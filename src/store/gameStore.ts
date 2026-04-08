import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BUSINESSES, MILESTONES, BusinessDef } from '../constants/businesses';
import { ACHIEVEMENTS } from '../constants/achievements';

export interface BusinessState {
  id: string;
  level: number;
  unlocked: boolean;
  hasManager: boolean;
  progress: number; // 0..1
  running: boolean;
  readyToCollect: boolean;
  lastCritAt?: number; // timestamp of last crit (for UI)
  lastCritMult?: number;
}

export const CRIT_CHANCE = 0.1;
export const CRIT_MULT = 5;

export interface OfflineReport {
  duration: number; // ms
  earned: number;
}

interface GameState {
  money: number;
  totalEarned: number;
  prestige: number;
  prestigeStars: number;
  manualCollects: number;
  businesses: Record<string, BusinessState>;
  unlockedAchievements: string[];
  lastSaveTime: number;
  soundEnabled: boolean;
  offlineReport: OfflineReport | null;
  hydrated: boolean;

  // actions
  hydrate: () => Promise<void>;
  tick: (deltaSec: number) => void;
  startBusiness: (id: string) => void;
  collectBusiness: (id: string) => void;
  upgradeBusiness: (id: string) => void;
  buyManager: (id: string) => void;
  unlockBusiness: (id: string) => void;
  doPrestige: () => void;
  resetAll: () => Promise<void>;
  clearOfflineReport: () => void;
  toggleSound: () => void;
  save: () => Promise<void>;
}

const SAVE_KEY = 'tesla_tycoon_save_v1';
const MAX_OFFLINE_MS = 8 * 60 * 60 * 1000;
const OFFLINE_PENALTY = 0.5;

function defaultBusinesses(): Record<string, BusinessState> {
  const obj: Record<string, BusinessState> = {};
  for (const b of BUSINESSES) {
    obj[b.id] = {
      id: b.id,
      level: b.id === 'model3' ? 1 : 0,
      unlocked: b.id === 'model3',
      hasManager: false,
      progress: 0,
      running: false,
      readyToCollect: false,
    };
  }
  return obj;
}

export function prestigeMultiplier(prestige: number): number {
  return 1 + prestige * 0.25;
}

export function milestoneMultiplier(level: number): number {
  let m = 1;
  for (const k of Object.keys(MILESTONES)) {
    const lvl = Number(k);
    if (level >= lvl) m *= MILESTONES[lvl];
  }
  return m;
}

export function businessIncome(def: BusinessDef, state: BusinessState, prestige: number): number {
  if (state.level <= 0) return 0;
  const managerMult = state.hasManager ? def.managerBuff : 1;
  return def.baseIncome * state.level * milestoneMultiplier(state.level) * prestigeMultiplier(prestige) * managerMult;
}

export function businessDuration(def: BusinessDef, state: BusinessState): number {
  // optional speed upgrades can go here
  return def.baseTime;
}

export function upgradeCost(def: BusinessDef, level: number): number {
  return Math.ceil(def.baseUpgradeCost * Math.pow(1.15, level));
}

export function pendingPrestigeStars(totalEarned: number, currentPrestige: number): number {
  if (totalEarned < 1_000_000) return 0;
  const total = Math.floor(Math.pow(totalEarned / 1_000_000, 0.5));
  const already = currentPrestige; // simple: stars granted historically ~= prestige count baseline
  const diff = total - already;
  return Math.max(0, diff);
}

export const useGameStore = create<GameState>((set, get) => ({
  money: 0,
  totalEarned: 0,
  prestige: 0,
  prestigeStars: 0,
  manualCollects: 0,
  businesses: defaultBusinesses(),
  unlockedAchievements: [],
  lastSaveTime: Date.now(),
  soundEnabled: true,
  offlineReport: null,
  hydrated: false,

  hydrate: async () => {
    try {
      const raw = await AsyncStorage.getItem(SAVE_KEY);
      if (!raw) {
        set({ hydrated: true, lastSaveTime: Date.now() });
        return;
      }
      const data = JSON.parse(raw);
      const now = Date.now();
      const elapsed = Math.min(MAX_OFFLINE_MS, now - (data.lastSaveTime ?? now));

      // restore
      const businesses: Record<string, BusinessState> = { ...defaultBusinesses(), ...(data.businesses ?? {}) };

      // offline earnings: for managed + running businesses earn during elapsed time at penalty
      let offlineEarn = 0;
      const prestige = data.prestige ?? 0;
      for (const def of BUSINESSES) {
        const b = businesses[def.id];
        if (!b || !b.unlocked || b.level <= 0) continue;
        if (!b.hasManager) continue;
        const income = businessIncome(def, b, prestige);
        const dur = businessDuration(def, b);
        const cycles = (elapsed / 1000) / dur;
        offlineEarn += income * cycles * OFFLINE_PENALTY;
      }

      set({
        money: (data.money ?? 0) + offlineEarn,
        totalEarned: (data.totalEarned ?? 0) + offlineEarn,
        prestige,
        prestigeStars: data.prestigeStars ?? 0,
        manualCollects: data.manualCollects ?? 0,
        businesses,
        unlockedAchievements: data.unlockedAchievements ?? [],
        soundEnabled: data.soundEnabled ?? true,
        lastSaveTime: now,
        offlineReport: offlineEarn > 1 ? { duration: elapsed, earned: offlineEarn } : null,
        hydrated: true,
      });
    } catch (e) {
      console.warn('hydrate failed', e);
      set({ hydrated: true });
    }
  },

  tick: (deltaSec) => {
    const { businesses, prestige } = get();
    let money = get().money;
    let totalEarned = get().totalEarned;
    const next: Record<string, BusinessState> = { ...businesses };
    let changed = false;

    for (const def of BUSINESSES) {
      const b = next[def.id];
      if (!b.unlocked || b.level <= 0) continue;

      if (b.running) {
        const dur = businessDuration(def, b);
        const nextProgress = b.progress + deltaSec / dur;
        if (nextProgress >= 1) {
          // cycle done — auto-collect income
          const baseIncome = businessIncome(def, b, prestige);
          const crit = Math.random() < CRIT_CHANCE;
          const income = crit ? baseIncome * CRIT_MULT : baseIncome;
          money += income;
          totalEarned += income;
          next[def.id] = {
            ...b,
            progress: 0,
            running: b.hasManager, // manager keeps cycling automatically
            readyToCollect: false,
            ...(crit ? { lastCritAt: Date.now(), lastCritMult: CRIT_MULT } : {}),
          };
          changed = true;
        } else if (nextProgress !== b.progress) {
          next[def.id] = { ...b, progress: nextProgress };
          changed = true;
        }
      }
    }

    if (changed) set({ businesses: next, money, totalEarned });
    else if (money !== get().money) set({ money, totalEarned });
  },

  startBusiness: (id) => {
    const b = get().businesses[id];
    if (!b || b.running || b.level <= 0) return;
    if (b.readyToCollect) {
      get().collectBusiness(id);
      return;
    }
    set({ businesses: { ...get().businesses, [id]: { ...b, running: true, progress: 0 } } });
  },

  collectBusiness: (id) => {
    const state = get();
    const def = BUSINESSES.find((x) => x.id === id);
    const b = state.businesses[id];
    if (!def || !b || !b.readyToCollect) return;
    const baseIncome = businessIncome(def, b, state.prestige);
    const crit = Math.random() < CRIT_CHANCE;
    const income = crit ? baseIncome * CRIT_MULT : baseIncome;
    set({
      money: state.money + income,
      totalEarned: state.totalEarned + income,
      manualCollects: state.manualCollects + 1,
      businesses: {
        ...state.businesses,
        [id]: {
          ...b,
          running: false,
          progress: 0,
          readyToCollect: false,
          ...(crit ? { lastCritAt: Date.now(), lastCritMult: CRIT_MULT } : {}),
        },
      },
    });
  },

  upgradeBusiness: (id) => {
    const state = get();
    const def = BUSINESSES.find((x) => x.id === id);
    const b = state.businesses[id];
    if (!def || !b || !b.unlocked) return;
    const cost = upgradeCost(def, b.level);
    if (state.money < cost) return;
    set({
      money: state.money - cost,
      businesses: { ...state.businesses, [id]: { ...b, level: b.level + 1 } },
    });
  },

  buyManager: (id) => {
    const state = get();
    const def = BUSINESSES.find((x) => x.id === id);
    const b = state.businesses[id];
    if (!def || !b || b.hasManager || !b.unlocked) return;
    if (state.money < def.managerCost) return;
    set({
      money: state.money - def.managerCost,
      businesses: { ...state.businesses, [id]: { ...b, hasManager: true } },
    });
  },

  unlockBusiness: (id) => {
    const state = get();
    const def = BUSINESSES.find((x) => x.id === id);
    const b = state.businesses[id];
    if (!def || !b || b.unlocked) return;
    if (state.money < def.unlockCost) return;
    set({
      money: state.money - def.unlockCost,
      businesses: { ...state.businesses, [id]: { ...b, unlocked: true, level: 1 } },
    });
  },

  doPrestige: () => {
    const state = get();
    const stars = pendingPrestigeStars(state.totalEarned, state.prestige);
    if (stars <= 0) return;
    set({
      money: 0,
      businesses: defaultBusinesses(),
      prestige: state.prestige + 1,
      prestigeStars: state.prestigeStars + stars,
      // totalEarned persists
    });
  },

  resetAll: async () => {
    await AsyncStorage.removeItem(SAVE_KEY);
    set({
      money: 0,
      totalEarned: 0,
      prestige: 0,
      prestigeStars: 0,
      manualCollects: 0,
      businesses: defaultBusinesses(),
      unlockedAchievements: [],
      offlineReport: null,
      lastSaveTime: Date.now(),
    });
  },

  clearOfflineReport: () => set({ offlineReport: null }),

  toggleSound: () => set({ soundEnabled: !get().soundEnabled }),

  save: async () => {
    const state = get();
    const data = {
      money: state.money,
      totalEarned: state.totalEarned,
      prestige: state.prestige,
      prestigeStars: state.prestigeStars,
      manualCollects: state.manualCollects,
      businesses: state.businesses,
      unlockedAchievements: state.unlockedAchievements,
      soundEnabled: state.soundEnabled,
      lastSaveTime: Date.now(),
    };
    try {
      await AsyncStorage.setItem(SAVE_KEY, JSON.stringify(data));
      set({ lastSaveTime: data.lastSaveTime });
    } catch (e) {
      console.warn('save failed', e);
    }
  },
}));

// achievement evaluator helper
export function evaluateAchievements() {
  const state = useGameStore.getState();
  const unlocked = new Set(state.unlockedAchievements);
  let cashReward = 0;
  let changed = false;
  for (const a of ACHIEVEMENTS) {
    if (unlocked.has(a.id)) continue;
    let val = 0;
    switch (a.type) {
      case 'totalEarned': val = state.totalEarned; break;
      case 'businessLevel': val = state.businesses[a.businessId!]?.level ?? 0; break;
      case 'businessUnlocked': val = Object.values(state.businesses).filter((b) => b.unlocked).length; break;
      case 'managersHired': val = Object.values(state.businesses).filter((b) => b.hasManager).length; break;
      case 'manualCollects': val = state.manualCollects; break;
      case 'prestigeCount': val = state.prestige; break;
    }
    if (val >= a.target) {
      unlocked.add(a.id);
      cashReward += a.rewardCash ?? 0;
      changed = true;
    }
  }
  if (changed) {
    useGameStore.setState({
      unlockedAchievements: Array.from(unlocked),
      money: state.money + cashReward,
      totalEarned: state.totalEarned + cashReward,
    });
  }
}

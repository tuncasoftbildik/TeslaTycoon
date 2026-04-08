import React, { useCallback, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Pressable, Animated } from 'react-native';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { BusinessDef } from '../constants/businesses';
import {
  BusinessState,
  useGameStore,
  businessIncome,
  businessDuration,
  upgradeCost,
} from '../store/gameStore';
import { formatMoney, formatTime } from '../utils/formatters';
import { theme } from '../constants/theme';

interface Props {
  def: BusinessDef;
  state: BusinessState;
}

function hexToRgba(hex: string, a: number) {
  const h = hex.replace('#', '');
  const r = parseInt(h.substring(0, 2), 16);
  const g = parseInt(h.substring(2, 4), 16);
  const b = parseInt(h.substring(4, 6), 16);
  return `rgba(${r},${g},${b},${a})`;
}

export const BusinessCard = React.memo(function BusinessCard({ def, state }: Props) {
  const prestige = useGameStore((s) => s.prestige);
  const money = useGameStore((s) => s.money);
  const unlock = useGameStore((s) => s.unlockBusiness);
  const start = useGameStore((s) => s.startBusiness);
  const upgrade = useGameStore((s) => s.upgradeBusiness);
  const buyManager = useGameStore((s) => s.buyManager);

  // crit floating text
  const critAnim = useRef(new Animated.Value(0)).current;
  const lastCritSeen = useRef<number | undefined>(undefined);
  useEffect(() => {
    if (state.lastCritAt && state.lastCritAt !== lastCritSeen.current) {
      lastCritSeen.current = state.lastCritAt;
      critAnim.setValue(1);
      Animated.timing(critAnim, {
        toValue: 0,
        duration: 1200,
        useNativeDriver: true,
      }).start();
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    }
  }, [state.lastCritAt, critAnim]);

  // ready-to-collect pulse
  const pulse = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    if (state.readyToCollect) {
      const loop = Animated.loop(
        Animated.sequence([
          Animated.timing(pulse, { toValue: 1.04, duration: 500, useNativeDriver: true }),
          Animated.timing(pulse, { toValue: 1, duration: 500, useNativeDriver: true }),
        ]),
      );
      loop.start();
      return () => loop.stop();
    }
  }, [state.readyToCollect, pulse]);

  const onTap = useCallback(() => {
    if (!state.unlocked) {
      if (money >= def.unlockCost) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        unlock(def.id);
      }
      return;
    }
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    start(def.id);
  }, [state.unlocked, money, def, start, unlock]);

  const onUpgrade = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    upgrade(def.id);
  }, [def.id, upgrade]);

  const onManager = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    buyManager(def.id);
  }, [def.id, buyManager]);

  if (!state.unlocked) {
    const canAfford = money >= def.unlockCost;
    return (
      <Pressable onPress={onTap} style={styles.lockedCard}>
        <LinearGradient
          colors={['rgba(255,255,255,0.04)', 'rgba(255,255,255,0.01)']}
          style={StyleSheet.absoluteFill}
        />
        <Text style={styles.lockIcon}>🔒</Text>
        <View style={{ flex: 1 }}>
          <Text style={styles.lockedName}>{def.name}</Text>
          <Text style={styles.lockedDesc} numberOfLines={2}>{def.description}</Text>
        </View>
        <LinearGradient
          colors={canAfford ? ['#ff3a4a', '#CC0000'] : ['#2a2d34', '#1a1d24']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.unlockBtn, !canAfford && { opacity: 0.6 }]}
        >
          <Text style={styles.unlockBtnText}>{formatMoney(def.unlockCost)}</Text>
          <Text style={styles.unlockBtnSub}>UNLOCK</Text>
        </LinearGradient>
      </Pressable>
    );
  }

  const income = businessIncome(def, state, prestige);
  const cost = upgradeCost(def, state.level);
  const dur = businessDuration(def, state);
  const canUpgrade = money >= cost;
  const canManager = !state.hasManager && money >= def.managerCost;
  const isReady = state.readyToCollect;

  return (
    <Animated.View style={{ transform: [{ scale: isReady ? pulse : 1 }] }}>
      <View
        style={[
          styles.card,
          isReady && {
            shadowColor: def.color,
            shadowOpacity: 0.8,
            shadowRadius: 16,
            shadowOffset: { width: 0, height: 0 },
          },
        ]}
      >
        <LinearGradient
          colors={[hexToRgba(def.color, 0.18), 'rgba(10,10,10,0.6)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
        <View style={[styles.sideBar, { backgroundColor: def.color }]} />

        <View style={styles.row}>
          <Pressable onPress={onTap} style={styles.iconBox}>
            <LinearGradient
              colors={[hexToRgba(def.color, 0.35), hexToRgba(def.color, 0.05)]}
              style={styles.iconCircle}
            >
              <Text style={styles.icon}>{def.emoji}</Text>
            </LinearGradient>
            <View style={[styles.lvlBadge, { borderColor: def.color }]}>
              <Text style={styles.level}>Lv {state.level}</Text>
            </View>
          </Pressable>

          <View style={styles.mid}>
            <Text style={styles.name} numberOfLines={1}>{def.name}</Text>
            <Text style={styles.income}>+{formatMoney(income)}</Text>
            <Text style={styles.duration}>per {formatTime(dur)}</Text>

            <View style={styles.progressBg}>
              <LinearGradient
                colors={[hexToRgba(def.color, 0.9), def.color]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={[styles.progressFill, { width: `${state.progress * 100}%` }]}
              />
              {isReady && (
                <Text style={styles.readyText}>⚡ TAP TO COLLECT ⚡</Text>
              )}
            </View>
          </View>

          <Animated.Text
            pointerEvents="none"
            style={[
              styles.critText,
              {
                opacity: critAnim,
                transform: [
                  {
                    translateY: critAnim.interpolate({ inputRange: [0, 1], outputRange: [-30, 0] }),
                  },
                  {
                    scale: critAnim.interpolate({ inputRange: [0, 1], outputRange: [1.4, 1] }),
                  },
                ],
              },
            ]}
          >
            CRIT x{state.lastCritMult ?? 5}!
          </Animated.Text>
        </View>

        <View style={styles.actions}>
          <Pressable onPress={onUpgrade} disabled={!canUpgrade} style={{ flex: 1 }}>
            <LinearGradient
              colors={canUpgrade ? ['#ff3a4a', '#CC0000'] : ['#1f2229', '#15171c']}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
              style={styles.btn}
            >
              <Text style={styles.btnLabel}>UPGRADE</Text>
              <Text style={[styles.btnValue, !canUpgrade && { color: theme.muted }]}>
                {formatMoney(cost)}
              </Text>
            </LinearGradient>
          </Pressable>

          <Pressable
            onPress={onManager}
            disabled={!canManager || state.hasManager}
            style={{ flex: 1 }}
          >
            <LinearGradient
              colors={
                state.hasManager
                  ? ['#00c853', '#00994d']
                  : canManager
                  ? ['#3E6AE1', '#1E40AF']
                  : ['#1f2229', '#15171c']
              }
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
              style={styles.btn}
            >
              <Text style={styles.btnLabel} numberOfLines={1}>
                {state.hasManager ? `✓ ${def.managerName.toUpperCase()}` : 'HIRE MGR'}
              </Text>
              {state.hasManager ? (
                <Text style={styles.btnValue}>{def.managerPerk}</Text>
              ) : (
                <Text style={[styles.btnValue, !canManager && { color: theme.muted }]}>
                  {formatMoney(def.managerCost)}
                </Text>
              )}
            </LinearGradient>
          </Pressable>
        </View>
      </View>
    </Animated.View>
  );
});

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: theme.cardBorder,
    overflow: 'hidden',
    backgroundColor: '#0a0a0a',
  },
  sideBar: { position: 'absolute', left: 0, top: 0, bottom: 0, width: 4 },
  lockedCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: theme.cardBorder,
    borderStyle: 'dashed',
    overflow: 'hidden',
    backgroundColor: '#0a0a0a',
  },
  lockIcon: { fontSize: 30 },
  lockedName: { color: theme.silver, fontWeight: '800', fontSize: 15 },
  lockedDesc: { color: theme.muted, fontSize: 11, marginTop: 3 },
  unlockBtn: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
    minWidth: 92,
  },
  unlockBtnText: { color: theme.white, fontWeight: '900', fontSize: 13 },
  unlockBtnSub: { color: theme.white, fontSize: 9, opacity: 0.85, letterSpacing: 1, marginTop: 1 },
  row: { flexDirection: 'row', alignItems: 'center' },
  iconBox: { width: 72, alignItems: 'center' },
  iconCircle: {
    width: 58,
    height: 58,
    borderRadius: 29,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  icon: { fontSize: 32 },
  lvlBadge: {
    marginTop: 4,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
    borderWidth: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  level: { color: theme.gold, fontSize: 10, fontWeight: '800' },
  mid: { flex: 1, marginLeft: 10 },
  name: { color: theme.white, fontWeight: '800', fontSize: 15, letterSpacing: 0.3 },
  income: { color: theme.green, fontSize: 15, fontWeight: '900', marginTop: 2 },
  duration: { color: theme.muted, fontSize: 10, fontWeight: '600' },
  progressBg: {
    height: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 10,
    marginTop: 8,
    overflow: 'hidden',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  progressFill: { position: 'absolute', left: 0, top: 0, bottom: 0 },
  critText: {
    position: 'absolute',
    right: 12,
    top: 6,
    color: '#ffd700',
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 1,
    textShadowColor: '#000',
    textShadowRadius: 6,
  },
  readyText: {
    color: theme.white,
    fontSize: 10,
    fontWeight: '900',
    textAlign: 'center',
    letterSpacing: 1,
    textShadowColor: '#000',
    textShadowRadius: 4,
  },
  actions: { flexDirection: 'row', gap: 8, marginTop: 12 },
  btn: {
    borderRadius: 11,
    paddingVertical: 11,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  btnLabel: { color: theme.white, fontSize: 10, fontWeight: '900', letterSpacing: 0.8 },
  btnValue: { color: theme.white, fontSize: 12, fontWeight: '800', marginTop: 2 },
});

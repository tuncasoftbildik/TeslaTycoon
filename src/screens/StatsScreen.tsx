import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useGameStore } from '../store/gameStore';
import { ACHIEVEMENTS } from '../constants/achievements';
import { BUSINESSES } from '../constants/businesses';
import { formatMoney } from '../utils/formatters';
import { theme } from '../constants/theme';
import { MoneyDisplay } from '../components/MoneyDisplay';

export function StatsScreen() {
  const state = useGameStore();
  const unlocked = new Set(state.unlockedAchievements);
  const businessesUnlocked = Object.values(state.businesses).filter((b) => b.unlocked).length;
  const managersHired = Object.values(state.businesses).filter((b) => b.hasManager).length;

  return (
    <View style={{ flex: 1 }}>
      <MoneyDisplay />
      <ScrollView contentContainerStyle={{ padding: 12, paddingBottom: 100 }}>
        <Text style={styles.h}>Lifetime Stats</Text>
        <View style={styles.grid}>
          <Stat label="Total Earned" value={formatMoney(state.totalEarned)} />
          <Stat label="Manual Collects" value={state.manualCollects.toString()} />
          <Stat label="Businesses" value={`${businessesUnlocked}/${BUSINESSES.length}`} />
          <Stat label="Managers" value={`${managersHired}/${BUSINESSES.length}`} />
          <Stat label="Prestige" value={state.prestige.toString()} />
          <Stat label="Stars" value={`⭐ ${state.prestigeStars}`} />
        </View>

        <Text style={styles.h}>Achievements ({unlocked.size}/{ACHIEVEMENTS.length})</Text>
        {ACHIEVEMENTS.map((a) => {
          const got = unlocked.has(a.id);
          return (
            <View key={a.id} style={[styles.ach, got && styles.achGot]}>
              <Text style={[styles.achIcon, !got && { opacity: 0.3 }]}>{a.icon}</Text>
              <View style={{ flex: 1 }}>
                <Text style={[styles.achTitle, !got && { color: theme.muted }]}>{a.title}</Text>
                <Text style={styles.achDesc}>{a.description}</Text>
              </View>
              {got && <Text style={styles.check}>✓</Text>}
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.stat}>
      <Text style={styles.statVal}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  h: { color: theme.white, fontWeight: '800', fontSize: 16, marginTop: 12, marginBottom: 8 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  stat: { backgroundColor: theme.card, borderRadius: 12, padding: 12, width: '48%', borderWidth: 1, borderColor: theme.cardBorder },
  statVal: { color: theme.white, fontSize: 18, fontWeight: '800' },
  statLabel: { color: theme.muted, fontSize: 11, marginTop: 2 },
  ach: { flexDirection: 'row', alignItems: 'center', backgroundColor: theme.card, borderRadius: 10, padding: 10, marginBottom: 6, borderWidth: 1, borderColor: theme.cardBorder },
  achGot: { borderColor: theme.red },
  achIcon: { fontSize: 24, width: 36, textAlign: 'center' },
  achTitle: { color: theme.white, fontWeight: '700', fontSize: 13 },
  achDesc: { color: theme.muted, fontSize: 11 },
  check: { color: theme.green, fontSize: 22, fontWeight: '900' },
});

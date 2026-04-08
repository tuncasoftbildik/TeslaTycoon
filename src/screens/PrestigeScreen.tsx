import React from 'react';
import { View, Text, StyleSheet, Pressable, Alert, ScrollView, Switch } from 'react-native';
import { useGameStore, pendingPrestigeStars, prestigeMultiplier } from '../store/gameStore';
import { formatMoney } from '../utils/formatters';
import { theme } from '../constants/theme';
import { MoneyDisplay } from '../components/MoneyDisplay';

export function PrestigeScreen() {
  const totalEarned = useGameStore((s) => s.totalEarned);
  const prestige = useGameStore((s) => s.prestige);
  const stars = useGameStore((s) => s.prestigeStars);
  const doPrestige = useGameStore((s) => s.doPrestige);
  const reset = useGameStore((s) => s.resetAll);
  const soundEnabled = useGameStore((s) => s.soundEnabled);
  const toggleSound = useGameStore((s) => s.toggleSound);

  const pending = pendingPrestigeStars(totalEarned, prestige);
  const canPrestige = pending > 0;

  const confirm = () => {
    Alert.alert(
      'Prestige Reset?',
      `Wipe progress for ${pending} ⭐ and permanent +25% bonus?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Prestige', style: 'destructive', onPress: doPrestige },
      ],
    );
  };

  const confirmReset = () => {
    Alert.alert('Wipe All Data?', 'This deletes everything. Cannot be undone.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Reset', style: 'destructive', onPress: reset },
    ]);
  };

  return (
    <View style={{ flex: 1 }}>
      <MoneyDisplay />
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 120 }}>
        <View style={styles.card}>
          <Text style={styles.title}>⭐ Prestige</Text>
          <Text style={styles.sub}>Reset your empire for permanent bonuses</Text>

          <View style={styles.statsRow}>
            <View style={styles.stat}>
              <Text style={styles.statVal}>{prestige}</Text>
              <Text style={styles.statLabel}>Current</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statVal}>+{((prestigeMultiplier(prestige) - 1) * 100).toFixed(0)}%</Text>
              <Text style={styles.statLabel}>Income Boost</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statVal}>⭐ {stars}</Text>
              <Text style={styles.statLabel}>Stars</Text>
            </View>
          </View>

          <Text style={styles.pendingLabel}>Available on Prestige:</Text>
          <Text style={styles.pendingVal}>+{pending} ⭐</Text>
          <Text style={styles.req}>Unlocks at {formatMoney(1_000_000)} lifetime earnings</Text>

          <Pressable
            onPress={confirm}
            disabled={!canPrestige}
            style={[styles.btn, !canPrestige && styles.btnDisabled]}
          >
            <Text style={styles.btnText}>{canPrestige ? 'PRESTIGE NOW' : 'Not Ready'}</Text>
          </Pressable>
        </View>

        <View style={styles.card}>
          <Text style={styles.title}>⚙️ Settings</Text>
          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>Sound Effects</Text>
            <Switch value={soundEnabled} onValueChange={toggleSound} trackColor={{ true: theme.red }} />
          </View>
          <Pressable onPress={confirmReset} style={[styles.btn, { backgroundColor: '#2a2d34', marginTop: 10 }]}>
            <Text style={styles.btnText}>Wipe All Data</Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: theme.card, borderRadius: 16, padding: 18, marginBottom: 14, borderWidth: 1, borderColor: theme.cardBorder },
  title: { color: theme.white, fontSize: 20, fontWeight: '800' },
  sub: { color: theme.muted, fontSize: 12, marginTop: 4 },
  statsRow: { flexDirection: 'row', gap: 10, marginTop: 16 },
  stat: { flex: 1, backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: 10, padding: 12, alignItems: 'center' },
  statVal: { color: theme.gold, fontSize: 18, fontWeight: '800' },
  statLabel: { color: theme.muted, fontSize: 10, marginTop: 2 },
  pendingLabel: { color: theme.silver, fontSize: 12, marginTop: 18 },
  pendingVal: { color: theme.gold, fontSize: 38, fontWeight: '900' },
  req: { color: theme.muted, fontSize: 11, marginTop: 4 },
  btn: { backgroundColor: theme.red, borderRadius: 12, paddingVertical: 14, alignItems: 'center', marginTop: 16 },
  btnDisabled: { backgroundColor: '#2a2d34' },
  btnText: { color: theme.white, fontWeight: '800', fontSize: 15, letterSpacing: 0.5 },
  settingRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 14 },
  settingLabel: { color: theme.white, fontSize: 14 },
});

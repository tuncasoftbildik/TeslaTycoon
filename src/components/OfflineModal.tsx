import React from 'react';
import { Modal, View, Text, StyleSheet, Pressable } from 'react-native';
import { useGameStore } from '../store/gameStore';
import { formatMoney, formatDuration } from '../utils/formatters';
import { theme } from '../constants/theme';

export function OfflineModal() {
  const report = useGameStore((s) => s.offlineReport);
  const close = useGameStore((s) => s.clearOfflineReport);
  if (!report) return null;
  return (
    <Modal transparent animationType="fade">
      <View style={styles.backdrop}>
        <View style={styles.card}>
          <Text style={styles.title}>Welcome back, Tycoon</Text>
          <Text style={styles.sub}>You were away for {formatDuration(report.duration)}</Text>
          <Text style={styles.amount}>{formatMoney(report.earned)}</Text>
          <Text style={styles.note}>Managers kept production running (50% offline rate)</Text>
          <Pressable style={styles.btn} onPress={close}>
            <Text style={styles.btnText}>Collect</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'center', alignItems: 'center', padding: 30 },
  card: { backgroundColor: '#171a20', borderRadius: 18, padding: 24, alignItems: 'center', borderWidth: 1, borderColor: theme.red, width: '100%' },
  title: { color: theme.white, fontSize: 22, fontWeight: '800' },
  sub: { color: theme.silver, fontSize: 13, marginTop: 6 },
  amount: { color: theme.gold, fontSize: 36, fontWeight: '900', marginVertical: 16 },
  note: { color: theme.muted, fontSize: 11, textAlign: 'center' },
  btn: { backgroundColor: theme.red, borderRadius: 12, paddingVertical: 14, paddingHorizontal: 40, marginTop: 18 },
  btnText: { color: theme.white, fontWeight: '800', fontSize: 16 },
});

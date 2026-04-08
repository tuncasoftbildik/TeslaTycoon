import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { useGameStore } from '../store/gameStore';
import { BUSINESSES } from '../constants/businesses';
import { BusinessCard } from '../components/BusinessCard';
import { MoneyDisplay } from '../components/MoneyDisplay';
import { SafeTesla3D } from '../components/SafeTesla3D';
import { theme } from '../constants/theme';

export function GameScreen() {
  const businesses = useGameStore((s) => s.businesses);

  // pick the highest-level unlocked business to showcase in 3D
  let showcase = BUSINESSES[0];
  for (const def of BUSINESSES) {
    const b = businesses[def.id];
    if (b?.unlocked && b.level >= (businesses[showcase.id]?.level ?? 0)) {
      showcase = def;
    }
  }

  return (
    <View style={styles.wrap}>
      <MoneyDisplay />
      <SafeTesla3D variant={showcase.id as any} label={showcase.name} />
      <ScrollView contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}>
        {BUSINESSES.map((def) => (
          <BusinessCard key={def.id} def={def} state={businesses[def.id]} />
        ))}
        <View style={{ height: 80 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1 },
  list: { padding: 12 },
});

import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { useGameStore } from '../store/gameStore';
import { formatMoney } from '../utils/formatters';
import { theme } from '../constants/theme';

export const MoneyDisplay = React.memo(function MoneyDisplay() {
  const money = useGameStore((s) => s.money);
  const stars = useGameStore((s) => s.prestigeStars);
  const prestige = useGameStore((s) => s.prestige);

  const scale = useRef(new Animated.Value(1)).current;
  const prev = useRef(money);

  useEffect(() => {
    if (money > prev.current) {
      Animated.sequence([
        Animated.timing(scale, { toValue: 1.08, duration: 90, useNativeDriver: true }),
        Animated.spring(scale, { toValue: 1, friction: 4, useNativeDriver: true }),
      ]).start();
    }
    prev.current = money;
  }, [money, scale]);

  return (
    <View style={styles.wrap}>
      <Animated.Text style={[styles.money, { transform: [{ scale }] }]}>
        {formatMoney(money)}
      </Animated.Text>
      <View style={styles.row}>
        {prestige > 0 && (
          <View style={styles.chip}>
            <Text style={styles.chipText}>⚡ P{prestige} · +{prestige * 25}%</Text>
          </View>
        )}
        {stars > 0 && (
          <View style={[styles.chip, styles.chipGold]}>
            <Text style={styles.chipTextGold}>⭐ {stars}</Text>
          </View>
        )}
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', paddingVertical: 14 },
  money: {
    color: theme.gold,
    fontSize: 44,
    fontWeight: '900',
    letterSpacing: 0.5,
    textShadowColor: 'rgba(255, 215, 0, 0.5)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 16,
  },
  row: { flexDirection: 'row', gap: 8, marginTop: 8 },
  chip: {
    backgroundColor: 'rgba(227,25,55,0.15)',
    borderColor: theme.red,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  chipText: { color: theme.white, fontSize: 11, fontWeight: '700' },
  chipGold: { backgroundColor: 'rgba(255,215,0,0.12)', borderColor: theme.gold },
  chipTextGold: { color: theme.gold, fontSize: 11, fontWeight: '800' },
});

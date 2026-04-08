import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable, ActivityIndicator, StatusBar, Image } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useGameStore } from './src/store/gameStore';
import { useGameLoop } from './src/hooks/useGameLoop';
import { GameScreen } from './src/screens/GameScreen';
import { StatsScreen } from './src/screens/StatsScreen';
import { PrestigeScreen } from './src/screens/PrestigeScreen';
import { OfflineModal } from './src/components/OfflineModal';
import { theme } from './src/constants/theme';

type Tab = 'city' | 'stats' | 'prestige';

export default function App() {
  const hydrate = useGameStore((s) => s.hydrate);
  const hydrated = useGameStore((s) => s.hydrated);
  const [tab, setTab] = useState<Tab>('city');

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  useGameLoop();

  return (
    <SafeAreaProvider>
      <StatusBar barStyle="light-content" />
      <View style={{ flex: 1, backgroundColor: '#000' }}>
        {/* Base dark gradient */}
        <LinearGradient
          colors={['#1a0008', '#0a0a0a', '#000000']}
          style={StyleSheet.absoluteFill}
        />
        {/* Red radial glow at top */}
        <LinearGradient
          colors={['rgba(227,25,55,0.25)', 'rgba(227,25,55,0.05)', 'transparent']}
          style={[StyleSheet.absoluteFill, { height: 400 }]}
        />

        <SafeAreaView style={{ flex: 1 }} edges={['top', 'bottom']}>
          {/* Header */}
          <View style={styles.header}>
            <Image
              source={require('./assets/icon.png')}
              style={styles.headerLogo}
              resizeMode="contain"
            />
            <Text style={styles.brand}>TESLA TYCOON</Text>
            <View style={styles.neonLine} />
          </View>

          {!hydrated ? (
            <View style={styles.loader}>
              <ActivityIndicator color={theme.red} size="large" />
            </View>
          ) : (
            <View style={{ flex: 1 }}>
              {tab === 'city' && <GameScreen />}
              {tab === 'stats' && <StatsScreen />}
              {tab === 'prestige' && <PrestigeScreen />}
            </View>
          )}

          {/* Tab Bar */}
          <View style={styles.tabsWrap}>
            <LinearGradient
              colors={['rgba(0,0,0,0.3)', 'rgba(0,0,0,0.9)']}
              style={StyleSheet.absoluteFill}
            />
            <View style={styles.tabs}>
              <TabBtn icon="🏙" label="City" active={tab === 'city'} onPress={() => setTab('city')} />
              <TabBtn icon="📊" label="Stats" active={tab === 'stats'} onPress={() => setTab('stats')} />
              <TabBtn icon="⭐" label="Prestige" active={tab === 'prestige'} onPress={() => setTab('prestige')} />
            </View>
          </View>

          <OfflineModal />
        </SafeAreaView>
      </View>
    </SafeAreaProvider>
  );
}

function TabBtn({
  icon,
  label,
  active,
  onPress,
}: {
  icon: string;
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress} style={{ flex: 1 }}>
      {active ? (
        <LinearGradient
          colors={['#ff3a4a', '#CC0000']}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={[styles.tab, styles.tabActive]}
        >
          <Text style={styles.tabIcon}>{icon}</Text>
          <Text style={[styles.tabLabel, styles.tabLabelActive]}>{label}</Text>
        </LinearGradient>
      ) : (
        <View style={styles.tab}>
          <Text style={[styles.tabIcon, { opacity: 0.55 }]}>{icon}</Text>
          <Text style={styles.tabLabel}>{label}</Text>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 16,
    paddingTop: 4,
    paddingBottom: 6,
    alignItems: 'center',
  },
  headerLogo: { width: 44, height: 44 },
  brand: {
    color: theme.white,
    fontSize: 17,
    fontWeight: '900',
    letterSpacing: 5,
    marginTop: 2,
    textShadowColor: theme.red,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  neonLine: {
    marginTop: 6,
    width: 120,
    height: 2,
    backgroundColor: theme.red,
    borderRadius: 2,
    shadowColor: theme.red,
    shadowOpacity: 1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 0 },
  },
  loader: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  tabsWrap: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(227,25,55,0.4)',
    overflow: 'hidden',
  },
  tabs: { flexDirection: 'row', padding: 8, gap: 6 },
  tab: {
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: 12,
    flexDirection: 'column',
  },
  tabActive: {
    shadowColor: theme.red,
    shadowOpacity: 0.8,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 0 },
  },
  tabIcon: { fontSize: 20 },
  tabLabel: { color: theme.muted, fontWeight: '800', fontSize: 11, marginTop: 2, letterSpacing: 0.5 },
  tabLabelActive: { color: theme.white },
});

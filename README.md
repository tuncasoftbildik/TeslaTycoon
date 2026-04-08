# Tesla Tycoon

Tesla temalı idle/tycoon mobil oyun. Küçük bir Model 3 atölyesinden başla, yatırım yap, yöneticiler işe al ve kendi elektrikli araç imparatorluğunu kur.

**Landing page:** https://tuncasoftbildik.github.io/TeslaTycoon/
**Gizlilik politikası:** https://tuncasoftbildik.github.io/TeslaTycoon/privacy.html

## Özellikler

- Klasik tycoon / idle oyun mekaniği
- Onlarca fabrika ve yükseltme seviyesi
- Yönetici sistemi — üretim hatlarını otomatikleştir
- Offline kazanç (manager atanmış işletmeler için)
- Prestige sistemi — yeniden başla, daha güçlü dön
- Başarım ve kilometre taşları
- 3D araç gösterimi (three.js + react-three-fiber)
- Tamamen çevrimdışı, reklam yok, veri toplama yok

## Teknoloji

- **Expo SDK 54** (React Native 0.81)
- **TypeScript**
- **Zustand** — state management
- **@react-three/fiber** + **expo-three** — 3D rendering
- **expo-av**, **expo-haptics**, **expo-linear-gradient** — UX detayları
- **AsyncStorage** — yerel veri saklama
- **EAS Build** — iOS / Android build ve TestFlight gönderimi

## Geliştirme

```bash
# Bağımlılıkları kur
npm install

# Geliştirme sunucusu
npx expo start

# iOS'ta çalıştır
npx expo run:ios

# Android'de çalıştır
npx expo run:android
```

## Build

```bash
# TestFlight için production iOS build + auto-submit
eas build --profile production --platform ios --auto-submit

# Android APK (internal distribution)
eas build --profile preview --platform android
```

## Proje Yapısı

```
src/
├── components/     # BusinessCard, MoneyDisplay, OfflineModal, Tesla3D
├── constants/      # businesses, achievements, theme
├── hooks/          # useGameLoop
├── screens/        # GameScreen, StatsScreen, PrestigeScreen
├── store/          # gameStore (Zustand)
└── utils/          # formatters

docs/               # GitHub Pages landing page + privacy policy
assets/             # App icon, splash, logo
```

## Lisans

Bu proje bağımsız bir hobi/portföy projesidir. Tesla, Tesla Inc.'in tescilli markasıdır ve bu uygulamanın Tesla, Inc. ile resmi bir bağlantısı yoktur.

## İletişim

tunca.bildik@gmail.com

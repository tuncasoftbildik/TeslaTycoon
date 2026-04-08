import { useEffect, useRef } from 'react';
import { AppState } from 'react-native';
import { useGameStore, evaluateAchievements } from '../store/gameStore';

export function useGameLoop() {
  const lastRef = useRef<number>(Date.now());
  const saveRef = useRef<number>(Date.now());

  useEffect(() => {
    let raf: any;
    const loop = () => {
      const now = Date.now();
      const delta = Math.min(1, (now - lastRef.current) / 1000);
      lastRef.current = now;
      useGameStore.getState().tick(delta);

      if (now - saveRef.current > 10000) {
        saveRef.current = now;
        useGameStore.getState().save();
        evaluateAchievements();
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    const sub = AppState.addEventListener('change', (s) => {
      if (s === 'background' || s === 'inactive') {
        useGameStore.getState().save();
      } else if (s === 'active') {
        lastRef.current = Date.now();
      }
    });

    return () => {
      cancelAnimationFrame(raf);
      sub.remove();
      useGameStore.getState().save();
    };
  }, []);
}

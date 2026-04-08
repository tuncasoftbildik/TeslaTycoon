import React, { useRef } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Canvas, useFrame } from '@react-three/fiber/native';
import type { Group } from 'three';

type Variant =
  | 'model3'
  | 'supercharger'
  | 'solarroof'
  | 'powerwall'
  | 'modely'
  | 'cybertruck'
  | 'semi'
  | 'robotaxi'
  | 'optimus'
  | 'mars';

interface Props {
  variant?: Variant;
  label?: string;
}

function Wheels({ wheelbase = 0.7, track = 0.55, y = 0.2, r = 0.22 }) {
  const positions: [number, number, number][] = [
    [-wheelbase, y, track],
    [wheelbase, y, track],
    [-wheelbase, y, -track],
    [wheelbase, y, -track],
  ];
  return (
    <>
      {positions.map((p, i) => (
        <mesh key={i} position={p} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[r, r, 0.18, 24]} />
          <meshStandardMaterial color="#111" roughness={0.8} />
        </mesh>
      ))}
    </>
  );
}

function Sedan({ color, cabinScale = 1 }: { color: string; cabinScale?: number }) {
  return (
    <group position={[0, -0.3, 0]}>
      <mesh position={[0, 0.5, 0]}>
        <boxGeometry args={[2.2, 0.5, 1]} />
        <meshStandardMaterial color={color} metalness={0.7} roughness={0.25} />
      </mesh>
      <mesh position={[0.05, 0.95, 0]}>
        <boxGeometry args={[1.2 * cabinScale, 0.45 * cabinScale, 0.9]} />
        <meshStandardMaterial color="#1a1a1a" metalness={0.4} roughness={0.2} />
      </mesh>
      <Wheels />
    </group>
  );
}

function Cybertruck() {
  return (
    <group position={[0, -0.3, 0]}>
      {/* angular wedge body */}
      <mesh position={[0, 0.7, 0]} rotation={[0, 0, 0]}>
        <boxGeometry args={[2.4, 0.7, 1.05]} />
        <meshStandardMaterial color="#b8bcc4" metalness={0.95} roughness={0.15} />
      </mesh>
      {/* sloped top */}
      <mesh position={[-0.2, 1.1, 0]} rotation={[0, 0, 0.18]}>
        <boxGeometry args={[1.6, 0.05, 1]} />
        <meshStandardMaterial color="#9aa0a8" metalness={0.95} roughness={0.15} />
      </mesh>
      <Wheels wheelbase={0.85} r={0.28} y={0.28} />
    </group>
  );
}

function Semi() {
  return (
    <group position={[0, -0.3, 0]}>
      <mesh position={[-0.6, 0.85, 0]}>
        <boxGeometry args={[1.0, 1.1, 1.05]} />
        <meshStandardMaterial color="#cfd3da" metalness={0.85} roughness={0.2} />
      </mesh>
      <mesh position={[0.7, 0.7, 0]}>
        <boxGeometry args={[1.6, 0.85, 1.0]} />
        <meshStandardMaterial color="#e5e7eb" metalness={0.6} roughness={0.3} />
      </mesh>
      <Wheels wheelbase={0.9} r={0.25} y={0.25} />
    </group>
  );
}

function Robotaxi() {
  return (
    <group position={[0, -0.3, 0]}>
      <mesh position={[0, 0.6, 0]}>
        <sphereGeometry args={[0.85, 32, 16]} />
        <meshStandardMaterial color="#a855f7" metalness={0.7} roughness={0.2} />
      </mesh>
      <mesh position={[0, 0.85, 0]}>
        <sphereGeometry args={[0.55, 32, 16]} />
        <meshStandardMaterial color="#1a1a1a" metalness={0.5} roughness={0.15} />
      </mesh>
      <Wheels wheelbase={0.55} track={0.5} r={0.2} />
    </group>
  );
}

function Supercharger() {
  return (
    <group position={[0, -0.5, 0]}>
      <mesh position={[0, 0.1, 0]}>
        <boxGeometry args={[1.4, 0.1, 1.4]} />
        <meshStandardMaterial color="#222" />
      </mesh>
      <mesh position={[0, 0.9, 0]}>
        <boxGeometry args={[0.45, 1.5, 0.25]} />
        <meshStandardMaterial color="#fff" metalness={0.3} roughness={0.4} />
      </mesh>
      <mesh position={[0, 1.5, 0.15]}>
        <boxGeometry args={[0.25, 0.35, 0.05]} />
        <meshStandardMaterial color="#3E6AE1" emissive="#3E6AE1" emissiveIntensity={0.6} />
      </mesh>
    </group>
  );
}

function SolarRoof() {
  return (
    <group position={[0, -0.4, 0]}>
      <mesh position={[0, 0.4, 0]}>
        <boxGeometry args={[1.6, 0.8, 1.2]} />
        <meshStandardMaterial color="#d1c0a5" />
      </mesh>
      <mesh position={[0, 1.05, 0]} rotation={[0, Math.PI / 4, 0]}>
        <coneGeometry args={[1.3, 0.7, 4]} />
        <meshStandardMaterial color="#1a2540" metalness={0.9} roughness={0.15} emissive="#0a1530" emissiveIntensity={0.3} />
      </mesh>
    </group>
  );
}

function Powerwall() {
  return (
    <group position={[0, -0.5, 0]}>
      <mesh position={[0, 0.95, 0]}>
        <boxGeometry args={[0.9, 1.7, 0.35]} />
        <meshStandardMaterial color="#f5f5f5" metalness={0.4} roughness={0.3} />
      </mesh>
      <mesh position={[0, 1.5, 0.18]}>
        <boxGeometry args={[0.5, 0.15, 0.02]} />
        <meshStandardMaterial color="#00c853" emissive="#00c853" emissiveIntensity={0.6} />
      </mesh>
    </group>
  );
}

function Optimus() {
  return (
    <group position={[0, -0.7, 0]}>
      {/* head */}
      <mesh position={[0, 1.65, 0]}>
        <boxGeometry args={[0.4, 0.4, 0.35]} />
        <meshStandardMaterial color="#1a1a1a" metalness={0.7} roughness={0.2} />
      </mesh>
      {/* torso */}
      <mesh position={[0, 1.05, 0]}>
        <boxGeometry args={[0.7, 0.85, 0.35]} />
        <meshStandardMaterial color="#e5e7eb" metalness={0.6} roughness={0.3} />
      </mesh>
      {/* arms */}
      {[-0.5, 0.5].map((x, i) => (
        <mesh key={i} position={[x, 1.05, 0]}>
          <boxGeometry args={[0.18, 0.85, 0.18]} />
          <meshStandardMaterial color="#cbd0d6" metalness={0.6} roughness={0.3} />
        </mesh>
      ))}
      {/* legs */}
      {[-0.18, 0.18].map((x, i) => (
        <mesh key={i} position={[x, 0.3, 0]}>
          <boxGeometry args={[0.22, 0.85, 0.22]} />
          <meshStandardMaterial color="#cbd0d6" metalness={0.6} roughness={0.3} />
        </mesh>
      ))}
    </group>
  );
}

function Rocket() {
  return (
    <group position={[0, -0.6, 0]}>
      <mesh position={[0, 1.1, 0]}>
        <cylinderGeometry args={[0.35, 0.35, 1.6, 24]} />
        <meshStandardMaterial color="#f5f5f5" metalness={0.7} roughness={0.25} />
      </mesh>
      <mesh position={[0, 2.05, 0]}>
        <coneGeometry args={[0.35, 0.55, 24]} />
        <meshStandardMaterial color="#f5f5f5" metalness={0.7} roughness={0.25} />
      </mesh>
      <mesh position={[0, 0.15, 0]}>
        <coneGeometry args={[0.5, 0.5, 24]} />
        <meshStandardMaterial color="#ef4444" emissive="#ff6622" emissiveIntensity={0.8} />
      </mesh>
    </group>
  );
}

function Model({ variant }: { variant: Variant }) {
  switch (variant) {
    case 'model3':
      return <Sedan color="#e31937" />;
    case 'modely':
      return <Sedan color="#c0c0c0" cabinScale={1.15} />;
    case 'cybertruck':
      return <Cybertruck />;
    case 'semi':
      return <Semi />;
    case 'robotaxi':
      return <Robotaxi />;
    case 'supercharger':
      return <Supercharger />;
    case 'solarroof':
      return <SolarRoof />;
    case 'powerwall':
      return <Powerwall />;
    case 'optimus':
      return <Optimus />;
    case 'mars':
      return <Rocket />;
  }
}

function Spinner({ variant }: { variant: Variant }) {
  const group = useRef<Group>(null);
  useFrame((_, delta) => {
    if (group.current) group.current.rotation.y += delta * 0.6;
  });
  return (
    <group ref={group}>
      <Model variant={variant} />
    </group>
  );
}

export function Tesla3D({ variant = 'model3', label }: Props) {
  return (
    <View style={styles.wrap}>
      <Canvas camera={{ position: [3, 2.4, 3.8], fov: 45 }}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 5, 5]} intensity={1.2} />
        <directionalLight position={[-3, 2, -2]} intensity={0.4} />
        <Spinner variant={variant} />
      </Canvas>
      {label ? <Text style={styles.label}>{label}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { height: 180, width: '100%' },
  label: {
    position: 'absolute',
    bottom: 6,
    alignSelf: 'center',
    color: '#fff',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.2,
    opacity: 0.7,
  },
});

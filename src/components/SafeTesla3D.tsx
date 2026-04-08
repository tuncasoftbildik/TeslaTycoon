import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Tesla3D } from './Tesla3D';

interface Props {
  variant?: any;
  label?: string;
}

interface State {
  hasError: boolean;
}

export class SafeTesla3D extends React.Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(err: unknown) {
    // swallow — 3D rendering is non-essential
    console.warn('Tesla3D failed to render', err);
  }

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.fallback}>
          <Text style={styles.fallbackEmoji}>⚡</Text>
          {this.props.label ? <Text style={styles.fallbackLabel}>{this.props.label}</Text> : null}
        </View>
      );
    }
    return <Tesla3D variant={this.props.variant} label={this.props.label} />;
  }
}

const styles = StyleSheet.create({
  fallback: {
    height: 180,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fallbackEmoji: { fontSize: 64 },
  fallbackLabel: {
    marginTop: 8,
    color: '#fff',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.2,
    opacity: 0.7,
  },
});

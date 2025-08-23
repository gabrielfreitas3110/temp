import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
} from 'react-native';

const { width: screenWidth } = Dimensions.get('window');

export default function HeaderBanner() {
  return (
    <View style={styles.container}>
      <View style={styles.bannerImage}>
        <Text style={styles.bannerText}>🧪</Text>
        <Text style={styles.bannerTitle}>Verifique os Potenciais-Padrão</Text>
        <Text style={styles.bannerSubtitle}>de Redução</Text>
      </View>
      <View style={styles.overlay}>
        <Text style={styles.overlayText}>
          Verifique os potenciais-padrão de redução clicando nos ícones abaixo
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    position: 'relative',
    backgroundColor: '#f8f9fa',
  },
  bannerImage: {
    width: '100%',
    height: 120,
    backgroundColor: '#e3f2fd',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  bannerText: {
    fontSize: 32,
    marginBottom: 8,
  },
  bannerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1976d2',
    textAlign: 'center',
    marginBottom: 4,
  },
  bannerSubtitle: {
    fontSize: 16,
    color: '#1976d2',
    textAlign: 'center',
  },
  overlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  overlayText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
});

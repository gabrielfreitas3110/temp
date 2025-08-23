import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  LayoutAnimation,
  Platform,
  UIManager,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SemiReacao } from '../data/semireacoes';

// Habilitar LayoutAnimation no Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface SemiReacaoItemProps {
  item: SemiReacao;
}

export default function SemiReacaoItem({ item }: SemiReacaoItemProps) {
  const [expanded, setExpanded] = useState(false);

  const toggleExpanded = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded(!expanded);
  };

  const getE0Color = (E0: string) => {
    const value = parseFloat(E0.replace(',', '.').replace(' V', ''));
    if (value < 0) return '#e74c3c'; // Vermelho para valores negativos
    if (value > 0) return '#27ae60'; // Verde para valores positivos
    return '#7f8c8d'; // Cinza para zero
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.header}
        onPress={toggleExpanded}
        activeOpacity={0.7}
        accessibilityRole="button"
        accessibilityLabel={`${item.rotulo}, potencial padrão ${item.E0}. Toque para ${expanded ? 'recolher' : 'expandir'} detalhes da equação`}
        accessibilityHint="Toque para ver a equação química completa"
      >
        <View style={styles.headerContent}>
          <Text style={styles.rotulo}>{item.rotulo}</Text>
          <Text style={[styles.E0, { color: getE0Color(item.E0) }]}>
            {item.E0}
          </Text>
        </View>
        <View style={styles.iconContainer}>
          <Ionicons
            name={expanded ? 'chevron-up' : 'chevron-down'}
            size={20}
            color="#666"
          />
        </View>
      </TouchableOpacity>

      {expanded && (
        <View style={styles.content}>
          <View style={styles.equacaoContainer}>
            <Text style={styles.equacaoLabel}>Equação:</Text>
            <Text style={styles.equacao}>{item.equacao}</Text>
          </View>
          
          {item.grupo && (
            <View style={styles.grupoContainer}>
              <Text style={styles.grupoLabel}>Grupo:</Text>
              <Text style={styles.grupo}>{item.grupo}</Text>
            </View>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginHorizontal: 16,
    marginVertical: 6,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    minHeight: 60,
  },
  headerContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rotulo: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    flex: 1,
  },
  E0: {
    fontSize: 16,
    fontWeight: '700',
    marginLeft: 12,
    minWidth: 60,
    textAlign: 'right',
  },
  iconContainer: {
    marginLeft: 12,
    width: 24,
    alignItems: 'center',
  },
  content: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderTopWidth: 1,
    borderTopColor: '#ecf0f1',
  },
  equacaoContainer: {
    marginTop: 12,
  },
  equacaoLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#7f8c8d',
    marginBottom: 4,
  },
  equacao: {
    fontSize: 15,
    color: '#2c3e50',
    lineHeight: 22,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  grupoContainer: {
    marginTop: 12,
  },
  grupoLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#7f8c8d',
    marginBottom: 4,
  },
  grupo: {
    fontSize: 15,
    color: '#2c3e50',
    fontStyle: 'italic',
  },
});

import React from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  ScrollView,
} from 'react-native';
import ReactionButton from './ReactionButton';
import { SemiReacao } from '../data/semireacoes';

interface Grid12Props {
  items: SemiReacao[];
  selectedId: string | null;
  onItemPress: (item: SemiReacao, position: { x: number; y: number; width: number; height: number }) => void;
}

const { width: screenWidth } = Dimensions.get('window');
const isTablet = screenWidth > 768;

export default function Grid12({ items, selectedId, onItemPress }: Grid12Props) {
  // Determinar layout baseado no tamanho da tela
  const columns = isTablet ? 4 : 3;
  const rows = isTablet ? 3 : 4;

  // Organizar itens em linhas
  const gridRows = [];
  for (let i = 0; i < rows; i++) {
    const rowItems = items.slice(i * columns, (i + 1) * columns);
    gridRows.push(rowItems);
  }

  return (
    <ScrollView 
      style={styles.container}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
    >
      {gridRows.map((row, rowIndex) => (
        <View key={rowIndex} style={styles.row}>
          {row.map((item) => (
            <ReactionButton
              key={item.id}
              item={item}
              onPress={onItemPress}
              isSelected={selectedId === item.id}
            />
          ))}
          {/* Preencher espaços vazios se a linha não tiver itens suficientes */}
          {Array.from({ length: columns - row.length }).map((_, index) => (
            <View key={`empty-${rowIndex}-${index}`} style={styles.emptySpace} />
          ))}
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  emptySpace: {
    flex: 1,
    aspectRatio: 1,
  },
});

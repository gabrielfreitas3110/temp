import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { SEMI_REACOES, SemiReacao } from '../data/semireacoes';
import Grid12 from '../components/Grid12';
import ReactionCallout from '../components/ReactionCallout';

export default function PotenciaisReducaoScreen() {
  const router = useRouter();
  const [selectedItem, setSelectedItem] = useState<SemiReacao | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [buttonPosition, setButtonPosition] = useState<{ x: number; y: number; width: number; height: number } | undefined>(undefined);

  // Paginação: 12 itens por página
  const itemsPerPage = 12;
  const totalPages = Math.ceil(SEMI_REACOES.length / itemsPerPage);
  
  const currentItems = useMemo(() => {
    const startIndex = currentPage * itemsPerPage;
    return SEMI_REACOES.slice(startIndex, startIndex + itemsPerPage);
  }, [currentPage]);

  const handleItemPress = (item: SemiReacao, position: { x: number; y: number; width: number; height: number }) => {
    setSelectedItem(item);
    setButtonPosition(position);
  };

  const handleCloseCallout = () => {
    setSelectedItem(null);
    setButtonPosition(undefined);
  };



  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    setSelectedItem(null); // Fechar callout ao mudar de página
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar hidden />
      
      {/* Header com gradiente */}
      <LinearGradient colors={['#1e3c72', '#2a5298']} style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Potenciais-Padrão de Redução</Text>
        <View style={styles.headerSpacer} />
      </LinearGradient>

      {/* Banner com imagem dos potenciais */}
      <View style={styles.bannerContainer}>
        <Image 
          source={require('../assets/images/verifique-potenciais-banner.png')}
          style={styles.bannerImage}
          resizeMode="cover"
        />
      </View>

      {/* Grade de 12 botões */}
      <Grid12
        items={currentItems}
        selectedId={selectedItem?.id || null}
        onItemPress={handleItemPress}
      />

      {/* Callout com detalhes */}
      <ReactionCallout
        visible={!!selectedItem}
        item={selectedItem}
        onClose={handleCloseCallout}
        buttonPosition={buttonPosition}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    padding: 8,
  },
  headerText: {
    flex: 1,
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginLeft: -40, // Compensar o botão de voltar
  },
  headerSpacer: {
    width: 40,
  },
  bannerContainer: {
    width: '100%',
    height: 200,
    marginTop: 20,
    marginBottom: 10,
  },
  bannerImage: {
    width: '100%',
    height: '100%',
  },
});

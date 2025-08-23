import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Modal,
  Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SemiReacao } from '../data/semireacoes';

interface ReactionCalloutProps {
  visible: boolean;
  item: SemiReacao | null;
  onClose: () => void;
  buttonPosition?: { x: number; y: number; width: number; height: number };
}

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function ReactionCallout({
  visible,
  item,
  onClose,
  buttonPosition,
}: ReactionCalloutProps) {
  if (!visible || !item) return null;

  const getE0Color = (E0: string) => {
    const value = parseFloat(E0.replace(',', '.').replace(' V', ''));
    if (value < 0) return '#e74c3c'; // Vermelho para valores negativos
    if (value > 0) return '#27ae60'; // Verde para valores positivos
    return '#7f8c8d'; // Cinza para zero
  };

  // Calcular posição do callout baseado na posição do botão
  const getCalloutPosition = () => {
    if (!buttonPosition) {
      // Posição padrão centralizada se não houver posição do botão
      return {
        top: screenHeight * 0.3,
        left: (screenWidth - 280) / 2,
      };
    }

    const { x, y, width, height } = buttonPosition;
    const calloutWidth = 280;
    const calloutHeight = 180;
    
    // Posicionar o callout ABAIXO do botão
    // Como a seta sai da parte de baixo do callout, o callout deve estar acima
    // mas com espaço suficiente para a seta apontar para o botão
    const buttonBottom = y + height;
    const top = buttonBottom + 60; // 60px abaixo do botão para dar mais espaço
    
    // Calcular a posição horizontal, garantindo que não saia da tela
    let left = x + (width - calloutWidth) / 2;
    
    // Ajustar se o callout sair da tela
    if (left < 20) {
      left = 20; // Mínimo 20px da borda esquerda
    } else if (left + calloutWidth > screenWidth - 20) {
      left = screenWidth - calloutWidth - 20; // Mínimo 20px da borda direita
    }
    
    return { top, left };
  };

  // Calcular posição da seta para ficar alinhada com o centro inferior do botão
  const getArrowPosition = () => {
    if (!buttonPosition) {
      return { left: 140 }; // Centro do callout (280/2)
    }

    const { x, width } = buttonPosition;
    const calloutWidth = 280;
    const calloutLeft = getCalloutPosition().left;
    
    // Calcular onde a seta deve ficar para apontar para o centro do botão
    const buttonCenter = x + width / 2;
    const calloutCenter = calloutLeft + calloutWidth / 2;
    const arrowOffset = buttonCenter - calloutCenter;
    
    return { left: 140 + arrowOffset }; // 140 é metade da largura do callout
  };

  const calloutPosition = getCalloutPosition();
  const arrowPosition = getArrowPosition();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
      accessibilityViewIsModal
      accessibilityLabel={`Detalhes da semi-reação: ${item.rotulo}`}
    >
      <Pressable style={styles.backdrop} onPress={onClose}>
        <View style={[styles.calloutContainer, calloutPosition]}>
          {/* Triângulo do balão */}
          <View style={[styles.arrow, arrowPosition]} />
          
          {/* Conteúdo do balão */}
          <View style={styles.callout}>
            {/* Cabeçalho com botão fechar */}
            <View style={styles.header}>
              <Text style={styles.title}>Semi-reação de redução:</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={onClose}
                accessibilityRole="button"
                accessibilityLabel="Fechar detalhes"
              >
                <Ionicons name="close" size={16} color="#666" />
              </TouchableOpacity>
            </View>

            {/* Equação */}
            <View style={styles.equationContainer}>
              <Text style={styles.equation}>{item.equacao}</Text>
            </View>

            {/* Potencial padrão */}
            <View style={styles.potentialContainer}>
              <Text style={styles.potentialLabel}>E° = </Text>
              <Text style={[styles.potentialValue, { color: getE0Color(item.E0) }]}>
                {item.E0}
              </Text>
            </View>

            {/* Grupo (se existir) */}
            {item.grupo && (
              <View style={styles.groupContainer}>
                <Text style={styles.groupLabel}>Grupo: </Text>
                <Text style={styles.groupValue}>{item.grupo}</Text>
              </View>
            )}

          </View>
        </View>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  calloutContainer: {
    position: 'absolute',
    width: 280,
    height: 180,
    borderRadius: 20, // Bordas mais arredondadas para consistência
  },
  arrow: {
    position: 'absolute',
    bottom: -10, // Seta sai da parte de baixo do callout
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 10,
    borderRightWidth: 10,
    borderBottomWidth: 10, // Seta apontando para cima (para o botão)
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#ffffff', // Cor da seta apontando para cima
    zIndex: 1,
  },
  callout: {
    backgroundColor: '#ffffff',
    borderRadius: 20, // Bordas mais arredondadas
    padding: 16,
    borderWidth: 2,
    borderColor: '#ff9800',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    height: '100%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
    flex: 1,
    marginRight: 12,
  },
  closeButton: {
    padding: 4,
    borderRadius: 16,
    backgroundColor: '#f8f9fa',
  },
  equationContainer: {
    marginBottom: 12,
    padding: 10,
    backgroundColor: '#f8f9fa',
    borderRadius: 6,
  },
  equation: {
    fontSize: 14,
    color: '#2c3e50',
    textAlign: 'center',
    fontFamily: 'monospace',
    lineHeight: 18,
  },
  potentialContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'baseline',
    marginBottom: 12,
  },
  potentialLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
  },
  potentialValue: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  groupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 8,
  },
  groupLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#7f8c8d',
  },
  groupValue: {
    fontSize: 12,
    color: '#2c3e50',
    fontStyle: 'italic',
  },
});

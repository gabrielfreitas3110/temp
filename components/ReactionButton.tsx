import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SemiReacao } from '../data/semireacoes';

interface ReactionButtonProps {
  item: SemiReacao;
  onPress: (item: SemiReacao, position: { x: number; y: number; width: number; height: number }) => void;
  isSelected: boolean;
}

export default function ReactionButton({ item, onPress, isSelected }: ReactionButtonProps) {
  const [isPressed, setIsPressed] = useState(false);
  const [buttonPosition, setButtonPosition] = useState({ x: 0, y: 0, width: 0, height: 0 });

  // Extrair o símbolo principal e a carga do rótulo
  const getSymbolAndCharge = (rotulo: string) => {
    // Exemplos: "Li⁺/Li" -> "Li⁺", "Ba²⁺/Ba" -> "Ba²⁺", "2H⁺/H₂" -> "2H⁺"
    const parts = rotulo.split('/');
    if (parts.length > 0) {
      return parts[0];
    }
    return rotulo;
  };

  // Extrair o estado físico (aq), (s), (g), (l)
  const getPhysicalState = (equacao: string) => {
    const match = equacao.match(/\(([aqsgl])\)/);
    if (match) {
      return match[1];
    }
    return 'aq'; // padrão
  };

  const symbolAndCharge = getSymbolAndCharge(item.rotulo);
  const physicalState = getPhysicalState(item.equacao);

  // Determinar cores de gradiente baseadas no grupo ou potencial
  const getGradientColors = (): readonly [string, string] => {
    // Cores específicas baseadas na imagem com gradientes mais vivos
    switch (item.id) {
      case 'li': return ['#ff6f00', '#e65100'] as const;      // Laranja mais vivo
      case 'k': return ['#ab47bc', '#8e24aa'] as const;      // Roxo mais vivo
      case 'ba': return ['#fdd835', '#fbc02d'] as const;     // Amarelo mais vivo
      case 'sr': return ['#7cb342', '#558b2f'] as const;     // Verde mais vivo
      case 'ca': return ['#00acc1', '#00838f'] as const;     // Ciano mais vivo
      case 'na': return ['#1e88e5', '#1565c0'] as const;     // Azul mais vivo
      case 'mg': return ['#00897b', '#00695c'] as const;     // Verde azulado mais vivo
      case 'be': return ['#f44336', '#c62828'] as const;     // Vermelho mais vivo
      case 'al': return ['#757575', '#616161'] as const;     // Cinza mais vivo
      case 'mn2_mn': return ['#e91e63', '#ad1457'] as const; // Magenta mais vivo
      case 'h2o_h2_oh': return ['#ff5722', '#bf360c'] as const; // Vermelho laranja mais vivo
      case 'zn2_zn': return ['#ffb300', '#ff8f00'] as const; // Amarelo dourado mais vivo
      default:
        // Para outros elementos, usar cores baseadas no grupo ou potencial
        if (item.grupo) {
          if (item.grupo.includes('alcalino')) return ['#ab47bc', '#8e24aa'] as const;
          if (item.grupo.includes('Alcalino-terrosos')) return ['#5e35b1', '#4527a0'] as const;
          if (item.grupo.includes('Transição')) return ['#ff6f00', '#e65100'] as const;
        }
        
        const value = parseFloat(item.E0.replace(',', '.').replace(' V', ''));
        if (value < -1.5) return ['#e91e63', '#ad1457'] as const;
        if (value < 0) return ['#ff5722', '#bf360c'] as const;
        if (value < 1.0) return ['#43a047', '#2e7d32'] as const;
        return ['#1e88e5', '#1565c0'] as const;
    }
  };

  const gradientColors = getGradientColors();

  // Determinar cor do texto baseada na cor de fundo
  const getTextColor = () => {
    // Cores claras para fundos escuros, cores escuras para fundos claros
    const lightColors = ['#9c27b0', '#3f51b5', '#e91e63', '#2196f3', '#009688', '#ff5722'];
    const veryLightColors = ['#ffeb3b', '#8bc34a', '#00bcd4', '#ffc107'];
    
    if (lightColors.includes(gradientColors[0])) {
      return '#ffffff'; // Texto branco para fundos escuros
    } else if (veryLightColors.includes(gradientColors[0])) {
      return '#000000'; // Texto preto para fundos muito claros
    } else {
      return '#000000'; // Texto preto para outros casos
    }
  };

  const textColor = getTextColor();

  const handlePressIn = () => {
    setIsPressed(true);
  };

  const handlePressOut = () => {
    setIsPressed(false);
  };

  const handlePress = () => {
    onPress(item, buttonPosition);
  };

  const handleLayout = (event: any) => {
    const { x, y, width, height } = event.nativeEvent.layout;
    console.log('Button layout:', { x, y, width, height, id: item.id });
    setButtonPosition({ x, y, width, height });
  };

  return (
    <TouchableOpacity
      style={[
        styles.button,
        isSelected && styles.selectedButton,
        isPressed && styles.pressedButton,
      ]}
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onLayout={handleLayout}
      activeOpacity={1}
      accessibilityRole="button"
      accessibilityLabel={`Abrir detalhes de ${symbolAndCharge} ${physicalState === 'aq' ? 'aquoso' : physicalState === 's' ? 'sólido' : physicalState === 'g' ? 'gasoso' : 'líquido'}`}
      accessibilityHint="Toque para ver a equação química e potencial padrão"
    >
      {/* Fundo escuro para profundidade */}
      <View style={styles.darkBackground} />
      
      <LinearGradient
        colors={gradientColors}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {/* Sombra interna para efeito 3D */}
        <View style={styles.innerShadow} />
        
        {/* Brilho superior */}
        <View style={styles.highlight} />
        
        {/* Borda interna clara */}
        <View style={styles.innerBorder} />
        
        <View style={styles.content}>
          <Text style={[styles.symbol, { color: textColor }]}>
            {symbolAndCharge}
          </Text>
          <Text style={[styles.physicalState, { color: textColor }]}>
            ({physicalState})
          </Text>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    aspectRatio: 1,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    flex: 1,
    marginHorizontal: 6,
    minHeight: 85,
    overflow: 'hidden',
    // Fundo 3D com sombra
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  selectedButton: {
    elevation: 16,
    shadowOpacity: 0.7,
    transform: [{ scale: 0.92 }],
    borderColor: 'rgba(255, 255, 255, 0.4)',
  },
  pressedButton: {
    transform: [{ scale: 0.95 }],
    elevation: 8,
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
  },
  gradient: {
    width: '100%',
    height: '100%',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    // Borda interna para efeito 3D
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.4)', // Borda mais brilhante
  },
  darkBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 24,
    backgroundColor: 'rgba(0, 0, 0, 0.2)', // Fundo escuro reduzido para mais brilho
    zIndex: -1, // Garante que esteja atrás
  },
  innerShadow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 24,
    backgroundColor: 'rgba(0, 0, 0, 0.15)', // Sombra interna reduzida
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3, // Sombra reduzida
    shadowRadius: 6,
    // Borda interna escura
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.2)', // Borda escura reduzida
  },
  highlight: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '45%',
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    // Gradiente de brilho mais intenso
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.25)',
    // Sombra interna para suavizar
    shadowColor: '#fff',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  innerBorder: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)', // Borda interna mais brilhante
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
    zIndex: 1,
    // Sombra interna no conteúdo
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  symbol: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    lineHeight: 26,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 3,
  },
  physicalState: {
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 3,
    opacity: 0.9,
    textShadowColor: 'rgba(0, 0, 0, 0.4)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
});

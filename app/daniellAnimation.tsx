import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Animated,
  PanResponder,
  Dimensions,
  ScrollView,
  SafeAreaView,
  LayoutChangeEvent,
  FlatList,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';

// Tipos TypeScript
type ZoneId = 'zone-lamp' | 'zone-zn-solution' | 'zone-cu-solution' | 'zone-salt-bridge' | 'slot-zn-electrode' | 'slot-cu-electrode';
type ComponentId = 'lamp' | 'zn-solution' | 'cu-solution' | 'salt-bridge' | 'zn-electrode' | 'cu-electrode';

interface Component {
  id: ComponentId;
  label: string;
  image: any;
  targetZone: ZoneId;
}

interface Box {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface Zone {
  id: ZoneId;
  label: string;
  bounds: Box | null;
  isOccupied: boolean;
  occupiedBy: ComponentId | null;
  isHighlighted: boolean;
  isEnabled: boolean;
}

type Placed = Partial<Record<ZoneId, ComponentId>>;

const COMPONENTS: Component[] = [
  { id: 'lamp', label: 'Lâmpada', targetZone: 'zone-lamp', image: require('@/assets/images/lampada.png') },
  { id: 'zn-solution', label: 'Solução de ZnSO₄', targetZone: 'zone-zn-solution', image: require('@/assets/images/bequer_esquerdo.png') },
  { id: 'cu-solution', label: 'Solução de CuSO₄', targetZone: 'zone-cu-solution', image: require('@/assets/images/bequer_direita.png') },
  { id: 'salt-bridge', label: 'Ponte Salina', targetZone: 'zone-salt-bridge', image: require('@/assets/images/ponte_salina.png') },
  { id: 'zn-electrode', label: 'Eletrodo de Zinco', targetZone: 'slot-zn-electrode', image: require('@/assets/images/eletrodo_zinco.png') },
  { id: 'cu-electrode', label: 'Eletrodo de Cobre', targetZone: 'slot-cu-electrode', image: require('@/assets/images/eletrodo_cobre.png') },
];

const ZONES: Zone[] = [
  { id: 'zone-lamp', label: 'Lâmpada', bounds: null, isOccupied: false, occupiedBy: null, isHighlighted: false, isEnabled: true },
  { id: 'zone-zn-solution', label: 'Solução de ZnSO₄', bounds: null, isOccupied: false, occupiedBy: null, isHighlighted: false, isEnabled: true },
  { id: 'zone-cu-solution', label: 'Solução de CuSO₄', bounds: null, isOccupied: false, occupiedBy: null, isHighlighted: false, isEnabled: true },
  { id: 'zone-salt-bridge', label: 'Ponte Salina', bounds: null, isOccupied: false, occupiedBy: null, isHighlighted: false, isEnabled: true },
  { id: 'slot-zn-electrode', label: 'Eletrodo de Zinco', bounds: null, isOccupied: false, occupiedBy: null, isHighlighted: false, isEnabled: false },
  { id: 'slot-cu-electrode', label: 'Eletrodo de Cobre', bounds: null, isOccupied: false, occupiedBy: null, isHighlighted: false, isEnabled: false },
];

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function DaniellAnimation() {
  const router = useRouter();
  
  // Estados principais
  const [availableComponents, setAvailableComponents] = useState<Component[]>(COMPONENTS);
  const [zones, setZones] = useState<Zone[]>(ZONES);
  const [placed, setPlaced] = useState<Placed>({});
  
  // Estados de UI
  const [isComplete, setIsComplete] = useState(false);
  const [showElectronFlow, setShowElectronFlow] = useState(false);
  const [draggedComponent, setDraggedComponent] = useState<ComponentId | null>(null);
  const [dragPosition, setDragPosition] = useState({ x: 0, y: 0 });
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState<string | null>(null);
  const [boardScrollOffset, setBoardScrollOffset] = useState({ x: 0, y: 0 });
  
  // Animações
  const lampGlowAnim = useRef(new Animated.Value(0)).current;
  const componentAnimations = useRef<{ [key: string]: Animated.Value }>({}).current;
  
  // Refs para medição
  const zoneRefs = useRef<{ [key: string]: View | null }>({});
  const boardScrollRef = useRef<ScrollView | null>(null);
  
  // Inicializar animações dos componentes
  useEffect(() => {
    COMPONENTS.forEach(comp => {
      componentAnimations[comp.id] = new Animated.Value(1);
    });
  }, []);

  // Hook para medir zona
  const measureZone = (zoneId: ZoneId, event: LayoutChangeEvent) => {
    const { x, y, width, height } = event.nativeEvent.layout;
    
    // Medir posição absoluta na tela
    zoneRefs.current[zoneId]?.measureInWindow((windowX, windowY) => {
      setZones(prev => prev.map(zone => 
        zone.id === zoneId 
          ? { ...zone, bounds: { x: windowX, y: windowY, width, height } }
          : zone
      ));
    });
  };

  // Função para verificar colisão com compensação de scroll
  const checkCollision = (dragX: number, dragY: number, zone: Zone): boolean => {
    if (!zone.bounds) return false;
    
    const { x, y, width, height } = zone.bounds;
    const centerX = dragX;
    const centerY = dragY;
    
    return (
      centerX >= x && 
      centerX <= x + width && 
      centerY >= y && 
      centerY <= y + height
    );
  };

  // Função para encontrar zona válida
  const findValidZone = (dragX: number, dragY: number, componentId: ComponentId): Zone | null => {
    const component = COMPONENTS.find(comp => comp.id === componentId);
    if (!component) return null;
    
    // Verificar se é um eletrodo e se a solução correspondente já foi colocada
    if (componentId.includes('electrode')) {
      const solutionZone = componentId === 'zn-electrode' ? 'zone-zn-solution' : 'zone-cu-solution';
      if (!placed[solutionZone as ZoneId]) return null;
    }
    
    return zones.find(zone => 
      zone.id === component.targetZone && 
      !zone.isOccupied && 
      zone.isEnabled &&
      checkCollision(dragX, dragY, zone)
    ) || null;
  };

  // Função para destacar zona durante drag
  const highlightZone = (dragX: number, dragY: number, componentId: ComponentId) => {
    const validZone = findValidZone(dragX, dragY, componentId);
    
    setZones(prev => prev.map(zone => ({
      ...zone,
      isHighlighted: validZone?.id === zone.id
    })));
  };

  // Função para habilitar slots de eletrodos
  const enableElectrodeSlots = (solutionZoneId: ZoneId) => {
    if (solutionZoneId === 'zone-zn-solution') {
      setZones(prev => prev.map(zone => 
        zone.id === 'slot-zn-electrode' ? { ...zone, isEnabled: true } : zone
      ));
    } else if (solutionZoneId === 'zone-cu-solution') {
      setZones(prev => prev.map(zone => 
        zone.id === 'slot-cu-electrode' ? { ...zone, isEnabled: true } : zone
      ));
    }
  };

  // Criar PanResponder para componente
  const createPanResponder = (componentId: ComponentId) => {
    return PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt, gestureState) => {
        setDraggedComponent(componentId);
        setDragPosition({ x: gestureState.x0, y: gestureState.y0 });
        
        // Animar componente sendo arrastado
        if (componentAnimations[componentId]) {
          Animated.timing(componentAnimations[componentId], {
            toValue: 0.8,
            duration: 150,
            useNativeDriver: true,
          }).start();
        }
      },
      onPanResponderMove: (evt, gestureState) => {
        const { moveX, moveY } = gestureState;
        setDragPosition({ x: moveX, y: moveY });
        highlightZone(moveX, moveY, componentId);
      },
      onPanResponderRelease: (evt, gestureState) => {
        const { moveX, moveY } = gestureState;
        handleDrop(componentId, moveX, moveY);
        
        // Resetar animação
        if (componentAnimations[componentId]) {
          Animated.timing(componentAnimations[componentId], {
            toValue: 1,
            duration: 150,
            useNativeDriver: true,
          }).start();
        }
        
        setDraggedComponent(null);
        setZones(prev => prev.map(zone => ({ ...zone, isHighlighted: false })));
      },
    });
  };

  // Função para lidar com drop
  const handleDrop = (componentId: ComponentId, dropX: number, dropY: number) => {
    const component = COMPONENTS.find(comp => comp.id === componentId);
    if (!component) return;

    const validZone = findValidZone(dropX, dropY, componentId);
    
    if (validZone) {
      // Drop válido - adicionar ao estado placed
      setPlaced(prev => ({ ...prev, [validZone.id]: componentId }));
      
      // Marcar zona como ocupada
      setZones(prev => prev.map(zone => 
        zone.id === validZone.id 
          ? { ...zone, isOccupied: true, occupiedBy: componentId }
          : zone
      ));
      
      // Remover da lista de disponíveis
      setAvailableComponents(prev => prev.filter(comp => comp.id !== componentId));
      
      // Habilitar slots de eletrodos se for uma solução
      if (componentId.includes('solution')) {
        enableElectrodeSlots(validZone.id);
      }
      
      // Mostrar sucesso
      setShowSuccess(`${component.label} posicionado corretamente!`);
      setTimeout(() => setShowSuccess(null), 2000);
      
      checkCompletion();
    } else {
      // Drop inválido - mostrar erro
      setErrorMessage('Solte o componente em uma zona válida!');
      setTimeout(() => setErrorMessage(null), 2000);
    }
  };

  // Verificar conclusão
  const checkCompletion = () => {
    const requiredZones: ZoneId[] = ['zone-lamp', 'zone-zn-solution', 'zone-cu-solution', 'zone-salt-bridge', 'slot-zn-electrode', 'slot-cu-electrode'];
    const allPlaced = requiredZones.every(zoneId => placed[zoneId]);
    
    if (allPlaced) {
      setIsComplete(true);
      startLampGlow();
      setTimeout(() => {
        setShowElectronFlow(true);
      }, 1000);
    }
  };

  // Animar brilho da lâmpada
  const startLampGlow = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(lampGlowAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(lampGlowAnim, {
          toValue: 0.3,
          duration: 500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  // Resetar simulação
  const resetSimulation = () => {
    setAvailableComponents(COMPONENTS);
    setZones(ZONES);
    setPlaced({});
    setIsComplete(false);
    setShowElectronFlow(false);
    lampGlowAnim.setValue(0);
    setErrorMessage(null);
    setShowSuccess(null);
  };

  // Renderizar zona de drop
  const renderDropZone = (zone: Zone) => {
    const isElectrode = zone.id.includes('electrode');
    const placedComponent = placed[zone.id as ZoneId];
    
    return (
      <View
        key={zone.id}
        ref={ref => zoneRefs.current[zone.id] = ref}
        onLayout={(event) => measureZone(zone.id, event)}
        style={[
          styles.dropZone,
          isElectrode && styles.electrodeZone,
          {
            borderColor: zone.isOccupied 
              ? '#4CAF50' 
              : zone.isHighlighted 
                ? '#4CAF50' 
                : zone.isEnabled
                  ? '#aaa'
                  : '#ccc',
            backgroundColor: zone.isOccupied 
              ? 'rgba(76, 175, 80, 0.1)' 
              : zone.isHighlighted 
                ? 'rgba(76, 175, 80, 0.2)' 
                : zone.isEnabled
                  ? 'rgba(240, 240, 240, 0.3)'
                  : 'rgba(200, 200, 200, 0.2)',
            borderWidth: zone.isHighlighted ? 2 : 1,
            opacity: zone.isEnabled ? 1 : 0.5,
          },
        ]}
      >
        {placedComponent ? (
          <View style={styles.placedComponentContainer}>
            <Image 
              source={COMPONENTS.find(c => c.id === placedComponent)?.image} 
              style={styles.placedComponentImage} 
            />
          </View>
        ) : (
          <Text style={[
            styles.zoneText, 
            { 
              color: zone.isOccupied || zone.isHighlighted ? '#4CAF50' : zone.isEnabled ? '#666' : '#999',
              fontSize: isElectrode ? 8 : 12,
            }
          ]}>
            {zone.label}
          </Text>
        )}
      </View>
    );
  };

  // Renderizar componente arrastável
  const renderDraggableComponent = (component: Component) => {
    const panResponder = createPanResponder(component.id);
    
    return (
      <Animated.View
        key={component.id}
        style={[
          styles.draggableComponent,
          {
            opacity: componentAnimations[component.id] || 1,
            transform: [{ scale: componentAnimations[component.id] || 1 }],
          },
        ]}
        {...panResponder.panHandlers}
      >
        <Image source={component.image} style={styles.draggableComponentImage} />
        <Text style={styles.draggableComponentText}>{component.label}</Text>
      </Animated.View>
    );
  };

  // Renderizar componente sendo arrastado (overlay)
  const renderDraggedComponent = () => {
    if (!draggedComponent) return null;
    
    const component = COMPONENTS.find(comp => comp.id === draggedComponent);
    if (!component) return null;

    const size = getComponentSize(component.id);
    
    return (
      <Animated.View
        style={[
          styles.draggedComponentOverlay,
          {
            left: dragPosition.x - size / 2,
            top: dragPosition.y - size / 2,
            width: size,
            height: size,
          },
        ]}
        pointerEvents="none"
      >
        <Image 
          source={component.image} 
          style={styles.draggedComponentImage} 
        />
      </Animated.View>
    );
  };

  // Função para obter tamanho do componente
  const getComponentSize = (componentId: ComponentId): number => {
    if (componentId.includes('electrode')) return 40;
    if (componentId === 'lamp') return 50;
    return 60;
  };

  // Renderizar fios condutores
  const renderWires = () => {
    if (!isComplete) return null;
    
    const znZone = zones.find(z => z.id === 'slot-zn-electrode');
    const cuZone = zones.find(z => z.id === 'slot-cu-electrode');
    const lampZone = zones.find(z => z.id === 'zone-lamp');
    
    if (!znZone?.bounds || !cuZone?.bounds || !lampZone?.bounds) return null;
    
    return (
      <View style={styles.wireContainer} pointerEvents="none">
        {/* Fio do eletrodo esquerdo para a lâmpada */}
        <View style={[
          styles.wire,
          {
            left: znZone.bounds.x + znZone.bounds.width / 2,
            top: znZone.bounds.y,
            width: 3,
            height: Math.abs(lampZone.bounds.y - znZone.bounds.y),
          }
        ]} />
        
        {/* Fio horizontal da lâmpada */}
        <View style={[
          styles.wire,
          {
            left: znZone.bounds.x + znZone.bounds.width / 2,
            top: lampZone.bounds.y + lampZone.bounds.height / 2,
            width: cuZone.bounds.x - znZone.bounds.x,
            height: 3,
          }
        ]} />
        
        {/* Fio da lâmpada para o eletrodo direito */}
        <View style={[
          styles.wire,
          {
            left: cuZone.bounds.x + cuZone.bounds.width / 2,
            top: lampZone.bounds.y + lampZone.bounds.height / 2,
            width: 3,
            height: Math.abs(cuZone.bounds.y - (lampZone.bounds.y + lampZone.bounds.height / 2)),
          }
        ]} />
      </View>
    );
  };

  // Renderizar lâmpada animada
  const renderAnimatedLamp = () => {
    if (!isComplete) return null;
    
    const lampZone = zones.find(z => z.id === 'zone-lamp');
    if (!lampZone?.bounds) return null;
    
    return (
      <Animated.View
        style={[
          styles.animatedLamp,
          {
            left: lampZone.bounds.x,
            top: lampZone.bounds.y,
            width: lampZone.bounds.width,
            height: lampZone.bounds.height,
            opacity: lampGlowAnim,
          },
        ]}
        pointerEvents="none"
      >
        <Image
          source={require('@/assets/images/lampada.png')}
          style={styles.lampImage}
        />
      </Animated.View>
    );
  };

  // Renderizar fluxo de elétrons
  const renderElectronFlow = () => {
    if (!showElectronFlow) return null;
    
    return (
      <View style={styles.electronFlowContainer} pointerEvents="none">
        <Image
          source={require('@/assets/images/movimento_eletron.png')}
          style={styles.electronFlowImage}
        />
      </View>
    );
  };

  // Renderizar mensagem
  const renderMessage = () => {
    if (errorMessage) {
      return (
        <View style={styles.messageContainer}>
          <Text style={styles.errorText}>{errorMessage}</Text>
        </View>
      );
    }
    
    if (showSuccess) {
      return (
        <View style={styles.messageContainer}>
          <Text style={styles.successText}>{showSuccess}</Text>
        </View>
      );
    }
    
    return null;
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar hidden={true} />
      
      {/* Header */}
      <LinearGradient
        colors={['#1e3c72', '#2a5298']}
        style={styles.header}
      >
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>← Voltar</Text>
        </TouchableOpacity>
        
        <Text style={styles.title}>Animação da Pilha de Daniell</Text>
        
        <TouchableOpacity style={styles.resetButton} onPress={resetSimulation}>
          <Text style={styles.resetButtonText}>Reiniciar</Text>
        </TouchableOpacity>
      </LinearGradient>

      {/* Instruções */}
      <View style={styles.instructions}>
        <Text style={styles.instructionsText}>
          Arraste os componentes para as zonas corretas para montar a Pilha de Daniell
        </Text>
      </View>

      {/* Board Scroll - Área de Montagem */}
      <ScrollView
        ref={boardScrollRef}
        style={styles.boardScroll}
        contentContainerStyle={styles.boardContent}
        showsVerticalScrollIndicator={false}
        onScroll={(event) => {
          setBoardScrollOffset(event.nativeEvent.contentOffset);
        }}
        scrollEventThrottle={16}
      >
        {/* Layout da Pilha de Daniell */}
        <View style={styles.daniellLayout}>
          {/* Lâmpada (topo) */}
          <View style={styles.lampZoneContainer}>
            {zones.filter(z => z.id === 'zone-lamp').map(renderDropZone)}
          </View>
          
          {/* Meia-células (meio) */}
          <View style={styles.cellsContainer}>
            {/* Meia-célula esquerda (Zn) */}
            <View style={styles.leftCell}>
              <View style={styles.solutionContainer}>
                {zones.filter(z => z.id === 'zone-zn-solution').map(renderDropZone)}
                <View style={styles.electrodeSlot}>
                  {zones.filter(z => z.id === 'slot-zn-electrode').map(renderDropZone)}
                </View>
              </View>
            </View>
            
            {/* Ponte Salina (centro) */}
            <View style={styles.saltBridgeContainer}>
              {zones.filter(z => z.id === 'zone-salt-bridge').map(renderDropZone)}
            </View>
            
            {/* Meia-célula direita (Cu) */}
            <View style={styles.rightCell}>
              <View style={styles.solutionContainer}>
                {zones.filter(z => z.id === 'zone-cu-solution').map(renderDropZone)}
                <View style={styles.electrodeSlot}>
                  {zones.filter(z => z.id === 'slot-cu-electrode').map(renderDropZone)}
                </View>
              </View>
            </View>
          </View>
        </View>
        
        {/* Fios condutores */}
        {renderWires()}
        
        {/* Lâmpada animada */}
        {renderAnimatedLamp()}
        
        {/* Fluxo de elétrons */}
        {renderElectronFlow()}
      </ScrollView>

      {/* Palette Container - Fixo no rodapé */}
      <View style={styles.paletteContainer}>
        <Text style={styles.panelTitle}>Componentes Disponíveis:</Text>
        <FlatList
          data={availableComponents}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.paletteContent}
          renderItem={({ item }) => renderDraggableComponent(item)}
          keyExtractor={(item) => item.id}
        />
      </View>

      {/* Overlay para componente sendo arrastado */}
      {renderDraggedComponent()}

      {/* Mensagens */}
      {renderMessage()}
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    padding: 8,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  title: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    flex: 1,
  },
  resetButton: {
    padding: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 5,
  },
  resetButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  instructions: {
    backgroundColor: '#fff',
    padding: 16,
    marginHorizontal: 16,
    borderRadius: 10,
    marginBottom: 8,
    elevation: 2,
  },
  instructionsText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#333',
  },
  boardScroll: {
    flex: 1,
    backgroundColor: '#fff',
    marginHorizontal: 16,
    borderRadius: 10,
    marginBottom: 8,
    elevation: 2,
  },
  boardContent: {
    padding: 16,
    minHeight: 600,
    alignItems: 'center',
  },
  daniellLayout: {
    alignItems: 'center',
    width: '100%',
  },
  lampZoneContainer: {
    marginBottom: 20,
  },
  cellsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 20,
  },
  leftCell: {
    alignItems: 'center',
    flex: 1,
  },
  rightCell: {
    alignItems: 'center',
    flex: 1,
  },
  saltBridgeContainer: {
    alignItems: 'center',
    marginHorizontal: 10,
  },
  solutionContainer: {
    position: 'relative',
    alignItems: 'center',
  },
  electrodeSlot: {
    position: 'absolute',
    width: '36%',
    height: '55%',
    bottom: '12%',
    left: '32%',
    zIndex: 5,
  },
  dropZone: {
    borderWidth: 1,
    borderStyle: 'dashed',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    aspectRatio: 1,
    width: 100,
    height: 100,
  },
  electrodeZone: {
    width: 60,
    height: 60,
    marginBottom: 0,
  },
  zoneText: {
    fontSize: 12,
    textAlign: 'center',
    color: '#666',
    fontWeight: '500',
  },
  placedComponentContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
  },
  placedComponentImage: {
    width: '80%',
    height: '80%',
    resizeMode: 'contain',
  },
  wireContainer: {
    position: 'absolute',
    zIndex: 5,
  },
  wire: {
    position: 'absolute',
    backgroundColor: '#333',
  },
  animatedLamp: {
    position: 'absolute',
    zIndex: 20,
  },
  lampImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  electronFlowContainer: {
    position: 'absolute',
    top: 100,
    left: '30%',
    zIndex: 15,
  },
  electronFlowImage: {
    width: '40%',
    height: 60,
    resizeMode: 'contain',
  },
  paletteContainer: {
    backgroundColor: '#fff',
    padding: 16,
    marginHorizontal: 16,
    borderRadius: 10,
    elevation: 2,
    height: 120,
  },
  panelTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  paletteContent: {
    paddingVertical: 8,
  },
  draggableComponent: {
    alignItems: 'center',
    marginRight: 16,
    padding: 8,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    minWidth: 80,
  },
  draggableComponentImage: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
  },
  draggableComponentText: {
    fontSize: 10,
    textAlign: 'center',
    marginTop: 4,
    color: '#666',
  },
  draggedComponentOverlay: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    zIndex: 2000,
  },
  draggedComponentImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  messageContainer: {
    position: 'absolute',
    top: 100,
    left: 32,
    right: 32,
    backgroundColor: '#f44336',
    padding: 12,
    borderRadius: 8,
    elevation: 5,
    zIndex: 3000,
  },
  errorText: {
    color: '#fff',
    fontSize: 14,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  successText: {
    color: '#fff',
    fontSize: 14,
    textAlign: 'center',
    fontWeight: 'bold',
  },
}); 
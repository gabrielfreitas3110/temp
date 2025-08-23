import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Animated,
  PanResponder,
  ScrollView,
  SafeAreaView,
  LayoutChangeEvent,
  FlatList,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Path } from 'react-native-svg';
import { Audio, Video, ResizeMode } from 'expo-av';

/* ========================= Tipos ========================= */
type ZoneId =
  | 'zone-lamp'
  | 'zone-zn-solution'
  | 'zone-cu-solution'
  | 'zone-salt-bridge'
  | 'slot-zn-electrode'
  | 'slot-cu-electrode'
  | 'zone-wires';

type ComponentId =
  | 'lamp'
  | 'zn-solution'
  | 'cu-solution'
  | 'salt-bridge'
  | 'zn-electrode'
  | 'cu-electrode'
  | 'wires';

type BuildStage =
  | 'empty'
  | 'bequers_only'
  | 'with_bridge'
  | 'with_zn_electrode'
  | 'with_cu_electrode'
  | 'complete'        // experimento_completo.png
  | 'with_wires';     // depois do completo

interface ComponentDef {
  id: ComponentId;
  label: string;
  image: any;
  targetZone: ZoneId;
}
interface Box { x: number; y: number; width: number; height: number; }
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

/* ===================== Dados/Constantes ===================== */
const COMPONENTS: ComponentDef[] = [
  { id: 'lamp', label: 'Lâmpada', targetZone: 'zone-lamp', image: require('@/assets/images/lampada.png') },
  { id: 'zn-solution', label: 'Solução de ZnSO₄', targetZone: 'zone-zn-solution', image: require('@/assets/images/bequer_esquerdo.png') },
  { id: 'cu-solution', label: 'Solução de CuSO₄', targetZone: 'zone-cu-solution', image: require('@/assets/images/bequer_direito.png') },
  { id: 'salt-bridge', label: 'Ponte Salina', targetZone: 'zone-salt-bridge', image: require('@/assets/images/ponte_salina.png') },
  { id: 'zn-electrode', label: 'Eletrodo de Zinco', targetZone: 'slot-zn-electrode', image: require('@/assets/images/eletrodo_zinco.png') },
  { id: 'cu-electrode', label: 'Eletrodo de Cobre', targetZone: 'slot-cu-electrode', image: require('@/assets/images/eletrodo_cobre.png') },
  { id: 'wires', label: 'Fios', targetZone: 'zone-wires', image: require('@/assets/images/fios.png') },
];

const INITIAL_ZONES: Zone[] = [
  { id: 'zone-lamp',         label: 'Lâmpada',           bounds: null, isOccupied: false, occupiedBy: null, isHighlighted: false, isEnabled: true  },
  { id: 'zone-zn-solution',  label: 'Solução de ZnSO₄',  bounds: null, isOccupied: false, occupiedBy: null, isHighlighted: false, isEnabled: true  },
  { id: 'zone-cu-solution',  label: 'Solução de CuSO₄',  bounds: null, isOccupied: false, occupiedBy: null, isHighlighted: false, isEnabled: true  },
  { id: 'zone-salt-bridge',  label: 'Ponte Salina',      bounds: null, isOccupied: false, occupiedBy: null, isHighlighted: false, isEnabled: true  },
  { id: 'slot-zn-electrode', label: 'Eletrodo de Zinco', bounds: null, isOccupied: false, occupiedBy: null, isHighlighted: false, isEnabled: false },
  { id: 'slot-cu-electrode', label: 'Eletrodo de Cobre', bounds: null, isOccupied: false, occupiedBy: null, isHighlighted: false, isEnabled: false },
  { id: 'zone-wires',        label: 'Simulação dos Fios',bounds: null, isOccupied: false, occupiedBy: null, isHighlighted: false, isEnabled: false },
];

const cloneInitialZones = (): Zone[] => INITIAL_ZONES.map(z => ({ ...z }));

export default function DaniellAnimation() {
  const router = useRouter();

  const [available, setAvailable] = useState<ComponentDef[]>(COMPONENTS);
  const [zones, setZones] = useState<Zone[]>(cloneInitialZones());
  const [placed, setPlaced] = useState<Placed>({});
  const [dragged, setDragged] = useState<ComponentId | null>(null);
  const [dragPos, setDragPos] = useState({ x: 0, y: 0 });
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [okMsg, setOkMsg] = useState<string | null>(null);
  const [isComplete, setIsComplete] = useState(false);
  const [buildStage, setBuildStage] = useState<BuildStage>('empty');
  const [currentExperimentImage, setCurrentExperimentImage] = useState<any>(null);
  const [wiresZonePosition, setWiresZonePosition] = useState(-300); // Posição inicial da zona dos fios

  const [layoutKey, setLayoutKey] = useState(0);

  // Novos estados para áudio e vídeo
  const [showVideo, setShowVideo] = useState(false);
  const [videoStatus, setVideoStatus] = useState({});
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  const itemScale = useRef<Record<string, Animated.Value>>({}).current;

  const zoneRefs = useRef<Record<string, View | null>>({});
  const boardRef = useRef<View | null>(null);
  const [boardBox, setBoardBox] = useState<Box | null>(null);

  // Referências para áudio
  const errorSoundRef = useRef<Audio.Sound | null>(null);
  const successSoundRef = useRef<Audio.Sound | null>(null);

  useEffect(() => {
    COMPONENTS.forEach(c => {
      if (!itemScale[c.id]) itemScale[c.id] = new Animated.Value(1);
    });

    // Configurar áudio
    const setupAudio = async () => {
      try {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: false,
          staysActiveInBackground: false,
          playsInSilentModeIOS: true,
          shouldDuckAndroid: true,
          playThroughEarpieceAndroid: false,
        });
        await loadSounds();
      } catch (error) {
        console.log('Erro ao configurar áudio:', error);
      }
    };

    setupAudio();

    return () => {
      // Limpar sons ao desmontar
      if (errorSoundRef.current) errorSoundRef.current.unloadAsync();
      if (successSoundRef.current) successSoundRef.current.unloadAsync();
    };
  }, []);

  // Função para carregar os sons
  const loadSounds = async () => {
    try {
      const { sound: errorSound } = await Audio.Sound.createAsync(
        require('@/assets/videos/error.mp4'),
        { shouldPlay: false }
      );
      errorSoundRef.current = errorSound;

      const { sound: successSound } = await Audio.Sound.createAsync(
        require('@/assets/videos/success.mp4'),
        { shouldPlay: false }
      );
      successSoundRef.current = successSound;
    } catch (error) {
      console.log('Erro ao carregar sons:', error);
    }
  };

  // Função para tocar som de erro
  const playErrorSound = async () => {
    try {
      if (errorSoundRef.current) {
        await errorSoundRef.current.setPositionAsync(0);
        await errorSoundRef.current.playAsync();
      }
    } catch (error) {
      console.log('Erro ao tocar som de erro:', error);
    }
  };

  // Função para tocar som de sucesso
  const playSuccessSound = async () => {
    try {
      if (successSoundRef.current) {
        await successSoundRef.current.setPositionAsync(0);
        await successSoundRef.current.playAsync();
      }
    } catch (error) {
      console.log('Erro ao tocar som de sucesso:', error);
    }
  };

  // Função para mostrar vídeo após sucesso
  const showSimulationVideo = () => {
    setTimeout(() => {
      setShowVideo(true);
      setIsVideoPlaying(true);
    }, 3000);
  };

  /* ========================= Medição ========================= */
  const measureZone = (id: ZoneId, e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    requestAnimationFrame(() => {
      zoneRefs.current[id]?.measureInWindow((x, y) => {
        setZones(prev => prev.map(z => (z.id === id ? { ...z, bounds: { x, y, width, height } } : z)));
      });
    });
  };

  const measureBoard = () => {
    requestAnimationFrame(() => {
      boardRef.current?.measureInWindow((x, y, width, height) => {
        setBoardBox({ x, y, width, height });
      });
    });
  };

  /* ==================== Colisão / Busca ==================== */
  const inside = (x: number, y: number, b: Box) =>
    x >= b.x && x <= b.x + b.width && y >= b.y && y <= b.y + b.height;

  const findZoneFor = (x: number, y: number, id: ComponentId): Zone | null => {
    const def = COMPONENTS.find(c => c.id === id);
    if (!def) return null;

    // Regras de progressão
    if (id === 'salt-bridge') {
      const hasZnSolution = !!placed['zone-zn-solution'];
      const hasCuSolution = !!placed['zone-cu-solution'];
      const hasAnyElectrode = !!placed['slot-zn-electrode'] || !!placed['slot-cu-electrode'];
      if (!hasZnSolution || !hasCuSolution || hasAnyElectrode) return null;
    }

    if (id === 'zn-electrode') {
      if (!placed['zone-zn-solution']) return null;
      if (!placed['zone-salt-bridge']) return null;
    }
    if (id === 'cu-electrode') {
      if (!placed['zone-cu-solution']) return null;
      if (!placed['zone-salt-bridge']) return null;
    }

    if (id === 'wires') {
      const ready =
        !!placed['zone-zn-solution'] &&
        !!placed['zone-cu-solution'] &&
        !!placed['zone-salt-bridge'] &&
        !!placed['slot-zn-electrode'] &&
        !!placed['slot-cu-electrode'];
      if (!ready) return null;
    }

    const z = zones.find(
      zone =>
        zone.id === def.targetZone &&
        zone.isEnabled &&
        !zone.isOccupied &&
        zone.bounds &&
        inside(x, y, zone.bounds)
    );
    return z ?? null;
  };

  const highlight = (x: number, y: number, id: ComponentId) => {
    const valid = findZoneFor(x, y, id);
    setZones(prev => prev.map(z => ({ ...z, isHighlighted: valid?.id === z.id })));
  };

  const enableElectrodeSlot = (solutionZone: ZoneId) => {
    if (solutionZone === 'zone-zn-solution')
      setZones(prev => prev.map(z => (z.id === 'slot-zn-electrode' ? { ...z, isEnabled: true } : z)));
    if (solutionZone === 'zone-cu-solution')
      setZones(prev => prev.map(z => (z.id === 'slot-cu-electrode' ? { ...z, isEnabled: true } : z)));
  };

  // Habilita zona de fios assim que o experimento ficar "complete"
  const maybeEnableWiresZone = (nextPlaced: Placed) => {
    const ready =
      !!nextPlaced['zone-zn-solution'] &&
      !!nextPlaced['zone-cu-solution'] &&
      !!nextPlaced['zone-salt-bridge'] &&
      !!nextPlaced['slot-zn-electrode'] &&
      !!nextPlaced['slot-cu-electrode'];
    if (ready) {
      setZones(prev => prev.map(z => (z.id === 'zone-wires' ? { ...z, isEnabled: true } : z)));
      // Move a zona dos fios para a posição final após habilitar
      setWiresZonePosition(-350);
    }
  };

  /* ==================== Drag & Drop ==================== */
  const createPanResponder = (id: ComponentId) =>
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt) => {
        setDragged(id);
        const { pageX, pageY } = evt.nativeEvent;
        setDragPos({ x: pageX, y: pageY });
        Animated.timing(itemScale[id], { toValue: 0.9, duration: 120, useNativeDriver: true }).start();
      },
      onPanResponderMove: (evt) => {
        const { pageX, pageY } = evt.nativeEvent;
        setDragPos({ x: pageX, y: pageY });
        highlight(pageX, pageY, id);
      },
      onPanResponderRelease: (evt) => {
        const { pageX, pageY } = evt.nativeEvent;
        handleDrop(id, pageX, pageY);
        Animated.timing(itemScale[id], { toValue: 1, duration: 120, useNativeDriver: true }).start();
        setDragged(null);
        setZones(prev => prev.map(z => ({ ...z, isHighlighted: false })));
      },
    });

  // Agora a conclusão exige também os fios
  const REQUIRED: ZoneId[] = [
    'zone-lamp',
    'zone-zn-solution',
    'zone-cu-solution',
    'zone-salt-bridge',
    'slot-zn-electrode',
    'slot-cu-electrode',
    'zone-wires',
  ];

  const updateBuildStage = (placedMap: Placed) => {
    const hasZnSolution = !!placedMap['zone-zn-solution'];
    const hasCuSolution = !!placedMap['zone-cu-solution'];
    const hasSaltBridge = !!placedMap['zone-salt-bridge'];
    const hasZnElectrode = !!placedMap['slot-zn-electrode'];
    const hasCuElectrode = !!placedMap['slot-cu-electrode'];
    const hasWires = !!placedMap['zone-wires'];

    let newStage: BuildStage = 'empty';
    let newImage: any = null;

    if (hasZnSolution && hasCuSolution && hasSaltBridge && hasZnElectrode && hasCuElectrode && hasWires) {
      newStage = 'with_wires';
      newImage = require('@/assets/images/experimento_completo.png'); // mantém a base do experimento; fios são um componente separado
    } else if (hasZnSolution && hasCuSolution && hasSaltBridge && hasZnElectrode && hasCuElectrode) {
      newStage = 'complete';
      newImage = require('@/assets/images/experimento_completo.png');
    } else if (hasZnSolution && hasCuSolution && hasSaltBridge && hasZnElectrode) {
      newStage = 'with_zn_electrode';
      newImage = require('@/assets/images/bequer_eletrodo_zinco.png');
    } else if (hasZnSolution && hasCuSolution && hasSaltBridge && hasCuElectrode) {
      newStage = 'with_cu_electrode';
      newImage = require('@/assets/images/bequer_eletrodo_cobre.png');
    } else if (hasZnSolution && hasCuSolution && hasSaltBridge) {
      newStage = 'with_bridge';
      newImage = require('@/assets/images/bequer_direito_esquerdo_ponte_salina.png');
    } else if (hasZnSolution && hasCuSolution) {
      newStage = 'bequers_only';
      newImage = null;
    }

    setBuildStage(newStage);
    setCurrentExperimentImage(newImage);
  };

  const handleDrop = (id: ComponentId, x: number, y: number) => {
    const def = COMPONENTS.find(c => c.id === id);
    if (!def) return;

    const zone = findZoneFor(x, y, id);
    if (!zone) {
      setErrorMsg('Solte o componente em uma zona válida!');
      playErrorSound(); // Tocar som de erro
      setTimeout(() => setErrorMsg(null), 1600);
      return;
    }

    setPlaced(prev => {
      const nextPlaced: Placed = { ...prev, [zone.id]: id };

      setZones(zs => zs.map(z => (z.id === zone.id ? { ...z, isOccupied: true, occupiedBy: id } : z)));
      setAvailable(av => av.filter(c => c.id !== id));

      if (id.endsWith('solution')) enableElectrodeSlot(zone.id);
      updateBuildStage(nextPlaced);
      maybeEnableWiresZone(nextPlaced);

      setOkMsg(`${def.label} posicionado corretamente!`);
      
      // Mensagem especial quando os fios são colocados e a lâmpada acende
      if (id === 'wires') {
        setTimeout(() => {
          setOkMsg('🎉 A lâmpada acendeu! A pilha está funcionando!');
          setTimeout(() => setOkMsg(null), 2000);
        }, 1200);
      } else {
        setTimeout(() => setOkMsg(null), 1200);
      }

      const done = REQUIRED.every(z => nextPlaced[z]);
      if (done) {
        setIsComplete(true);
        playSuccessSound(); // Tocar som de sucesso
        showSimulationVideo(); // Mostrar vídeo após 3 segundos
      }

      return nextPlaced;
    });
  };

  // ===== RESET =====
  const reset = () => {
    setAvailable(COMPONENTS);
    setZones(cloneInitialZones());
    setPlaced({});
    setDragged(null);
    setIsComplete(false);
    setErrorMsg(null);
    setOkMsg(null);
    setBuildStage('empty');
    setCurrentExperimentImage(null);
    setWiresZonePosition(-300); // Reset da posição da zona dos fios
    setShowVideo(false); // Reset do vídeo
    setIsVideoPlaying(false); // Reset do estado de reprodução
    zoneRefs.current = {};
    setLayoutKey(k => k + 1);
    setTimeout(measureBoard, 0);
  };

  /* ==================== Anchors & Wires (futuro) ==================== */
  const toBoard = (pt: {x:number; y:number}): {x:number; y:number} => {
    if (!boardBox) return pt;
    return { x: pt.x - boardBox.x, y: pt.y - boardBox.y };
  };
  const rectCenter = (b: Box) => ({ x: b.x + b.width/2, y: b.y + b.height/2 });
  const getAnchor = (zoneId: ZoneId): {x:number;y:number} | null => {
    const z = zones.find(zz => zz.id === zoneId);
    if (!z?.bounds || !boardBox) return null;
    const c = rectCenter(z.bounds);
    let px = c.x, py = c.y;
    if (zoneId === 'zone-lamp') {
      px = c.x; py = z.bounds.y + z.bounds.height - 6;
    }
    if (zoneId === 'slot-zn-electrode' || zoneId === 'slot-cu-electrode') {
      px = c.x; py = z.bounds.y + 8;
    }
    return toBoard({ x: px, y: py });
  };
  const renderWirePath = (p1: {x:number;y:number}, p2: {x:number;y:number}, lift: number) => {
    const c1x = p1.x, c1y = p1.y - lift;
    const c2x = p2.x, c2y = p2.y - lift;
    const d = `M ${p1.x} ${p1.y} C ${c1x} ${c1y}, ${c2x} ${c2y}, ${p2.x} ${p2.y}`;
    return d;
  };

  /* ========================= Render ========================= */
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar hidden />
      <LinearGradient colors={['#1e3c72', '#2a5298']} style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Animação da Pilha de Daniell</Text>
        <TouchableOpacity
          style={{ paddingHorizontal: 10, paddingVertical: 6, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 6 }}
          onPress={reset}
        >
          <Text style={{ color: '#fff', fontWeight: '700' }}>Reiniciar</Text>
        </TouchableOpacity>
      </LinearGradient>

      <View style={styles.instructions}>
        <Text style={styles.instructionsText}>
          Arraste os componentes para as zonas corretas para montar a Pilha de Daniell
        </Text>
      </View>

      <ScrollView key={layoutKey} style={styles.board} contentContainerStyle={styles.boardContent} showsVerticalScrollIndicator={false}>
        <View
          style={{ flex: 1, minHeight: 720 }}
          ref={boardRef}
          onLayout={measureBoard}
        >
          {/* Lâmpada */}
          <View style={styles.rowTop}>
            {zones.filter(z => z.id === 'zone-lamp').map(renderDropZone)}
          </View>

          {/* Béqueres + Ponte */}
          <View style={styles.rowMiddle}>
            <View style={[
              styles.beakerWrap,
              (placed['zone-zn-solution'] && placed['zone-cu-solution']) && { marginRight: -100 }
            ]}>
              {zones.filter(z => z.id === 'zone-zn-solution').map(renderDropZone)}
              <View style={styles.slotZnAbs}>
                {zones.filter(z => z.id === 'slot-zn-electrode').map(renderDropZone)}
              </View>
            </View>

            <View style={styles.bridgeWrap}>
              {zones.filter(z => z.id === 'zone-salt-bridge').map(renderDropZone)}
            </View>

            <View style={[
              styles.beakerWrap,
              (placed['zone-zn-solution'] && placed['zone-cu-solution']) && { marginLeft: -100 }
            ]}>
              {zones.filter(z => z.id === 'zone-cu-solution').map(renderDropZone)}
              <View style={styles.slotCuAbs}>
                {zones.filter(z => z.id === 'slot-cu-electrode').map(renderDropZone)}
              </View>
            </View>

            {/* Imagem de estágio central ou Vídeo de simulação */}
            {showVideo && isVideoPlaying && isComplete ? (
              <View style={styles.stageContainer}>
                <Video
                  source={require('@/assets/videos/video_simulacao_completa.mp4')}
                  style={styles.stageVideo}
                  useNativeControls={false}
                  resizeMode={ResizeMode.CONTAIN}
                  shouldPlay={true}
                  isLooping={true}
                  isMuted={false}
                  onPlaybackStatusUpdate={status => setVideoStatus(status)}
                />
              </View>
            ) : currentExperimentImage ? (
              <View style={styles.stageContainer}>
                <Image source={currentExperimentImage} style={styles.stageImage} resizeMode="contain" />
              </View>
            ) : null}
          </View>

          <View style={[styles.rowBottom, { marginTop: wiresZonePosition }]}>
            {zones.filter(z => z.id === 'zone-wires').map(renderDropZone)}
          </View>
        </View>
      </ScrollView>

      {/* Paleta */}
      <View style={styles.palette}>
        <Text style={styles.paletteTitle}>Componentes Disponíveis:</Text>
        <FlatList
          data={available}
          horizontal
          keyExtractor={i => i.id}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingVertical: 6 }}
          renderItem={({ item }) => (
            <Animated.View style={styles.draggable} {...createPanResponder(item.id).panHandlers}>
              <Image source={item.image} style={styles.draggableImg} />
              <Text style={styles.draggableText}>{item.label}</Text>
            </Animated.View>
          )}
        />
      </View>

      {/* Overlay do drag */}
      {dragged && (() => {
        const comp = COMPONENTS.find(c => c.id === dragged)!;
        const size =
          dragged === 'wires' ? 250 :
          dragged.includes('electrode') ? 60 :
          dragged === 'lamp' ? 76 :
          dragged === 'salt-bridge' ? 110 : 130;
        return (
          <Animated.View
            pointerEvents="none"
            style={[styles.dragOverlay, { left: dragPos.x - size / 2, top: dragPos.y - size / 2, width: size, height: size }]}
          >
            <Image source={comp.image} style={styles.dragOverlayImg} />
          </Animated.View>
        );
      })()}

      {/* Mensagens */}
      {errorMsg && (
        <View style={styles.toastError}>
          <Text style={styles.toastText}>{errorMsg}</Text>
        </View>
      )}
      {okMsg && (
        <View style={[styles.toastError, { backgroundColor: '#43a047' }]}>
          <Text style={styles.toastText}>{okMsg}</Text>
        </View>
      )}


    </SafeAreaView>
  );

  // --------- renderDropZone ---------
  function renderDropZone(zone: Zone) {
    const placedId = placed[zone.id];

    const shouldRenderIndividualImage = (zoneId: ZoneId, placedId: ComponentId | null): boolean => {
      if (!placedId) return false;
      if (zoneId === 'zone-lamp') return true;

      if (buildStage === 'empty') return true;

      if (buildStage === 'bequers_only') {
        if (zoneId === 'zone-zn-solution' || zoneId === 'zone-cu-solution') return true;
        return false;
      }

      if (buildStage === 'with_bridge' || buildStage === 'with_zn_electrode' || buildStage === 'with_cu_electrode' || buildStage === 'complete' || buildStage === 'with_wires') {
        if (zoneId === 'zone-zn-solution' || zoneId === 'zone-cu-solution') return false;
      }
      if (buildStage === 'with_bridge' || buildStage === 'with_zn_electrode' || buildStage === 'with_cu_electrode' || buildStage === 'complete' || buildStage === 'with_wires') {
        if (zoneId === 'zone-salt-bridge') return false;
      }
      if (buildStage === 'with_zn_electrode' || buildStage === 'complete' || buildStage === 'with_wires') {
        if (zoneId === 'slot-zn-electrode') return false;
      }
      if (buildStage === 'with_cu_electrode' || buildStage === 'complete' || buildStage === 'with_wires') {
        if (zoneId === 'slot-cu-electrode') return false;
      }

      // Para os fios, sempre renderiza a imagem individual (não vira parte do "stageImage")
      if (zoneId === 'zone-wires') return true;

      return true;
    };

    // Função para obter a imagem correta da lâmpada baseada no estágio
    const getLampImage = () => {
      if (zone.id === 'zone-lamp' && placedId === 'lamp') {
        // Se os fios estão colocados (estágio with_wires), usa lâmpada acesa
        if (buildStage === 'with_wires') {
          return require('@/assets/images/lampada_acessa.png');
        }
        // Caso contrário, usa lâmpada normal
        return require('@/assets/images/lampada.png');
      }
      return null;
    };

    return (
      <View
        key={zone.id}
        ref={r => (zoneRefs.current[zone.id] = r)}
        onLayout={e => measureZone(zone.id, e)}
        style={[
          styles.dropZone,
          (zone.id === 'zone-zn-solution' || zone.id === 'zone-cu-solution') && styles.beakerZone,
          zone.id === 'zone-salt-bridge' && styles.saltBridgeZone,
          zone.id === 'zone-lamp' && styles.lampZone,
          (zone.id === 'slot-zn-electrode' || zone.id === 'slot-cu-electrode') && styles.slotFill,
          zone.id === 'zone-wires' && styles.wiresZone,
          {
            borderColor: zone.isOccupied ? 'transparent' : zone.isHighlighted ? '#4CAF50' : '#aab0b4',
            backgroundColor: zone.isOccupied
              ? 'transparent'
              : zone.isHighlighted
              ? 'rgba(76,175,80,0.18)'
              : 'rgba(240,240,240,0.20)',
            borderWidth: zone.isOccupied ? 0 : zone.isHighlighted ? 2 : 1,
            opacity: zone.isEnabled ? 1 : 0.5,
          },
        ]}
      >
        {placedId && shouldRenderIndividualImage(zone.id, placedId) ? (
          <View style={styles.placedWrap}>
            <Image 
              source={getLampImage() || COMPONENTS.find(c => c.id === placedId)!.image} 
              style={[
                styles.placedImg,
                zone.id === 'zone-wires' && styles.placedImgWires
              ]} 
            />
          </View>
        ) : (
          !zone.isOccupied && <Text style={styles.zoneText}>{zone.label}</Text>
        )}
      </View>
    );
  }
}

/* ========================= Estilos ========================= */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },

  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12 },
  headerTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold' },

  instructions: { backgroundColor: '#fff', padding: 14, marginHorizontal: 16, borderRadius: 10, marginBottom: 8, elevation: 2 },
  instructionsText: { textAlign: 'center', color: '#333' },

  board: { flex: 1, backgroundColor: '#fff', marginHorizontal: 16, borderRadius: 10, marginBottom: 8, elevation: 2 },
  boardContent: { padding: 16, paddingBottom: 24, minHeight: 600 },

  rowTop: { alignItems: 'center', marginBottom: 50 },
  rowMiddle: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', paddingHorizontal: 8, position: 'relative' },
  rowBottom: { alignItems: 'center', justifyContent: 'center' },

  beakerWrap: { flex: 1, alignItems: 'center', position: 'relative' },
  bridgeWrap: { flex: 1, alignItems: 'center' },

  /* Zonas base */
  dropZone: {
    borderWidth: 1,
    borderStyle: 'dashed',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },

  /* Dimensões por zona */
  beakerZone: { width: '140%', aspectRatio: 1, zIndex: 3 },
  saltBridgeZone: { width: '100%', aspectRatio: 1.00, alignSelf: 'center', marginTop: -50, zIndex: 6 },
  lampZone: { width: '38%', aspectRatio: 1, alignSelf: 'center' },

  /* NOVO: zona dos fios (área larga e horizontal) */
  wiresZone: {
    width: '90%',
    aspectRatio: 2.6,        
    alignSelf: 'center',
  },

  /* Slots absolutos (eletrodos) */
  slotZnAbs: { position: 'absolute', width: '45%', height: '70%', bottom: '20%', right: '40%', zIndex: 5 },
  slotCuAbs: { position: 'absolute', width: '45%', height: '70%', bottom: '20%', left: '40%', zIndex: 5 },
  slotFill: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, width: '100%', height: '100%' },

  /* Imagem de estágio central */
  stageContainer: {
    position: 'absolute',
    left: '15%',
    right: '15%',
    top: '10%',
    bottom: '10%',
    zIndex: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stageImage: { width: '100%', height: '125%', resizeMode: 'contain' },
  stageVideo: { width: '200%', height: '325%' },

  /* Sobreposição dos fios (ocupa toda a área do rowMiddle/board) */
  wiresOverlay: {
    position: 'absolute',
    left: 0, right: 0, top: 0, bottom: 0,
    zIndex: 7,
  },

  zoneText: { fontSize: 12, color: '#667085', fontWeight: '500', textAlign: 'center', paddingHorizontal: 4 },

  placedWrap: { width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' },
  placedImg: { width: '94%', height: '94%', resizeMode: 'contain' },
  placedImgWires: { width: '120%', height: '200%', resizeMode: 'contain' },

  /* Paleta */
  palette: { backgroundColor: '#fff', padding: 14, marginHorizontal: 16, borderRadius: 10, elevation: 2, height: 120 },
  paletteTitle: { fontSize: 16, fontWeight: 'bold', color: '#333', marginBottom: 6 },
  draggable: { alignItems: 'center', marginRight: 14, padding: 8, backgroundColor: '#f8f9fa', borderRadius: 10, minWidth: 84 },
  draggableImg: { width: 44, height: 44, resizeMode: 'contain' },
  draggableText: { fontSize: 10, marginTop: 4, color: '#666', textAlign: 'center' },

  /* Overlay do drag */
  dragOverlay: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2000,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  dragOverlayImg: { width: '100%', height: '100%', resizeMode: 'contain' },

  /* Toasts */
  toastError: {
    position: 'absolute',
    top: 92,
    left: 24,
    right: 24,
    backgroundColor: '#e53935',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    elevation: 5,
    zIndex: 3000,
  },
  toastText: { color: '#fff', textAlign: 'center', fontWeight: '700' },
});

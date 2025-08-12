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

/* ========================= Tipos ========================= */
type ZoneId =
  | 'zone-lamp'
  | 'zone-zn-solution'
  | 'zone-cu-solution'
  | 'zone-salt-bridge'
  | 'slot-zn-electrode'
  | 'slot-cu-electrode';

type ComponentId =
  | 'lamp'
  | 'zn-solution'
  | 'cu-solution'
  | 'salt-bridge'
  | 'zn-electrode'
  | 'cu-electrode';

interface ComponentDef {
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

/* ===================== Dados/Constantes ===================== */
const COMPONENTS: ComponentDef[] = [
  { id: 'lamp', label: 'Lâmpada', targetZone: 'zone-lamp', image: require('@/assets/images/lampada.png') },
  { id: 'zn-solution', label: 'Solução de ZnSO₄', targetZone: 'zone-zn-solution', image: require('@/assets/images/bequer_esquerdo.png') },
  { id: 'cu-solution', label: 'Solução de CuSO₄', targetZone: 'zone-cu-solution', image: require('@/assets/images/bequer_direita.png') },
  { id: 'salt-bridge', label: 'Ponte Salina', targetZone: 'zone-salt-bridge', image: require('@/assets/images/ponte_salina.png') },
  { id: 'zn-electrode', label: 'Eletrodo de Zinco', targetZone: 'slot-zn-electrode', image: require('@/assets/images/eletrodo_zinco.png') },
  { id: 'cu-electrode', label: 'Eletrodo de Cobre', targetZone: 'slot-cu-electrode', image: require('@/assets/images/eletrodo_cobre.png') },
];

const INITIAL_ZONES: Zone[] = [
  { id: 'zone-lamp', label: 'Lâmpada', bounds: null, isOccupied: false, occupiedBy: null, isHighlighted: false, isEnabled: true },
  { id: 'zone-zn-solution', label: 'Solução de ZnSO₄', bounds: null, isOccupied: false, occupiedBy: null, isHighlighted: false, isEnabled: true },
  { id: 'zone-cu-solution', label: 'Solução de CuSO₄', bounds: null, isOccupied: false, occupiedBy: null, isHighlighted: false, isEnabled: true },
  { id: 'zone-salt-bridge', label: 'Ponte Salina', bounds: null, isOccupied: false, occupiedBy: null, isHighlighted: false, isEnabled: true },
  { id: 'slot-zn-electrode', label: 'Eletrodo de Zinco', bounds: null, isOccupied: false, occupiedBy: null, isHighlighted: false, isEnabled: false },
  { id: 'slot-cu-electrode', label: 'Eletrodo de Cobre', bounds: null, isOccupied: false, occupiedBy: null, isHighlighted: false, isEnabled: false },
];

/* ========================= Componente ========================= */
export default function DaniellAnimation() {
  const router = useRouter();

  // estados
  const [available, setAvailable] = useState<ComponentDef[]>(COMPONENTS);
  const [zones, setZones] = useState<Zone[]>(INITIAL_ZONES);
  const [placed, setPlaced] = useState<Placed>({});
  const [dragged, setDragged] = useState<ComponentId | null>(null);
  const [dragPos, setDragPos] = useState({ x: 0, y: 0 });
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [okMsg, setOkMsg] = useState<string | null>(null);
  const [isComplete, setIsComplete] = useState(false);
  const [showElectronFlow, setShowElectronFlow] = useState(false);

  // animações
  const itemScale = useRef<Record<string, Animated.Value>>({}).current;
  const lampGlow = useRef(new Animated.Value(0)).current;

  // refs
  const zoneRefs = useRef<Record<string, View | null>>({});

  useEffect(() => {
    COMPONENTS.forEach(c => (itemScale[c.id] = new Animated.Value(1)));
  }, []);

  /* ========================= Medição ========================= */
  const measureZone = (id: ZoneId, e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    zoneRefs.current[id]?.measureInWindow((x, y) => {
      setZones(prev => prev.map(z => (z.id === id ? { ...z, bounds: { x, y, width, height } } : z)));
    });
  };

  /* ==================== Colisão / Busca ==================== */
  const inside = (x: number, y: number, b: Box) => x >= b.x && x <= b.x + b.width && y >= b.y && y <= b.y + b.height;

  const findZoneFor = (x: number, y: number, id: ComponentId): Zone | null => {
    const def = COMPONENTS.find(c => c.id === id);
    if (!def) return null;

    if (id === 'zn-electrode' && !placed['zone-zn-solution']) return null;
    if (id === 'cu-electrode' && !placed['zone-cu-solution']) return null;

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

  /* ==================== Drag & Drop ==================== */
  const createPanResponder = (id: ComponentId) =>
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (_, g) => {
        setDragged(id);
        setDragPos({ x: g.x0, y: g.y0 });
        Animated.timing(itemScale[id], { toValue: 0.9, duration: 120, useNativeDriver: true }).start();
      },
      onPanResponderMove: (_, g) => {
        setDragPos({ x: g.moveX, y: g.moveY });
        highlight(g.moveX, g.moveY, id);
      },
      onPanResponderRelease: (_, g) => {
        handleDrop(id, g.moveX, g.moveY);
        Animated.timing(itemScale[id], { toValue: 1, duration: 120, useNativeDriver: true }).start();
        setDragged(null);
        setZones(prev => prev.map(z => ({ ...z, isHighlighted: false })));
      },
    });

  const handleDrop = (id: ComponentId, x: number, y: number) => {
    const def = COMPONENTS.find(c => c.id === id);
    if (!def) return;

    const zone = findZoneFor(x, y, id);
    if (!zone) {
      setErrorMsg('Solte o componente em uma zona válida!');
      setTimeout(() => setErrorMsg(null), 1600);
      return;
    }

    setPlaced(p => ({ ...p, [zone.id]: id }));
    setZones(prev => prev.map(z => (z.id === zone.id ? { ...z, isOccupied: true, occupiedBy: id } : z)));
    setAvailable(prev => prev.filter(c => c.id !== id));
    if (id.endsWith('solution')) enableElectrodeSlot(zone.id);

    setOkMsg(`${def.label} posicionado corretamente!`);
    setTimeout(() => setOkMsg(null), 1200);

    checkCompletion();
  };

  const checkCompletion = () => {
    const req: ZoneId[] = [
      'zone-lamp',
      'zone-zn-solution',
      'zone-cu-solution',
      'zone-salt-bridge',
      'slot-zn-electrode',
      'slot-cu-electrode',
    ];
    const done = req.every(z => placed[z]);
    if (done) {
      setIsComplete(true);
      Animated.loop(
        Animated.sequence([
          Animated.timing(lampGlow, { toValue: 1, duration: 500, useNativeDriver: true }),
          Animated.timing(lampGlow, { toValue: 0.3, duration: 500, useNativeDriver: true }),
        ])
      ).start();
      setTimeout(() => setShowElectronFlow(true), 900);
    }
  };

  const reset = () => {
    setAvailable(COMPONENTS);
    setZones(INITIAL_ZONES);
    setPlaced({});
    setDragged(null);
    setIsComplete(false);
    setShowElectronFlow(false);
    lampGlow.setValue(0);
    setErrorMsg(null);
    setOkMsg(null);
  };

  /* ==================== Render helpers ==================== */
  const renderDropZone = (zone: Zone) => {
    const placedId = placed[zone.id];

    return (
      <View
        key={zone.id}
        ref={r => (zoneRefs.current[zone.id] = r)}
        onLayout={e => measureZone(zone.id, e)}
        style={[
          styles.dropZone,

          // dimensões específicas
          (zone.id === 'zone-zn-solution' || zone.id === 'zone-cu-solution') && styles.beakerZone,
          zone.id === 'zone-salt-bridge' && styles.saltBridgeZone,
          zone.id === 'zone-lamp' && styles.lampZone,

          // slots dos eletrodos: a zona preenche o container absoluto do slot
          (zone.id === 'slot-zn-electrode' || zone.id === 'slot-cu-electrode') && styles.slotFill,

          // estados visuais
          {
            borderColor: zone.isOccupied
              ? '#4CAF50'
              : zone.isHighlighted
                ? '#4CAF50'
                : '#aab0b4',
            backgroundColor: zone.isOccupied
              ? 'rgba(76,175,80,0.10)'
              : zone.isHighlighted
                ? 'rgba(76,175,80,0.18)'
                : 'rgba(240,240,240,0.20)',
            borderWidth: zone.isHighlighted ? 2 : 1,
            opacity: zone.isEnabled ? 1 : 0.5,
          },
        ]}
      >
        {placedId ? (
          <View style={styles.placedWrap}>
            <Image source={COMPONENTS.find(c => c.id === placedId)!.image} style={styles.placedImg} />
          </View>
        ) : (
          <Text style={styles.zoneText}>{zone.label}</Text>
        )}
      </View>
    );
  };

  const renderDraggable = (c: ComponentDef) => {
    const pan = createPanResponder(c.id);
    return (
      <Animated.View
        key={c.id}
        style={[styles.draggable, { transform: [{ scale: itemScale[c.id] || new Animated.Value(1) }] }]}
        {...pan.panHandlers}
      >
        <Image source={c.image} style={styles.draggableImg} />
        <Text style={styles.draggableText}>{c.label}</Text>
      </Animated.View>
    );
  };

  const renderDraggedOverlay = () => {
    if (!dragged) return null;
    const comp = COMPONENTS.find(c => c.id === dragged)!;
    const size = getOverlaySize(dragged);
    return (
      <Animated.View
        pointerEvents="none"
        style={[styles.dragOverlay, { left: dragPos.x - size / 2, top: dragPos.y - size / 2, width: size, height: size }]}
      >
        <Image source={comp.image} style={styles.dragOverlayImg} />
      </Animated.View>
    );
  };

  const getOverlaySize = (id: ComponentId) => {
    if (id.includes('electrode')) return 60;
    if (id === 'lamp') return 76;
    if (id === 'salt-bridge') return 110;
    return 130; // bequers
  };

  const renderWires = () => {
    if (!isComplete) return null;
    const zn = zones.find(z => z.id === 'slot-zn-electrode')?.bounds;
    const cu = zones.find(z => z.id === 'slot-cu-electrode')?.bounds;
    const lp = zones.find(z => z.id === 'zone-lamp')?.bounds;
    if (!zn || !cu || !lp) return null;

    return (
      <View style={styles.wires} pointerEvents="none">
        <View style={[styles.wire, { left: zn.x + zn.width / 2, top: zn.y - 8, width: 2, height: lp.y - zn.y + 8 }]} />
        <View style={[styles.wire, { left: zn.x + zn.width / 2, top: lp.y + lp.height / 2, width: cu.x - zn.x, height: 2 }]} />
        <View style={[styles.wire, { left: cu.x + cu.width / 2, top: lp.y + lp.height / 2, width: 2, height: cu.y - (lp.y + lp.height / 2) + 8 }]} />
      </View>
    );
  };

  const renderLampGlow = () => {
    if (!isComplete) return null;
    const lp = zones.find(z => z.id === 'zone-lamp')?.bounds;
    if (!lp) return null;
    return (
      <Animated.View
        pointerEvents="none"
        style={[styles.lampGlow, { left: lp.x, top: lp.y, width: lp.width, height: lp.height, opacity: lampGlow }]}
      >
        <Image source={require('@/assets/images/lampada.png')} style={{ width: '100%', height: '100%', resizeMode: 'contain' }} />
      </Animated.View>
    );
  };

  /* ========================= Render ========================= */
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar hidden />
      <LinearGradient colors={['#1e3c72', '#2a5298']} style={styles.header}>
        <TouchableOpacity style={styles.headerBtn} onPress={() => router.back()}>
          <Text style={styles.headerBtnText}>← Voltar</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Animação da Pilha de Daniell</Text>
        <TouchableOpacity style={styles.headerBtn} onPress={reset}>
          <Text style={styles.headerBtnText}>Reiniciar</Text>
        </TouchableOpacity>
      </LinearGradient>

      <View style={styles.instructions}>
        <Text style={styles.instructionsText}>
          Arraste os componentes para as zonas corretas para montar a Pilha de Daniell
        </Text>
      </View>

      <ScrollView style={styles.board} contentContainerStyle={styles.boardContent} showsVerticalScrollIndicator={false}>
        {/* Lâmpada */}
        <View style={styles.rowTop}>{zones.filter(z => z.id === 'zone-lamp').map(renderDropZone)}</View>

        {/* Béqueres + Ponte */}
        <View style={styles.rowMiddle}>
          <View style={styles.beakerWrap}>
            {zones.filter(z => z.id === 'zone-zn-solution').map(renderDropZone)}
            <View style={styles.slotZnAbs}>
              {zones.filter(z => z.id === 'slot-zn-electrode').map(renderDropZone)}
            </View>
          </View>

          <View style={styles.bridgeWrap}>
            {zones.filter(z => z.id === 'zone-salt-bridge').map(renderDropZone)}
          </View>

          <View style={styles.beakerWrap}>
            {zones.filter(z => z.id === 'zone-cu-solution').map(renderDropZone)}
            <View style={styles.slotCuAbs}>
              {zones.filter(z => z.id === 'slot-cu-electrode').map(renderDropZone)}
            </View>
          </View>
        </View>

        {renderWires()}
        {renderLampGlow()}

        {showElectronFlow && (
          <View style={styles.electron} pointerEvents="none">
            <Image
              source={require('@/assets/images/movimento_eletron.png')}
              style={{ width: '100%', height: '100%', resizeMode: 'contain' }}
            />
          </View>
        )}
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
      {renderDraggedOverlay()}

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
}

/* ========================= Estilos ========================= */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },

  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12 },
  headerBtn: { paddingHorizontal: 10, paddingVertical: 6, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 6 },
  headerBtnText: { color: '#fff', fontWeight: '700' },
  headerTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold' },

  instructions: { backgroundColor: '#fff', padding: 14, marginHorizontal: 16, borderRadius: 10, marginBottom: 8, elevation: 2 },
  instructionsText: { textAlign: 'center', color: '#333' },

  board: { flex: 1, backgroundColor: '#fff', marginHorizontal: 16, borderRadius: 10, marginBottom: 8, elevation: 2 },
  boardContent: { padding: 16, paddingBottom: 24, minHeight: 600 },

  rowTop: { alignItems: 'center', marginBottom: 18 },
  rowMiddle: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', paddingHorizontal: 8 },

  beakerWrap: { flex: 1, alignItems: 'center', position: 'relative' },
  bridgeWrap: { flex: 1, alignItems: 'center' },

  /* Zonas base (sem tamanho fixo) */
  dropZone: {
    borderWidth: 1,
    borderStyle: 'dashed',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },

  /* Dimensões por zona */
  beakerZone: { width: '135%', aspectRatio: 1, zIndex: 3 },                 // bequers grandes
  saltBridgeZone: { width: '200%', aspectRatio: 1.35, alignSelf: 'center', marginTop: -50, zIndex: 6 }, // ponte larga sobreposta
  lampZone: { width: '38%', aspectRatio: 1, alignSelf: 'center' },

  /* Slots absolutos dentro dos bequers (agora voltados para o centro) */
  slotZnAbs: { position: 'absolute', width: '50%', height: '75%', bottom: '15%', right: '40%', zIndex: 5 },
  slotCuAbs: { position: 'absolute', width: '55%', height: '75%', bottom: '15%', left: '40%', zIndex: 5 },

  // A zona do slot preenche totalmente o container do slot
  slotFill: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },

  zoneText: { fontSize: 12, color: '#667085', fontWeight: '500', textAlign: 'center', paddingHorizontal: 4 },

  placedWrap: { width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' },
  placedImg: { width: '94%', height: '94%', resizeMode: 'contain' },

  /* Fios e animações */
  wires: { position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, zIndex: 7 },
  wire: { position: 'absolute', backgroundColor: '#000' },
  lampGlow: { position: 'absolute', zIndex: 20 },

  electron: { position: 'absolute', left: '28%', top: 80, width: '44%', height: 60, zIndex: 12 },

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

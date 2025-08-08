# Animação da Pilha de Daniell - Célula Galvânica

## Descrição

Esta nova funcionalidade implementa uma simulação interativa da Pilha de Daniell usando React Native com TypeScript. A simulação permite que os usuários montem a pilha arrastando e soltando componentes nas posições corretas.

## Funcionalidades Implementadas

### 1. Componentes Interativos
- **Solução de ZnSO₄** (bequer_esquerdo.png)
- **Solução de CuSO₄** (bequer_direita.png)
- **Eletrodo de Zinco** (eletrodo_zinco.png)
- **Eletrodo de Cobre** (eletrodo_cobre.png)
- **Ponte Salina** (ponte_salina.png)
- **Fios com Lâmpada** (lampada.png)

### 2. Sistema de Drag and Drop
- Implementado usando `PanResponder` do React Native
- Validação de posicionamento correto dos componentes
- Feedback visual para zonas ocupadas e componentes posicionados

### 3. Efeitos Visuais
- **Lâmpada com brilho**: Animação de pulsação quando a pilha está completa
- **Movimento de elétrons**: Exibição da imagem `movimento_eletron.png` quando a simulação é completada
- **Feedback visual**: Zonas mudam de cor quando ocupadas corretamente

### 4. Controles
- **Botão Reiniciar**: Restaura o estado inicial da simulação
- **Navegação**: Botão voltar para retornar ao menu principal

## Estrutura de Arquivos

### Arquivos Criados/Modificados

1. **`app/daniellAnimation.tsx`** - Tela principal da animação
2. **`app/_layout.tsx`** - Adicionada rota para a nova tela
3. **`data/menu-data.ts`** - Adicionada entrada no menu principal

### Imagens Utilizadas

Todas as imagens estão localizadas em `assets/images/`:
- `bequer_esquerdo.png` - Solução de ZnSO₄
- `bequer_direita.png` - Solução de CuSO₄
- `eletrodo_zinco.png` - Eletrodo de Zinco
- `eletrodo_cobre.png` - Eletrodo de Cobre
- `ponte_salina.png` - Ponte Salina
- `lampada.png` - Fios com Lâmpada
- `movimento_eletron.png` - Animação de movimento de elétrons

## Como Acessar

1. Abra o aplicativo
2. No menu principal, procure por "Animação da Pilha de Daniell"
3. A nova tela aparece após "Pilhas e Eletrólise" no menu

## Funcionamento da Simulação

### Passos para Completar:
1. Arraste a **Solução de ZnSO₄** para a zona esquerda
2. Arraste a **Solução de CuSO₄** para a zona direita
3. Posicione o **Eletrodo de Zinco** na solução de ZnSO₄
4. Posicione o **Eletrodo de Cobre** na solução de CuSO₄
5. Conecte os eletrodos com a **Ponte Salina**
6. Adicione os **Fios com Lâmpada** para completar o circuito

### Resultado:
Quando todos os componentes estão posicionados corretamente:
- A lâmpada acende com efeito de brilho pulsante
- A animação de movimento de elétrons é exibida
- Uma mensagem de congratulações é mostrada

## Tecnologias Utilizadas

- **React Native** - Framework principal
- **TypeScript** - Tipagem estática
- **Expo Router** - Navegação
- **PanResponder** - Gestos de arrastar e soltar
- **Animated API** - Animações
- **LinearGradient** - Gradientes visuais

## Estrutura do Código

### Interfaces Principais:
```typescript
interface Component {
  id: string;
  name: string;
  image: any;
  position: { x: number; y: number };
  isPlaced: boolean;
  correctZone: string;
  isDragging: boolean;
}

interface DropZone {
  id: string;
  name: string;
  position: { x: number; y: number; width: number; height: number };
  isOccupied: boolean;
  occupiedBy: string | null;
}
```

### Estados Principais:
- `components` - Lista de componentes arrastáveis
- `dropZones` - Zonas de destino para os componentes
- `isComplete` - Indica se a simulação foi completada
- `showElectronFlow` - Controla a exibição da animação de elétrons

## Melhorias Futuras

1. **Animações mais elaboradas** para o movimento de elétrons
2. **Sons** para feedback auditivo
3. **Modo tutorial** com instruções passo a passo
4. **Diferentes níveis de dificuldade**
5. **Histórico de tentativas** e estatísticas
6. **Modo multiplayer** para competição entre usuários

## Compatibilidade

- React Native 0.70+
- Expo SDK 49+
- TypeScript 4.9+
- Compatível com iOS e Android 
# Potenciais-Padrão de Redução - Implementação

## Visão Geral

Esta implementação cria uma tela interativa para visualizar os potenciais-padrão de redução (E°) de 40 semi-reações químicas, organizadas em uma grade de 12 botões por página com navegação por paginação.

## Arquivos Implementados

### 1. `data/semireacoes.ts`
- **Tipo**: `SemiReacao` com campos: `id`, `rotulo`, `equacao`, `E0`, `grupo`
- **Dados**: 40 semi-reações em ordem específica conforme material de referência
- **Formato**: E° usa vírgula como separador decimal (ex: "-3,05 V")

### 2. `components/ReactionButton.tsx`
- **Funcionalidade**: Botão individual da grade com símbolo químico e estado físico
- **Características**:
  - Cores baseadas em grupo ou potencial
  - Símbolo principal + carga (ex: "Li⁺")
  - Estado físico em subscrito (ex: "(aq)")
  - Feedback visual ao selecionar
  - Acessibilidade completa

### 3. `components/ReactionCallout.tsx`
- **Funcionalidade**: Balão de fala modal com detalhes da semi-reação
- **Conteúdo**:
  - Título: "Semi-reação de redução:"
  - Equação química completa com formatação
  - Potencial padrão (E°) destacado
  - Grupo químico (se disponível)
  - Navegação Anterior/Próximo
- **Interação**: Fechamento por toque fora, botão X ou botão voltar

### 4. `components/HeaderBanner.tsx`
- **Funcionalidade**: Banner superior com instruções
- **Conteúdo**: Emoji 🧪 + título + instruções de uso
- **Acessibilidade**: Label descritivo para leitores de tela

### 5. `components/Grid12.tsx`
- **Funcionalidade**: Grade responsiva de botões
- **Layout**: 
  - Mobile: 3 colunas × 4 linhas
  - Tablet: 4 colunas × 3 linhas
- **Paginação**: 12 itens por página

### 6. `app/potenciaisReducao.tsx`
- **Funcionalidade**: Tela principal integrando todos os componentes
- **Estado**: 
  - `selectedItem`: Item atualmente selecionado
  - `currentPage`: Página atual da paginação
- **Navegação**: Botão voltar no header

## Funcionalidades Implementadas

### ✅ Requisitos Atendidos
1. **Grade de 12 botões**: Layout responsivo 3×4 (mobile) ou 4×3 (tablet)
2. **Botões visuais**: Símbolos químicos com cargas e estados físicos
3. **Cores por categoria**: Metais alcalinos (roxo), alcalino-terrosos (azul), etc.
4. **Balão de fala**: Modal com equação completa e E°
5. **Navegação**: Botões Anterior/Próximo dentro do balão
6. **Paginação**: 12 itens por página (4 páginas no total)
7. **Acessibilidade**: Labels descritivos, roles e hints
8. **Responsividade**: Adaptação automática para diferentes tamanhos de tela

### 🎨 Características Visuais
- **Botões**: Bordas arredondadas (20px), sombras, cores temáticas
- **Balão**: Fundo branco, borda laranja, triângulo apontador
- **Tipografia**: Hierarquia clara com tamanhos e pesos apropriados
- **Espaçamento**: Margens e padding consistentes (8-16px)

### 🔧 Funcionalidades Técnicas
- **Estado local**: Gerenciamento de seleção e página atual
- **Memoização**: Otimização de renderização com `useMemo`
- **Navegação**: Lógica para anterior/próximo dentro da lista completa
- **Responsividade**: Detecção automática de tablet vs mobile

## Estrutura de Dados

### SemiReacao
```typescript
{
  id: "li",                    // Identificador único
  rotulo: "Li⁺/Li",           // Rótulo para exibição
  equacao: "Li⁺(aq) + e⁻ → Li(s)", // Equação completa
  E0: "-3,05 V",              // Potencial padrão
  grupo: "Metais alcalinos"   // Categoria (opcional)
}
```

### Paginação
- **Página 1**: Itens 1-12 (Li⁺ até Al³⁺)
- **Página 2**: Itens 13-24 (Mn²⁺ até Pb²⁺)
- **Página 3**: Itens 25-36 (2H⁺ até Au³⁺)
- **Página 4**: Itens 37-40 (MnO₄⁻ até F₂)

## Navegação e Menu

### Posicionamento no Menu
O item "Potenciais-Padrão de Redução" foi inserido no menu principal:
- **ID**: "2.5" (entre "Reações e oxirredução" e "Pilhas e Eletrólise")
- **Cor**: #8e44ad (roxo)
- **Link**: `potenciaisReducao`

### Rota
- **Arquivo**: `app/potenciaisReducao.tsx`
- **Rota**: `/potenciaisReducao`
- **Layout**: Adicionado ao `app/_layout.tsx`

## Acessibilidade

### Labels e Hints
- **Botões**: "Abrir detalhes de [símbolo] [estado]"
- **Balão**: "Detalhes da semi-reação: [rótulo]"
- **Navegação**: "Item anterior", "Próximo item"
- **Fechar**: "Fechar detalhes"

### Roles e Estados
- `accessibilityRole="button"` para botões
- `accessibilityViewIsModal` para o balão
- `accessibilityLabel` descritivo para cada elemento
- `accessibilityHint` com instruções de uso

## Considerações de Performance

### Otimizações Implementadas
1. **Renderização condicional**: Balão só é montado quando necessário
2. **Memoização**: Lista de itens da página atual
3. **Paginação**: Apenas 12 itens renderizados por vez
4. **Lazy loading**: Componentes carregados sob demanda

### Limitações Conhecidas
- Não há busca/filtro implementado (foi removido conforme especificação)
- Todos os 40 itens são carregados na memória (mas apenas 12 são renderizados)

## Próximos Passos Sugeridos

### Melhorias Opcionais
1. **Imagem do banner**: Substituir placeholder por imagem real
2. **Haptics**: Feedback tátil ao tocar botões
3. **Animações**: Transições suaves entre páginas
4. **Busca**: Campo de busca opcional (se necessário)
5. **Favoritos**: Sistema de marcação de itens importantes

### Testes Recomendados
1. **Responsividade**: Testar em diferentes tamanhos de tela
2. **Acessibilidade**: Verificar com leitores de tela
3. **Performance**: Testar com listas maiores
4. **Navegação**: Verificar fluxo entre páginas e itens

## Conclusão

A implementação atende completamente aos requisitos especificados, criando uma interface visual e interativa para consulta dos potenciais-padrão de redução. A arquitetura modular permite fácil manutenção e extensão futura.



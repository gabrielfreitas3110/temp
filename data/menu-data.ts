export interface IMenuData {
  id: string;
  title: string;
  color: string;
  pages: {
    numero: number;
    texto: string;
    link?: string;
    params?: {
      id?: number;
      title?: string;
      firstPage?: string;
      soundText?: string;
    };
  }[];
  images?: {
    id: string;
    imgUrl: any;
  }[];
}
export const MENU_DATA: IMenuData[] = [
  {
    id: "1",
    title: "Equipe",
    color: "#6200ee",
    pages: [
      {
        numero: 1,
        texto:
          "Maraína Medeiros Fernandes Doutoranda em Química - UFU Fábio Augusto do Amaral Prof. Dr. Instituto de Química - UFU Sheila Cristina Canobre Profa. Dra. Instituto de Química - UFU Simone Machado Goulart Profa. Dra. IFG Câmpus Itumbiara Gabriel Augusto Costa de Freitas Analista desenvolvedor Java Senior",
      },
      {
        numero: 2,
        link: "member",
        params: { id: 1 },
        texto:
          "Maraína Medeiros Fernandes Contato: maraina.medeiros@ifg.edu.br Doutoranda em Química - UFU Mestrado em Meio Ambiente e Qualidade Ambiental - UFU Licenciatura em Química - IFG Servidora técnica administrativa IFG",
      },
      {
        numero: 3,
        link: "member",
        params: { id: 2 },
        texto:
          "Sheila Cristina Canobre Contato: sheila.canobre@ufu.br Doutorado em Ciências - UFSCar Bacharelado e Licenciatura em Química - UFSCar Mestrado em Físico Química - UFSCar Linha de pesquisa: eletroquímica, polímeros condutores, dispositivos de armazenamento de energia e corrosão. Docente - UFU",
      },
      {
        numero: 4,
        link: "member",
        params: { id: 3 },
        texto:
          "Fábio Augusto do Amaral Contato: fabioamaral@ufu.br Doutorado em Ciências - UFSCar Mestrado em Química - UFSCar Bacharelado e Licenciatura em Química - UFSCar Linha de pesquisa:  síntese de coagulante natural e eletroquímica, armazenamento de energia, tratamento de efluentes, materiais compósitos e sensores eletroquímicos. Docente - UFU",
      },
      {
        numero: 5,
        link: "member",
        params: { id: 4 },
        texto:
          "Simone Machado Goulart Contato: simone.goulart@ifg.edu.br Doutorado em Agroquímica - UFV Mestrado em Agroquímica - UFV Tecnologia de laticínios e Licenciatura em Química Universidade Católica de Brasília e UFV Linha de pesquisa:  Química de Alimentos, Química Ambiental e Forense, com ênfase em cromatografia e compostos orgânicos poluentes, especialmente agrotóxicos Docente - IFG",
      },
      {
        numero: 6,
        link: "member",
        params: { id: 5 },
        texto:
          "Gabriel Augusto Costa de Freitas Contato: lgabriel.freitas3110@gmail.com Desenvolvedor Backend Java Senior Cursando Bacharelado em Engenharia Elétrica - IFG Itumbiara Conhecimento avançado em Banco de Dados SQL e NoSQL Linha de pesquisa: Big Data, Data Science, Data Analytics e Software Development. Analista de Sistemas Desenvolvedor Java Senior",
      },
    ],
  },
  {
    id: "2",
    title: "Reações e oxirredução",
    color: "#ff5731",
    images: [
      { id: "1", imgUrl: require("@/assets/images/oxirreducao-1.png") },
      { id: "2", imgUrl: require("@/assets/images/oxirreducao-2.png") },
      { id: "3", imgUrl: require("@/assets/images/oxirreducao-3.png") },
      { id: "4", imgUrl: require("@/assets/images/oxirreducao-4.png") },
      { id: "5", imgUrl: require("@/assets/images/oxirreducao-5.png") },
    ],
    pages: [
      {
        numero: 1,
        texto:
          "Existem reações químicas em que envolvem transferências de elétrons entre espécies químicas. Tais processos envolvem substâncias com tendência a doar elétrons e substâncias com tendência a receber elétrons.  Esses processos são conhecidos como reações de oxirredução! Análise microscópica... Obtenção de hidrogênio em laboratório H 2 (g) H O + 3 Zn 2+ (aq) (aq) Zn (s)",
      },
      {
        numero: 2,
        texto:
          'Conceitos de oxidação e redução... Processo em que há um ganho de elétrons por uma espécie química. Redução - os elétrons aparecem na parte dos reagentes! + 2 H + 2 e H (aq) Processo em que há a perda de elétrons por uma espécie química. Oxidação - os elétrrons aparecem na parte dos produtos! _ _ 2(g) Zn Zn + 2 e Redução Oxidação 2+ (s) (aq) Equação global do processo (s) Zn Zn + 2 e + 2 H + 2 e H (aq) + Zn + 2 H H + Zn (s) (aq) 2+ (aq) _ _ 2 (g) 2(g) 2+ (aq) Em casos em que não é possível identificar os oxidação/redução processos utiliza-se de o conceito de "número de oxidação"',
      },
      {
        numero: 3,
        texto:
          " Número de oxidação (Nox) O Nox é uma forma de entender como os elétrons estão distribuídos entre os átomos que participam de um composto iônico ou de uma molécula! Regras O Nox de cada átomo em uma substância simples é sempre zero! Ex.: O Observações: - o Nox deve ser determinado para cada átomo, isoladamente. - Nos compostos iônicos, o Nox é a própria carga do íon. - Já nos compostos moleculares, o Nox é uma carga imaginária, e o Nox negativo é atribuído ao átomo de maior eletronegatividade. O Nox de um íon monoatômico é sempre igual à sua própria carga! + 2 K Ba F N 2+ O Ex.: O Nox: 3 +1 +2 -1 -3 Existem elementos que apresentam Nox fixo em seus compostos! Ex.: AgCl Ag₂SO₄ Nox: +1 O Nox do elemento Hidrogênio nas substâncias compostas geralmente é +1. HBr H₂SO₄ Nox: +1",
      },
      {
        numero: 4,
        texto:
          "Número de oxidação (Nox) Regras O Nox do elemento oxigênio, na maioria de seus compostos, é igual a -2! Ex.: C O Os halogênios apresentam Nox = -1 quando formam compostos binários (dois elementos), nos quais são mais eletronegativos! Ex.: H Cl Nox: -2 Nox: -2 Nox: -1 A soma dos Nox de todos os átomos constituintes de um composto iônico molecular é sempre zero! Ex.: H ou Cl Em um íon composto, o somatório dos Nox é igual a carga do íon! Ex.: Nox Cr: 2x Nox O: -2 2 Cr O 2 7 Nox: +1 -1 Soma dos Nox: 0 Calculando o valor do Nox do Cr a partir do Nox do O e da carga do íon: 2x - 2 (7) = -2 x = +6",
      },
      {
        numero: 5,
        texto:
          "espontaneidade Em uma reação de oxirredução que ocorra espontaneamente, os elétrons são tranferidos de uma espécie química com menor potencial padrão de redução para outra com maior potencial padrão de redução. Reação de oxirredução espontânea: E0_R (espécie que recebe e )- E0_R (espécie que perde e ) Reação de oxirredução não-espontânea: E0_R (espécie que recebe e )- E0_R (espécie que perde e ) > 0 < 0 Agente redutor: é a espécie que sofre oxidação e, portanto, promove a redução da outra espécie química! Agente oxidante: é a espécie que sofre redução e, portanto, promove a oxidação da outra espécie química! Agente redutor: este apresenta o menor potencial padrão de redução! Agente oxidante: este apresenta o maior potencial padrão de redução!",
      },
    ],
  },
  {
    id: "2.5",
    title: "Potenciais-Padrão de Redução",
    color: "#8e44ad",
    pages: [
      {
        numero: 1,
        texto: "Tabela completa dos potenciais-padrão de redução (E°) para 40 semi-reações químicas. Consulte os valores de potencial para determinar a espontaneidade de reações de oxirredução e identificar agentes oxidantes e redutores.",
        link: "potenciaisReducao",
        params: { title: "Potenciais-Padrão de Redução" },
      },
    ],
  },
  {
    id: "3",
    title: "Pilhas e Eletrólise",
    color: "#0288D1",
    images: [
      { id: "1", imgUrl: require("@/assets/images/pilhas-eletrolise-1.png") },
      { id: "2", imgUrl: require("@/assets/images/pilhas-eletrolise-2.png") },
      { id: "3", imgUrl: require("@/assets/images/pilhas-eletrolise-3.png") },
      { id: "4", imgUrl: require("@/assets/images/pilhas-eletrolise-4.png") },
      { id: "5", imgUrl: require("@/assets/images/pilhas-eletrolise-5.png") },
      { id: "6", imgUrl: require("@/assets/images/pilhas-eletrolise-6.png") },
    ],
    pages: [
      {
        numero: 1,
        texto:
          "São dispositivos nos quais uma reação espontânea de oxirredução produz corrente elétrica! No interior da pilha ocorre uma reação de oxirredução, isto é, há perda e ganho de elétrons. Essa reação libera elétrons, os quais são atraídos para o polo positivo da pilha. A passagem de elétrons pelo filamento da lâmpada o torna incandescente. Desenho esquemático de funcionamento de uma pilha-- Ânodo Zinco E° = -0,76 V red---- Cátodo Algodão embebido em salmoura Cobre E° = +0,34 V red A primeira pilha foi criada pelo cientista italiano Alessandro Volta, em 1800. Basicamente a pilha era constituída de dois eletrodos (placas metálicas de zinco e cobre) e por algodão embebido em solução eletrolítica. Nesse conjunto de placas e algodão (célula eletrolítica), os elétrons fluem da lâmina de zinco para a de cobre, mantendo a lâmpada acesa por um pequeno intervalo de tempo. Isso ocorre porque os elétrons, por apresentarem carga negativa, migram do ânodo (lâmina de zinco) para o cátodo (lâmina de cobre).",
      },
      {
        numero: 2,
        texto:
          "Pilha de Daniell _ e e ânodo (-) Cl (aq) + K + Cl (aq) _ + K (aq) (aq) cátodo (+) Zinco Cobre KCl ponte salina (aq) Zn 2+ Cl 2 2+ Zn SO 4 lã de vidro K SO 2 4 + Cu 2+ O químico e meteorologista John Frederick Daniell, em 1836, aperfeiçoou a descoberta de Volta, dividindo a célula eletrolítica de sua pilha em duas partes (duas células), como mostra o esquema acima. Os dois eletrodos metálicos eram unidos externamente por um fio condutor e as duas células eram unidas por uma ponte salina constituída de uma solução saturada de cloreto de potássio. Veja como acontece as semi-reações",
      },
      {
        numero: 3,
        texto:
          "Pilha de Daniell após certo tempo de funcionamento... No eletrodo de cobre: No eletrodo de zinco: Espessamento da lâmina de Cobre; E° = +0,34 V; Esse fato pode ser explicado pela semi reação de redução: red red 2+ _ Cu + 2 e Cu (aq) (s) Desgaste da lâmina de Zinco; E° = -0,76 V; Esse fato pode ser explicado pela semi reação de oxidação: 2+ (s) Zn Zn + 2 e (aq) O eletrodo em que ocorre a redução é o cátodo! _ O eletrodo em que ocorre a oxidação é o ânodo! Reação global: 2+ 2+ Zn + Cu Zn + Cu (s) (aq) (aq) Usando a notação oficial, a pilha estudada é representada pelo ânodo no lado esquerdo, ponte salina no meio e cátodo no lado direito, como mostra abaixo: Ânodo Ponte salina 2+ Cátodo 2+ Zn / Zn // Cu / Cu (s) 0",
      },
      {
        numero: 4,
        texto:
          "Definição É um processo não-espontâneo em que há a passagem de uma corrente elétrica por meio de um sistema líquido, no qual existam íons, produzindo-se reações químicas. Gerador Eletrodos Ânodo Cátodo Oxidação Redução Solução eletrolítica Íons No processo de eletrólise, os elétrons emergem do gerador pelo ânodo (-) e entram na célula eletrolítica pelo cátodo (-), no qual produzem redução. A eletrólise pode ser de dois tipos: ígnea ou em meio aquoso!",
      },
      {
        numero: 5,
        texto:
          "Ígnea Cátodo (redução): Ânodo (oxidação): Reação global: Neste tipo de eletrólise, a substância pura está liquefeita (sólida) e não existe água no sistema. Veja como acontece o processo com o cloreto de sódio: + 2 Na + 2 e (l) 2 Cl (l) + _ Cl 2 Na + 2 Cl (l) (l) 2 (g) 2 Na (l) + 2 e _ 2 Na + Cl (l) 2 (g) Eletrólise ígnea do cloreto de sódio Potencial padrão de redução das semi-reações: 0 Na: Cl: E = -2,71 red 0 red E = +1,36",
      },
      {
        numero: 6,
        texto:
          "Neste em meio aquoso tipo de eletrólise, devemos considerar não só os íons provenientes do soluto, mas também os da água, provenientes de sua ionização. Eletrólise aquosa do cloreto de sódio Dissociação do NaCl: Autoionização da água: Semi-reações no ânodo: Semi-reações no cátodo: 2 NaCl + (aq) 2 H O 2 Cl 2 H O 2 (l) (aq) 2 Na + 2 Cl (aq) + (aq) 2 H + 2 OH Cl 2 (g) 2 (l) (aq) (aq) + 2 e + _ O + 4 H + 4 e 2 (g) + Na + e (aq) 2 H O + 2 e 2 (l) _ _ (aq) Na (s) H + 2 OH 2 (g) _ (aq) 2 NaCl + 2 H O (aq) 2 (l) 2 (g) H + Cl + 2 NaOH 2 (g) Reação global Outros produtos da eletrólise da salmoura: Peróxido de hidrogênio: _ O + H O + 2 e HO + OH 2 (g) 2 (l) 2 (aq) (aq) + _ O + 2 H + 2 e H O 2 (g) (aq) Hipoclorito de sódio: 2 2 (aq) 2 NaOH + Cl NaCl + NaClO + H O (aq) 2 (g) (aq) (aq) 2 (l)",
      },
    ],
  },
  {
    id: "3.5",
    title: "Animação da Pilha de Daniell",
    color: "#7b1fa2",
    pages: [
      {
        numero: 1,
        texto: "Simulação interativa da Pilha de Daniell - Célula Galvânica. Monte a pilha arrastando os componentes para as posições corretas e veja a lâmpada acender quando tudo estiver no lugar certo!",
        link: "daniellAnimation",
        params: { title: "Animação da Pilha de Daniell" },
      },
    ],
  },
  {
    id: "4",
    title: "Eletroquímica e o Cotidiano",
    color: "#d84315",
    images: [
      {
        id: "1",
        imgUrl: require("@/assets/images/eletroquimica-cotidiano-1.png"),
      },
      {
        id: "2",
        imgUrl: require("@/assets/images/eletroquimica-cotidiano-2.png"),
      },
      {
        id: "3",
        imgUrl: require("@/assets/images/eletroquimica-cotidiano-3.png"),
      },
      {
        id: "4",
        imgUrl: require("@/assets/images/eletroquimica-cotidiano-4.png"),
      },
      {
        id: "5",
        imgUrl: require("@/assets/images/eletroquimica-cotidiano-5.png"),
      },
      {
        id: "6",
        imgUrl: require("@/assets/images/eletroquimica-cotidiano-6.png"),
      },
      {
        id: "7",
        imgUrl: require("@/assets/images/eletroquimica-cotidiano-7.png"),
      },
      {
        id: "8",
        imgUrl: require("@/assets/images/eletroquimica-cotidiano-8.png"),
      },
      {
        id: "9",
        imgUrl: require("@/assets/images/eletroquimica-cotidiano-9.png"),
      },
    ],
    pages: [
      {
        numero: 1,
        texto:
          "Fotossíntese CO 2 Raios solares A fotossíntese é uma reação de oxirredução. +4-4 =0 As moléculas de clorofila utilizam energia luminosa para produzir o gás oxigênio. A reação global a seguir mostra esse processo: +2-2 = 0 0 +12-12 6 CO + 6 H O C H O + 6 O 2 2 6 12 6 2 Semi-reações + _ + NADP + 2 e + H NADPH Redução + 2 H O O + 4 H + 4 e 2 2 Oxidação",
      },
      {
        numero: 2,
        texto:
          "Vitamina C Suco de limão ou de laranja Salada de frutas Na área medicinal, os agentes redutores costumam ser denominados de antioxidantes, pois estes evitam que os alimentos sofram alterações (perda da qualidade). A vitamina C (ácido ascórbico) é um dos mais conhecidos. O ácido ascórbico na presença do gás oxigênio e de um catalisador sofre tornando-se o oxidação, ácido dehidroascórbico, como mostra a reação abaixo: H O 2 + _ + 2 H O + 2 e 3 ácido L-ascórbico ácido L-dehidroascórbico Esse ácido possui pH abaixo de 4, o que favorece a diminuição da velocidade da reação de escurecimento do tecido da fruta!",
      },
      {
        numero: 3,
        texto:
          "Uma pilha na boca Um dos materiais utilizados por dentistas para restaurar dentes com cáries é o amálgama dentário. Ele consiste numa mistura de três substâncias em quantidades praticamente iguais: Ag Hg Ag Sn Sn Hg 2 3 8 3 Os potencias padrão de redução dessas espécies são, respectivamente, +0,85 V, -0,05 V e -0,13 V. Veja o que acontece quando um dente obturado entra em contato com um dente incrustado de ouro: 0 2+ _ 3+ _ Sn Sn + 2 e // 0 Au + 3 e Au Oxidação Ânodo 2 Au + 3 Sn 2 Au + 3 Sn Equação global Redução Incrustação de ouro é Obturação de amálgama 3+ O contato do ouro com a obturação de amálgama cria uma célula eletroquímica na boca, causando uma dor aguda no dente (choque) pela alta corrente elétrica produzida.",
      },
      {
        numero: 3,
        texto:
          "Gases no sangue O 2 O nível de oxigênio no sangue é muito importante, por isso diversos dispositivos foram desenvolvidos para possibilitar sua medição como uma minúscula célula eletroquímica. Uma das metades dessa é um eletrodo utilizado como referência. Já a outra metade é um eletrodo que detecta e mede a concentração de oxigênio no sangue. O eletrodo sensível é colocado em uma amostra de sangue arterial, e uma pequena voltagem é aplicada na célula para causar a redução do oxigênio dissolvido na amostra, como mostra a reação de redução à seguir: 0 +2-2 = 0 O + 2 H O + 4 e 2 (aq) 2 (l) 0 +1-1--2 _ Redução +1 4 OH Oxidação (aq) _ 4 Ag + 4 Cl 4 AgCl + 4 e (aq) (aq) (aq) 2 (aq) O + 2 H O + 4 Ag + 4 Cl 4 AgCl + 4 OH 2 (l) (aq) (aq) Princípio de funcionamento de um eletrodo de Clark Solução de eletrólito (Cloreto de KCl (aq) Cátodo (metal nobre) Ânodo (eletrodo de prata/cloreto de prata) potássio) Ag / AgCl (s) membrana permeável (teflon)",
      },
      {
        numero: 4,
        texto:
          "Eletrodo ou metal de sacrifício 2+ Mg Mg + 2 e (s) (aq) _ // 2+ (aq) e _ magnésio _ Fe + 2 e Fe Oxidação Redução (s) O metal de sacrifício é um metal que apresenta um potencial padrão de redução menor do que o do ferro ou aço. Por esse motivo, tanques de aço contendo combustível, por exemplo, apresentam placas de magnésio que apresentam tendência de perder elétrons (maior potencial padrão de oxidação) a fim de protegê-los. O mesmo acontece também com navios e oleodutos. E 0 red Mg = -2,37 V < E 0 red Fe = -0,45 V O magnésio, quando se oxida, perde elétrons para o ferro, o qual é reduzido!",
      },
      {
        numero: 5,
        texto:
          "Bafômetro e pilha de combustível O bafômetro é um aparelho comumente utilizado em motoristas com suspeitas de dirigir alcoolizados. Este aparelho tem a função de medir a quantidade de álcool etílico na corrente sanguínea. H H C HC OH 3 Álcool etílico Ele mede a quantidade de álcool presente no ar expirado, que é proporcional à quantidade de álcool presente na corrente sanguínea. A célula de combustível que tem dois eletrodos de platina é um dos tipos de bafômetro utilizados atualmente. Como acontece a reação de oxirredução no bafômetro?!",
      },
      {
        numero: 6,
        texto:
          "Veja como ocorre as reações redox no bafômetro à pilha de combustível Ânodo Ar expirado No cátodo, o gás oxigênio é reduzido: _ C H OH 2 5 H CCOOH 3 O + 2 H O + 4 e 4 OH (aq) OH meio eletrolítico H O 2 e _ Entrada de ar 2 (g) 2 (l) No ânodo, o álcool etílico é oxidado: C H OH + 4 OH 2 5 (v) H CCOOH + 3 H O + 4 e (aq) 3 (aq) 2 (l) A quantidade de corrente elétrica é proporcional à quantidade de álcool que reage no bafômetro!",
      },
      {
        numero: 7,
        texto:
          "Bafômetro de dicromato de potássio Reação química do ar expirado pelo motorista com as substâncias do tubo do bafômetro: Dicromato de potássio Ácido sulfúrico SEM ETANOL: a cor do tubo fica alaranjada. Dicromato de potássio Reação Etanol Ácido sulfúrico Acetaldeído Cr (SO ) 2 4 3 Sulfato de Crômio III COM ETANOL: a cor do tubo fica verde. O reagente dicromato de potássio K Cr O possui coloração amarelo alaranjado. Já um dos produtos da reação é o sulfato de crômio III - Cr (SO ) , o qual apresenta coloração verde. 2 2 7 2 Veja, a seguir, como acontece a reação de oxirredução dentro do dispositivo (bafômetro)!",
      },
      {
        numero: 8,
        texto:
          "Bafômetro de dicromato de potássio K Cr O + 4 H SO + 3 C H OH 3 C H O + K SO + Cr (SO ) + 7 H O 2 2 2 7 (aq) 2 4 (aq) 5 2 (v) 4 (g) Reação global 2 4 (aq) Reação na forma iônica: +6 -14 = -2 +1-2 +3 -2 +2 -2 +1 = 0 +3 2 4 3 (aq) 2 (l)-1 +3 -1 +1 -2 = 0 +2 -2 = 0 2 2 7 (aq) + Cr O + 8 H + 3 CH CH OH 2 Cr + 3 CH CHO + 7 H O (aq) Redução 3 2 (g) 3+ (aq) 3 Explicação química... Oxidação (g) 2 (l) Quando o álcool exalado pelo motorista embriagado entra em contato com o reagente dicromato de potássio, ocorre a oxidação do álcool etílico a acetaldeído, e a redução do íon Cr O 7 , mudando a coloração do reagente.",
      },
      {
        numero: 9,
        texto:
          "Pilhas Pilha é um dispositivo formado por uma ou mais células eletroquímicas ligadas em série ou em paralelo, gerando uma corrente elétrica. Essas células são formadas por dois eletrodos mergulhados em uma solução contendo íons, chamada de eletrólito, que reagem e transferem elétrons. Existem vários tipos de pilhas e baterias, tais como pilhas secas (como as pilhas comuns), baterias de íon-lítio e pilhas alcalinas, que são amplamente utilizadas em dispositivos eletrônicos do dia a dia.",
      },
    ],
  },
  {
    id: "5",
    title: "Exercícios e aplicações",
    color: "#2e7ae4",
    images: [
      // {
      //   id: "1",
      //   imgUrl: require("@/assets/images/exercicios-aplicacoes-1.png"),
      // },
      // {
      //   id: "2",
      //   imgUrl: require("@/assets/images/exercicios-aplicacoes-2.png"),
      // },
      // {
      //   id: "3",
      //   imgUrl: require("@/assets/images/exercicios-aplicacoes-3-parte-1.png"),
      // },
      // {
      //   id: "4",
      //   imgUrl: require("@/assets/images/exercicios-aplicacoes-3-parte-2.png"),
      // },
      {
        id: "5",
        imgUrl: require("@/assets/images/exercicios-aplicacoes-4.png"),
      },
      {
        id: "6",
        imgUrl: require("@/assets/images/exercicios-aplicacoes-5.png"),
      },
      {
        id: "7",
        imgUrl: require("@/assets/images/exercicios-aplicacoes-6.png"),
      },
      {
        id: "8",
        imgUrl: require("@/assets/images/exercicios-aplicacoes-7-parte-1.png"),
      },
      {
        id: "9",
        imgUrl: require("@/assets/images/exercicios-aplicacoes-7-parte-2.png"),
      },
    ],
    pages: [
      {
        numero: 1,
        texto:
          "Quiz de mútipla escolha questões 1 a 3 REsoistas rápidas para fixar o conteúdo. Ver perguntas Perguntas abertas Questões 4 a 8 Responda com suas próprias palavras e aprofunde o entendimento.",
        link: "questionsMenu",
      },
      {
        numero: 2,
        texto:
          "Questão 4 (PERUZZO; CANTO, 2007, p. 387) No funcionamento da célula galvânica ilustrada abaixo verifica-se acúmulo de chumbo metálico na placa da esquerda e desgaste (corrosão) da placa da direita. A parede porosa exerce o mesmo papel da ponte salina. a) Expresse, por meio de equações químicas, o que ocorre em cada eletrodo. b) Em que sentido se estabelece o fluxo de elétrons no fio metálico? c) Qual eletrodo atua como cátodo e qual atua como ânodo? d) Qual eletrodo é o polo positivo e qual é o negativo? e) Equacione a reação global da pilha ilustrada. membrana porosa Pb 0 Al 0 Pb 2+ Al 3+",
        link: "slides",
        params: {
          title: "Exercícios e aplicações",
          firstPage: "1",
        },
      },
      {
        numero: 3,
        texto:
          "Questão 5  (USBERCO; SALVADOR, 2010, p. 433) Observe abaixo a reação global e as semi-reações que ocorre no bafômetro: 2 5 (v) C H OH + O H CCOOH +  H O 2 (g) 3 (aq) 2 (l) a) Quem são os agentes oxidantes e redutores? b) Qual o elemento que recebe elétrons? c) Qual dos elementos tem a maior variação de NOX? d) Qual a substância que funciona como polo negativo? e) Qual a substância que tem maior número de elétrons? _ 2 (g) 2 (l) _ _ O + 2 H O + 4 e 4 OH C H OH + 4 OH H CCOOH + 3 H O + 4 e 2 5 (v) (aq) (aq) 3 (aq) 2 (l) _",
        link: "slides",
        params: {
          title: "Exercícios e aplicações",
          firstPage: "2",
        },
      },
      {
        numero: 4,
        texto:
          "Questão 6 (USBERCO; SALVADOR, 2010, p. 398) Uma reação envolvendo permanganato de potássio em meio ácido com um sal de ferro II pode ser representada pela equação: KMnO + H SO + FeSO K SO + Fe (SO) + MnSO + H O 4 2 4 4 3 4 2 2 4 2 4 x y w z O permanganato de potássio, em meio ácido, um excelente agente oxidante, é usado no estudo dos solos para determinar a presença e a quantidade de Fe . Uma grande concentração de íons Fe atribui ao solo uma coloração esverdeada e, em solução aquosa, origina soluções de cor verde-pálida. A respeito desse experimento, responda as questões à seguir: a) Qual os valores dos Nox indicados por x, y, w e z? b) Qual substância sofreu oxidação e qual sofreu redução? c) Qual a variação do Nox da semi-reação de oxidação? d) Qual a variação do Nox da semi-reação de redução? e) Faça o balanceamento da equação global.",
        link: "slides",
        params: {
          title: "Exercícios e aplicações",
          firstPage: "3",
        },
      },
      {
        numero: 5,
        texto:
          "Questão 7 (UFPR) Um estudante montou um arranjo experimental para investigar a condutividade de algumas soluções aquosas. Para isso, ele usou água destilada, uma fonte de tensão e um amperímetro. Os resultados experimentais estão apresentados abaixo: Experimento Soluto Corrente medida (A) A açúcar 0 Observações visuais não houve alteração perceptível B C ácido sulfúrico sulfato de cobre 0,5 0,5 A solução aquosa houve evolução de gases em ambos os eletrodos houve evolução gás em um eletrodo e houve deposição de cobre no outro eletrodo eletrodos de platina",
        link: "slides",
        params: {
          title: "Exercícios e aplicações",
          firstPage: "4",
        },
      },
      {
        numero: 6,
        texto:
          "Questão 7 (continuação...) Com base nos resultados obtidos no experimento pelo estudante, responda as seguintes questões: a) Por que o amperímetro não registrou corrente elétrica no experimento A e registrou nos experimentos B e C? b) Quais foram os gases liberados no experimento B no eletrodo positivo? E no eletrodo negativo? c) Qual foi o gás liberado no experimento C? Em qual eletrodo (ânodo ou cátodo) houve deposição de cobre?",
        link: "slides",
        params: {
          title: "Exercícios e aplicações",
          firstPage: "5",
        },
      },
    ],
  },
  {
    id: "6",
    title: "Gabarito",
    color: "#57dc32",
    images: [
      {
        id: "1",
        imgUrl: require("@/assets/images/gabarito-1.png"),
      },
      {
        id: "2",
        imgUrl: require("@/assets/images/gabarito-2.png"),
      },
      {
        id: "3",
        imgUrl: require("@/assets/images/gabarito-3.png"),
      },
      {
        id: "4",
        imgUrl: require("@/assets/images/gabarito-4.png"),
      },
      {
        id: "5",
        imgUrl: require("@/assets/images/gabarito-5.png"),
      },
    ],
    pages: [
      {
        numero: 1,
        texto:
          "Questão 1 Resposta: alternativa B. Questão 2 Resposta: alternativa C. Questão 3 Resposta: alternativa C. Questão 4 Respostas: a) Semi-reação de oxidação: Al ------> Al 3+ (s) 2+ (aq) (aq) _ + 3 e Sem-ireação de redução: Pb + 2 e -------> Pb b) Os elétrons são emitidos pela placa de alumínio e se dirigem para a placa de chumbo.",
      },
      {
        numero: 2,
        texto:
          "Questão 4 c) Por definição, ânodo é o eletrodo em que há a oxidação, já o cátodo é o eletrodo em que há a redução. Assim, o ânodo é o eletrodo de alumínio e o cátodo é o eletrodo de chumbo. d) O polo positivo (que recebe elétrons do fio metálico) é o eletrodo de chumbo. O polo negativo (que emite elétrons para o fio) é o eletrodo de alumínio.",
      },
      {
        numero: 3,
        texto:
          "Questão 4 e) Para chegar à equação global, multiplicamos a semi-reação de oxidação por 2 e a de redução por 3, como mostra abaixo: (s) 2+ _ 3+ 2 Al ------> 2 Al + 6 e 3 Pb + 6 e ------> 3 Pb (aq) (aq) (s) _ 2+ 3+ 2 Al + 3 Pb ------> 2 Al + 3 Pb (s) Questão (aq) (aq) (s) Questão 5 Respostas: a) Agente redutor: álcool etílico e o agente oxidante: gás oxigênio. b) Gás oxigênio. c) Carbono com nox igual a 4.",
      },
      {
        numero: 4,
        texto:
          "Questão 5 Respostas: d) Polo negativo (ânodo): álcool etílico. e) Álcool etílico que recebe 4 elétrons. Questão 6 Respostas: a) x = +7 ; y = +2; w = +2; z = +3. 4 b) Oxidação: FeSO e Redução: KMnO . c) Variação do Nox = +1. d) Variação do Nox = +5. e) 4 2 KMnO + 8 H SO + 10 FeSO 1 K SO + 4(aq) 2 4(aq) 4(aq) 5 Fe (SO ) + 2 MnSO + 8 H O 2 4 3(aq) 4(aq) 2 2 (l)",
      },
      {
        numero: 5,
        texto:
          "Questão 7 Respostas: a) Experimento A: o açúcar não sofre ionização, logo a solução não é eletrolítica. Experimento B: o ácido sulfúrico sofre ionização. Experimento C: o sulfato de cobre (sal) sofre dissociação, originando soluções eletrolíticas. b) Polo - (cátodo) = H ; Polo + (ânodo) = O . 2(g) (s) 2(g) c) Polo - (cátodo) = Cu (deposição); Polo + (ânodo) = O . 2(g",
      },
    ],
  },
  {
    id: "7",
    title: "Material Suplementar",
    color: "#2e7ae4",
    images: [
      {
        id: "1",
        imgUrl: require("@/assets/images/material-suplementar-1.png"),
      },
      {
        id: "2",
        imgUrl: require("@/assets/images/material-suplementar-2.png"),
      },
      {
        id: "3",
        imgUrl: require("@/assets/images/material-suplementar-3.png"),
      },
    ],
    pages: [
      {
        numero: 1,
        texto:
          "Assistir video Fonte: Adaptado de Silva et al. (2021). Experimento: Uma pilha de limão com moedas! Introdução: Em nosso cotidiano, pilhas comuns são bastante utilizadas para fazer funcionar equipamentos eletrônicos. Isso acontece porque no interior das pilhas existem metais e soluções eletrolíticas que causam reações de oxirredução (com perda e ganho de elétrons), que consequentemente gera uma corrente elétrica responsável por fazer o equipamento funcionar. Pensando nesse princípio, é possível montar uma pilha caseira usando materiais de baixo custo. Veja a seguir: Materiais:- 1 limão- 1 calculadora ou relógio digital- 2 fios elétricos com garras de jacaré- 1 moeda de cobre- 1 prego de zinco- 1 estilete",
      },
      {
        numero: 2,
        texto:
          "Assistir video Fonte: Adaptado de Silva et al. (2021). Experimento: Uma pilha de limão com moedas! Procedimento: 1) Faça dois pequenos cortes na casca do limão e enfie em cada um a placa de cobre (moeda de cobre) e a placa de zinco (prego de zinco). Importante: os metais não devem se tocar!! 2) Conecte os fios com as garras de jacaré à moeda de cobre e ao prego de zinco. Na outra extremidade de cada um dos dois fios deve ser conectada à calculadora. 3) Observe que a calculadora irá funcionar de imediato. Desenho esquemático da pilha de limão caseira Ácido ascórbico O limão é ácido e seu suco é uma solução eletrolítica com espécies químicas (ácido cítrico e ácido ascórbico, principalmente) com cargas positivas e negativas em meio aquoso! Ácido cítrico",
      },
      {
        numero: 3,
        texto:
          "Assistir video Fonte: Adaptado de Silva et al. (2021). Experimento: Uma pilha de limão com moedas! Questões para refletir! 1 - Levando-se em consideração a pilha construída anteriormente, a seguir são dadas as semi-reações e seus respectivos potenciais padrão de redução: a) No eletrodo de Zn, ocorre oxidação ou redução? Escreva a equação correspondente. b) Esse eletrodo é o polo positivo ou o negativo? c) Esse eletrodo é o ânodo ou o cátodo? d) No eletrodo de Cu, ocorre oxidação ou redução? Escreva a equação correspondente. e) Escreva a equação que representa a reação global. f) Qual a representação oficial dessa pilha? g) Qual o sentido dos elétrons? h) O que ocorre com as lâminas de Zn e Cu? i) O que ocorre com as concentrações das duas soluções? 2+ _ Zn + 2 e Zn (aq) E red = -0,76 V 2+ 0 0 _ Cu + 2 e Cu (aq) (s) (s) E red = +0,34 V",
      },
    ],
  },
  {
    id: "8",
    title: "Referências",
    color: "#e1c820",
    images: [
      {
        id: "1",
        imgUrl: require("@/assets/images/referencias-1.png"),
      },
    ],
    pages: [
      {
        numero: 1,
        texto:
          "KOTZ, J. C.; TREICHEL, P. M.; WEAVER, G. C. Química geral e reações químicas. Vol. 2. Cengage Learning: São Paulo, 2012. 404 p. PERUZZO, F. M.; CANTO, E. L. do. Química: na abordagem do cotidiano. Volume único. 3 ed. Moderna: São Paulo, 2007. 760 p. SILVA, C. K. M. da et al. Jogo da velha no ensino de eletroquímica: um relato de experiência. Scientia Naturalis, Rio Branco, v. 3, n. 1, p. 256 273, 2021. STARR, Cecie et al. Vol. 1. Biologia: unidade e diversidade da vida. Cengage learning: São Paulo, 2011. 303 p. USBERCO, J.; SALVADOR, E. Química. Volume único. 7 ed. Saraiva: São Paulo, 2006. 672 p. USBERCO, J.; SALVADOR, E. Química. Volume único. 8 ed. Saraiva: São Paulo, 2010. 800 p.",
      },
    ],
  },
];

export type SemiReacao = {
  id: string;      // slug único, ex.: "li", "k", "mno4_mn2_ac", ...
  rotulo: string;  // ex.: "Li⁺/Li"
  equacao: string; // ex.: "Li⁺(aq) + e⁻ → Li(s)"
  E0: string;      // ex.: "-3,05 V" (usar vírgula como separador decimal)
  grupo?: string;  // opcional
};

export const SEMI_REACOES: SemiReacao[] = [
  // ===== Manter ESTA ORDEM =====
  { id: "li",  rotulo: "Li⁺/Li",        equacao: "Li⁺(aq) + e⁻ → Li(s)",                               E0: "-3,05 V", grupo: "Metais alcalinos" },
  { id: "k",   rotulo: "K⁺/K",          equacao: "K⁺(aq) + e⁻ → K(s)",                                 E0: "-2,93 V", grupo: "Metais alcalinos" },
  { id: "ba",  rotulo: "Ba²⁺/Ba",       equacao: "Ba²⁺(aq) + 2e⁻ → Ba(s)",                             E0: "-2,90 V", grupo: "Alcalino-terrosos" },
  { id: "sr",  rotulo: "Sr²⁺/Sr",       equacao: "Sr²⁺(aq) + 2e⁻ → Sr(s)",                             E0: "-2,89 V", grupo: "Alcalino-terrosos" },
  { id: "ca",  rotulo: "Ca²⁺/Ca",       equacao: "Ca²⁺(aq) + 2e⁻ → Ca(s)",                             E0: "-2,87 V", grupo: "Alcalino-terrosos" },
  { id: "na",  rotulo: "Na⁺/Na",        equacao: "Na⁺(aq) + e⁻ → Na(s)",                               E0: "-2,71 V", grupo: "Metais alcalinos" },
  { id: "mg",  rotulo: "Mg²⁺/Mg",       equacao: "Mg²⁺(aq) + 2e⁻ → Mg(s)",                             E0: "-2,37 V", grupo: "Alcalino-terrosos" },
  { id: "be",  rotulo: "Be²⁺/Be",       equacao: "Be²⁺(aq) + 2e⁻ → Be(s)",                             E0: "-1,85 V" },
  { id: "al",  rotulo: "Al³⁺/Al",       equacao: "Al³⁺(aq) + 3e⁻ → Al(s)",                             E0: "-1,66 V" },

  { id: "mn2_mn",    rotulo: "Mn²⁺/Mn",       equacao: "Mn²⁺(aq) + 2e⁻ → Mn(s)",                             E0: "-1,18 V" },
  { id: "h2o_h2_oh", rotulo: "2H₂O/H₂ + 2OH⁻", equacao: "2H₂O(l) + 2e⁻ → H₂(g) + 2OH⁻(aq)",                 E0: "-1,18 V" },
  { id: "zn2_zn",    rotulo: "Zn²⁺/Zn",       equacao: "Zn²⁺(aq) + 2e⁻ → Zn(s)",                             E0: "-0,76 V" },
  { id: "cr3_cr",    rotulo: "Cr³⁺/Cr",       equacao: "Cr³⁺(aq) + 3e⁻ → Cr(s)",                             E0: "-0,74 V" },
  { id: "fe2_fe",    rotulo: "Fe²⁺/Fe",       equacao: "Fe²⁺(aq) + 2e⁻ → Fe(s)",                             E0: "-0,44 V" },
  { id: "cd2_cd",    rotulo: "Cd²⁺/Cd",       equacao: "Cd²⁺(aq) + 2e⁻ → Cd(s)",                             E0: "-0,40 V" },
  { id: "pbso4_pb",  rotulo: "PbSO₄/Pb + SO₄²⁻", equacao: "PbSO₄(s) + 2e⁻ → Pb(s) + SO₄²⁻(aq)",             E0: "-0,31 V" },
  { id: "co2_co",    rotulo: "Co²⁺/Co",       equacao: "Co²⁺(aq) + 2e⁻ → Co(s)",                             E0: "-0,28 V" },
  { id: "ni2_ni",    rotulo: "Ni²⁺/Ni",       equacao: "Ni²⁺(aq) + 2e⁻ → Ni(s)",                             E0: "-0,25 V" },
  { id: "sn2_sn",    rotulo: "Sn²⁺/Sn",       equacao: "Sn²⁺(aq) + 2e⁻ → Sn(s)",                             E0: "-0,14 V" },
  { id: "pb2_pb",    rotulo: "Pb²⁺/Pb",       equacao: "Pb²⁺(aq) + 2e⁻ → Pb(s)",                             E0: "-0,13 V" },
  { id: "h_h2",      rotulo: "2H⁺/H₂",        equacao: "2H⁺(aq) + 2e⁻ → H₂(g)",                              E0: "0,0 V" },
  { id: "sn4_sn2",   rotulo: "Sn⁴⁺/Sn²⁺",     equacao: "Sn⁴⁺(aq) + 2e⁻ → Sn²⁺(aq)",                          E0: "+0,13 V" },
  { id: "cu2_cu1",   rotulo: "Cu²⁺/Cu⁺",      equacao: "Cu²⁺(aq) + e⁻ → Cu⁺(aq)",                            E0: "+0,15 V" },
  { id: "so4_so2",   rotulo: "SO₄²⁻/SO₂",     equacao: "SO₄²⁻(aq) + 4H⁺(aq) + 2e⁻ → SO₂(g) + 2H₂O(l)",       E0: "+0,20 V" },
  { id: "agcl_ag_cl",rotulo: "AgCl/Ag + Cl⁻", equacao: "AgCl(s) + e⁻ → Ag(s) + Cl⁻(aq)",                     E0: "+0,22 V" },
  { id: "cu2_cu",    rotulo: "Cu²⁺/Cu",       equacao: "Cu²⁺(aq) + 2e⁻ → Cu(s)",                             E0: "+0,34 V" },
  { id: "o2_4oh",    rotulo: "O₂/4OH⁻",       equacao: "O₂(g) + 2H₂O(l) + 4e⁻ → 4OH⁻(aq)",                    E0: "+0,40 V" },
  { id: "i2_i",      rotulo: "I₂/2I⁻",        equacao: "I₂(s) + 2e⁻ → 2I⁻(aq)",                              E0: "+0,53 V" },
  { id: "mno4_mno2", rotulo: "MnO₄⁻/MnO₂",    equacao: "MnO₄⁻(aq) + 2H₂O(l) + 3e⁻ → MnO₂(s) + 4OH⁻(aq)",     E0: "+0,59 V" },
  { id: "o2_h2o2",   rotulo: "O₂/H₂O₂",       equacao: "O₂(g) + 2H⁺(aq) + 2e⁻ → H₂O₂(aq)",                   E0: "+0,68 V" },
  { id: "fe3_fe2",   rotulo: "Fe³⁺/Fe²⁺",     equacao: "Fe³⁺(aq) + e⁻ → Fe²⁺(aq)",                           E0: "+0,77 V" },
  { id: "ag_ag",     rotulo: "Ag⁺/Ag",        equacao: "Ag⁺(aq) + e⁻ → Ag(s)",                               E0: "+0,80 V" },
  { id: "hg2_hg",    rotulo: "Hg₂²⁺/Hg(l)",   equacao: "Hg₂²⁺(aq) + 2e⁻ → 2Hg(l)",                           E0: "+0,85 V" },
  { id: "no3_no",    rotulo: "NO₃⁻/NO",       equacao: "NO₃⁻(aq) + 4H⁺(aq) + 3e⁻ → NO(g) + 2H₂O(l)",          E0: "+0,96 V" },
  { id: "br2_br",    rotulo: "Br₂/2Br⁻",      equacao: "Br₂(l) + 2e⁻ → 2Br⁻(aq)",                            E0: "+1,07 V" },
  { id: "o2_h2o",    rotulo: "O₂/2H₂O",       equacao: "O₂(g) + 4H⁺(aq) + 4e⁻ → 2H₂O(l)",                     E0: "+1,23 V" },
  { id: "mno2_mn2",  rotulo: "MnO₂/Mn²⁺",     equacao: "MnO₂(s) + 4H⁺(aq) + 2e⁻ → Mn²⁺(aq) + 2H₂O(l)",        E0: "+1,23 V" },
  { id: "cr2o7_cr3", rotulo: "Cr₂O₇²⁻/Cr³⁺",  equacao: "Cr₂O₇²⁻(aq) + 14H⁺(aq) + 6e⁻ → 2Cr³⁺(aq) + 7H₂O(l)", E0: "+1,33 V" },
  { id: "cl2_cl",    rotulo: "Cl₂/2Cl⁻",      equacao: "Cl₂(g) + 2e⁻ → 2Cl⁻(aq)",                            E0: "+1,36 V" },
  { id: "au3_au",    rotulo: "Au³⁺/Au",       equacao: "Au³⁺(aq) + 3e⁻ → Au(s)",                              E0: "+1,50 V" },
  { id: "mno4_mn2_ac", rotulo: "MnO₄⁻/Mn²⁺",  equacao: "MnO₄⁻(aq) + 8H⁺(aq) + 5e⁻ → Mn²⁺(aq) + 4H₂O(l)",      E0: "+1,51 V" },
  { id: "ce4_ce3",   rotulo: "Ce⁴⁺/Ce³⁺",     equacao: "Ce⁴⁺(aq) + e⁻ → Ce³⁺(aq)",                           E0: "+1,61 V" },
  { id: "h2o2_2h2o", rotulo: "H₂O₂/2H₂O",     equacao: "H₂O₂(aq) + 2H⁺(aq) + 2e⁻ → 2H₂O(l)",                  E0: "+1,77 V" },
  { id: "co3_co2",   rotulo: "Co³⁺/Co²⁺",     equacao: "Co³⁺(aq) + e⁻ → Co²⁺(aq)",                           E0: "+1,82 V" },
  { id: "o3_o2",     rotulo: "O₃/O₂",         equacao: "O₃(g) + 2H⁺(aq) + 2e⁻ → O₂(g) + H₂O(l)",              E0: "+2,07 V" },
  { id: "f2_f",      rotulo: "F₂/2F⁻",        equacao: "F₂(g) + 2e⁻ → 2F⁻(aq)",                               E0: "+2,87 V" },
];


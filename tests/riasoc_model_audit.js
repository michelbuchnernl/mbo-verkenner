#!/usr/bin/env node
/*
 * Model-audit voor de MBO Opleidingen Verkenner (30 vragen).
 *
 * Draait rechtstreeks op index.html: vragen, telling, tie-break en
 * opleidingsmatch komen uit dezelfde code als de website.
 *
 *   node tests/riasoc_model_audit.js
 *
 * Wat er gesimuleerd wordt (standaard 600 leerlingen per groep):
 *   1. willekeurige klikkers        -> is de vragenset eerlijk voor alle zes letters?
 *   2. kant-klikkers                -> wat gebeurt er als iemand steeds links kiest?
 *   3. leerlingen met echte voorkeur -> vindt de test die voorkeur terug?
 * en bij elke groep: hoe gevarieerd en hoe passend zijn de zes opleidingen?
 */

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const repoRoot = path.resolve(__dirname, '..');
const htmlPath = process.env.RIASOC_HTML_PATH ? path.resolve(process.env.RIASOC_HTML_PATH) : path.join(repoRoot, 'index.html');
const outputDir = process.env.RIASOC_OUTPUT_DIR ? path.resolve(process.env.RIASOC_OUTPUT_DIR) : path.join(__dirname, 'output');
const N = Number(process.env.RIASOC_N || 600);
const SEED = Number(process.env.RIASOC_SEED || 20261118);
const EXTRA_SEEDS = [11, 23, 37, 59, 71];

// ---------------------------------------------------------------- model laden
function loadModel() {
  const html = fs.readFileSync(htmlPath, 'utf8');
  const scripts = [...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi)]
    .map(m => m[1]).filter(s => s.includes('const QS=') && s.includes('const MBO='));
  if (scripts.length !== 1) throw new Error(`Applicatiescript niet eenduidig gevonden (${scripts.length}).`);
  const decode = v => String(v || '')
    .replace(/&#8211;/g, '-').replace(/&#232;/g, 'è').replace(/&#235;/g, 'ë').replace(/&#246;/g, 'ö')
    .replace(/&#\d+;/g, ' ').replace(/&amp;/g, '&');
  const element = () => ({
    value: '', textContent: '', innerText: '',
    set innerHTML(v) { this.value = this.textContent = this.innerText = decode(v); },
    get innerHTML() { return this.value; },
    style: {}, classList: { add() {}, remove() {} }, appendChild() {}, setAttribute() {}, getContext: () => ({})
  });
  const context = {
    console, setTimeout, clearTimeout, Date, Math, window: {},
    document: { querySelectorAll: () => [], getElementById: () => element(), createElement: () => element() },
    Chart: function Chart() { return { destroy() {} }; },
    fetch: async () => ({ ok: true })
  };
  const exportScript = `
    window.__RIASOC_AUDIT__ = {
      QS, D, META, MBO, MBO_CORRECTIONS, IMG_BASE,
      norm, rankProfile, profileQuality, answerKey, profileCorrelation,
      validateQuestions, validateDesign, validateNiveauMatchCases,
      selectSuggestions, selectedProvider, sectorFamily, opleidingStam, matchPct,
      setAllowedLevels(levels){ S.allowedLevels = levels.slice(); }
    };`;
  vm.runInNewContext(`${scripts[0]}\n${exportScript}`, context, { filename: htmlPath });
  return { model: context.window.__RIASOC_AUDIT__, decode };
}

// ------------------------------------------------------------------ hulpjes
function rng(seed) {
  let a = seed >>> 0;
  return () => {
    a |= 0; a = a + 0x6D2B79F5 | 0;
    let t = Math.imul(a ^ a >>> 15, 1 | a);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}
function gauss(r) {
  let u = 0;
  while (u === 0) u = r();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * r());
}
const pctStr = (x, digits = 1) => `${(x * 100).toFixed(digits)}%`;
const csvCell = v => { const s = String(v ?? ''); return /[",\n;]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s; };
const mdTable = (head, rows) => [`| ${head.join(' | ')} |`, `|${head.map(() => '---').join('|')}|`, ...rows.map(r => `| ${r.join(' | ')} |`)].join('\n');

// Chi-kwadraat tegen een gelijke verdeling; grenswaarden bij p = 0,05.
const CHI_CRIT = { 5: 11.07, 19: 30.14 };
function chiSquare(counts, total) {
  const expected = total / counts.length;
  return counts.reduce((sum, c) => sum + (c - expected) ** 2 / expected, 0);
}
function correlationMatrix(rows) {
  const k = rows[0].length, n = rows.length;
  const mean = Array.from({ length: k }, (_, i) => rows.reduce((a, r) => a + r[i], 0) / n);
  const cov = (i, j) => rows.reduce((a, r) => a + (r[i] - mean[i]) * (r[j] - mean[j]), 0) / n;
  return Array.from({ length: k }, (_, i) => Array.from({ length: k }, (_, j) => cov(i, j) / Math.sqrt(cov(i, i) * cov(j, j))));
}
function spearman(a, b) {
  const rank = v => {
    const s = v.map((x, i) => [x, i]).sort((p, q) => p[0] - q[0]);
    const out = [];
    for (let i = 0; i < s.length;) {
      let j = i;
      while (j + 1 < s.length && s[j + 1][0] === s[i][0]) j++;
      for (let k = i; k <= j; k++) out[s[k][1]] = (i + j) / 2;
      i = j + 1;
    }
    return out;
  };
  const ra = rank(a), rb = rank(b), m = (a.length - 1) / 2;
  let num = 0, da = 0, db = 0;
  ra.forEach((_, i) => { num += (ra[i] - m) * (rb[i] - m); da += (ra[i] - m) ** 2; db += (rb[i] - m) ** 2; });
  return da && db ? num / Math.sqrt(da * db) : 0;
}

// Verborgen voorkeuren met de zeshoek van Holland: buren lijken op elkaar
// (r = 0,40), om-en-om minder (0,15), tegenover elkaar niet (0).
function makeThetaSampler(D) {
  const RHO = [1, 0.40, 0.15, 0];
  const dist = (i, j) => { const x = Math.abs(i - j); return Math.min(x, D.length - x); };
  const sigma = D.map((_, i) => D.map((_, j) => RHO[dist(i, j)]));
  const L = sigma.map(r => r.map(() => 0));
  for (let i = 0; i < D.length; i++) for (let j = 0; j <= i; j++) {
    let s = sigma[i][j];
    for (let k = 0; k < j; k++) s -= L[i][k] * L[j][k];
    L[i][j] = i === j ? Math.sqrt(s) : s / L[j][j];
  }
  return r => {
    const z = D.map(() => gauss(r));
    return Object.fromEntries(D.map((d, i) => [d, L[i].reduce((a, l, k) => a + l * z[k], 0)]));
  };
}

// ------------------------------------------------------------- een leerling
const LEVEL_SETS = [[2, 3], [3, 4], [3, 4], [3, 4], [4], [2, 3, 4]]; // Basis, Kader, GL, TL, Havo, Anders
const LEVEL_LABELS = ['Basis', 'Kader', 'GL', 'TL', 'Havo', 'Anders'];

function runStudent(model, choices, index) {
  const answers = model.QS.map((q, i) => ({ q: q.n, c: choices[i] }));
  const meta = model.rankProfile(answers);
  model.setAllowedLevels(LEVEL_SETS[index % LEVEL_SETS.length]);
  const suggestions = model.selectSuggestions(meta.pct, meta.code, 6, model.answerKey(answers));
  return { answers, meta, pct: meta.pct, suggestions, track: LEVEL_LABELS[index % LEVEL_LABELS.length] };
}

function summarise(model, students, truths) {
  const { D } = model;
  const n = students.length;
  const top1 = Object.fromEntries(D.map(d => [d, 0]));
  const sets = {}, codes = {};
  const programmes = {}, families = {}, suggestionSets = {};
  let boundaryTie = 0, boundaryUnresolved = 0, topTie = 0, flat = 0;
  let simSum = 0, inTop3 = 0, inTop2 = 0, inBottom2 = 0, total = 0, familySum = 0, schoolSum = 0;
  let hit1 = 0, overlap = 0, rho = 0, sugTrueTop3 = 0;

  students.forEach((st, k) => {
    const { meta } = st;
    top1[meta.order[0]]++;
    const set = meta.selected.slice().sort((a, b) => D.indexOf(a) - D.indexOf(b)).join('');
    sets[set] = (sets[set] || 0) + 1;
    codes[meta.code] = (codes[meta.code] || 0) + 1;
    if (meta.boundary.tied) boundaryTie++;
    if (meta.boundary.tied && meta.boundary.decidedBy === 'gelijk') boundaryUnresolved++;
    if (meta.wins[meta.order[0]] === meta.wins[meta.order[1]]) topTie++;
    if (model.profileQuality(st.pct, st.answers).flat) flat++;

    const fams = new Set(), schools = new Set();
    st.suggestions.forEach(m => {
      const key = `${m.c} ${m.o}`;
      programmes[key] = (programmes[key] || 0) + 1;
      const fam = model.sectorFamily(m);
      families[fam] = (families[fam] || 0) + 1;
      fams.add(fam); schools.add(model.selectedProvider(m).school);
      simSum += m.sim; total++;
      const lead = D.slice().sort((a, b) => m.sc[b] - m.sc[a] || D.indexOf(a) - D.indexOf(b))[0];
      if (meta.order.slice(0, 3).includes(lead)) inTop3++;
      if (meta.order.slice(0, 2).includes(lead)) inTop2++;
      if (meta.order.slice(4).includes(lead)) inBottom2++;
      if (truths) {
        const trueOrder = D.slice().sort((a, b) => truths[k][b] - truths[k][a]);
        if (trueOrder.slice(0, 3).includes(lead)) sugTrueTop3++;
      }
    });
    familySum += fams.size; schoolSum += schools.size;
    const setKey = st.suggestions.map(m => `${m.c} ${m.o}`).sort().join(' | ');
    suggestionSets[setKey] = (suggestionSets[setKey] || 0) + 1;

    if (truths) {
      const trueOrder = D.slice().sort((a, b) => truths[k][b] - truths[k][a]);
      if (meta.order[0] === trueOrder[0]) hit1++;
      overlap += meta.selected.filter(d => trueOrder.slice(0, 3).includes(d)).length;
      rho += spearman(D.map(d => st.pct[d]), D.map(d => truths[k][d]));
    }
  });

  const allSets = [];
  D.forEach((a, i) => D.slice(i + 1).forEach((b, j) => D.slice(i + j + 2).forEach(c => allSets.push(a + b + c))));
  const setCounts = allSets.map(s => sets[s] || 0);
  const corr = correlationMatrix(students.map(st => D.map(d => st.pct[d])));
  const offDiag = [];
  corr.forEach((row, i) => row.forEach((v, j) => { if (j > i) offDiag.push(v); }));
  const progList = Object.entries(programmes).sort((a, b) => b[1] - a[1]);

  return {
    n, top1, sets, setCounts, allSets, codes, corr,
    chiTop1: chiSquare(D.map(d => top1[d]), n),
    chiSets: chiSquare(setCounts, n),
    corrMin: Math.min(...offDiag), corrMax: Math.max(...offDiag),
    meanPct: Object.fromEntries(D.map(d => [d, students.reduce((a, st) => a + st.pct[d], 0) / n])),
    boundaryTie: boundaryTie / n, boundaryUnresolved: boundaryUnresolved / n, topTie: topTie / n, flat: flat / n,
    uniqueProgrammes: progList.length, uniqueSets: Object.keys(suggestionSets).length,
    mostShown: progList[0] ? progList[0][1] / n : 0, progList,
    top10Share: progList.slice(0, 10).reduce((a, x) => a + x[1], 0) / total,
    families, total,
    meanSim: simSum / total, inTop3: inTop3 / total, inTop2: inTop2 / total, inBottom2: inBottom2 / total,
    meanFamilies: familySum / n, meanSchools: schoolSum / n,
    recovery: truths ? { hit1: hit1 / n, overlap: overlap / n, rho: rho / n, sugTrueTop3: sugTrueTop3 / total } : null
  };
}

// --------------------------------------------------------------- populaties
function randomStudents(model, n, seed, pLeft = 0.5) {
  const r = rng(seed);
  return Array.from({ length: n }, (_, k) => runStudent(model, model.QS.map(() => r() < pLeft ? 'A' : 'B'), k));
}
function latentStudents(model, n, seed, { beta = 1.5, appealSd = 0.3 } = {}) {
  const r = rng(seed);
  const sample = makeThetaSampler(model.D);
  // Elk plaatje is voor iedereen een beetje aantrekkelijker of saaier dan bedoeld.
  const appeal = model.QS.map(() => [gauss(r) * appealSd, gauss(r) * appealSd]);
  const truths = [], students = [];
  for (let k = 0; k < n; k++) {
    const theta = sample(r);
    const choices = model.QS.map((q, i) => {
      const delta = beta * (theta[q.a] - theta[q.b]) + appeal[i][0] - appeal[i][1];
      return r() < 1 / (1 + Math.exp(-delta)) ? 'A' : 'B';
    });
    truths.push(theta);
    students.push(runStudent(model, choices, k));
  }
  return { students, truths };
}

// Alleen de telling, voor de vergelijking met de oude 62 vragen (weging 3/1).
function scoreOnly(D, questions, choices) {
  const raw = Object.fromEntries(D.map(d => [d, 0])), max = { ...raw };
  questions.forEach((q, i) => {
    const w = choices[i] === 'A' ? q.wA : q.wB;
    D.forEach(d => { raw[d] += w[d] || 0; max[d] += Math.max(q.wA[d] || 0, q.wB[d] || 0); });
  });
  return Object.fromEntries(D.map(d => [d, raw[d] / max[d] * 100]));
}
function compareQuestionSets(model, n, seed) {
  const { D } = model;
  const fixture = JSON.parse(fs.readFileSync(path.join(__dirname, 'fixtures', 'vragen_62_oud.json'), 'utf8'));
  const lead = w => D.slice().sort((a, b) => (w[b] || 0) - (w[a] || 0))[0];
  const old = fixture.vragen.map(q => ({ ...q, a: lead(q.wA), b: lead(q.wB) }));
  const sets = { 'Oud: 62 vragen, weging 3/1': old, 'Nieuw: 30 vragen, 1 punt per keuze': model.QS };
  const sample = makeThetaSampler(D);
  const out = [];
  for (const [label, questions] of Object.entries(sets)) {
    let r = rng(seed);
    const top1 = Object.fromEntries(D.map(d => [d, 0])), triples = {}, rows = [];
    for (let k = 0; k < n; k++) {
      const pct = scoreOnly(D, questions, questions.map(() => r() < 0.5 ? 'A' : 'B'));
      const order = D.map(d => [d, pct[d], r()]).sort((x, y) => y[1] - x[1] || x[2] - y[2]).map(x => x[0]);
      top1[order[0]]++;
      const key = order.slice(0, 3).sort().join('');
      triples[key] = (triples[key] || 0) + 1;
      rows.push(D.map(d => pct[d]));
    }
    const tripleCounts = Object.values(triples).concat(Array(20 - Object.keys(triples).length).fill(0));
    const corr = correlationMatrix(rows), off = [];
    corr.forEach((row, i) => row.forEach((v, j) => { if (j > i) off.push(v); }));
    const allLeft = scoreOnly(D, questions, questions.map(() => 'A'));
    r = rng(seed + 1);
    let hit1 = 0, overlap = 0, rho = 0;
    for (let k = 0; k < n; k++) {
      const theta = sample(r);
      const pct = scoreOnly(D, questions, questions.map(q => r() < 1 / (1 + Math.exp(-1.5 * (theta[q.a] - theta[q.b]))) ? 'A' : 'B'));
      const order = D.map(d => [d, pct[d], r()]).sort((x, y) => y[1] - x[1] || x[2] - y[2]).map(x => x[0]);
      const trueOrder = D.slice().sort((a, b) => theta[b] - theta[a]);
      if (order[0] === trueOrder[0]) hit1++;
      overlap += order.slice(0, 3).filter(d => trueOrder.slice(0, 3).includes(d)).length;
      rho += spearman(D.map(d => pct[d]), D.map(d => theta[d]));
    }
    out.push({
      label, top1, chiTop1: chiSquare(D.map(d => top1[d]), n),
      tripleMin: Math.min(...tripleCounts), tripleMax: Math.max(...tripleCounts), chiSets: chiSquare(tripleCounts, n),
      corrMin: Math.min(...off), corrMax: Math.max(...off), allLeft,
      hit1: hit1 / n, overlap: overlap / n, rho: rho / n
    });
  }
  return out;
}

// ------------------------------------------------------------------ rapport
function main() {
  const { model, decode } = loadModel();
  const { D, QS, META } = model;
  const today = process.env.RIASOC_AUDIT_DATE || new Date().toISOString().slice(0, 10);
  const problems = [];

  // 1. Ontwerp
  const design = model.validateDesign();
  const questionErrors = model.validateQuestions().filter(x => x.status !== 'ok');
  const missingImages = QS.filter(q => !fs.existsSync(path.join(repoRoot, model.IMG_BASE, q.img))).map(q => q.img);
  const niveauCases = model.validateNiveauMatchCases();
  if (!design.ok) problems.push(...design.problems.map(p => `ontwerp: ${p}`));
  questionErrors.forEach(e => problems.push(`vraag ${e.n}: ${e.problems.join(', ')}`));
  missingImages.forEach(f => problems.push(`plaatje ontbreekt: ${f}`));
  if (niveauCases.some(c => !c.ok)) problems.push('niveaufilter: testcase mislukt');

  // 2. Populaties
  const random = summarise(model, randomStudents(model, N, SEED));
  const randomStudentsList = randomStudents(model, N, SEED);
  const extra = EXTRA_SEEDS.map(seed => summarise(model, randomStudents(model, N, seed)));
  const leftBias = summarise(model, randomStudents(model, N, SEED + 1, 0.7));
  const latent = latentStudents(model, N, SEED + 2);
  const latentSummary = summarise(model, latent.students, latent.truths);
  const patterns = [
    ['Altijd links (A)', QS.map(() => 'A')],
    ['Altijd rechts (B)', QS.map(() => 'B')],
    ['Om en om A/B', QS.map((_, i) => i % 2 ? 'B' : 'A')],
    ...D.map(d => [`Kiest altijd ${META[d].naam}, verder willekeurig`, (() => { const r = rng(SEED + D.indexOf(d)); return QS.map(q => q.a === d ? 'A' : q.b === d ? 'B' : (r() < 0.5 ? 'A' : 'B')); })()])
  ].map(([label, choices], k) => ({ label, ...runStudent(model, choices, 5 + k * 6) }));
  const comparison = compareQuestionSets(model, N, SEED);
  // Fijnmeting: alleen de telling, met veel meer klikkers, om toeval uit te sluiten.
  const FINE_N = 60000;
  const fine = Object.fromEntries(D.map(d => [d, 0]));
  { const r = rng(SEED + 7); for (let k = 0; k < FINE_N; k++) fine[model.rankProfile(QS.map(q => ({ q: q.n, c: r() < 0.5 ? 'A' : 'B' }))).order[0]]++; }

  // Harde eisen: de audit faalt als de vragenset aantoonbaar scheef is.
  if (random.chiTop1 > CHI_CRIT[5] && extra.filter(e => e.chiTop1 > CHI_CRIT[5]).length >= 2) problems.push('willekeurige klikkers: een letter komt aantoonbaar vaker bovenaan');
  const allLeft = patterns[0];
  if (new Set(D.map(d => allLeft.pct[d])).size !== 1) problems.push('altijd links geeft geen vlak profiel');
  if (D.some(d => Math.abs(fine[d] / FINE_N - 1 / 6) > 0.01)) problems.push('fijnmeting: een letter wijkt meer dan 1 procentpunt af op plek 1');
  if (random.mostShown > 0.25) problems.push(`een opleiding verschijnt bij ${pctStr(random.mostShown, 0)} van de willekeurige klikkers`);

  // 3. Markdown
  const lines = [];
  const add = (...x) => lines.push(...x);
  add('---', 'title: RIASOC model-audit (30 vragen)', `date: ${today}`, 'source: index.html', '---', '',
    '# RIASOC model-audit', '',
    `Gesimuleerd met ${N} leerlingen per groep (vaste seed ${SEED}). Opnieuw draaien: \`node tests/riasoc_model_audit.js\`.`, '',
    problems.length ? `**Uitkomst: ${problems.length} probleem/problemen**\n\n${problems.map(p => `- ${p}`).join('\n')}` : '**Uitkomst: geen problemen gevonden.**', '');

  add('## 1. Ontwerp van de vragenset', '',
    mdTable(['Controle', 'Uitkomst'], [
      ['Aantal vragen', QS.length],
      ['Fouten per vraag', questionErrors.length],
      ['Ontbrekende plaatjes', missingImages.length],
      ['Elke letter even vaak', D.map(d => `${d} ${design.total[d]}x`).join(', ')],
      ['Links / rechts per letter', D.map(d => `${d} ${design.left[d]}/${design.right[d]}`).join(', ')],
      ['Type vergelijking', `${design.types.adjacent} buren, ${design.types['skip-one']} om-en-om, ${design.types.opposite} tegenover`],
      ['Niveaufilter-testcases', niveauCases.every(c => c.ok) ? 'geslaagd' : 'MISLUKT']
    ]), '',
    'Hoe vaak staat elk tweetal tegenover elkaar:', '',
    mdTable(['', ...D], D.map(a => [`**${a}**`, ...D.map(b => a === b ? '-' : (design.pairs[[a, b].sort((x, y) => D.indexOf(x) - D.indexOf(y)).join('-')] || 0))])), '',
    mdTable(['#', 'Plaatje (oud nr.)', 'Links (A)', 'Rechts (B)', 'Type'], QS.map(q => [q.n, `${q.src}${q.swapped ? ' (omgewisseld)' : ''}${q.note ? ` (${q.note})` : ''}`, `${q.a} - ${q.lA}`, `${q.b} - ${q.lB}`, q.pairType])), '');

  add(`## 2. ${N} willekeurige klikkers`, '',
    'Wie zonder voorkeur klikt, hoort bij elke letter evenveel kans te hebben. Zo is te zien of de vragenset zelf een richting op duwt.', '',
    mdTable(['Meting', 'Uitkomst', 'Ideaal'], [
      ['Letter op plek 1', D.map(d => `${d} ${pctStr(random.top1[d] / N)}`).join(' · '), 'elk 16,7%'],
      ['Toets gelijke verdeling plek 1', `chi² = ${random.chiTop1.toFixed(1)}`, `onder ${CHI_CRIT[5]}`],
      ['Top-3 combinaties (20 mogelijk)', `${random.setCounts.filter(c => c > 0).length} komen voor; minst ${Math.min(...random.setCounts)}x, meest ${Math.max(...random.setCounts)}x`, `elk ${N / 20}x`],
      ['Toets gelijke verdeling top-3', `chi² = ${random.chiSets.toFixed(1)}`, `onder ${CHI_CRIT[19]}`],
      ['Verschillende codes (120 mogelijk)', Object.keys(random.codes).length, '-'],
      ['Samenhang tussen letters', `${random.corrMin.toFixed(2)} tot ${random.corrMax.toFixed(2)}`, 'alle rond -0,20'],
      ['Gemiddelde score per letter', D.map(d => `${d} ${random.meanPct[d].toFixed(0)}%`).join(' · '), 'elk 50%'],
      ['Gelijke stand op de grens plek 3/4', pctStr(random.boundaryTie, 0), '-'],
      ['... daarvan na tie-break nog gelijk', pctStr(random.boundaryUnresolved, 0), '-'],
      ['Vlak profiel (verschil hoogste-laagste max. 20 punten)', pctStr(random.flat, 0), '-']
    ]), '',
    `Herhaald met vijf andere seeds (${EXTRA_SEEDS.join(', ')}): chi² plek 1 = ${extra.map(e => e.chiTop1.toFixed(1)).join(', ')}; chi² top-3 = ${extra.map(e => e.chiSets.toFixed(1)).join(', ')}.`, '',
    `Fijnmeting met ${FINE_N.toLocaleString('nl-NL')} willekeurige klikkers (alleen de telling): plek 1 = ${D.map(d => `${d} ${pctStr(fine[d] / FINE_N, 2)}`).join(' · ')}.`, '');

  const suggestionRows = s => [
    ['Verschillende opleidingen getoond', `${s.uniqueProgrammes} van ${new Set(model.MBO.map(m => `${m.c} ${m.o}`)).size}`],
    ['Verschillende zestallen', `${s.uniqueSets} op ${s.n} leerlingen`],
    ['Meest getoonde opleiding', `${decode(s.progList[0][0])} (${pctStr(s.mostShown, 0)} van de leerlingen)`],
    ['Aandeel van de 10 meest getoonde', pctStr(s.top10Share, 0)],
    ['Sectoren per leerling (van 6)', s.meanFamilies.toFixed(1)],
    ['Scholen per leerling (van 6)', s.meanSchools.toFixed(1)],
    ['Gemiddelde profielmatch', pctStr(s.meanSim, 0)],
    ['Hoofdletter opleiding zit in top 3 van leerling', pctStr(s.inTop3, 0)],
    ['Hoofdletter opleiding zit in top 2 van leerling', pctStr(s.inTop2, 0)],
    ['Hoofdletter opleiding hoort bij de 2 laagste letters', pctStr(s.inBottom2, 0)]
  ];
  add('### Opleidingen bij deze groep', '', mdTable(['Meting', 'Uitkomst'], suggestionRows(random)), '',
    'Verdeling over sectoren (aandeel van alle getoonde opleidingen):', '',
    mdTable(['Sector', 'Getoond', 'Aandeel in aanbod'], Object.entries(random.families).sort((a, b) => b[1] - a[1]).map(([f, c]) => [f, pctStr(c / random.total, 0), pctStr(model.MBO.filter(m => model.sectorFamily(m) === f).length / model.MBO.length, 0)])), '',
    'Vaakst getoond:', '',
    mdTable(['Opleiding', 'Bij % van de leerlingen'], random.progList.slice(0, 12).map(([o, c]) => [decode(o), pctStr(c / N, 0)])), '');

  add('## 3. Kant-klikkers en vaste patronen', '',
    'Elke letter staat 5x links en 5x rechts. Wie steeds dezelfde kant kiest krijgt daardoor een vlak profiel en een waarschuwing, geen schijnprofiel.', '',
    mdTable(['Patroon', ...D, 'Code', 'Melding'], patterns.map(p => {
      const q = model.profileQuality(p.pct, p.answers);
      return [p.label, ...D.map(d => `${p.pct[d]}%`), p.meta.code, q.oneSided ? 'zelfde kant' : q.flat ? 'vlak profiel' : '-'];
    })), '',
    `${N} klikkers met een voorkeur voor links (70% links): plek 1 = ${D.map(d => `${d} ${pctStr(leftBias.top1[d] / N)}`).join(' · ')}; chi² = ${leftBias.chiTop1.toFixed(1)} (grens ${CHI_CRIT[5]}).`, '');

  const rec = latentSummary.recovery;
  add(`## 4. ${N} leerlingen met een echte voorkeur`, '',
    'Elke gesimuleerde leerling heeft verborgen voorkeuren voor de zes letters (met de samenhang van de zeshoek van Holland) en kiest per plaatje met een kans die van het verschil afhangt. Elk plaatje is daarnaast voor iedereen iets aantrekkelijker of saaier dan bedoeld. De vraag is of de test de verborgen voorkeur terugvindt.', '',
    mdTable(['Meting', 'Uitkomst'], [
      ['Sterkste letter goed gevonden', pctStr(rec.hit1, 0)],
      ['Overlap gevonden top 3 met echte top 3', `${rec.overlap.toFixed(2)} van 3`],
      ['Rangcorrelatie gemeten en echt profiel', rec.rho.toFixed(2)],
      ['Gelijke stand op de grens plek 3/4', pctStr(latentSummary.boundaryTie, 0)],
      ['... daarvan na tie-break nog gelijk', pctStr(latentSummary.boundaryUnresolved, 0)],
      ['Verschillende codes (120 mogelijk)', Object.keys(latentSummary.codes).length],
      ['Hoofdletter opleiding zit in echte top 3 van leerling', pctStr(rec.sugTrueTop3, 0)]
    ]), '', '### Opleidingen bij deze groep', '', mdTable(['Meting', 'Uitkomst'], suggestionRows(latentSummary)), '');

  add('## 5. Oude en nieuwe vragenset naast elkaar', '',
    'Alleen de telling van de vragen, zonder opleidingen. Gelijke stand is hier met het lot beslist.', '',
    mdTable(['Meting', ...comparison.map(c => c.label)], [
      ['Willekeurig: letter op plek 1', ...comparison.map(c => D.map(d => `${d} ${pctStr(c.top1[d] / N, 0)}`).join(' '))],
      ['Willekeurig: chi² plek 1 (grens 11,07)', ...comparison.map(c => c.chiTop1.toFixed(1))],
      ['Willekeurig: top-3 combinatie minst / meest', ...comparison.map(c => `${c.tripleMin} / ${c.tripleMax}`)],
      ['Willekeurig: chi² top-3 (grens 30,14)', ...comparison.map(c => c.chiSets.toFixed(1))],
      ['Samenhang tussen letters', ...comparison.map(c => `${c.corrMin.toFixed(2)} tot ${c.corrMax.toFixed(2)}`)],
      ['Altijd links: score per letter', ...comparison.map(c => D.map(d => `${d} ${c.allLeft[d].toFixed(0)}`).join(' '))],
      ['Echte voorkeur: sterkste letter goed', ...comparison.map(c => pctStr(c.hit1, 0))],
      ['Echte voorkeur: overlap top 3', ...comparison.map(c => `${c.overlap.toFixed(2)} van 3`)],
      ['Echte voorkeur: rangcorrelatie', ...comparison.map(c => c.rho.toFixed(2))]
    ]), '');

  add('## 6. Profielcorrectie opleidingen', '',
    mdTable(['Categorie', 'Aantal'], [...Object.entries(model.MBO_CORRECTIONS).sort((a, b) => b[1] - a[1]), ['eigen dossierprofiel (geen correctie)', model.MBO.filter(m => !m.modelCategory).length]]), '',
    `Verschillende RIASOC-profielen in de dataset: ${new Set(model.MBO.map(m => D.map(d => m.sc[d]).join(','))).size} op ${model.MBO.length} opleidingen. Zie \`riasoc_classificatie_dump.csv\`.`, '');

  fs.mkdirSync(outputDir, { recursive: true });
  fs.writeFileSync(path.join(outputDir, 'riasoc_model_audit.md'), lines.join('\n') + '\n');

  // 4. CSV's
  const simHead = ['leerling', 'vmbo', 'antwoorden', ...D, 'code', 'grens_gelijk', 'beslist_door', ...[1, 2, 3, 4, 5, 6].flatMap(i => [`opleiding_${i}`, `match_${i}`, `sector_${i}`, `school_${i}`])];
  const simRows = randomStudentsList.map((st, k) => [k + 1, st.track, model.answerKey(st.answers), ...D.map(d => st.pct[d]), st.meta.code, st.meta.boundary.tied ? 'ja' : 'nee', st.meta.boundary.decidedBy,
    ...st.suggestions.flatMap(m => [decode(m.o), model.matchPct(m), model.sectorFamily(m), model.selectedProvider(m).school])]);
  fs.writeFileSync(path.join(outputDir, `riasoc_simulatie_${N}_willekeurig.csv`), [simHead, ...simRows].map(r => r.map(csvCell).join(',')).join('\n') + '\n');

  const dumpHead = ['crebo', 'opleiding', 'school', 'sector', 'categorie', ...D, 'code'];
  const dumpRows = model.MBO.map(m => [m.c, decode(m.o), decode(m.s), model.sectorFamily(m), m.modelCategory || '', ...D.map(d => m.sc[d]), m.code]);
  fs.writeFileSync(path.join(outputDir, 'riasoc_classificatie_dump.csv'), [dumpHead, ...dumpRows].map(r => r.map(csvCell).join(',')).join('\n') + '\n');

  console.log(JSON.stringify({
    vragen: QS.length, problemen: problems,
    willekeurig: { plek1: random.top1, chi2: +random.chiTop1.toFixed(1), opleidingen: random.uniqueProgrammes, meestGetoond: +random.mostShown.toFixed(3), hoofdletterInTop3: +random.inTop3.toFixed(3) },
    echteVoorkeur: { sterksteLetterGoed: +rec.hit1.toFixed(3), overlapTop3: +rec.overlap.toFixed(2), rangcorrelatie: +rec.rho.toFixed(3) }
  }, null, 2));
  if (problems.length) process.exitCode = 1;
}

main();

#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const repoRoot = path.resolve(__dirname, '..');
const htmlPath = path.join(repoRoot, 'index.html');
const outputDir = path.join(__dirname, 'output');
const outputPath = path.join(outputDir, 'riasoc_model_audit.md');

function loadModel() {
  const html = fs.readFileSync(htmlPath, 'utf8');
  const scripts = [...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi)]
    .map(match => match[1])
    .filter(script => script.includes('const QS=') && script.includes('const MBO='));

  if (scripts.length !== 1) {
    throw new Error(`Kon de applicatie-scriptbron niet eenduidig vinden: ${scripts.length} scripts gevonden.`);
  }

  const context = {
    console,
    setTimeout,
    clearTimeout,
    Date,
    Math,
    window: {},
    document: {
      querySelectorAll: () => [],
      getElementById: () => ({
        classList: { add() {}, remove() {} },
        style: {},
        value: '',
        textContent: '',
        innerHTML: '',
        appendChild() {},
        getContext: () => ({})
      }),
      createElement: () => ({ style: {}, appendChild() {}, setAttribute() {} })
    },
    Chart: function Chart() { return { destroy() {} }; },
    fetch: async () => ({ ok: true })
  };
  context.window = context.window;

  const exportScript = `
    window.__RIASOC_AUDIT__ = {
      IMG, QS, D, META, CAREER_IDEAS, MBO, MBO_CORRECTIONS,
      maxSc, norm, topCodeMeta, topCode, validateQuestions,
      validateNiveauMatchCases, extractNiveaus, niveauMatch,
      selectedProvider, selectSuggestions, mboDomainForSelection, matchPct,
      setAllowedLevels(levels){ S.allowedLevels = levels.slice(); },
      getAllowedLevels(){ return S.allowedLevels.slice(); }
    };
  `;

  vm.runInNewContext(`${scripts[0]}\n${exportScript}`, context, { filename: htmlPath });
  return context.window.__RIASOC_AUDIT__;
}

function emptyScores(D) {
  return Object.fromEntries(D.map(d => [d, 0]));
}

function addWeights(scores, weights, D) {
  D.forEach(d => {
    scores[d] += weights[d] || 0;
  });
}

function totalWeight(weights, dims) {
  return dims.reduce((sum, d) => sum + (weights[d] || 0), 0);
}

function pickForTarget(q, target, D) {
  const a = totalWeight(q.wA, target);
  const b = totalWeight(q.wB, target);
  if (a !== b) return a > b ? 'A' : 'B';

  const targetSet = new Set(target);
  const aNoise = D.filter(d => !targetSet.has(d)).reduce((sum, d) => sum + (q.wA[d] || 0), 0);
  const bNoise = D.filter(d => !targetSet.has(d)).reduce((sum, d) => sum + (q.wB[d] || 0), 0);
  if (aNoise !== bNoise) return aNoise < bNoise ? 'A' : 'B';

  return q.n % 2 === 0 ? 'A' : 'B';
}

function scoreScenario(model, targetDims, label) {
  const scores = emptyScores(model.D);
  const answers = [];
  model.QS.forEach(q => {
    const choice = pickForTarget(q, targetDims, model.D);
    answers.push(choice);
    addWeights(scores, choice === 'A' ? q.wA : q.wB, model.D);
  });
  return { label, targetDims, answers, raw: scores };
}

function scoreAnswerPattern(model, label, chooser) {
  const scores = emptyScores(model.D);
  const answers = [];
  model.QS.forEach((q, i) => {
    const choice = chooser(q, i);
    answers.push(choice);
    addWeights(scores, choice === 'A' ? q.wA : q.wB, model.D);
  });
  return { label, targetDims: [], answers, raw: scores };
}

function seededRandom(seed) {
  let x = seed >>> 0;
  return () => {
    x = (1664525 * x + 1013904223) >>> 0;
    return x / 4294967296;
  };
}

function analyzeScenario(model, scenario, allowedLevels = [2, 3, 4]) {
  model.setAllowedLevels(allowedLevels);
  const normalized = model.norm(scenario.raw);
  const meta = model.topCodeMeta(normalized);
  const suggestions = model.selectSuggestions(normalized, meta.code, 6);
  const ordered = model.D.slice().sort((a, b) => normalized[b] - normalized[a] || model.D.indexOf(a) - model.D.indexOf(b));
  const gaps = {
    top1Top2: normalized[ordered[0]] - normalized[ordered[1]],
    top2Top3: normalized[ordered[1]] - normalized[ordered[2]],
    top3Top4: normalized[ordered[2]] - normalized[ordered[3]]
  };
  const providerRows = suggestions.map(m => {
    const provider = model.selectedProvider(m);
    return {
      dim: m.dim,
      opleiding: m.o,
      crebo: m.c,
      school: provider.school,
      locatie: provider.location,
      niveau: provider.level,
      leerweg: provider.learning,
      url: provider.url || m.url || '',
      match: model.matchPct(m)
    };
  });

  return {
    ...scenario,
    allowedLevels,
    normalized,
    meta,
    ordered,
    gaps,
    careerIdeaCount: meta.code.split('').slice(0, 3).reduce((sum, d) => sum + ((model.CAREER_IDEAS[d] || []).length), 0),
    suggestions: providerRows,
    uniqueSuggestionNames: new Set(providerRows.map(x => x.opleiding.toLowerCase())).size,
    uniqueSchools: new Set(providerRows.map(x => x.school.toLowerCase())).size,
    suggestionDims: providerRows.map(x => x.dim)
  };
}

function makeScenarios(model) {
  const scenarios = [];
  model.D.forEach(d => scenarios.push(scoreScenario(model, [d], `Zuiver ${d} (${model.META[d].naam})`)));

  const pairs = ['RI', 'IA', 'AS', 'SO', 'OC', 'CR', 'RS', 'IO', 'AC', 'RO', 'IC', 'SA'];
  pairs.forEach(pair => scenarios.push(scoreScenario(model, pair.split(''), `Combinatie ${pair}`)));

  ['RIA', 'IAS', 'ASO', 'SOC', 'OCR', 'CRI', 'SIC', 'AIC', 'OSC'].forEach(code => {
    scenarios.push(scoreScenario(model, code.split(''), `Top-3 ${code}`));
  });

  scenarios.push(scoreAnswerPattern(model, 'Alle A-antwoorden', () => 'A'));
  scenarios.push(scoreAnswerPattern(model, 'Alle B-antwoorden', () => 'B'));
  scenarios.push(scoreAnswerPattern(model, 'Om-en-om A/B', (_q, i) => i % 2 === 0 ? 'A' : 'B'));
  scenarios.push(scoreAnswerPattern(model, 'Om-en-om B/A', (_q, i) => i % 2 === 0 ? 'B' : 'A'));

  return scenarios;
}

function randomAudit(model, count = 1000) {
  const topCodeCounts = {};
  const top1Counts = Object.fromEntries(model.D.map(d => [d, 0]));
  const tinyGapCases = [];
  const suggestionSets = {};
  const random = seededRandom(20260501);

  for (let i = 0; i < count; i++) {
    const scenario = scoreAnswerPattern(model, `Random ${i + 1}`, () => random() < 0.5 ? 'A' : 'B');
    const analysis = analyzeScenario(model, scenario);
    topCodeCounts[analysis.meta.code] = (topCodeCounts[analysis.meta.code] || 0) + 1;
    top1Counts[analysis.meta.code[0]] += 1;
    if (analysis.gaps.top1Top2 <= 2 || analysis.gaps.top2Top3 <= 2 || analysis.gaps.top3Top4 <= 2 || analysis.meta.hasTie) {
      tinyGapCases.push({
        label: analysis.label,
        code: analysis.meta.code,
        scores: analysis.normalized,
        gaps: analysis.gaps,
        ties: analysis.meta.exactTies
      });
    }
    const suggestionKey = analysis.suggestions.map(s => `${s.opleiding}|${s.school}`).join(' / ');
    suggestionSets[suggestionKey] = (suggestionSets[suggestionKey] || 0) + 1;
  }

  return {
    count,
    uniqueTopCodes: Object.keys(topCodeCounts).length,
    topCodeCounts,
    top1Counts,
    tinyGapCount: tinyGapCases.length,
    tinyGapExamples: tinyGapCases.slice(0, 8),
    uniqueSuggestionSets: Object.keys(suggestionSets).length,
    mostCommonSuggestionSets: Object.entries(suggestionSets)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([set, n]) => ({ n, set }))
  };
}

function table(rows, headers) {
  const head = `| ${headers.join(' | ')} |`;
  const sep = `| ${headers.map(() => '---').join(' | ')} |`;
  const body = rows.map(row => `| ${headers.map(h => String(row[h] ?? '').replace(/\|/g, '\\|')).join(' | ')} |`);
  return [head, sep, ...body].join('\n');
}

function scoreText(model, scores) {
  return model.D.map(d => `${d} ${scores[d]}%`).join(', ');
}

function renderReport(model, analyses, random) {
  const now = new Date().toISOString().slice(0, 10);
  const validation = model.validateQuestions();
  const validationErrors = validation.filter(x => x.status !== 'ok');
  const niveauCases = model.validateNiveauMatchCases();
  const smallGapAnalyses = analyses.filter(a => a.gaps.top1Top2 <= 2 || a.gaps.top2Top3 <= 2 || a.gaps.top3Top4 <= 2 || a.meta.hasTie);
  const weakDiversity = analyses.filter(a => a.uniqueSuggestionNames < 6 || new Set(a.suggestionDims).size < Math.min(3, a.meta.code.length));

  const summaryRows = analyses.map(a => ({
    Scenario: a.label,
    Code: a.meta.code,
    Scores: scoreText(model, a.normalized),
    Gaps: `${a.gaps.top1Top2}/${a.gaps.top2Top3}/${a.gaps.top3Top4}`,
    Beroepen: a.careerIdeaCount,
    Opleidingen: `${a.uniqueSuggestionNames}/6`,
    Scholen: a.uniqueSchools,
    Dimensies: [...new Set(a.suggestionDims)].join('')
  }));

  const suggestionRows = analyses.slice(0, 12).flatMap(a => a.suggestions.map((s, index) => ({
    Scenario: a.label,
    Nr: index + 1,
    Dim: s.dim,
    Opleiding: s.opleiding,
    School: s.school,
    Locatie: s.locatie,
    Match: `${s.match}%`
  })));

  const topCodes = Object.entries(random.topCodeCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 15)
    .map(([Code, Aantal]) => ({ Code, Aantal }));

  return `---
title: RIASOC model-audit
date: ${now}
source: index.html
---

# RIASOC model-audit

Deze audit draait rechtstreeks op de HTML/JS-bron van de MBO Opleidingen Verkenner. Het script simuleert antwoordpatronen, gebruikt dezelfde normalisatie, tie-detectie, niveaufiltering en opleidingsselectie als de website, en maakt zichtbaar of het model voldoende differentieert.

## Conclusie

- Vraagvalidatie: ${validationErrors.length === 0 ? 'geslaagd' : `${validationErrors.length} fouten gevonden`}.
- Niveau-testcases: ${niveauCases.every(x => x.ok) ? 'geslaagd' : 'niet allemaal geslaagd'}.
- Scenario's getest: ${analyses.length}.
- Random simulaties: ${random.count}.
- Unieke topcodes in random simulaties: ${random.uniqueTopCodes}.
- Unieke sets van 6 opleidingen in random simulaties: ${random.uniqueSuggestionSets}.
- Scenario's met kleine verschillen of ties: ${smallGapAnalyses.length}.
- Scenario's met mogelijke diversiteitszwakte in de 6 opleidingen: ${weakDiversity.length}.

Beoordeling: ${validationErrors.length === 0 && niveauCases.every(x => x.ok) && random.uniqueTopCodes >= 20 && random.uniqueSuggestionSets >= 50 && weakDiversity.length <= 3 ? 'de diversiteit en werking zijn op hoofdlijnen gezond. Kleine verschillen worden zichtbaar via de tie/gap-informatie en leiden niet tot één vaste standaarduitkomst.' : 'er zijn aandachtspunten; bekijk vooral de tabellen met kleine verschillen en mogelijke diversiteitszwakte.'}

## Gecontroleerde methode

1. De audit laadt \`index.html\` en exporteert de bestaande modeldata en functies in een Node VM-context.
2. Per testprofiel worden 62 keuzes gesimuleerd.
3. Ruwe RIASOC-punten worden genormaliseerd met \`norm()\`.
4. De topcode en tie-informatie komen uit \`topCodeMeta()\`.
5. De 6 opleidingen komen uit \`selectSuggestions()\`.
6. School en locatie worden bepaald met \`selectedProvider()\`, dus ook de Zuid-Holland-voorkeur wordt getest.

## Scenario-overzicht

${table(summaryRows, ['Scenario', 'Code', 'Scores', 'Gaps', 'Beroepen', 'Opleidingen', 'Scholen', 'Dimensies'])}

## Voorbeeldsuggesties

Alle suggesties hieronder zijn de eerste 12 scenario's uit de audit. Dit is bedoeld als steekproef om te zien of de concrete opleidingen niet steeds uit dezelfde school of categorie komen.

${table(suggestionRows, ['Scenario', 'Nr', 'Dim', 'Opleiding', 'School', 'Locatie', 'Match'])}

## Random simulaties

### Topcode-spreiding

${table(topCodes, ['Code', 'Aantal'])}

### Eerste dimensie

${table(Object.entries(random.top1Counts).map(([Dimensie, Aantal]) => ({ Dimensie, Aantal })), ['Dimensie', 'Aantal'])}

### Kleine verschillen

- Aantal random cases met top-gaps van 2 punten of minder, of exacte ties: ${random.tinyGapCount}.
- Voorbeelden:

${random.tinyGapExamples.map(x => `- ${x.label}: ${x.code}, ${scoreText(model, x.scores)}, gaps ${x.gaps.top1Top2}/${x.gaps.top2Top3}/${x.gaps.top3Top4}`).join('\n') || '- Geen voorbeelden.'}

### Meest voorkomende opleidingensets

${random.mostCommonSuggestionSets.map(x => `- ${x.n}x: ${x.set}`).join('\n')}

## Validatievragen

${validationErrors.length ? validationErrors.map(x => `- Q${x.n}: ${x.problems.join('; ')}`).join('\n') : '- Alle 62 vragen zijn valide.'}

## Niveau-testcases

${table(niveauCases.map(x => ({
  Input: x.input,
  Levels: x.levels.join(','),
  Parsed: x.parsed.join(','),
  Expected: x.expected,
  Actual: x.actual,
  OK: x.ok
})), ['Input', 'Levels', 'Parsed', 'Expected', 'Actual', 'OK'])}

## Mogelijke vervolgchecks

- Bespreek scenario's met kleine gaps als brede profielen, niet als harde rangorde.
- Controleer bij toekomstige MBO-data of \`random.uniqueSuggestionSets\` hoog blijft.
- Kijk handmatig naar scenario's waar minder dan drie dimensies terugkomen in de zes opleidingen.
- Herhaal deze audit na elke inhoudelijke wijziging in vragen, wegingen of MBO-records.
`;
}

function main() {
  const model = loadModel();
  fs.mkdirSync(outputDir, { recursive: true });

  const analyses = makeScenarios(model).map(s => analyzeScenario(model, s));
  const random = randomAudit(model, 1000);
  const report = renderReport(model, analyses, random);
  fs.writeFileSync(outputPath, report, 'utf8');

  const validationErrors = model.validateQuestions().filter(x => x.status !== 'ok').length;
  const niveauOk = model.validateNiveauMatchCases().every(x => x.ok);
  const smallGapCount = analyses.filter(a => a.gaps.top1Top2 <= 2 || a.gaps.top2Top3 <= 2 || a.gaps.top3Top4 <= 2 || a.meta.hasTie).length;

  console.log(JSON.stringify({
    report: outputPath,
    scenarios: analyses.length,
    randomRuns: random.count,
    validationErrors,
    niveauOk,
    uniqueTopCodes: random.uniqueTopCodes,
    uniqueSuggestionSets: random.uniqueSuggestionSets,
    scenarioSmallGaps: smallGapCount,
    randomSmallGaps: random.tinyGapCount
  }, null, 2));
}

main();

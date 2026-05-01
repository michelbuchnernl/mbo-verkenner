#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const repoRoot = path.resolve(__dirname, '..');
const htmlPath = process.env.RIASOC_HTML_PATH
  ? path.resolve(process.env.RIASOC_HTML_PATH)
  : path.join(repoRoot, 'index.html');
const outputDir = process.env.RIASOC_OUTPUT_DIR
  ? path.resolve(process.env.RIASOC_OUTPUT_DIR)
  : path.join(__dirname, 'output');
const outputPrefix = process.env.RIASOC_OUTPUT_PREFIX ? `${process.env.RIASOC_OUTPUT_PREFIX}_` : '';
const outputPath = path.join(outputDir, `${outputPrefix}riasoc_model_audit.md`);
const simulationCsvPath = path.join(outputDir, `${outputPrefix}riasoc_50_simulaties.csv`);
const classificationCsvPath = path.join(outputDir, `${outputPrefix}riasoc_classificatie_dump.csv`);

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
      createElement: tag => {
        const tagName = String(tag).toLowerCase();
        if (tagName === 'textarea' || tagName === 'div') {
          return {
            value: '',
            textContent: '',
            innerText: '',
            set innerHTML(value) {
              const decoded = String(value || '')
                .replace(/&#8211;/g, '-')
                .replace(/&#232;/g, 'e')
                .replace(/&#246;/g, 'o')
                .replace(/&amp;/g, '&');
              this.value = decoded;
              this.textContent = decoded;
              this.innerText = decoded;
            },
            get innerHTML() { return this.value; },
            style: {},
            appendChild() {},
            setAttribute() {}
          };
        }
        return { style: {}, appendChild() {}, setAttribute() {} };
      }
    },
    Chart: function Chart() { return { destroy() {} }; },
    fetch: async () => ({ ok: true })
  };
  context.window = context.window;

  const exportScript = `
    const __fallbackMatchPct = typeof matchPct === 'function'
      ? matchPct
      : (m) => Math.round((m.sim || 0) * 100);
    window.__RIASOC_AUDIT__ = {
      IMG, QS, D, META, CAREER_IDEAS, MBO,
      MBO_CORRECTIONS: typeof MBO_CORRECTIONS !== 'undefined' ? MBO_CORRECTIONS : {},
      maxSc, norm, topCodeMeta, topCode, validateQuestions,
      validateNiveauMatchCases, extractNiveaus, niveauMatch,
      selectedProvider, selectSuggestions, mboDomainForSelection, matchPct: __fallbackMatchPct,
      sectorFamily: typeof sectorFamily === 'function' ? sectorFamily : null,
      opleidingStam: typeof opleidingStam === 'function' ? opleidingStam : null,
      dominantLetters: typeof dominantLetters === 'function' ? dominantLetters : null,
      dedupeScored: typeof dedupeScored === 'function' ? dedupeScored : null,
      setAllowedLevels(levels){ S.allowedLevels = levels.slice(); },
      getAllowedLevels(){ return S.allowedLevels.slice(); }
    };
  `;

  vm.runInNewContext(`${scripts[0]}\n${exportScript}`, context, { filename: htmlPath });
  return context.window.__RIASOC_AUDIT__;
}

function decodeText(value) {
  return String(value || '')
    .replace(/&#8211;/g, '-')
    .replace(/&#232;/g, 'e')
    .replace(/&#246;/g, 'o')
    .replace(/&amp;/g, '&');
}

function fallbackSectorFamily(m) {
  const text = decodeText(`${m.o} ${(m.b || []).join(' ')} ${m.s}`).toLowerCase();
  if (/dier|paraveterinair|groen|hovenier|natuur|water|voeding|vapro|agrar/.test(text)) return 'Voeding, natuur & dier';
  if (/verpleeg|verzorg|dokters|apotheek|apothekers|pedagog|onderwijsassistent|kinderopvang|sociaal werker|maatschappelijke zorg|begeleider|zorg en welzijn|helpende/.test(text)) return 'Zorg & welzijn';
  if (/sport|bewegings|buurtsport|leefstijlcoach|onderwijs/.test(text)) return 'Onderwijs & sport';
  if (/bouw|infra|asfalt|autoschade|timmer|metsel|install|elektro|metaal|monteur|technicus elektrotechn|technicus gas|technicus elektric|engineering|mechatronica|voertuig|fiets|hout|meubel|schilder|stukadoor|juwelier|goudsmid|uurwerk|piano|keuken|smart building|productietechniek/.test(text)) return 'Techniek & maken';
  if (/schoonheid|kapper|barbier|hairstylist|beauty|fashion|tailor/.test(text)) return 'Uiterlijke verzorging';
  if (/software|developer|applicatie|ict|cyber|system engineer|support technician|beheerder|data/.test(text)) return 'ICT & data';
  if (/media|mediavorm|mediamaker|redactie|fotografie|av-|podium|sign|immersive|interieuradviseur|styling|vormgeving|ruimtemaker|decor|muziek|dance|musical|creatief/.test(text)) return 'Creatief & media';
  if (/hospitality|toerisme|tourism|hotel|gastheer|gastvrouw|leisure|event|evenement|bar|kok|food|bakker|boulanger|patissier|horeca/.test(text)) return 'Horeca & toerisme';
  if (/commerc|account|sales|marketing|retail|intercedent|ondernemer|manager|leidinggevende|transport en logistiek/.test(text)) return 'Commercieel & ondernemend';
  if (/administr|jurid|business services|office|finance|hr|control|secretar/.test(text)) return 'Administratie & juridisch';
  if (/logistiek|transport|chauffeur|warehouse|voorraad/.test(text)) return 'Logistiek & transport';
  if (/veilig|beveil|handhaver|militair|veva|defensie/.test(text)) return 'Veiligheid & defensie';
  if (/labor|analist|onderzoek|research|instrumentmaker/.test(text)) return 'Laboratorium & onderzoek';
  return 'Overig';
}

function familyFor(model, m) {
  return model.sectorFamily ? model.sectorFamily(m) : fallbackSectorFamily(m);
}

function stemFor(model, m) {
  if (model.opleidingStam) return model.opleidingStam(m);
  return decodeText(m.o)
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/\([^)]*\)/g, ' ')
    .replace(/\b(010|allround|junior|senior|eerste|zelfstandig|leidinggevende|versneld|verkort|kopjaar|praktijkroute|structuurklas|niveau|bbl|bol|nt2|veva|defensie|i\.s\.m\.|ism)\b/g, ' ')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
    .split(' ')
    .filter(Boolean)
    .slice(0, 4)
    .join(' ');
}

function dominantLettersFor(model, m) {
  if (model.dominantLetters) return model.dominantLetters(m);
  return model.D.slice()
    .sort((a, b) => (m.sc[b] || 0) - (m.sc[a] || 0) || model.D.indexOf(a) - model.D.indexOf(b))
    .slice(0, 2);
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
      family: familyFor(model, m),
      school: provider.school,
      locatie: provider.location,
      niveau: provider.level,
      leerweg: provider.learning,
      url: provider.url || m.url || '',
      match: model.matchPct(m),
      sim: m.sim || 0
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
    uniqueFamilies: new Set(providerRows.map(x => x.family)).size,
    suggestionDims: providerRows.map(x => x.dim)
  };
}

function combos(items, size) {
  if (size === 0) return [[]];
  if (items.length < size) return [];
  const [head, ...tail] = items;
  return [
    ...combos(tail, size - 1).map(rest => [head, ...rest]),
    ...combos(tail, size)
  ];
}

function makeScenarios(model) {
  const scenarios = [];
  model.D.forEach(d => scenarios.push(scoreScenario(model, [d], `Zuiver ${d} (${model.META[d].naam})`)));

  combos(model.D, 2).forEach(pair => {
    const code = pair.join('');
    scenarios.push(scoreScenario(model, pair, `Combinatie ${code}`));
  });

  combos(model.D, 3).forEach(triple => {
    const code = triple.join('');
    scenarios.push(scoreScenario(model, triple, `Top-3 ${code}`));
  });

  scenarios.push(scoreAnswerPattern(model, 'Alle A-antwoorden', () => 'A'));
  scenarios.push(scoreAnswerPattern(model, 'Alle B-antwoorden', () => 'B'));
  scenarios.push(scoreAnswerPattern(model, 'Om-en-om A/B', (_q, i) => i % 2 === 0 ? 'A' : 'B'));
  scenarios.push(scoreAnswerPattern(model, 'Om-en-om B/A', (_q, i) => i % 2 === 0 ? 'B' : 'A'));

  const random = seededRandom(6200501);
  for (let i = 0; i < 5; i++) {
    scenarios.push(scoreAnswerPattern(model, `Seeded random ${i + 1}`, () => random() < 0.5 ? 'A' : 'B'));
  }

  if (scenarios.length !== 50) {
    throw new Error(`Audit verwacht precies 50 scenario's, maar kreeg ${scenarios.length}.`);
  }

  return scenarios;
}

function randomAudit(model, count = 1000) {
  const topCodeCounts = {};
  const top1Counts = Object.fromEntries(model.D.map(d => [d, 0]));
  const tinyGapCases = [];
  const suggestionSets = {};
  const positionMatchSums = Array(6).fill(0);
  const positionCounts = Array(6).fill(0);
  let pos6RatioSum = 0;
  let pos6RatioCount = 0;
  let pos6Below65Count = 0;
  let sTop2Count = 0;
  let sTop2CareCount = 0;
  let sTop2EducationSportCount = 0;
  let sTop2EitherCount = 0;
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

    analysis.suggestions.forEach((s, index) => {
      positionMatchSums[index] += s.match;
      positionCounts[index] += 1;
    });
    const firstMatch = analysis.suggestions[0]?.match || 0;
    const sixthMatch = analysis.suggestions[5]?.match || 0;
    if (firstMatch > 0 && sixthMatch > 0) {
      const ratio = sixthMatch / firstMatch;
      pos6RatioSum += ratio;
      pos6RatioCount += 1;
      if (ratio < 0.65) pos6Below65Count += 1;
    }
    if (analysis.normalized.S >= 60 && analysis.ordered.slice(0, 2).includes('S')) {
      sTop2Count += 1;
      const families = new Set(analysis.suggestions.map(s => s.family));
      if (families.has('Zorg & welzijn')) sTop2CareCount += 1;
      if (families.has('Onderwijs & sport')) sTop2EducationSportCount += 1;
      if (families.has('Zorg & welzijn') || families.has('Onderwijs & sport')) sTop2EitherCount += 1;
    }
  }

  return {
    count,
    uniqueTopCodes: Object.keys(topCodeCounts).length,
    topCodeCounts,
    top1Counts,
    tinyGapCount: tinyGapCases.length,
    tinyGapExamples: tinyGapCases.slice(0, 8),
    uniqueSuggestionSets: Object.keys(suggestionSets).length,
    averageMatchByPosition: positionMatchSums.map((sum, index) => positionCounts[index] ? Math.round((sum / positionCounts[index]) * 10) / 10 : 0),
    averagePos6ToPos1Ratio: pos6RatioCount ? Math.round((pos6RatioSum / pos6RatioCount) * 1000) / 1000 : 0,
    pos6Below65Count,
    sTop2Coverage: {
      cases: sTop2Count,
      zorgWelzijn: sTop2CareCount,
      onderwijsSport: sTop2EducationSportCount,
      either: sTop2EitherCount
    },
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

function csvEscape(value) {
  const s = String(value ?? '');
  return /[",\n;]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

function writeSimulationCsv(analyses) {
  const baseHeaders = [
    'scenario_id', 'scenario', 'target_dims', 'answer_pattern',
    'R', 'I', 'A', 'S', 'O', 'C',
    'topcode', 'gap_1_2', 'gap_2_3', 'gap_3_4',
    'unique_families', 'unique_schools'
  ];
  const suggestionHeaders = [];
  for (let i = 1; i <= 6; i++) {
    suggestionHeaders.push(
      `opleiding_${i}`, `crebo_${i}`, `dim_${i}`, `family_${i}`,
      `school_${i}`, `locatie_${i}`, `niveau_${i}`, `match_${i}`, `sim_${i}`, `url_${i}`
    );
  }
  const headers = [...baseHeaders, ...suggestionHeaders];
  const rows = analyses.map((a, index) => {
    const row = {
      scenario_id: index + 1,
      scenario: a.label,
      target_dims: a.targetDims.join(''),
      answer_pattern: a.answers.join(''),
      R: a.normalized.R,
      I: a.normalized.I,
      A: a.normalized.A,
      S: a.normalized.S,
      O: a.normalized.O,
      C: a.normalized.C,
      topcode: a.meta.code,
      gap_1_2: a.gaps.top1Top2,
      gap_2_3: a.gaps.top2Top3,
      gap_3_4: a.gaps.top3Top4,
      unique_families: a.uniqueFamilies,
      unique_schools: a.uniqueSchools
    };
    a.suggestions.forEach((s, i) => {
      const n = i + 1;
      row[`opleiding_${n}`] = s.opleiding;
      row[`crebo_${n}`] = s.crebo;
      row[`dim_${n}`] = s.dim;
      row[`family_${n}`] = s.family;
      row[`school_${n}`] = s.school;
      row[`locatie_${n}`] = s.locatie;
      row[`niveau_${n}`] = s.niveau;
      row[`match_${n}`] = s.match;
      row[`sim_${n}`] = s.sim.toFixed(4);
      row[`url_${n}`] = s.url;
    });
    return row;
  });
  const csv = [
    headers.map(csvEscape).join(','),
    ...rows.map(row => headers.map(h => csvEscape(row[h])).join(','))
  ].join('\n');
  fs.writeFileSync(simulationCsvPath, csv, 'utf8');
}

function classificationRows(model) {
  return model.MBO.map(m => ({
    crebo: m.c,
    opleiding: decodeText(m.o),
    school: decodeText(m.s),
    family: familyFor(model, m),
    stem: stemFor(model, m),
    dominantLetters: dominantLettersFor(model, m).join(''),
    modelCategory: m.modelCategory || ''
  }));
}

function writeClassificationCsv(model) {
  const headers = ['crebo', 'opleiding', 'school', 'family', 'stem', 'dominantLetters', 'modelCategory'];
  const rows = classificationRows(model);
  const csv = [
    headers.map(csvEscape).join(','),
    ...rows.map(row => headers.map(h => csvEscape(row[h])).join(','))
  ].join('\n');
  fs.writeFileSync(classificationCsvPath, csv, 'utf8');
  return rows;
}

function classificationAudit(rows) {
  const warnings = [];
  const stemCounts = {};
  rows.forEach(row => {
    increment(stemCounts, row.stem || '(leeg)');
    const text = `${row.opleiding} ${row.school}`.toLowerCase();
    if (/dierverzorg|dier en|paraveterinair/.test(text) && row.family === 'Zorg & welzijn') {
      warnings.push({ Type: 'false-positive', Opleiding: row.opleiding, Family: row.family, Verwacht: 'Voeding, natuur & dier' });
    }
    if (/autoschade|asfalt|metsel/.test(text) && row.family !== 'Techniek & maken') {
      warnings.push({ Type: 'false-positive', Opleiding: row.opleiding, Family: row.family, Verwacht: 'Techniek & maken' });
    }
    if (/verpleeg|verzorgende|dokters|apotheek|apothekers|helpende/.test(text) && !/dierverzorg/.test(text) && row.family !== 'Zorg & welzijn') {
      warnings.push({ Type: 'false-negative', Opleiding: row.opleiding, Family: row.family, Verwacht: 'Zorg & welzijn' });
    }
  });
  const largeStems = Object.entries(stemCounts)
    .filter(([, count]) => count > 10)
    .sort((a, b) => b[1] - a[1])
    .map(([Stem, Aantal]) => ({ Stem, Aantal }));
  return { warnings, largeStems };
}

function increment(map, key, by = 1) {
  map[key] = (map[key] || 0) + by;
}

function frequencyRows(map, keyName, limit = 20) {
  return Object.entries(map)
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, limit)
    .map(([key, count]) => ({ [keyName]: key, Aantal: count }));
}

function diversityAudit(analyses) {
  const opleidingCounts = {};
  const creboCounts = {};
  const schoolCounts = {};
  const familyCounts = {};
  const lowDiversityScenarios = [];

  analyses.forEach(a => {
    const familyInScenario = {};
    const schoolInScenario = {};
    const creboInScenario = {};
    a.suggestions.forEach(s => {
      increment(opleidingCounts, s.opleiding);
      increment(creboCounts, s.crebo);
      increment(schoolCounts, s.school);
      increment(familyCounts, s.family);
      increment(familyInScenario, s.family);
      increment(schoolInScenario, s.school);
      increment(creboInScenario, s.crebo);
    });
    const maxFamily = Math.max(...Object.values(familyInScenario));
    const maxSchool = Math.max(...Object.values(schoolInScenario));
    const repeatedCrebos = Object.entries(creboInScenario).filter(([, count]) => count > 1).map(([crebo, count]) => `${crebo} (${count}x)`);
    if (a.uniqueFamilies < 3 || maxFamily >= 4 || maxSchool >= 4 || repeatedCrebos.length) {
      lowDiversityScenarios.push({
        Scenario: a.label,
        Code: a.meta.code,
        Families: a.uniqueFamilies,
        Schools: a.uniqueSchools,
        DominanteFamilie: Object.entries(familyInScenario).sort((x, y) => y[1] - x[1])[0].join(' '),
        DominanteSchool: Object.entries(schoolInScenario).sort((x, y) => y[1] - x[1])[0].join(' '),
        HerhaaldeCrebos: repeatedCrebos.join(', ')
      });
    }
  });
  const totalSlots = analyses.reduce((sum, a) => sum + a.suggestions.length, 0);
  const topSchool = Object.entries(schoolCounts).sort((a, b) => b[1] - a[1])[0] || ['', 0];
  const topFamily = Object.entries(familyCounts).sort((a, b) => b[1] - a[1])[0] || ['', 0];

  return {
    opleidingCounts,
    creboCounts,
    schoolCounts,
    familyCounts,
    totalSlots,
    topSchool: { name: topSchool[0], count: topSchool[1], share: totalSlots ? topSchool[1] / totalSlots : 0 },
    topFamily: { name: topFamily[0], count: topFamily[1], share: totalSlots ? topFamily[1] / totalSlots : 0 },
    lowDiversityScenarios
  };
}

function scoreText(model, scores) {
  return model.D.map(d => `${d} ${scores[d]}%`).join(', ');
}

function renderReport(model, analyses, random, classifiedRows) {
  const now = new Date().toISOString().slice(0, 10);
  const validation = model.validateQuestions();
  const validationErrors = validation.filter(x => x.status !== 'ok');
  const niveauCases = model.validateNiveauMatchCases();
  const smallGapAnalyses = analyses.filter(a => a.gaps.top1Top2 <= 2 || a.gaps.top2Top3 <= 2 || a.gaps.top3Top4 <= 2 || a.meta.hasTie);
  const weakDiversity = analyses.filter(a => a.uniqueSuggestionNames < 6 || new Set(a.suggestionDims).size < Math.min(3, a.meta.code.length));
  const diversity = diversityAudit(analyses);
  const classification = classificationAudit(classifiedRows);
  const sourceLabel = path.relative(repoRoot, htmlPath);

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
    Familie: s.family,
    Opleiding: s.opleiding,
    School: s.school,
    Locatie: s.locatie,
    Match: `${s.match}%`
  })));

  const topCodes = Object.entries(random.topCodeCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 15)
    .map(([Code, Aantal]) => ({ Code, Aantal }));
  const sCoverage = random.sTop2Coverage;
  const sCoverageRows = [{
    Cases: sCoverage.cases,
    'Zorg & welzijn': sCoverage.cases ? `${sCoverage.zorgWelzijn} (${Math.round(sCoverage.zorgWelzijn / sCoverage.cases * 100)}%)` : '0',
    'Onderwijs & sport': sCoverage.cases ? `${sCoverage.onderwijsSport} (${Math.round(sCoverage.onderwijsSport / sCoverage.cases * 100)}%)` : '0',
    'Een van beide': sCoverage.cases ? `${sCoverage.either} (${Math.round(sCoverage.either / sCoverage.cases * 100)}%)` : '0'
  }];

  return `---
title: RIASOC model-audit
date: ${now}
source: ${sourceLabel}
---

# RIASOC model-audit

Deze audit draait rechtstreeks op de HTML/JS-bron van de MBO Opleidingen Verkenner. Het script simuleert antwoordpatronen, gebruikt dezelfde normalisatie, tie-detectie, niveaufiltering en opleidingsselectie als de website, en maakt zichtbaar of het model voldoende differentieert.

## Conclusie

- Vraagvalidatie: ${validationErrors.length === 0 ? 'geslaagd' : `${validationErrors.length} fouten gevonden`}.
- Niveau-testcases: ${niveauCases.every(x => x.ok) ? 'geslaagd' : 'niet allemaal geslaagd'}.
- Scenario's getest: ${analyses.length}.
- CSV met 50 simulaties: \`${path.relative(repoRoot, simulationCsvPath)}\`.
- Random simulaties: ${random.count}.
- Unieke topcodes in random simulaties: ${random.uniqueTopCodes}.
- Unieke sets van 6 opleidingen in random simulaties: ${random.uniqueSuggestionSets}.
- Scenario's met kleine verschillen of ties: ${smallGapAnalyses.length}.
- Scenario's met mogelijke diversiteitszwakte in de 6 opleidingen: ${weakDiversity.length}.
- Classificatie-waarschuwingen: ${classification.warnings.length}.

Beoordeling: ${validationErrors.length === 0 && niveauCases.every(x => x.ok) && random.uniqueTopCodes >= 20 && random.uniqueSuggestionSets >= 50 && weakDiversity.length <= 3 && classification.warnings.length === 0 ? 'de diversiteit en werking zijn op hoofdlijnen gezond. Kleine verschillen worden zichtbaar via de tie/gap-informatie en leiden niet tot één vaste standaarduitkomst.' : 'er zijn aandachtspunten; bekijk vooral de tabellen met kleine verschillen, classificatie en mogelijke diversiteitszwakte.'}

## Gecontroleerde methode

1. De audit laadt \`${sourceLabel}\` en exporteert de bestaande modeldata en functies in een Node VM-context.
2. Per testprofiel worden 62 keuzes gesimuleerd.
3. Ruwe RIASOC-punten worden genormaliseerd met \`norm()\`.
4. De topcode en tie-informatie komen uit \`topCodeMeta()\`.
5. De 6 opleidingen komen uit \`selectSuggestions()\`.
6. School en locatie worden bepaald met \`selectedProvider()\`, dus ook de Zuid-Holland-voorkeur wordt getest.

De classificatie-dump staat in:

\`\`\`text
${path.relative(repoRoot, classificationCsvPath)}
\`\`\`

## Scenario-overzicht

${table(summaryRows, ['Scenario', 'Code', 'Scores', 'Gaps', 'Beroepen', 'Opleidingen', 'Scholen', 'Dimensies'])}

## Voorbeeldsuggesties

Alle suggesties hieronder zijn de eerste 12 scenario's uit de audit. Dit is bedoeld als steekproef om te zien of de concrete opleidingen niet steeds uit dezelfde school of categorie komen.

${table(suggestionRows, ['Scenario', 'Nr', 'Dim', 'Familie', 'Opleiding', 'School', 'Locatie', 'Match'])}

## Analyse 50 simulaties

De 50 simulaties bestaan uit:

- 6 zuivere profielen: R, I, A, S, O, C;
- 15 tweedimensionale combinaties;
- 20 driedimensionale combinaties;
- 4 vaste patronen: alle A, alle B, om-en-om A/B, om-en-om B/A;
- 5 seeded random profielen.

Alle 50 simulaties zijn als tabel weggeschreven naar:

\`\`\`text
${path.relative(repoRoot, simulationCsvPath)}
\`\`\`

### Meest voorkomende opleidingen in 50 simulaties

${table(frequencyRows(diversity.opleidingCounts, 'Opleiding', 20), ['Opleiding', 'Aantal'])}

### Meest voorkomende CREBO's

${table(frequencyRows(diversity.creboCounts, 'CREBO', 20), ['CREBO', 'Aantal'])}

### Meest voorkomende scholen

${table(frequencyRows(diversity.schoolCounts, 'School', 15), ['School', 'Aantal'])}

Hoogste schoolconcentratie: ${diversity.topSchool.name} met ${diversity.topSchool.count}/${diversity.totalSlots} slots (${Math.round(diversity.topSchool.share * 100)}%).

### Sectorfamilies in alle suggesties

${table(frequencyRows(diversity.familyCounts, 'Familie', 15), ['Familie', 'Aantal'])}

Hoogste sectorfamilieconcentratie: ${diversity.topFamily.name} met ${diversity.topFamily.count}/${diversity.totalSlots} slots (${Math.round(diversity.topFamily.share * 100)}%).

### Scenario's met lage variatie

Een scenario wordt hier gemarkeerd als er minder dan 3 sectorfamilies zijn, als één familie of school 4 of meer plekken vult, of als dezelfde CREBO meer dan één keer voorkomt.

${diversity.lowDiversityScenarios.length ? table(diversity.lowDiversityScenarios, ['Scenario', 'Code', 'Families', 'Schools', 'DominanteFamilie', 'DominanteSchool', 'HerhaaldeCrebos']) : '- Geen scenario’s met lage variatie gevonden.'}

## Random simulaties

### Topcode-spreiding

${table(topCodes, ['Code', 'Aantal'])}

### Eerste dimensie

${table(Object.entries(random.top1Counts).map(([Dimensie, Aantal]) => ({ Dimensie, Aantal })), ['Dimensie', 'Aantal'])}

### Matchscore per positie

${table(random.averageMatchByPosition.map((GemiddeldeMatch, index) => ({ Positie: index + 1, GemiddeldeMatch })), ['Positie', 'GemiddeldeMatch'])}

- Gemiddelde verhouding positie 6 / positie 1: ${random.averagePos6ToPos1Ratio}.
- Random cases waarin positie 6 onder 65% van positie 1 valt: ${random.pos6Below65Count}.

### S-top2 dekking

Random cases met S in top-2 en S >= 60:

${table(sCoverageRows, ['Cases', 'Zorg & welzijn', 'Onderwijs & sport', 'Een van beide'])}

### Kleine verschillen

- Aantal random cases met top-gaps van 2 punten of minder, of exacte ties: ${random.tinyGapCount}.
- Voorbeelden:

${random.tinyGapExamples.map(x => `- ${x.label}: ${x.code}, ${scoreText(model, x.scores)}, gaps ${x.gaps.top1Top2}/${x.gaps.top2Top3}/${x.gaps.top3Top4}`).join('\n') || '- Geen voorbeelden.'}

### Meest voorkomende opleidingensets

${random.mostCommonSuggestionSets.map(x => `- ${x.n}x: ${x.set}`).join('\n')}

## Classificatiechecks

De classificatiecheck zoekt expliciet naar bekende false positives zoals dierverzorging als zorg/welzijn en autoschade/asfalt/metsel buiten techniek.

${classification.warnings.length ? table(classification.warnings, ['Type', 'Opleiding', 'Family', 'Verwacht']) : '- Geen classificatie-waarschuwingen gevonden.'}

### Grote opleidingsstammen

Stammen met meer dan 10 records verdienen handmatige controle, omdat ze echte duplicaten kunnen zijn of juist te grof samengevoegde varianten.

${classification.largeStems.length ? table(classification.largeStems, ['Stem', 'Aantal']) : '- Geen opleidingsstammen met meer dan 10 records.'}

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
  const classifiedRows = writeClassificationCsv(model);
  writeSimulationCsv(analyses);
  const report = renderReport(model, analyses, random, classifiedRows);
  fs.writeFileSync(outputPath, report, 'utf8');

  const validationErrors = model.validateQuestions().filter(x => x.status !== 'ok').length;
  const niveauOk = model.validateNiveauMatchCases().every(x => x.ok);
  const smallGapCount = analyses.filter(a => a.gaps.top1Top2 <= 2 || a.gaps.top2Top3 <= 2 || a.gaps.top3Top4 <= 2 || a.meta.hasTie).length;
  const classificationWarnings = classificationAudit(classifiedRows).warnings.length;

  console.log(JSON.stringify({
    report: outputPath,
    simulationCsv: simulationCsvPath,
    classificationCsv: classificationCsvPath,
    scenarios: analyses.length,
    randomRuns: random.count,
    validationErrors,
    niveauOk,
    uniqueTopCodes: random.uniqueTopCodes,
    uniqueSuggestionSets: random.uniqueSuggestionSets,
    scenarioSmallGaps: smallGapCount,
    randomSmallGaps: random.tinyGapCount,
    averageMatchByPosition: random.averageMatchByPosition,
    averagePos6ToPos1Ratio: random.averagePos6ToPos1Ratio,
    sTop2Coverage: random.sTop2Coverage,
    classificationWarnings
  }, null, 2));
}

main();

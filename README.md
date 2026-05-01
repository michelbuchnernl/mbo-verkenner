# MBO Opleidingen Verkenner

RIASOC/MBO Opleidingen Verkenner voor het Corbulo Tech & Design College.

De app is een zelfstandige HTML/JS-tool waarmee leerlingen 62 visuele A/B-keuzes maken. Op basis daarvan berekent de app een RIASOC-profiel en toont hij passende MBO-suggesties.

## In deze versie

- 1 schoon HTML-document: `index.html`
- 62 lokale vraagafbeeldingen in `assets/riasoc/`
- geen Google Drive image-afhankelijkheid voor de quizbeelden
- question metadata: `pair`, `pairType`, `expectedType`
- `validateQuestions()` voor controle van de R-I-A-S-O-C hexagon
- tie-aware profielcode via `topCodeMeta()`
- verbeterde `niveauMatch()` voor samengestelde niveauvelden
- PDF-export zonder verticale samendrukking: vaste A4-pagina's met klikbare opleidingslinks
- 12 brede beroepideeën en 6 concrete MBO-opleidingen met deduplicatie, sectorcaps en schoolspreiding
- geautomatiseerde model-audit in `tests/riasoc_model_audit.js`
- MBO-records krijgen expliciete codes en inhoudelijke RIASOC-herwegingen
- modeluitleg in `docs/RIASOC_Modeluitleg_weging_en_resultaat.md`

## Starten

Open `index.html` in een browser. Er is geen build-stap en geen server nodig.

## Bestandsstructuur

```text
mbo-verkenner/
├── index.html
├── assets/
│   └── riasoc/
│       ├── 01-fiets-repareren-of-fiets-uitleggen.png
│       ├── ...
│       └── 62-bij-een-blijven-of-de-groep-organiseren.png
├── docs/
│   └── RIASOC_Modeluitleg_weging_en_resultaat.md
├── tests/
│   ├── riasoc_model_audit.js
│   └── output/
│       └── riasoc_model_audit.md
└── README.md
```

## Model

De verkenner gebruikt de zes RIASOC-dimensies:

| Code | Dimensie | Kern |
|---|---|---|
| R | Realistisch | Doen en maken |
| I | Intellectueel | Denken en analyseren |
| A | Artistiek | Creeren en verbeelden |
| S | Sociaal | Helpen en ondersteunen |
| O | Ondernemend | Leiden en overtuigen |
| C | Conventioneel | Ordenen en structureren |

Lees de volledige uitleg in [docs/RIASOC_Modeluitleg_weging_en_resultaat.md](docs/RIASOC_Modeluitleg_weging_en_resultaat.md).

## Validatie

Voer de model-audit uit met:

```bash
node tests/riasoc_model_audit.js
```

De laatste lokale validatie gaf:

- `<!DOCTYPE html>`: 1
- `</html>`: 1
- IMG-items: 62
- Q32-Q62 gevuld: ja
- `validateQuestions()`: 62 vragen, 0 fouten
- `niveauMatch()` testcases: geslaagd
- model-audit: 50 scenario's, 1000 random simulaties, 114 unieke topcodes, 403 unieke opleidingensets, 0 lage-variatiescenario's
- CSV-analyse: `tests/output/riasoc_50_simulaties.csv`

## Doel

Dit instrument is een gespreksstarter voor loopbaanorientatie. Het is geen diagnose en geen bindend beroepsadvies.

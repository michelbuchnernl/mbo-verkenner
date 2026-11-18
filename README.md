# MBO Opleidingen Verkenner

RIASOC/MBO Opleidingen Verkenner voor het Corbulo Tech & Design College.

De app is een zelfstandige HTML/JS-tool waarmee leerlingen 30 visuele A/B-keuzes maken. Op basis daarvan berekent de app een RIASOC-profiel en toont hij passende MBO-suggesties.

## In deze versie

- 1 HTML-document: `index.html`, zonder build-stap
- 30 vragen: 28 uit de oorspronkelijke 62 plaatjes, 1 nieuw en 1 samengesteld plaatje
- elk tweetal letters staat 2 keer tegenover elkaar; elke letter komt 10 keer voor, 5 keer links en 5 keer rechts
- 1 punt per keuze voor de gekozen letter, zonder bijpunten
- gelijke stand wordt beslist door het onderlinge duel en gemeld aan de leerling
- melding bij een vlak profiel of als iemand steeds dezelfde kant kiest
- opleidingsmatch op profielvorm (correlatie), met wisseling tussen opleidingen die even goed passen
- elke sterke letter van de leerling krijgt minstens één opleiding
- invulvelden voor voornaam, achternaam en klas; die staan op de uitslag en in de PDF
- 12 brede beroepideeën en 6 concrete MBO-opleidingen, hooguit 2 per sector en per school
- profielcorrectie van opleidingen kijkt alleen naar de opleidingsnaam
- alle teksten voor leerlingen op taalniveau 2F: korte zinnen en gewone woorden
- terugknop tijdens de vragen
- PDF-export met klikbare opleidingslinks
- model-audit met 600 gesimuleerde leerlingen per groep in `tests/riasoc_model_audit.js`

Waarom deze 30 plaatjes en deze telling: [docs/RIASOC_30_vragen_ontwerp.md](docs/RIASOC_30_vragen_ontwerp.md).

## Starten

Open `index.html` in een browser. Er is geen build-stap en geen server nodig.

## Bestandsstructuur

```text
mbo-verkenner/
├── index.html
├── assets/
│   └── riasoc/                  alle plaatjes en de logo's
├── docs/
│   ├── RIASOC_30_vragen_ontwerp.md
│   ├── RIASOC_Modeluitleg_weging_en_resultaat.md
│   ├── RIASOC_Beeldaudit_62_plaatjes.md
│   ├── RIASOC_Claude_Beeldaudit_Reviewpakket.md
│   └── riasoc_30_plaatjes_overzicht.jpg
├── tests/
│   ├── riasoc_model_audit.js
│   ├── fixtures/vragen_62_oud.json
│   └── output/
├── tools/
│   ├── swap_sides.py            wisselt linker- en rechterscène van een plaatje
│   └── combine_sides.py         maakt één plaatje uit twee bestaande scènes
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

```bash
node tests/riasoc_model_audit.js
```

De audit draait op `index.html` zelf, schrijft een rapport naar `tests/output/riasoc_model_audit.md` en eindigt met een fout als de vragenset scheef is. Laatste uitkomst (2026-11-18):

- ontwerp: 30 vragen, 0 fouten, elk tweetal 2 keer, elke letter 10 keer en 5/5 links/rechts
- 600 willekeurige klikkers: elke letter 14-20% kans op plek 1; bij 60.000 klikkers 16,4-17,0%
- altijd links of rechts: vlak profiel met melding
- 600 leerlingen met een echte voorkeur: sterkste letter in 63% goed, overlap top 3 gemiddeld 2,53 van 3
- opleidingen: 313 van de 400 komen in beeld, de meest getoonde bij 12% van de leerlingen

## Doel

Dit instrument is een gespreksstarter voor loopbaanorientatie. Het is geen diagnose en geen bindend beroepsadvies.

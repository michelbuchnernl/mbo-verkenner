---
title: RIASOC model-audit (30 vragen)
date: 2026-11-18
source: index.html
---

# RIASOC model-audit

Gesimuleerd met 600 leerlingen per groep (vaste seed 20261118). Opnieuw draaien: `node tests/riasoc_model_audit.js`.

**Uitkomst: geen problemen gevonden.**

## 1. Ontwerp van de vragenset

| Controle | Uitkomst |
|---|---|
| Aantal vragen | 30 |
| Fouten per vraag | 0 |
| Ontbrekende plaatjes | 0 |
| Elke letter even vaak | R 10x, I 10x, A 10x, S 10x, O 10x, C 10x |
| Links / rechts per letter | R 5/5, I 5/5, A 5/5, S 5/5, O 5/5, C 5/5 |
| Type vergelijking | 14 buren, 10 om-en-om, 6 tegenover |
| Niveaufilter-testcases | geslaagd |

Hoe vaak staat elk tweetal tegenover elkaar:

|  | R | I | A | S | O | C |
|---|---|---|---|---|---|---|
| **R** | - | 2 | 2 | 2 | 2 | 2 |
| **I** | 2 | - | 2 | 2 | 2 | 2 |
| **A** | 2 | 2 | - | 3 | 1 | 2 |
| **S** | 2 | 2 | 3 | - | 2 | 1 |
| **O** | 2 | 2 | 1 | 2 | - | 3 |
| **C** | 2 | 2 | 2 | 1 | 3 | - |

| # | Plaatje (oud nr.) | Links (A) | Rechts (B) | Type |
|---|---|---|---|---|
| 1 | 5 | R - Speeltoestel maken | S - Op kinderen letten | opposite |
| 2 | 28 | I - Oorzaak zoeken | C - Stappen checken | skip-one |
| 3 | 49 | A - Campagne ontwerpen | O - Mensen meekrijgen | skip-one |
| 4 | 56 | C - Voorraad ordenen | R - Opstelling bouwen | adjacent |
| 5 | 32 | A - Fotoserie maken | S - Leerling helpen | adjacent |
| 6 | 6 | I - Robot onderzoeken | O - Team leiden | opposite |
| 7 | 11 (omgewisseld) | C - Voorbeeld volgen | A - Eigen poster maken | opposite |
| 8 | 50 | S - Eén persoon helpen | O - Groep leiden | adjacent |
| 9 | 40 | R - Motor openmaken | I - Schema bekijken | adjacent |
| 10 | 61 | C - Hulpvraag verwerken | S - Persoon helpen | skip-one |
| 11 | 44 | I - Wind uitleggen | A - Wind verbeelden | adjacent |
| 12 | 20 (omgewisseld) | O - Opbouw leiden | R - Geluid aansluiten | skip-one |
| 13 | 24 (omgewisseld) | S - Met bewoner praten | I - Water onderzoeken | skip-one |
| 14 | 36 | O - Kraam leiden | C - Kraam bijhouden | adjacent |
| 15 | 16 (omgewisseld) | A - Apart krukje maken | R - Stevig krukje maken | skip-one |
| 16 | 25 | I - App onderzoeken | S - Iemand met app helpen | skip-one |
| 17 | 37 | O - Sponsor overtuigen | C - Formulieren invullen | adjacent |
| 18 | 18 | R - Wand bouwen | A - Kamer inrichten | skip-one |
| 19 | 51 | S - Goed luisteren | O - Groep overtuigen | adjacent |
| 20 | 59 | C - Gegevens invoeren | I - Betekenis zoeken | skip-one |
| 21 | 33 | A - Buurtmuur schilderen | S - Buurtgesprek houden | adjacent |
| 22 | 21 | R - Pomp maken | O - Tuinproject regelen | skip-one |
| 23 | 45 | I - Goed antwoord zoeken | A - Eigen kunstwerk maken | adjacent |
| 24 | 57 | C - Codes checken | R - Apparatuur plaatsen | adjacent |
| 25 | 34 (omgewisseld) | S - Ruzie oplossen | A - Toneelscène spelen | adjacent |
| 26 | 8 (omgewisseld) | O - Website-idee verkopen | I - Website onderzoeken | opposite |
| 27 | 13 | A - Kostuum bedenken | C - Kostuums bijhouden | opposite |
| 28 | 42 | R - Leren door doen | I - Leren door vergelijken | adjacent |
| 29 | 55 | O - Energiek leiden | C - Zorgvuldig controleren | adjacent |
| 30 | 1 (omgewisseld) | S - Fiets uitleggen | R - Fiets maken | opposite |

## 2. 600 willekeurige klikkers

Wie zonder voorkeur klikt, hoort bij elke letter evenveel kans te hebben. Zo is te zien of de vragenset zelf een richting op duwt.

| Meting | Uitkomst | Ideaal |
|---|---|---|
| Letter op plek 1 | R 18.0% · I 16.7% · A 18.8% · S 16.2% · O 15.3% · C 15.0% | elk 16,7% |
| Toets gelijke verdeling plek 1 | chi² = 4.1 | onder 11.07 |
| Top-3 combinaties (20 mogelijk) | 20 komen voor; minst 22x, meest 40x | elk 30x |
| Toets gelijke verdeling top-3 | chi² = 18.1 | onder 30.14 |
| Verschillende codes (120 mogelijk) | 119 | - |
| Samenhang tussen letters | -0.33 tot -0.07 | alle rond -0,20 |
| Gemiddelde score per letter | R 50% · I 51% · A 50% · S 50% · O 50% · C 49% | elk 50% |
| Gelijke stand op de grens plek 3/4 | 47% | - |
| ... daarvan na tie-break nog gelijk | 7% | - |
| Vlak profiel (verschil hoogste-laagste max. 20 punten) | 10% | - |

Herhaald met vijf andere seeds (11, 23, 37, 59, 71): chi² plek 1 = 6.7, 7.6, 4.5, 7.9, 8.9; chi² top-3 = 16.1, 22.3, 16.3, 15.7, 18.5.

Fijnmeting met 60.000 willekeurige klikkers (alleen de telling): plek 1 = R 16.91% · I 16.71% · A 16.51% · S 16.31% · O 16.73% · C 16.83%.

### Opleidingen bij deze groep

| Meting | Uitkomst |
|---|---|
| Verschillende opleidingen getoond | 316 van 400 |
| Verschillende zestallen | 583 op 600 leerlingen |
| Meest getoonde opleiding | 25798 Podium- en evenemententechnicus (12% van de leerlingen) |
| Aandeel van de 10 meest getoonde | 17% |
| Sectoren per leerling (van 6) | 3.7 |
| Scholen per leerling (van 6) | 4.2 |
| Gemiddelde profielmatch | 64% |
| Hoofdletter opleiding zit in top 3 van leerling | 94% |
| Hoofdletter opleiding zit in top 2 van leerling | 81% |
| Hoofdletter opleiding hoort bij de 2 laagste letters | 2% |

Verdeling over sectoren (aandeel van alle getoonde opleidingen):

| Sector | Getoond | Aandeel in aanbod |
|---|---|---|
| Techniek & maken | 18% | 40% |
| Uiterlijke verzorging | 12% | 6% |
| Creatief & media | 12% | 7% |
| Horeca & toerisme | 11% | 7% |
| Overig | 9% | 4% |
| Commercieel & ondernemend | 8% | 9% |
| ICT & data | 6% | 5% |
| Voeding, natuur & dier | 6% | 3% |
| Veiligheid & defensie | 4% | 4% |
| Laboratorium & onderzoek | 4% | 2% |
| Zorg & welzijn | 4% | 7% |
| Administratie & juridisch | 2% | 4% |
| Logistiek & transport | 2% | 3% |
| Onderwijs & sport | 2% | 2% |

Vaakst getoond:

| Opleiding | Bij % van de leerlingen |
|---|---|
| 25798 Podium- en evenemententechnicus | 12% |
| 25686 Fashion Tailor | 12% |
| 27005 Specialist Restauratie & Decoratie | 12% |
| 25717 AV-Specialist | 12% |
| 25614 Boulanger | 10% |
| 25689 Basismedewerker Fashion | 9% |
| 27037 Standbouwer | 9% |
| 27101 Allround interieurvakman (M/V) (woningstofferen) | 9% |
| 25688 Fashion Product Coordinator | 8% |
| 27036 Specialist Decorbouwer | 8% |
| 25685 Fashion Retailer | 8% |
| 25684 Assistant Fashion Tailor | 8% |

## 3. Kant-klikkers en vaste patronen

Elke letter staat 5x links en 5x rechts. Wie steeds dezelfde kant kiest krijgt daardoor een vlak profiel en een waarschuwing, geen schijnprofiel.

| Patroon | R | I | A | S | O | C | Code | Melding |
|---|---|---|---|---|---|---|---|---|
| Altijd links (A) | 50% | 50% | 50% | 50% | 50% | 50% | SRO | zelfde kant |
| Altijd rechts (B) | 50% | 50% | 50% | 50% | 50% | 50% | SRI | zelfde kant |
| Om en om A/B | 60% | 50% | 60% | 50% | 50% | 30% | ARS | - |
| Kiest altijd Realistisch, verder willekeurig | 100% | 60% | 40% | 40% | 30% | 30% | RIA | - |
| Kiest altijd Intellectueel, verder willekeurig | 30% | 100% | 30% | 60% | 30% | 50% | ISC | - |
| Kiest altijd Artistiek, verder willekeurig | 40% | 30% | 100% | 50% | 40% | 40% | ASO | - |
| Kiest altijd Sociaal, verder willekeurig | 50% | 30% | 40% | 100% | 40% | 40% | SRC | - |
| Kiest altijd Ondernemend, verder willekeurig | 10% | 30% | 50% | 60% | 100% | 50% | OSA | - |
| Kiest altijd Conventioneel, verder willekeurig | 40% | 40% | 50% | 20% | 50% | 100% | COA | - |

600 klikkers met een voorkeur voor links (70% links): plek 1 = R 19.7% · I 13.7% · A 14.8% · S 16.2% · O 16.5% · C 19.2%; chi² = 10.0 (grens 11.07).

## 4. 600 leerlingen met een echte voorkeur

Elke gesimuleerde leerling heeft verborgen voorkeuren voor de zes letters (met de samenhang van de zeshoek van Holland) en kiest per plaatje met een kans die van het verschil afhangt. Elk plaatje is daarnaast voor iedereen iets aantrekkelijker of saaier dan bedoeld. De vraag is of de test de verborgen voorkeur terugvindt.

| Meting | Uitkomst |
|---|---|
| Sterkste letter goed gevonden | 66% |
| Overlap gevonden top 3 met echte top 3 | 2.47 van 3 |
| Rangcorrelatie gemeten en echt profiel | 0.80 |
| Gelijke stand op de grens plek 3/4 | 27% |
| ... daarvan na tie-break nog gelijk | 3% |
| Verschillende codes (120 mogelijk) | 117 |
| Hoofdletter opleiding zit in echte top 3 van leerling | 90% |

### Opleidingen bij deze groep

| Meting | Uitkomst |
|---|---|
| Verschillende opleidingen getoond | 318 van 400 |
| Verschillende zestallen | 581 op 600 leerlingen |
| Meest getoonde opleiding | 25717 AV-Specialist (12% van de leerlingen) |
| Aandeel van de 10 meest getoonde | 16% |
| Sectoren per leerling (van 6) | 3.7 |
| Scholen per leerling (van 6) | 4.1 |
| Gemiddelde profielmatch | 67% |
| Hoofdletter opleiding zit in top 3 van leerling | 95% |
| Hoofdletter opleiding zit in top 2 van leerling | 82% |
| Hoofdletter opleiding hoort bij de 2 laagste letters | 1% |

## 5. Oude en nieuwe vragenset naast elkaar

Alleen de telling van de vragen, zonder opleidingen. Gelijke stand is hier met het lot beslist.

| Meting | Oud: 62 vragen, weging 3/1 | Nieuw: 30 vragen, 1 punt per keuze |
|---|---|---|
| Willekeurig: letter op plek 1 | R 18% I 26% A 16% S 13% O 14% C 13% | R 20% I 16% A 19% S 16% O 15% C 15% |
| Willekeurig: chi² plek 1 (grens 11,07) | 41.5 | 7.2 |
| Willekeurig: top-3 combinatie minst / meest | 7 / 68 | 19 / 39 |
| Willekeurig: chi² top-3 (grens 30,14) | 215.7 | 21.1 |
| Samenhang tussen letters | -0.46 tot 0.50 | -0.34 tot -0.07 |
| Altijd links: score per letter | R 76 I 80 A 69 S 26 O 25 C 52 | R 50 I 50 A 50 S 50 O 50 C 50 |
| Echte voorkeur: sterkste letter goed | 73% | 64% |
| Echte voorkeur: overlap top 3 | 2.58 van 3 | 2.48 van 3 |
| Echte voorkeur: rangcorrelatie | 0.84 | 0.81 |

## 6. Profielcorrectie opleidingen

| Categorie | Aantal |
|---|---|
| techniek-r-i-c-uitvoering | 81 |
| techniek-r-i-c-analyse | 46 |
| hospitality-contact-uitvoerend | 41 |
| creatief-media-ontwerp | 31 |
| zorg-welzijn-contact | 26 |
| ict-beheer-support | 12 |
| hospitality-contact-leiding | 11 |
| entree-breed-contact-dienstverlening | 11 |
| entree-breed-techniek-logistiek | 9 |
| creatief-media-technisch | 6 |
| ambacht-precisie-vormgeving | 5 |
| ambacht-materiaal-vormgeving | 4 |
| vastgoed-organisatie-advies | 4 |
| entree-breed-orienterend | 3 |
| ict-software-development | 3 |
| ict-software-creatief | 3 |
| ambacht-service-techniek | 2 |
| eigen dossierprofiel (geen correctie) | 102 |

Verschillende RIASOC-profielen in de dataset: 43 op 400 opleidingen. Zie `riasoc_classificatie_dump.csv`.


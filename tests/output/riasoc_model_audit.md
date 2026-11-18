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
| Type vergelijking | 12 buren, 12 om-en-om, 6 tegenover |
| Niveaufilter-testcases | geslaagd |

Hoe vaak staat elk tweetal tegenover elkaar:

|  | R | I | A | S | O | C |
|---|---|---|---|---|---|---|
| **R** | - | 2 | 2 | 2 | 2 | 2 |
| **I** | 2 | - | 2 | 2 | 2 | 2 |
| **A** | 2 | 2 | - | 2 | 2 | 2 |
| **S** | 2 | 2 | 2 | - | 2 | 2 |
| **O** | 2 | 2 | 2 | 2 | - | 2 |
| **C** | 2 | 2 | 2 | 2 | 2 | - |

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
| 21 | 64 (samengesteld uit 22 en 15) | O - Stand presenteren | A - Stand inrichten | skip-one |
| 22 | 57 | C - Codes checken | R - Apparatuur plaatsen | adjacent |
| 23 | 33 | A - Buurtmuur schilderen | S - Buurtgesprek houden | adjacent |
| 24 | 42 | R - Leren door doen | I - Leren door vergelijken | adjacent |
| 25 | 63 (nieuw) | S - Deelnemer aanmoedigen | C - Scores bijhouden | skip-one |
| 26 | 45 | I - Goed antwoord zoeken | A - Eigen kunstwerk maken | adjacent |
| 27 | 21 | R - Pomp maken | O - Tuinproject regelen | skip-one |
| 28 | 13 | A - Kostuum bedenken | C - Kostuums bijhouden | opposite |
| 29 | 8 (omgewisseld) | O - Website-idee verkopen | I - Website onderzoeken | opposite |
| 30 | 1 (omgewisseld) | S - Fiets uitleggen | R - Fiets maken | opposite |

## 2. 600 willekeurige klikkers

Wie zonder voorkeur klikt, hoort bij elke letter evenveel kans te hebben. Zo is te zien of de vragenset zelf een richting op duwt.

| Meting | Uitkomst | Ideaal |
|---|---|---|
| Letter op plek 1 | R 17.3% · I 19.8% · A 17.2% · S 15.5% · O 16.0% · C 14.2% | elk 16,7% |
| Toets gelijke verdeling plek 1 | chi² = 6.8 | onder 11.07 |
| Top-3 combinaties (20 mogelijk) | 20 komen voor; minst 21x, meest 39x | elk 30x |
| Toets gelijke verdeling top-3 | chi² = 22.4 | onder 30.14 |
| Verschillende codes (120 mogelijk) | 120 | - |
| Samenhang tussen letters | -0.26 tot -0.14 | alle rond -0,20 |
| Gemiddelde score per letter | R 50% · I 51% · A 50% · S 50% · O 50% · C 50% | elk 50% |
| Gelijke stand op de grens plek 3/4 | 51% | - |
| ... daarvan na tie-break nog gelijk | 9% | - |
| Vlak profiel (verschil hoogste-laagste max. 20 punten) | 12% | - |

Herhaald met vijf andere seeds (11, 23, 37, 59, 71): chi² plek 1 = 5.3, 3.7, 3.0, 15.6, 4.6; chi² top-3 = 13.1, 30.6, 20.4, 22.9, 14.4.

Fijnmeting met 60.000 willekeurige klikkers (alleen de telling): plek 1 = R 17.00% · I 16.74% · A 16.36% · S 16.65% · O 16.52% · C 16.73%.

### Opleidingen bij deze groep

| Meting | Uitkomst |
|---|---|
| Verschillende opleidingen getoond | 313 van 400 |
| Verschillende zestallen | 587 op 600 leerlingen |
| Meest getoonde opleiding | 27037 Standbouwer (14% van de leerlingen) |
| Aandeel van de 10 meest getoonde | 17% |
| Sectoren per leerling (van 6) | 3.9 |
| Scholen per leerling (van 6) | 4.2 |
| Gemiddelde profielmatch | 62% |
| Elke sterke letter van de leerling heeft een opleiding | 78% |
| Hoofdletter opleiding zit in top 3 van leerling | 91% |
| Hoofdletter opleiding zit in top 2 van leerling | 77% |
| Hoofdletter opleiding hoort bij de 2 laagste letters | 3% |

Verdeling over sectoren (aandeel van alle getoonde opleidingen):

| Sector | Getoond | Aandeel in aanbod |
|---|---|---|
| Techniek & maken | 19% | 40% |
| Creatief & media | 12% | 7% |
| Uiterlijke verzorging | 11% | 6% |
| Horeca & toerisme | 10% | 7% |
| Commercieel & ondernemend | 10% | 9% |
| Overig | 9% | 4% |
| ICT & data | 6% | 5% |
| Voeding, natuur & dier | 5% | 3% |
| Zorg & welzijn | 4% | 7% |
| Laboratorium & onderzoek | 4% | 2% |
| Veiligheid & defensie | 4% | 4% |
| Administratie & juridisch | 3% | 4% |
| Logistiek & transport | 2% | 3% |
| Onderwijs & sport | 2% | 2% |

Vaakst getoond:

| Opleiding | Bij % van de leerlingen |
|---|---|
| 27037 Standbouwer | 14% |
| 25717 AV-Specialist | 11% |
| 25685 Fashion Retailer | 10% |
| 25688 Fashion Product Coordinator | 10% |
| 25798 Podium- en evenemententechnicus | 10% |
| 27005 Specialist Restauratie & Decoratie | 10% |
| 25686 Fashion Tailor | 10% |
| 25689 Basismedewerker Fashion | 10% |
| 27036 Specialist Decorbouwer | 9% |
| 25882 Redactiemedewerker | 8% |
| 25276 Werkvoorbereider elektro | 8% |
| 27101 Allround interieurvakman (M/V) (woningstofferen) | 8% |

## 3. Kant-klikkers en vaste patronen

Elke letter staat 5x links en 5x rechts. Wie steeds dezelfde kant kiest krijgt daardoor een vlak profiel en een waarschuwing, geen schijnprofiel.

| Patroon | R | I | A | S | O | C | Code | Melding |
|---|---|---|---|---|---|---|---|---|
| Altijd links (A) | 50% | 50% | 50% | 50% | 50% | 50% | SRO | zelfde kant |
| Altijd rechts (B) | 50% | 50% | 50% | 50% | 50% | 50% | SRI | zelfde kant |
| Om en om A/B | 70% | 30% | 60% | 50% | 50% | 40% | RAO | - |
| Kiest altijd Realistisch, verder willekeurig | 100% | 40% | 50% | 40% | 40% | 30% | RAI | - |
| Kiest altijd Intellectueel, verder willekeurig | 30% | 100% | 30% | 70% | 30% | 40% | ISC | - |
| Kiest altijd Artistiek, verder willekeurig | 60% | 20% | 100% | 50% | 30% | 40% | ARS | - |
| Kiest altijd Sociaal, verder willekeurig | 30% | 30% | 70% | 100% | 40% | 30% | SAO | - |
| Kiest altijd Ondernemend, verder willekeurig | 30% | 20% | 40% | 60% | 100% | 50% | OSC | - |
| Kiest altijd Conventioneel, verder willekeurig | 40% | 50% | 30% | 30% | 50% | 100% | CIO | - |

600 klikkers met een voorkeur voor links (70% links): plek 1 = R 15.2% · I 18.7% · A 15.8% · S 18.5% · O 16.2% · C 15.7%; chi² = 4.2 (grens 11.07).

## 4. 600 leerlingen met een echte voorkeur

Elke gesimuleerde leerling heeft verborgen voorkeuren voor de zes letters (met de samenhang van de zeshoek van Holland) en kiest per plaatje met een kans die van het verschil afhangt. Elk plaatje is daarnaast voor iedereen iets aantrekkelijker of saaier dan bedoeld. De vraag is of de test de verborgen voorkeur terugvindt.

| Meting | Uitkomst |
|---|---|
| Sterkste letter goed gevonden | 63% |
| Overlap gevonden top 3 met echte top 3 | 2.53 van 3 |
| Rangcorrelatie gemeten en echt profiel | 0.81 |
| Gelijke stand op de grens plek 3/4 | 25% |
| ... daarvan na tie-break nog gelijk | 4% |
| Verschillende codes (120 mogelijk) | 115 |
| Hoofdletter opleiding zit in echte top 3 van leerling | 90% |

### Opleidingen bij deze groep

| Meting | Uitkomst |
|---|---|
| Verschillende opleidingen getoond | 319 van 400 |
| Verschillende zestallen | 580 op 600 leerlingen |
| Meest getoonde opleiding | 27037 Standbouwer (14% van de leerlingen) |
| Aandeel van de 10 meest getoonde | 16% |
| Sectoren per leerling (van 6) | 3.9 |
| Scholen per leerling (van 6) | 4.2 |
| Gemiddelde profielmatch | 66% |
| Elke sterke letter van de leerling heeft een opleiding | 89% |
| Hoofdletter opleiding zit in top 3 van leerling | 94% |
| Hoofdletter opleiding zit in top 2 van leerling | 81% |
| Hoofdletter opleiding hoort bij de 2 laagste letters | 1% |

## 5. Oude en nieuwe vragenset naast elkaar

Alleen de telling van de vragen, zonder opleidingen. Gelijke stand is hier met het lot beslist.

| Meting | Oud: 62 vragen, weging 3/1 | Nieuw: 30 vragen, 1 punt per keuze |
|---|---|---|
| Willekeurig: letter op plek 1 | R 18% I 26% A 16% S 13% O 14% C 13% | R 17% I 18% A 18% S 16% O 17% C 14% |
| Willekeurig: chi² plek 1 (grens 11,07) | 41.5 | 3.8 |
| Willekeurig: top-3 combinatie minst / meest | 7 / 68 | 20 / 38 |
| Willekeurig: chi² top-3 (grens 30,14) | 215.7 | 13.6 |
| Samenhang tussen letters | -0.46 tot 0.50 | -0.28 tot -0.15 |
| Altijd links: score per letter | R 76 I 80 A 69 S 26 O 25 C 52 | R 50 I 50 A 50 S 50 O 50 C 50 |
| Echte voorkeur: sterkste letter goed | 73% | 66% |
| Echte voorkeur: overlap top 3 | 2.58 van 3 | 2.52 van 3 |
| Echte voorkeur: rangcorrelatie | 0.84 | 0.82 |

## 6. Profielcorrectie opleidingen

| Categorie | Aantal |
|---|---|
| techniek-r-i-c-uitvoering | 81 |
| techniek-r-i-c-analyse | 46 |
| hospitality-contact-uitvoerend | 41 |
| creatief-media-ontwerp | 31 |
| zorg-welzijn-contact | 26 |
| leiding-ondernemen (+O) | 15 |
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

Verschillende RIASOC-profielen in de dataset: 50 op 400 opleidingen. Zie `riasoc_classificatie_dump.csv`.


---
title: RIASOC Modeluitleg - weging en resultaatberekening
tags:
  - riasoc
  - mbo
  - modeluitleg
  - verkenner
status: concept
created: 2026-05-01
---

# RIASOC Modeluitleg - weging en resultaatberekening

Deze notitie beschrijft hoe de RIASOC/MBO Opleidingen Verkenner keuzes omzet naar een profiel en daarna naar passende MBO-suggesties. De verkenner is bedoeld als orienterend hulpmiddel: hij laat zien welke richtingen aansluiten bij voorkeuren, maar vervangt geen loopbaangesprek, intake of advies van mentor/decaan.

## 1. Wat wordt gepeild?

De vragen peilen voorkeuren langs de zes RIASOC-dimensies:

| Code | Dimensie | In gewone taal |
|---|---|---|
| R | Realistisch | Doen, maken, bouwen, repareren |
| I | Intellectueel | Onderzoeken, analyseren, begrijpen |
| A | Artistiek | Ontwerpen, verbeelden, creatief maken |
| S | Sociaal | Helpen, begeleiden, zorgen, contact |
| O | Ondernemend | Leiden, overtuigen, organiseren |
| C | Conventioneel | Ordenen, controleren, structureren |

Elke vraag toont twee situaties. De leerling kiest niet wat "beter" is, maar wat meer aanspreekt. Daarmee wordt voorkeur gemeten, geen vaardigheid.

## 2. Waarom 62 vragen?

De vragen zijn opgebouwd rond de hexagon-volgorde:

```text
R - I - A - S - O - C - terug naar R
```

Die volgorde komt uit het RIASOC-model: naast elkaar liggende dimensies zijn inhoudelijk verwant, tegenoverliggende dimensies verschillen sterker.

De set bevat meerdere typen vergelijkingen:

| Type | Betekenis | Voorbeeld |
|---|---|---|
| adjacent | Vergelijking tussen verwante buren | I-A, S-O |
| skip-one | Vergelijking met een tussenstap | A-O, C-I |
| opposite | Vergelijking met maximale afstand | R-S, I-O, A-C |

In de software krijgt elke vraag daarom metadata:

```js
pair: "I-A"
pairType: "adjacent"
expectedType: "adjacent"
```

`validateQuestions()` controleert of deze metadata klopt met de hexagon-volgorde, of alle 62 afbeeldingen gevuld zijn, en of elke antwoordkant een duidelijke hoofddimensie heeft.

## 3. Hoe telt een antwoord mee?

Elke antwoordoptie heeft een kleine scoreverdeling. De hoofddimensie krijgt meestal 3 punten. Een ondersteunende dimensie krijgt meestal 1 punt.

Voorbeeld:

```js
wA: { R: 3, C: 1 }
wB: { S: 3, O: 1 }
```

Als een leerling A kiest, krijgt het profiel:

- R +3
- C +1

Als een leerling B kiest:

- S +3
- O +1

Deze 3/1-weging voorkomt dat een keuze te plat wordt. Een praktische scene kan bijvoorbeeld vooral Realistisch zijn, maar ook iets Conventioneels hebben omdat nauwkeurig werken belangrijk is. Een helpende scene kan vooral Sociaal zijn, maar ook iets Ondernemends hebben als iemand uitleg geeft of anderen activeert.

## 4. Van ruwe score naar percentage

Niet elke dimensie komt exact even vaak en even zwaar in alle vraagkanten terug. Daarom gebruikt de software normalisatie.

Voor elke dimensie wordt eerst berekend wat de maximaal haalbare score is:

```js
maxScore[dimensie] = som van de hoogste haalbare score per vraag
```

Daarna wordt de score omgezet naar een percentage:

```text
percentage = afgerond(ruweScore / maxScore * 100)
```

Daardoor betekent 70 procent bij Sociaal hetzelfde soort signaal als 70 procent bij Realistisch: de leerling heeft relatief vaak gekozen voor situaties waarin die dimensie belangrijk was.

## 5. Hoe ontstaat de profielcode?

De profielcode bestaat uit de drie hoogste dimensies, bijvoorbeeld:

```text
SIC
```

Dat betekent: Sociaal staat het sterkst, daarna Intellectueel, daarna Conventioneel.

De oude versie koos bij gelijke scores stilzwijgend volgens de vaste volgorde R-I-A-S-O-C. Dat is aangepast. De software gebruikt nu `topCodeMeta()`:

- dimensies worden gegroepeerd per score;
- exacte gelijke scores worden zichtbaar vastgelegd;
- bijna-gelijke scores rond de grens worden gemeld;
- de code toont nog steeds een top 3, maar de scorebalken en tie-melding blijven leidend.

Belangrijk: bij gelijke of bijna gelijke scores moet de code niet worden gelezen als harde rangorde. Dan is het profiel breder.

## 6. Hoe worden MBO-opleidingen gewogen?

Elke MBO-record heeft zelf ook een RIASOC-profiel:

```js
sc: { R: 4, I: 9, A: 5, S: 3, O: 5, C: 7 }
```

Deze scores beschrijven wat de opleiding of beroepsrichting vooral vraagt. Een softwareopleiding krijgt bijvoorbeeld expliciet I/C/R of I/A/C, afhankelijk van de inhoud. Een zorgopleiding krijgt S als primaire dimensie. Techniek wordt niet meer als een brede klomp behandeld, maar gescheiden in R/I/C: uitvoeren, analyseren en nauwkeurig werken.

De huidige correctielagen zijn:

| Categorie | Correctieprincipe |
|---|---|
| Entree breed/orienterend | Niet doen alsof een brede entreeopleiding een scherpe RIASOC-code heeft |
| ICT/software | I, C en R expliciet; creatieve software krijgt extra A |
| Techniek | R/I/C gescheiden naar uitvoeren, analyse en nauwkeurigheid |
| Zorg/welzijn/contact | S primair als helpen, begeleiden of contact de kern is |
| Hospitality/contact | S primair bij gastcontact; O hoger bij leiding/ondernemen |
| Creatief/media | A/I/C inhoudelijk gewogen, niet door tie-volgorde |

Na die correctie krijgt elk MBO-record een expliciete `codeMeta` en `code`. De selectie is dus niet meer afhankelijk van lege `code:""` velden of toevallige volgorde in de data.

## 7. Hoe wordt de match berekend?

De match tussen leerling en opleiding is een gewogen overeenkomst tussen twee profielen.

Voor elke dimensie:

```text
leerlingPercentage / 100 * opleidingScore / 10
```

Daarna worden de zes bijdragen bij elkaar opgeteld:

```text
match = som over R, I, A, S, O, C
```

Een opleiding scoort dus hoog als zij sterk is op dimensies waarop de leerling ook hoog scoort.

Voorbeeld in woorden:

- Leerling scoort hoog op S en C.
- Een opleiding met S=10 en C=6 krijgt veel matchbijdrage.
- Een opleiding met vooral R en weinig S krijgt minder matchbijdrage, ook als die opleiding op zichzelf een duidelijke beroepsrichting heeft.

## 8. Niveau-filter

Voor de suggesties wordt ook gekeken naar de gekozen vooropleiding:

| Keuze leerling | Toegestane MBO-niveaus |
|---|---|
| Basis | 2 en 3 |
| Kader | 3 en 4 |
| Gemengde leerweg | 3 en 4 |
| Theoretische leerweg | 3 en 4 |
| Havo | 4 |
| Anders | 2, 3 en 4 |

`niveauMatch()` leest nu ook samengestelde strings goed, bijvoorbeeld:

```text
MBO 3; 3; 4
2, 3, 4; 4
3; 2 / 3
```

Daarmee vallen opleidingen niet weg door rommelige niveau-notatie.

## 9. Waarom ziet de leerling maximaal 8 suggesties?

De software berekent eerst voor alle passende MBO-records een matchscore. Daarna wordt een topselectie gemaakt met spreiding, zodat niet acht bijna dezelfde opleidingen uit dezelfde dominante categorie verschijnen.

De suggestiekaart toont:

- opleiding;
- school en locatie;
- korte motivatie;
- beroepsrollen;
- niveau en leerweg;
- matchpercentage;
- link naar de opleiding als die bekend is.

De motivatie wordt automatisch opgebouwd uit de overlap tussen het leerlingprofiel en het opleidingsprofiel. Daardoor staat er niet alleen "past bij jou", maar ook waarom.

## 10. Datastroom in het kort

```mermaid
flowchart TD
    A["Leerling kiest A of B per vraag"] --> B["Ruwe RIASOC-punten optellen"]
    B --> C["Normaliseren naar percentages"]
    C --> D["Topcode + tie-informatie bepalen"]
    C --> E["MBO-records filteren op niveau"]
    E --> F["MBO-scores inhoudelijk corrigeren"]
    F --> G["Matchscore per opleiding berekenen"]
    G --> H["Top 8 met spreiding tonen"]
    D --> I["Profieltekst, radar en PDF"]
    H --> I
```

## 11. Wat is belangrijk om erbij te vertellen?

De uitslag is een gesprekstarter. Een hoge score betekent: "dit soort situaties sprak je vaak aan". Het betekent niet automatisch dat iemand daar al goed in is of dat andere richtingen niet kunnen.

Gebruik de uitkomst daarom zo:

- Kijk eerst naar de hoogste drie dimensies.
- Kijk daarna naar bijna-gelijke scores.
- Bespreek herkenning: "Klopt dit met wat jij leuk vindt?"
- Gebruik de MBO-suggesties als startpunt voor open dagen, proeflessen en gesprekken.
- Laat leerlingen ook opleidingen bekijken die net buiten de top 8 vallen als ze nieuwsgierig zijn.

## 12. Kwaliteitscontrole

De software controleert op dit moment:

- precies 62 vragen;
- alle vragen hebben een afbeelding;
- Q32-Q62 zijn gevuld;
- elke vraag heeft `pair`, `pairType` en `expectedType`;
- vraagmetadata klopt met de R-I-A-S-O-C hexagon;
- MBO-records hebben expliciete codes;
- niveaufilters herkennen samengestelde notaties;
- PDF gebruikt dezelfde berekening als het schermresultaat.

Bij nieuwe data of nieuwe afbeeldingen moet opnieuw `validateQuestions()` worden uitgevoerd en moeten enkele vaste niveau-testcases slagen.

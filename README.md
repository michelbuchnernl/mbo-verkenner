# MBO Opleidingen Verkenner
### Corbulo Tech & Design College — RIASOC Keuzetool

Een visuele A/B-keuzetool waarmee vmbo-leerlingen ontdekken welke MBO-opleidingen bij hun interesses en talenten kunnen passen. Gebaseerd op het Holland RIASOC-model.

---

## Wat doet het?

Leerlingen kiezen 62 keer tussen twee scènes (Kies A of Kies B). Op basis van hun keuzes wordt een persoonlijk RIASOC-profiel berekend. Daarna krijgen ze een overzicht van passende MBO-opleidingen in de regio NH · ZH · Utrecht, met directe links naar de schoolpagina's.

**Geen diagnose. Geen label. Wel een gespreksstarter.**

---

## Schermen

| Scherm | Beschrijving |
|--------|-------------|
| **Start** | Naam invullen (optioneel), quiz starten |
| **62 vragen** | A/B-keuze tussen twee scènes met afbeelding |
| **Gegevens** | Naam, huidige opleiding (vmbo-track), e-mailadres |
| **Resultaten** | RIASOC-profiel (radardiagram + scores), profieltekst, 8 opleidingssuggesties |
| **PDF** | Downloadbaar 2-pagina rapport |

---

## RIASOC-model

| Letter | Type | Kernwoorden |
|--------|------|-------------|
| **R** | Realistisch | Doen & Maken |
| **I** | Intellectueel | Denken & Analyseren |
| **A** | Artistiek | Creëren & Verbeelden |
| **S** | Sociaal | Helpen & Ondersteunen |
| **O** | Ondernemend | Leiden & Overtuigen |
| **C** | Conventioneel | Ordenen & Structureren |

De 62 vragen zijn verdeeld over tegenovergestelde, afwisselende en aangrenzende RIASOC-paren op basis van de hexagonale Holland-logica.

---

## Opleidingen

46 MBO-opleidingen van 12 scholen in Noord-Holland, Zuid-Holland en Utrecht:

- Techniek College Rotterdam
- HMC (Hout- en Meubileringscollege)
- MBO Rijnland
- ROC Mondriaan / Smart Tech
- ROC van Amsterdam
- Grafisch Lyceum Rotterdam (GLR)
- LIS (Leidse Instrumentmakers School)
- Nimeto
- Euro College
- Zadkine
- Yuverta
- STC

---

## Afbeeldingen

De quiz gebruikt 62 scèneafbeeldingen (16:9 PNG) die via Google Drive worden geladen:

```javascript
const IMG = [
  null,           // index 0 ongebruikt
  /* Q01 */ "DRIVE_FILE_ID",
  /* Q02 */ "DRIVE_FILE_ID",
  // ...
  /* Q62 */ "DRIVE_FILE_ID"
];
```

- Q01–31: beschikbaar
- Q32–62: worden gevuld zodra nieuwe afbeeldingen zijn geüpload naar de Drive-map

Afbeeldingen worden geladen via `https://lh3.googleusercontent.com/d/{fileId}`. Bij ontbrekende ID's verschijnt een placeholder.

---

## Technische opbouw

Één zelfstandig HTML-bestand — geen server, geen build-stap, geen dependencies te installeren.

| Onderdeel | Technologie |
|-----------|------------|
| UI framework | Vanilla JavaScript |
| Grafieken | Chart.js 4.4.0 (CDN) |
| PDF export | jsPDF 2.5.1 + html2canvas 1.4.1 (CDN) |
| Lettertype | Red Hat Text (Google Fonts) |
| Afbeeldingen | Google Drive public URL's |

---

## Snel starten

```bash
# Clone de repo
git clone https://github.com/[gebruikersnaam]/mbo-verkenner.git

# Open het bestand in je browser
open index.html
```

Geen `npm install`. Geen server. Gewoon openen.

---

## Demo verspreiden

| Methode | Hoe | Geschikt voor |
|---------|-----|---------------|
| **GitHub Pages** | Settings → Pages → Source: main | Iedereen met link |
| **Netlify Drop** | Sleep `index.html` op [netlify.com/drop](https://app.netlify.com/drop) | Snelste live URL (10 sec) |
| **E-mailbijlage** | Stuur `.html` bestand mee | Leraren / testers |
| **QR-code** | Genereer QR naar GitHub Pages URL | Posters / op school |

---

## Aanpassen

### Nieuwe afbeeldingen toevoegen

1. Upload 62 PNG-bestanden (16:9) naar de Google Drive-map met `01`–`62` in de bestandsnaam
2. Vraag Claude om de map te scannen en de `IMG`-array te vullen
3. Commit en push

### Nieuwe opleiding toevoegen

Voeg een object toe aan de `MBO` array in `index.html`:

```javascript
{
  o: "Naam opleiding",
  s: "School naam",
  l: "Stad / locatie",
  n: "3",           // MBO-niveau (2/3/4)
  lw: "BOL",        // BOL, BBL of BOL & BBL
  c: "25000",       // CREBO-nummer
  url: "https://school.nl/opleiding",
  sc: { R:5, I:8, A:3, S:2, O:4, C:7 }  // RIASOC-scores 0–10
}
```

### E-mailadressen opslaan (optioneel)

Vul `DB_URL` in met een webhook-endpoint (bijv. Make.com, Zapier of een eigen API):

```javascript
const DB_URL = 'https://jouw-webhook-url.nl/endpoint';
```

---

## Bestandsstructuur

```
mbo-verkenner/
└── index.html          # Volledige quiz (HTML + CSS + JS in één bestand)
└── README.md           # Dit bestand
```

---

## Versies

| Versie | Wat is er veranderd |
|--------|---------------------|
| v1 | 31 vragen, basisopzet |
| v2 | 62 vragen, opleidingslinks, verbeterde MBO-data |
| v3 | Corbulo logo, tekstcorrecties, GitHub-ready |

---

## Context

Ontwikkeld als loopbaanoriëntatietool voor leerlingen van het **Corbulo Tech & Design College** in het kader van een RIASOC-gebaseerd keuzegesprek over MBO-opleidingen in de regio.

Het instrument is bedoeld als **gespreksstarter**, niet als beroepsadvies. De uitkomst is een profiel in beweging — ook de suggesties die *niet* passen kunnen waardevol zijn.

---

## Licentie

Intern gebruik Corbulo Tech & Design College. Neem contact op voor hergebruik.

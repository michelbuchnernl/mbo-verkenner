---
title: RIASOC model-audit
date: 2026-05-01
source: index.html
---

# RIASOC model-audit

Deze audit draait rechtstreeks op de HTML/JS-bron van de MBO Opleidingen Verkenner. Het script simuleert antwoordpatronen, gebruikt dezelfde normalisatie, tie-detectie, niveaufiltering en opleidingsselectie als de website, en maakt zichtbaar of het model voldoende differentieert.

## Conclusie

- Vraagvalidatie: geslaagd.
- Niveau-testcases: geslaagd.
- Scenario's getest: 31.
- Random simulaties: 1000.
- Unieke topcodes in random simulaties: 114.
- Unieke sets van 6 opleidingen in random simulaties: 251.
- Scenario's met kleine verschillen of ties: 15.
- Scenario's met mogelijke diversiteitszwakte in de 6 opleidingen: 0.

Beoordeling: de diversiteit en werking zijn op hoofdlijnen gezond. Kleine verschillen worden zichtbaar via de tie/gap-informatie en leiden niet tot één vaste standaarduitkomst.

## Gecontroleerde methode

1. De audit laadt `index.html` en exporteert de bestaande modeldata en functies in een Node VM-context.
2. Per testprofiel worden 62 keuzes gesimuleerd.
3. Ruwe RIASOC-punten worden genormaliseerd met `norm()`.
4. De topcode en tie-informatie komen uit `topCodeMeta()`.
5. De 6 opleidingen komen uit `selectSuggestions()`.
6. School en locatie worden bepaald met `selectedProvider()`, dus ook de Zuid-Holland-voorkeur wordt getest.

## Scenario-overzicht

| Scenario | Code | Scores | Gaps | Beroepen | Opleidingen | Scholen | Dimensies |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Zuiver R (Realistisch) | RCI | R 100%, I 45%, A 38%, S 36%, O 31%, C 82% | 18/37/7 | 12 | 6/6 | 4 | RCI |
| Zuiver I (Intellectueel) | IAR | R 38%, I 100%, A 92%, S 35%, O 34%, C 37% | 8/54/1 | 12 | 6/6 | 3 | IAR |
| Zuiver A (Artistiek) | AIS | R 35%, I 84%, A 100%, S 51%, O 36%, C 30% | 16/33/15 | 12 | 6/6 | 2 | AIS |
| Zuiver S (Sociaal) | SOA | R 29%, I 31%, A 46%, S 100%, O 90%, C 38% | 10/44/8 | 12 | 6/6 | 3 | SOA |
| Zuiver O (Ondernemend) | OSC | R 27%, I 30%, A 28%, S 91%, O 100%, C 53% | 9/38/23 | 12 | 6/6 | 4 | OSC |
| Zuiver C (Conventioneel) | CRI | R 95%, I 49%, A 22%, S 22%, O 39%, C 100% | 5/46/10 | 12 | 6/6 | 4 | CRI |
| Combinatie RI | IRA | R 89%, I 91%, A 69%, S 14%, O 13%, C 60% | 2/20/9 | 12 | 6/6 | 3 | IRA |
| Combinatie IA | IAS | R 38%, I 97%, A 97%, S 41%, O 31%, C 32% | 0/56/3 | 12 | 6/6 | 2 | IAS |
| Combinatie AS | ASO | R 12%, I 65%, A 88%, S 86%, O 70%, C 16% | 2/16/5 | 12 | 6/6 | 2 | ASO |
| Combinatie SO | SOC | R 27%, I 27%, A 35%, S 97%, O 96%, C 48% | 1/48/13 | 12 | 6/6 | 4 | SOC |
| Combinatie OC | OCS | R 59%, I 26%, A 8%, S 65%, O 86%, C 82% | 4/17/6 | 12 | 6/6 | 3 | OCS |
| Combinatie CR | CRI | R 97%, I 51%, A 22%, S 22%, O 38%, C 99% | 2/46/13 | 12 | 6/6 | 4 | CRI |
| Combinatie RS | SRC | R 80%, I 19%, A 31%, S 82%, O 60%, C 62% | 2/18/2 | 12 | 6/6 | 4 | SRC |
| Combinatie IO | IOA | R 12%, I 82%, A 63%, S 58%, O 75%, C 40% | 7/12/5 | 12 | 6/6 | 2 | IOA |
| Combinatie AC | CRA | R 73%, I 70%, A 71%, S 16%, O 21%, C 80% | 7/2/1 | 12 | 6/6 | 3 | CRA |
| Combinatie RO | ORC | R 80%, I 17%, A 11%, S 64%, O 83%, C 76% | 3/4/12 | 12 | 6/6 | 3 | ORC |
| Combinatie IC | CRI | R 80%, I 77%, A 50%, S 9%, O 26%, C 87% | 7/3/27 | 12 | 6/6 | 4 | CRI |
| Combinatie SA | ASO | R 12%, I 65%, A 88%, S 86%, O 70%, C 16% | 2/16/5 | 12 | 6/6 | 2 | ASO |
| Top-3 RIA | IAR | R 65%, I 97%, A 97%, S 22%, O 10%, C 46% | 0/32/19 | 12 | 6/6 | 3 | IAR |
| Top-3 IAS | AIS | R 15%, I 87%, A 100%, S 66%, O 53%, C 16% | 13/21/13 | 12 | 6/6 | 2 | AIS |
| Top-3 ASO | SOA | R 11%, I 48%, A 74%, S 100%, O 87%, C 17% | 13/13/26 | 12 | 6/6 | 2 | SOA |
| Top-3 SOC | OSC | R 44%, I 16%, A 13%, S 91%, O 100%, C 66% | 9/25/22 | 12 | 6/6 | 3 | OSC |
| Top-3 OCR | CRO | R 95%, I 26%, A 8%, S 43%, O 57%, C 98% | 3/38/14 | 12 | 6/6 | 3 | CRO |
| Top-3 CRI | RCI | R 100%, I 65%, A 35%, S 9%, O 23%, C 97% | 3/32/30 | 12 | 6/6 | 4 | RCI |
| Top-3 SIC | CIS | R 45%, I 70%, A 38%, S 58%, O 44%, C 72% | 2/12/13 | 12 | 6/6 | 3 | CIS |
| Top-3 AIC | IAR | R 64%, I 97%, A 90%, S 14%, O 16%, C 54% | 7/26/10 | 12 | 6/6 | 3 | IAR |
| Top-3 OSC | OSC | R 44%, I 16%, A 13%, S 91%, O 100%, C 66% | 9/25/22 | 12 | 6/6 | 3 | OSC |
| Alle A-antwoorden | IRA | R 80%, I 83%, A 68%, S 24%, O 32%, C 49% | 3/12/19 | 12 | 6/6 | 3 | IRA |
| Alle B-antwoorden | SOC | R 30%, I 30%, A 40%, S 85%, O 78%, C 64% | 7/14/24 | 12 | 6/6 | 4 | SOC |
| Om-en-om A/B | RCI | R 59%, I 56%, A 54%, S 51%, O 56%, C 57% | 2/1/0 | 12 | 6/6 | 5 | RCI |
| Om-en-om B/A | SIC | R 52%, I 57%, A 54%, S 58%, O 55%, C 57% | 1/0/2 | 12 | 6/6 | 3 | SIC |

## Voorbeeldsuggesties

Alle suggesties hieronder zijn de eerste 12 scenario's uit de audit. Dit is bedoeld als steekproef om te zien of de concrete opleidingen niet steeds uit dezelfde school of categorie komen.

| Scenario | Nr | Dim | Opleiding | School | Locatie | Match |
| --- | --- | --- | --- | --- | --- | --- |
| Zuiver R (Realistisch) | 1 | R | Allround medewerker Juwelier | Zadkine | Zadkine Vakschool &#8211; Schoonhoven | 43% |
| Zuiver R (Realistisch) | 2 | R | Specialist Restauratie & Decoratie | Nimeto | Utrecht | 42% |
| Zuiver R (Realistisch) | 3 | C | Medewerker hospitality | ROC Da Vinci College | Dordrecht | 37% |
| Zuiver R (Realistisch) | 4 | C | 010 Bar Academy zelfstandig werkend bartender | ROC Da Vinci College | Dordrecht | 37% |
| Zuiver R (Realistisch) | 5 | I | ICT Support Technician | MBO Rijnland | Gouda, Leiden B&#232;taplein / Lammenschans | 34% |
| Zuiver R (Realistisch) | 6 | I | ICT support technician Defensie (VEVA) | MBO Rijnland | Gouda, Leiden B&#232;taplein / Lammenschans | 34% |
| Zuiver I (Intellectueel) | 1 | I | Mediavormgeven | Grafisch Lyceum Rotterdam | Rotterdam | 38% |
| Zuiver I (Intellectueel) | 2 | I | Redactiemedewerker | Grafisch Lyceum Rotterdam | Rotterdam | 38% |
| Zuiver I (Intellectueel) | 3 | A | Mediamanager | Grafisch Lyceum Rotterdam | Rotterdam | 37% |
| Zuiver I (Intellectueel) | 4 | A | Immersive Experience | Grafisch Lyceum Rotterdam | Rotterdam | 36% |
| Zuiver I (Intellectueel) | 5 | R | Specialist Restauratie & Decoratie | Nimeto | Utrecht | 39% |
| Zuiver I (Intellectueel) | 6 | R | Allround meubelmaker / (scheeps)interieurbouwer | HMC | Amsterdam, Rotterdam | 38% |
| Zuiver A (Artistiek) | 1 | A | Mediavormgeven | Grafisch Lyceum Rotterdam | Rotterdam | 37% |
| Zuiver A (Artistiek) | 2 | A | Mediamanager | Grafisch Lyceum Rotterdam | Rotterdam | 37% |
| Zuiver A (Artistiek) | 3 | I | Redactiemedewerker | Grafisch Lyceum Rotterdam | Rotterdam | 36% |
| Zuiver A (Artistiek) | 4 | I | Immersive Experience | Grafisch Lyceum Rotterdam | Rotterdam | 36% |
| Zuiver A (Artistiek) | 5 | S | Interieurvakman (M/V) (woningstofferen) | HMC | Amsterdam, Rotterdam | 30% |
| Zuiver A (Artistiek) | 6 | S | Allround interieurvakman (M/V) (woningstofferen) | HMC | Amsterdam, Rotterdam | 30% |
| Zuiver S (Sociaal) | 1 | S | Medewerker hospitality | ROC Da Vinci College | Dordrecht | 36% |
| Zuiver S (Sociaal) | 2 | S | 010 Bar Academy zelfstandig werkend bartender | ROC Da Vinci College | Dordrecht | 36% |
| Zuiver S (Sociaal) | 3 | O | Interieuradviseur | HMC | Amsterdam, Rotterdam | 41% |
| Zuiver S (Sociaal) | 4 | O | Interieuradviseur (verkort) | HMC | Amsterdam, Rotterdam | 41% |
| Zuiver S (Sociaal) | 5 | A | Mediamanager | Grafisch Lyceum Rotterdam | Rotterdam | 34% |
| Zuiver S (Sociaal) | 6 | A | Mediamaker | Grafisch Lyceum Rotterdam | Rotterdam | 33% |
| Zuiver O (Ondernemend) | 1 | O | Interieuradviseur | HMC | Amsterdam, Rotterdam | 40% |
| Zuiver O (Ondernemend) | 2 | O | Interieuradviseur (verkort) | HMC | Amsterdam, Rotterdam | 40% |
| Zuiver O (Ondernemend) | 3 | S | Medewerker hospitality | ROC Da Vinci College | Dordrecht | 37% |
| Zuiver O (Ondernemend) | 4 | S | 010 Bar Academy zelfstandig werkend bartender | ROC Da Vinci College | Dordrecht | 37% |
| Zuiver O (Ondernemend) | 5 | C | Juridisch medewerker | ROC Mondriaan | Den Haag | 39% |
| Zuiver O (Ondernemend) | 6 | C | Administratief Medewerker | MBO Rijnland | Leiden B&#232;taplein / Lammenschans | 39% |
| Zuiver C (Conventioneel) | 1 | C | Medewerker hospitality | ROC Da Vinci College | Dordrecht | 37% |
| Zuiver C (Conventioneel) | 2 | C | 010 Bar Academy zelfstandig werkend bartender | ROC Da Vinci College | Dordrecht | 37% |
| Zuiver C (Conventioneel) | 3 | R | Specialist Restauratie & Decoratie | Nimeto | Utrecht | 43% |
| Zuiver C (Conventioneel) | 4 | R | Werkvoorbereider elektro | Techniek College Rotterdam | Scheepsbouwweg 11/15 | 43% |
| Zuiver C (Conventioneel) | 5 | I | ICT Support Technician | MBO Rijnland | Gouda, Leiden B&#232;taplein / Lammenschans | 35% |
| Zuiver C (Conventioneel) | 6 | I | ICT support technician Defensie (VEVA) | MBO Rijnland | Gouda, Leiden B&#232;taplein / Lammenschans | 35% |
| Combinatie RI | 1 | I | Mediavormgeven | Grafisch Lyceum Rotterdam | Rotterdam | 36% |
| Combinatie RI | 2 | I | Redactiemedewerker | Grafisch Lyceum Rotterdam | Rotterdam | 36% |
| Combinatie RI | 3 | R | Specialist Restauratie & Decoratie | Nimeto | Utrecht | 44% |
| Combinatie RI | 4 | R | Allround meubelmaker / (scheeps)interieurbouwer | HMC | Amsterdam, Rotterdam | 43% |
| Combinatie RI | 5 | A | Standbouwer | Nimeto | Utrecht | 35% |
| Combinatie RI | 6 | A | Immersive Experience | Grafisch Lyceum Rotterdam | Rotterdam | 35% |
| Combinatie IA | 1 | I | Mediavormgeven | Grafisch Lyceum Rotterdam | Rotterdam | 38% |
| Combinatie IA | 2 | I | Redactiemedewerker | Grafisch Lyceum Rotterdam | Rotterdam | 37% |
| Combinatie IA | 3 | A | Mediamanager | Grafisch Lyceum Rotterdam | Rotterdam | 37% |
| Combinatie IA | 4 | A | Immersive Experience | Grafisch Lyceum Rotterdam | Rotterdam | 36% |
| Combinatie IA | 5 | S | 010 Academy Beautystylist | ROC Da Vinci College | Dordrecht, Gorinchem | 29% |
| Combinatie IA | 6 | S | Baangarantie Junior Hairstylist i.s.m. PVNL | ROC Da Vinci College | Dordrecht, Gorinchem | 29% |
| Combinatie AS | 1 | A | Mediamanager | Grafisch Lyceum Rotterdam | Rotterdam | 37% |
| Combinatie AS | 2 | A | Mediamaker | Grafisch Lyceum Rotterdam | Rotterdam | 37% |
| Combinatie AS | 3 | S | Interieurvakman (M/V) (woningstofferen) | HMC | Amsterdam, Rotterdam | 34% |
| Combinatie AS | 4 | S | Allround interieurvakman (M/V) (woningstofferen) | HMC | Amsterdam, Rotterdam | 34% |
| Combinatie AS | 5 | O | Interieuradviseur | HMC | Amsterdam, Rotterdam | 39% |
| Combinatie AS | 6 | O | Interieuradviseur (verkort) | HMC | Amsterdam, Rotterdam | 39% |
| Combinatie SO | 1 | S | Medewerker hospitality | ROC Da Vinci College | Dordrecht | 37% |
| Combinatie SO | 2 | S | 010 Bar Academy zelfstandig werkend bartender | ROC Da Vinci College | Dordrecht | 37% |
| Combinatie SO | 3 | O | Interieuradviseur | HMC | Amsterdam, Rotterdam | 40% |
| Combinatie SO | 4 | O | Interieuradviseur (verkort) | HMC | Amsterdam, Rotterdam | 40% |
| Combinatie SO | 5 | C | Juridisch medewerker | ROC Mondriaan | Den Haag | 38% |
| Combinatie SO | 6 | C | Administratief Medewerker | MBO Rijnland | Leiden B&#232;taplein / Lammenschans | 38% |
| Combinatie OC | 1 | O | Management transport en logistiek | Zadkine | Zadkine Prins Alexanderlaan &#8211; Rotterdam Oost | 37% |
| Combinatie OC | 2 | O | Logistiek supervisor | ROC Da Vinci College | Dordrecht | 37% |
| Combinatie OC | 3 | C | Medewerker hospitality | ROC Da Vinci College | Dordrecht | 40% |
| Combinatie OC | 4 | C | 010 Bar Academy zelfstandig werkend bartender | ROC Da Vinci College | Dordrecht | 40% |
| Combinatie OC | 5 | S | Zelfstandig Medewerker Hospitality | ROC Da Vinci College | Dordrecht | 40% |
| Combinatie OC | 6 | S | Zelfstandig medewerker leisure | ROC Mondriaan | Den Haag | 40% |
| Combinatie CR | 1 | C | Medewerker hospitality | ROC Da Vinci College | Dordrecht | 38% |
| Combinatie CR | 2 | C | 010 Bar Academy zelfstandig werkend bartender | ROC Da Vinci College | Dordrecht | 38% |
| Combinatie CR | 3 | R | Werkvoorbereider elektro | Techniek College Rotterdam | Scheepsbouwweg 11/15 | 43% |
| Combinatie CR | 4 | R | Specialist Restauratie & Decoratie | Nimeto | Utrecht | 43% |
| Combinatie CR | 5 | I | ICT Support Technician | MBO Rijnland | Gouda, Leiden B&#232;taplein / Lammenschans | 35% |
| Combinatie CR | 6 | I | ICT support technician Defensie (VEVA) | MBO Rijnland | Gouda, Leiden B&#232;taplein / Lammenschans | 35% |

## Random simulaties

### Topcode-spreiding

| Code | Aantal |
| --- | --- |
| RCI | 50 |
| CRI | 37 |
| RCS | 30 |
| IAC | 28 |
| IAR | 27 |
| IAS | 26 |
| IAO | 24 |
| SOC | 23 |
| ICA | 22 |
| SOA | 22 |
| OSC | 22 |
| OSI | 20 |
| AIS | 20 |
| AIO | 19 |
| RIC | 19 |

### Eerste dimensie

| Dimensie | Aantal |
| --- | --- |
| R | 214 |
| I | 232 |
| A | 130 |
| S | 150 |
| O | 144 |
| C | 130 |

### Kleine verschillen

- Aantal random cases met top-gaps van 2 punten of minder, of exacte ties: 853.
- Voorbeelden:

- Random 3: ISA, R 56%, I 66%, A 57%, S 58%, O 43%, C 53%, gaps 8/1/1
- Random 5: COI, R 50%, I 56%, A 49%, S 54%, O 58%, C 63%, gaps 5/2/2
- Random 6: COR, R 56%, I 51%, A 54%, S 50%, O 58%, C 62%, gaps 4/2/2
- Random 7: IRC, R 56%, I 68%, A 50%, S 49%, O 55%, C 56%, gaps 12/0/1
- Random 8: SAI, R 32%, I 58%, A 65%, S 70%, O 57%, C 49%, gaps 5/7/1
- Random 9: IRA, R 61%, I 62%, A 56%, S 54%, O 45%, C 56%, gaps 1/5/0
- Random 10: ARI, R 58%, I 55%, A 60%, S 54%, O 55%, C 53%, gaps 2/3/0
- Random 11: RSO, R 59%, I 52%, A 53%, S 59%, O 56%, C 54%, gaps 0/3/2

### Meest voorkomende opleidingensets

- 31x: Interieuradviseur|HMC / Interieuradviseur (verkort)|HMC / Medewerker hospitality|ROC Da Vinci College / 010 Bar Academy zelfstandig werkend bartender|ROC Da Vinci College / Zelfstandig Medewerker Hospitality|ROC Da Vinci College / Zelfstandig medewerker leisure|ROC Mondriaan
- 28x: Allround medewerker Juwelier|Zadkine / Werkvoorbereider elektro|Techniek College Rotterdam / Medewerker hospitality|ROC Da Vinci College / 010 Bar Academy zelfstandig werkend bartender|ROC Da Vinci College / Zelfstandig Medewerker Hospitality|ROC Da Vinci College / Zelfstandig medewerker leisure|ROC Mondriaan
- 28x: Medewerker hospitality|ROC Da Vinci College / 010 Bar Academy zelfstandig werkend bartender|ROC Da Vinci College / Interieuradviseur|HMC / Interieuradviseur (verkort)|HMC / Zelfstandig Medewerker Hospitality|ROC Da Vinci College / Zelfstandig medewerker leisure|ROC Mondriaan
- 22x: Medewerker hospitality|ROC Da Vinci College / 010 Bar Academy zelfstandig werkend bartender|ROC Da Vinci College / Interieuradviseur|HMC / Interieuradviseur (verkort)|HMC / Mediamanager|Grafisch Lyceum Rotterdam / Mediavormgeven|Grafisch Lyceum Rotterdam
- 18x: Mediavormgeven|Grafisch Lyceum Rotterdam / Redactiemedewerker|Grafisch Lyceum Rotterdam / Mediamanager|Grafisch Lyceum Rotterdam / Immersive Experience|Grafisch Lyceum Rotterdam / Interieuradviseur|HMC / Interieuradviseur (verkort)|HMC

## Validatievragen

- Alle 62 vragen zijn valide.

## Niveau-testcases

| Input | Levels | Parsed | Expected | Actual | OK |
| --- | --- | --- | --- | --- | --- |
| MBO 3; 3; 4 | 3 | 3,4 | true | true | true |
| MBO 3; 3; 4 | 2 | 3,4 | false | false | true |
| 2, 3, 4; 4 | 2 | 2,3,4 | true | true | true |
| 2, 3, 4; 4 | 4 | 2,3,4 | true | true | true |
| 3; 2 / 3 | 2 | 3,2 | true | true | true |
| 3; 2 / 3 | 4 | 3,2 | false | false | true |

## Mogelijke vervolgchecks

- Bespreek scenario's met kleine gaps als brede profielen, niet als harde rangorde.
- Controleer bij toekomstige MBO-data of `random.uniqueSuggestionSets` hoog blijft.
- Kijk handmatig naar scenario's waar minder dan drie dimensies terugkomen in de zes opleidingen.
- Herhaal deze audit na elke inhoudelijke wijziging in vragen, wegingen of MBO-records.

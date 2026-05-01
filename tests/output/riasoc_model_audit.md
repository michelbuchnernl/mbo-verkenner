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
- Scenario's getest: 50.
- CSV met 50 simulaties: `tests/output/riasoc_50_simulaties.csv`.
- Random simulaties: 1000.
- Unieke topcodes in random simulaties: 114.
- Unieke sets van 6 opleidingen in random simulaties: 443.
- Scenario's met kleine verschillen of ties: 25.
- Scenario's met mogelijke diversiteitszwakte in de 6 opleidingen: 0.
- Classificatie-waarschuwingen: 0.

Beoordeling: de diversiteit en werking zijn op hoofdlijnen gezond. Kleine verschillen worden zichtbaar via de tie/gap-informatie en leiden niet tot één vaste standaarduitkomst.

## Gecontroleerde methode

1. De audit laadt `index.html` en exporteert de bestaande modeldata en functies in een Node VM-context.
2. Per testprofiel worden 62 keuzes gesimuleerd.
3. Ruwe RIASOC-punten worden genormaliseerd met `norm()`.
4. De topcode en tie-informatie komen uit `topCodeMeta()`.
5. De 6 opleidingen komen uit `selectSuggestions()`.
6. School en locatie worden bepaald met `selectedProvider()`, dus ook de Zuid-Holland-voorkeur wordt getest.

De classificatie-dump staat in:

```text
tests/output/riasoc_classificatie_dump.csv
```

## Scenario-overzicht

| Scenario | Code | Scores | Gaps | Beroepen | Opleidingen | Scholen | Dimensies |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Zuiver R (Realistisch) | RCI | R 100%, I 47%, A 40%, S 40%, O 26%, C 72% | 28/25/7 | 12 | 6/6 | 4 | RCI |
| Zuiver I (Intellectueel) | IAR | R 41%, I 100%, A 90%, S 37%, O 33%, C 28% | 10/49/4 | 12 | 6/6 | 4 | AIR |
| Zuiver A (Artistiek) | AIS | R 35%, I 85%, A 100%, S 49%, O 31%, C 28% | 15/36/14 | 12 | 6/6 | 4 | AIS |
| Zuiver S (Sociaal) | SOA | R 30%, I 30%, A 43%, S 100%, O 79%, C 36% | 21/36/7 | 12 | 6/6 | 5 | OSA |
| Zuiver O (Ondernemend) | OSC | R 30%, I 32%, A 29%, S 81%, O 100%, C 44% | 19/37/12 | 12 | 6/6 | 4 | OSC |
| Zuiver C (Conventioneel) | CRI | R 89%, I 49%, A 28%, S 28%, O 23%, C 100% | 11/40/21 | 12 | 6/6 | 5 | RCI |
| Combinatie RI | IRA | R 89%, I 92%, A 71%, S 20%, O 10%, C 49% | 3/18/22 | 12 | 6/6 | 5 | RAI |
| Combinatie RA | RAI | R 85%, I 71%, A 85%, S 32%, O 9%, C 50% | 0/14/21 | 12 | 6/6 | 4 | RAI |
| Combinatie RS | SRO | R 82%, I 20%, A 29%, S 85%, O 54%, C 53% | 3/28/1 | 12 | 6/6 | 4 | RSO |
| Combinatie RO | ORS | R 83%, I 22%, A 15%, S 60%, O 86%, C 55% | 3/23/5 | 12 | 6/6 | 5 | ROS |
| Combinatie RC | CRI | R 94%, I 49%, A 28%, S 28%, O 23%, C 97% | 3/45/21 | 12 | 6/6 | 5 | RCI |
| Combinatie IA | IAR | R 41%, I 97%, A 97%, S 40%, O 29%, C 26% | 0/56/1 | 12 | 6/6 | 3 | AIR |
| Combinatie IS | ISA | R 20%, I 84%, A 75%, S 83%, O 50%, C 14% | 1/8/25 | 12 | 6/6 | 4 | OISA |
| Combinatie IO | IOA | R 20%, I 85%, A 63%, S 53%, O 79%, C 23% | 6/16/10 | 12 | 6/6 | 4 | OIA |
| Combinatie IC | CRI | R 74%, I 72%, A 53%, S 19%, O 13%, C 89% | 15/2/19 | 12 | 6/6 | 5 | RCI |
| Combinatie AS | SAI | R 14%, I 65%, A 83%, S 89%, O 61%, C 13% | 6/18/4 | 12 | 6/6 | 5 | OSAI |
| Combinatie AO | OAS | R 14%, I 57%, A 88%, S 67%, O 89%, C 12% | 1/21/10 | 12 | 6/6 | 5 | OAS |
| Combinatie AC | CAR | R 68%, I 67%, A 74%, S 21%, O 6%, C 85% | 11/6/1 | 12 | 6/6 | 5 | RCA |
| Combinatie SO | OSC | R 30%, I 28%, A 29%, S 88%, O 100%, C 41% | 12/47/11 | 12 | 6/6 | 4 | OSC |
| Combinatie SC | SCR | R 58%, I 16%, A 17%, S 88%, O 51%, C 83% | 5/25/7 | 12 | 6/6 | 4 | RSC |
| Combinatie OC | OCS | R 53%, I 28%, A 11%, S 57%, O 84%, C 80% | 4/23/4 | 12 | 6/6 | 5 | COS |
| Top-3 RIA | IAR | R 68%, I 97%, A 97%, S 22%, O 6%, C 40% | 0/29/28 | 12 | 6/6 | 4 | RAI |
| Top-3 RIS | IRS | R 71%, I 76%, A 56%, S 68%, O 25%, C 33% | 5/3/12 | 12 | 6/6 | 4 | RIS |
| Top-3 RIO | IRO | R 73%, I 77%, A 43%, S 32%, O 65%, C 37% | 4/8/22 | 12 | 6/6 | 4 | RIO |
| Top-3 RIC | CRI | R 94%, I 59%, A 39%, S 19%, O 13%, C 97% | 3/35/20 | 12 | 6/6 | 5 | RCI |
| Top-3 RAS | SAR | R 67%, I 51%, A 68%, S 74%, O 36%, C 33% | 6/1/16 | 12 | 6/6 | 6 | RSA |
| Top-3 RAO | OAR | R 68%, I 43%, A 72%, S 46%, O 75%, C 27% | 3/4/22 | 12 | 6/6 | 5 | RAO |
| Top-3 RAC | RCI | R 94%, I 59%, A 54%, S 21%, O 6%, C 88% | 6/29/5 | 12 | 6/6 | 5 | RCI |
| Top-3 RSO | OSR | R 52%, I 18%, A 15%, S 88%, O 100%, C 46% | 12/36/6 | 12 | 6/6 | 4 | RSO |
| Top-3 RSC | RCS | R 94%, I 16%, A 17%, S 67%, O 38%, C 87% | 7/20/29 | 12 | 6/6 | 4 | RCS |
| Top-3 ROC | RCO | R 94%, I 28%, A 11%, S 37%, O 54%, C 94% | 0/40/17 | 12 | 6/6 | 6 | RCO |
| Top-3 IAS | AIS | R 20%, I 87%, A 97%, S 67%, O 45%, C 12% | 10/20/22 | 12 | 6/6 | 4 | AIS |
| Top-3 IAO | IAO | R 20%, I 96%, A 92%, S 43%, O 65%, C 12% | 4/27/22 | 12 | 6/6 | 4 | AIO |
| Top-3 IAC | IAR | R 58%, I 97%, A 94%, S 19%, O 3%, C 56% | 3/36/2 | 12 | 6/6 | 4 | RAI |
| Top-3 ISO | OSI | R 20%, I 52%, A 50%, S 85%, O 98%, C 17% | 13/33/2 | 12 | 6/6 | 5 | OSI |
| Top-3 ISC | CIS | R 42%, I 66%, A 35%, S 64%, O 28%, C 79% | 13/2/22 | 12 | 6/6 | 5 | RCIS |
| Top-3 IOC | COI | R 38%, I 62%, A 38%, S 38%, O 68%, C 71% | 3/6/24 | 12 | 6/6 | 5 | COI |
| Top-3 ASO | SOA | R 14%, I 51%, A 69%, S 95%, O 83%, C 12% | 12/14/18 | 12 | 6/6 | 5 | OSA |
| Top-3 ASC | SCA | R 36%, I 38%, A 60%, S 79%, O 35%, C 68% | 11/8/22 | 12 | 6/6 | 4 | RSCA |
| Top-3 AOC | OCA | R 32%, I 38%, A 53%, S 42%, O 79%, C 71% | 8/18/11 | 12 | 6/6 | 5 | COA |
| Top-3 SOC | OSC | R 41%, I 15%, A 11%, S 85%, O 100%, C 61% | 15/24/20 | 12 | 6/6 | 4 | OSC |
| Alle A-antwoorden | IRA | R 76%, I 80%, A 69%, S 26%, O 25%, C 52% | 4/7/17 | 12 | 6/6 | 5 | RIA |
| Alle B-antwoorden | SOC | R 33%, I 33%, A 39%, S 80%, O 78%, C 53% | 2/25/14 | 12 | 6/6 | 4 | OSC |
| Om-en-om A/B | RIA | R 58%, I 56%, A 54%, S 49%, O 54%, C 52% | 2/2/0 | 12 | 6/6 | 4 | RIA |
| Om-en-om B/A | ISA | R 52%, I 57%, A 54%, S 57%, O 49%, C 53% | 0/3/1 | 12 | 6/6 | 5 | RISA |
| Seeded random 1 | RAI | R 64%, I 57%, A 60%, S 48%, O 50%, C 47% | 4/3/7 | 12 | 6/6 | 4 | RAI |
| Seeded random 2 | OSR | R 52%, I 38%, A 49%, S 59%, O 71%, C 52% | 12/7/0 | 12 | 6/6 | 4 | ROS |
| Seeded random 3 | AIO | R 44%, I 61%, A 64%, S 48%, O 59%, C 47% | 3/2/11 | 12 | 6/6 | 5 | RAIO |
| Seeded random 4 | CRA | R 58%, I 49%, A 57%, S 46%, O 50%, C 62% | 4/1/7 | 12 | 6/6 | 4 | RCA |
| Seeded random 5 | RSA | R 65%, I 52%, A 53%, S 62%, O 39%, C 53% | 3/9/0 | 12 | 6/6 | 6 | RSA |

## Voorbeeldsuggesties

Alle suggesties hieronder zijn de eerste 12 scenario's uit de audit. Dit is bedoeld als steekproef om te zien of de concrete opleidingen niet steeds uit dezelfde school of categorie komen.

| Scenario | Nr | Dim | Familie | Opleiding | School | Locatie | Match |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Zuiver R (Realistisch) | 1 | R | Techniek & maken | Pianotechnicus | HMC | Amsterdam | 38% |
| Zuiver R (Realistisch) | 2 | C | Administratie & juridisch | Administratief Medewerker | MBO Rijnland | Leiden B&#232;taplein / Lammenschans | 30% |
| Zuiver R (Realistisch) | 3 | R | Techniek & maken | Keukenmonteur | HMC | Amsterdam, Rotterdam | 38% |
| Zuiver R (Realistisch) | 4 | C | Horeca & toerisme | Boulanger | MBO Rijnland | Leiden B&#232;taplein / Lammenschans | 38% |
| Zuiver R (Realistisch) | 5 | I | Laboratorium & onderzoek | Allround laborant | Techniek College Rotterdam | Jan Ligthartstraat | 37% |
| Zuiver R (Realistisch) | 6 | I | Veiligheid & defensie | VeVa Bedrijfsautotechnicus | ROC Mondriaan | Den Haag | 37% |
| Zuiver I (Intellectueel) | 1 | A | Techniek & maken | Creatief vakman (ontwerpen en maken met hout) | HMC | Amsterdam | 35% |
| Zuiver I (Intellectueel) | 2 | A | Creatief & media | Fotografie | Grafisch Lyceum Rotterdam | Rotterdam | 35% |
| Zuiver I (Intellectueel) | 3 | I | Uiterlijke verzorging | Assistant Fashion Tailor | Zadkine | Zadkine Benthemplein &#8211; Rotterdam Centrum | 35% |
| Zuiver I (Intellectueel) | 4 | I | Uiterlijke verzorging | Fashion Retailer | Zadkine | Zadkine Benthemplein &#8211; Rotterdam Centrum | 35% |
| Zuiver I (Intellectueel) | 5 | R | Creatief & media | AV-Specialist | Grafisch Lyceum Rotterdam | Rotterdam | 33% |
| Zuiver I (Intellectueel) | 6 | R | Techniek & maken | Medewerker productietechniek | ROC Da Vinci College | Dordrecht | 32% |
| Zuiver A (Artistiek) | 1 | A | Techniek & maken | Creatief vakman (ontwerpen en maken met hout) | HMC | Amsterdam | 35% |
| Zuiver A (Artistiek) | 2 | A | Creatief & media | Fotografie | Grafisch Lyceum Rotterdam | Rotterdam | 35% |
| Zuiver A (Artistiek) | 3 | I | Uiterlijke verzorging | Assistant Fashion Tailor | Zadkine | Zadkine Benthemplein &#8211; Rotterdam Centrum | 35% |
| Zuiver A (Artistiek) | 4 | I | Uiterlijke verzorging | Fashion Retailer | Zadkine | Zadkine Benthemplein &#8211; Rotterdam Centrum | 35% |
| Zuiver A (Artistiek) | 5 | S | Commercieel & ondernemend | Intercedent | ROC Mondriaan | Den Haag | 31% |
| Zuiver A (Artistiek) | 6 | S | Commercieel & ondernemend | Commercieel medewerker | ROC Mondriaan | Den Haag | 31% |
| Zuiver S (Sociaal) | 1 | O | Commercieel & ondernemend | Intercedent | ROC Mondriaan | Den Haag | 37% |
| Zuiver S (Sociaal) | 2 | S | Zorg & welzijn | Mbo-Verpleegkundige | ROC Mondriaan | Den Haag, Delft, Leiden | 31% |
| Zuiver S (Sociaal) | 3 | S | Commercieel & ondernemend | 010 E-com Academy | MBO Rijnland | Woerden, Zoetermeer Van Doornenplantsoen | 37% |
| Zuiver S (Sociaal) | 4 | O | Horeca & toerisme | Evenementen & Hotelmanagement | Euro College | Amsterdam, Rotterdam, Utrecht, Groningen | 36% |
| Zuiver S (Sociaal) | 5 | A | Techniek & maken | Creatief vakman (ontwerpen en maken met hout) | HMC | Amsterdam | 28% |
| Zuiver S (Sociaal) | 6 | A | Uiterlijke verzorging | Assistant Fashion Tailor | Zadkine | Zadkine Benthemplein &#8211; Rotterdam Centrum | 28% |
| Zuiver O (Ondernemend) | 1 | O | Commercieel & ondernemend | Intercedent | ROC Mondriaan | Den Haag | 38% |
| Zuiver O (Ondernemend) | 2 | S | Zorg & welzijn | Mbo-Verpleegkundige | ROC Mondriaan | Den Haag, Delft, Leiden | 30% |
| Zuiver O (Ondernemend) | 3 | O | Commercieel & ondernemend | 010 E-com Academy | MBO Rijnland | Woerden, Zoetermeer Van Doornenplantsoen | 38% |
| Zuiver O (Ondernemend) | 4 | S | Horeca & toerisme | Evenementen & Hotelmanagement | Euro College | Amsterdam, Rotterdam, Utrecht, Groningen | 36% |
| Zuiver O (Ondernemend) | 5 | C | Administratie & juridisch | Administratief Medewerker | MBO Rijnland | Leiden B&#232;taplein / Lammenschans | 36% |
| Zuiver O (Ondernemend) | 6 | C | Administratie & juridisch | Business Administration & Control Specialist | ROC Da Vinci College | Dordrecht | 36% |
| Zuiver C (Conventioneel) | 1 | R | Techniek & maken | Medewerker productietechniek | ROC Da Vinci College | Dordrecht | 39% |
| Zuiver C (Conventioneel) | 2 | C | Administratie & juridisch | Administratief Medewerker | MBO Rijnland | Leiden B&#232;taplein / Lammenschans | 32% |
| Zuiver C (Conventioneel) | 3 | C | Techniek & maken | Pianotechnicus | HMC | Amsterdam | 38% |
| Zuiver C (Conventioneel) | 4 | R | Laboratorium & onderzoek | Allround laborant | Techniek College Rotterdam | Jan Ligthartstraat | 38% |
| Zuiver C (Conventioneel) | 5 | I | Laboratorium & onderzoek | Chemisch fysisch analist | MBO Rijnland | Leiden Zernikedreef | 38% |
| Zuiver C (Conventioneel) | 6 | I | Veiligheid & defensie | VeVa Bedrijfsautotechnicus | ROC Mondriaan | Den Haag | 38% |
| Combinatie RI | 1 | R | Techniek & maken | Medewerker productietechniek | ROC Da Vinci College | Dordrecht | 39% |
| Combinatie RI | 2 | A | Creatief & media | AV-Specialist | Grafisch Lyceum Rotterdam | Rotterdam | 34% |
| Combinatie RI | 3 | I | Techniek & maken | Allround meubelmaker / (scheeps)interieurbouwer | HMC | Amsterdam, Rotterdam | 37% |
| Combinatie RI | 4 | I | Laboratorium & onderzoek | Allround laborant | Techniek College Rotterdam | Jan Ligthartstraat | 37% |
| Combinatie RI | 5 | R | Laboratorium & onderzoek | Chemisch fysisch analist | MBO Rijnland | Leiden Zernikedreef | 37% |
| Combinatie RI | 6 | A | Creatief & media | Podium- en evenemententechnicus | Grafisch Lyceum Rotterdam | Rotterdam | 34% |
| Combinatie RA | 1 | R | Techniek & maken | Pianotechnicus | HMC | Amsterdam | 37% |
| Combinatie RA | 2 | A | Creatief & media | AV-Specialist | Grafisch Lyceum Rotterdam | Rotterdam | 34% |
| Combinatie RA | 3 | R | Techniek & maken | Keukenmonteur | HMC | Amsterdam, Rotterdam | 37% |
| Combinatie RA | 4 | A | Creatief & media | Podium- en evenemententechnicus | Grafisch Lyceum Rotterdam | Rotterdam | 34% |
| Combinatie RA | 5 | I | Laboratorium & onderzoek | Allround laborant | Techniek College Rotterdam | Jan Ligthartstraat | 35% |
| Combinatie RA | 6 | I | Laboratorium & onderzoek | Chemisch fysisch analist | MBO Rijnland | Leiden Zernikedreef | 35% |
| Combinatie RS | 1 | R | Voeding, natuur & dier | Gespecialiseerd productiemedewerker voedingsmiddelenindustrie (VAPRO) | Lentiz | MBO LIFE College (Schiedam) | 39% |
| Combinatie RS | 2 | S | Zorg & welzijn | Mbo-Verpleegkundige | ROC Mondriaan | Den Haag, Delft, Leiden | 30% |
| Combinatie RS | 3 | S | Horeca & toerisme | Kok | ROC Da Vinci College | Dordrecht | 38% |
| Combinatie RS | 4 | R | Horeca & toerisme | Medewerker foodservice | ROC Mondriaan | Den Haag | 38% |
| Combinatie RS | 5 | O | Logistiek & transport | Logistiek supervisor | ROC Da Vinci College | Dordrecht | 34% |
| Combinatie RS | 6 | O | Overig | Allround Facilitair Medewerker | MBO Rijnland | Gouda, Leiden Storm Buysingstraat | 34% |
| Combinatie RO | 1 | R | Horeca & toerisme | Kok | ROC Da Vinci College | Dordrecht | 39% |
| Combinatie RO | 2 | R | Techniek & maken | Pianotechnicus | HMC | Amsterdam | 35% |
| Combinatie RO | 3 | O | Logistiek & transport | Logistiek supervisor | ROC Da Vinci College | Dordrecht | 36% |
| Combinatie RO | 4 | O | Horeca & toerisme | 010 Event Academy | Euro College | Zadkine Benthemplein &#8211; Rotterdam Centrum | 35% |
| Combinatie RO | 5 | S | Voeding, natuur & dier | Gespecialiseerd productiemedewerker voedingsmiddelenindustrie (VAPRO) | Lentiz | MBO LIFE College (Schiedam) | 39% |
| Combinatie RO | 6 | S | Administratie & juridisch | Administratief Medewerker | MBO Rijnland | Leiden B&#232;taplein / Lammenschans | 35% |
| Combinatie RC | 1 | R | Techniek & maken | Medewerker productietechniek | ROC Da Vinci College | Dordrecht | 39% |
| Combinatie RC | 2 | C | Administratie & juridisch | Administratief Medewerker | MBO Rijnland | Leiden B&#232;taplein / Lammenschans | 32% |
| Combinatie RC | 3 | C | Techniek & maken | Pianotechnicus | HMC | Amsterdam | 39% |
| Combinatie RC | 4 | R | Laboratorium & onderzoek | Allround laborant | Techniek College Rotterdam | Jan Ligthartstraat | 38% |
| Combinatie RC | 5 | I | Laboratorium & onderzoek | Chemisch fysisch analist | MBO Rijnland | Leiden Zernikedreef | 38% |
| Combinatie RC | 6 | I | Veiligheid & defensie | VeVa Bedrijfsautotechnicus | ROC Mondriaan | Den Haag | 38% |
| Combinatie IA | 1 | A | Techniek & maken | Creatief vakman (ontwerpen en maken met hout) | HMC | Amsterdam | 36% |
| Combinatie IA | 2 | A | Creatief & media | Fotografie | Grafisch Lyceum Rotterdam | Rotterdam | 36% |
| Combinatie IA | 3 | I | Uiterlijke verzorging | Assistant Fashion Tailor | Zadkine | Zadkine Benthemplein &#8211; Rotterdam Centrum | 36% |
| Combinatie IA | 4 | I | Uiterlijke verzorging | Fashion Retailer | Zadkine | Zadkine Benthemplein &#8211; Rotterdam Centrum | 36% |
| Combinatie IA | 5 | R | Creatief & media | AV-Specialist | Grafisch Lyceum Rotterdam | Rotterdam | 33% |
| Combinatie IA | 6 | R | Techniek & maken | Pianotechnicus | HMC | Amsterdam | 32% |

## Analyse 50 simulaties

De 50 simulaties bestaan uit:

- 6 zuivere profielen: R, I, A, S, O, C;
- 15 tweedimensionale combinaties;
- 20 driedimensionale combinaties;
- 4 vaste patronen: alle A, alle B, om-en-om A/B, om-en-om B/A;
- 5 seeded random profielen.

Alle 50 simulaties zijn als tabel weggeschreven naar:

```text
tests/output/riasoc_50_simulaties.csv
```

### Meest voorkomende opleidingen in 50 simulaties

| Opleiding | Aantal |
| --- | --- |
| Creatief vakman (ontwerpen en maken met hout) | 23 |
| Intercedent | 19 |
| Administratief Medewerker | 18 |
| Assistant Fashion Tailor | 17 |
| Gespecialiseerd productiemedewerker voedingsmiddelenindustrie (VAPRO) | 16 |
| Pianotechnicus | 16 |
| Mbo-Verpleegkundige | 15 |
| Fotografie | 14 |
| Allround laborant | 13 |
| Boulanger | 12 |
| Medewerker productietechniek | 12 |
| Kok | 10 |
| Chemisch fysisch analist | 9 |
| Fashion Retailer | 9 |
| AV-Specialist | 8 |
| Business Administration & Control Specialist | 8 |
| Commercieel medewerker | 8 |
| 010 E-com Academy | 7 |
| 010 Event Academy | 7 |
| Allround meubelmaker / (scheeps)interieurbouwer | 7 |

### Meest voorkomende CREBO's

| CREBO | Aantal |
| --- | --- |
| 25548 | 23 |
| 25136 | 19 |
| 25723 | 18 |
| 25684 | 17 |
| 25663 | 16 |
| 25979 | 16 |
| 25655 | 15 |
| 25718 | 14 |
| 25044 | 13 |
| 25614 | 12 |
| 25894 | 12 |
| 27060 | 10 |
| 25685 | 9 |
| 25952 | 9 |
| 25717 | 8 |
| 25725 | 8 |
| 25874 | 8 |
| 25017 | 7 |
| 25749 | 7 |
| 25876 | 7 |

### Meest voorkomende scholen

| School | Aantal |
| --- | --- |
| ROC Mondriaan | 64 |
| HMC | 48 |
| MBO Rijnland | 47 |
| ROC Da Vinci College | 41 |
| Grafisch Lyceum Rotterdam | 30 |
| Zadkine | 26 |
| Lentiz | 16 |
| Techniek College Rotterdam | 15 |
| Euro College | 13 |

Hoogste schoolconcentratie: ROC Mondriaan met 64/300 slots (21%).

### Sectorfamilies in alle suggesties

| Familie | Aantal |
| --- | --- |
| Techniek & maken | 62 |
| Horeca & toerisme | 46 |
| Commercieel & ondernemend | 40 |
| Administratie & juridisch | 30 |
| Creatief & media | 26 |
| Uiterlijke verzorging | 26 |
| Laboratorium & onderzoek | 22 |
| Voeding, natuur & dier | 16 |
| Zorg & welzijn | 15 |
| ICT & data | 6 |
| Veiligheid & defensie | 6 |
| Logistiek & transport | 3 |
| Onderwijs & sport | 1 |
| Overig | 1 |

Hoogste sectorfamilieconcentratie: Techniek & maken met 62/300 slots (21%).

### Scenario's met lage variatie

Een scenario wordt hier gemarkeerd als er minder dan 3 sectorfamilies zijn, als één familie of school 4 of meer plekken vult, of als dezelfde CREBO meer dan één keer voorkomt.

- Geen scenario’s met lage variatie gevonden.

## Random simulaties

### Topcode-spreiding

| Code | Aantal |
| --- | --- |
| IAR | 39 |
| RCI | 38 |
| IAS | 32 |
| IAO | 27 |
| IAC | 24 |
| RIA | 23 |
| RCS | 23 |
| RIC | 22 |
| AIS | 22 |
| IRA | 21 |
| AIO | 21 |
| CRI | 21 |
| SIA | 21 |
| AIR | 19 |
| RAI | 17 |

### Eerste dimensie

| Dimensie | Aantal |
| --- | --- |
| R | 241 |
| I | 229 |
| A | 146 |
| S | 156 |
| O | 111 |
| C | 117 |

### Matchscore per positie

| Positie | GemiddeldeMatch |
| --- | --- |
| 1 | 34.2 |
| 2 | 31.4 |
| 3 | 32.8 |
| 4 | 33 |
| 5 | 32.4 |
| 6 | 32.4 |

- Gemiddelde verhouding positie 6 / positie 1: 0.949.
- Random cases waarin positie 6 onder 65% van positie 1 valt: 0.

### S-top2 dekking

Random cases met S in top-2 en S >= 60:

| Cases | Zorg & welzijn | Onderwijs & sport | Een van beide |
| --- | --- | --- | --- |
| 192 | 192 (100%) | 0 (0%) | 192 (100%) |

### Kleine verschillen

- Aantal random cases met top-gaps van 2 punten of minder, of exacte ties: 847.
- Voorbeelden:

- Random 1: CRO, R 61%, I 39%, A 35%, S 52%, O 61%, C 70%, gaps 9/0/9
- Random 2: CRA, R 62%, I 53%, A 54%, S 40%, O 44%, C 68%, gaps 6/8/1
- Random 3: IRA, R 61%, I 67%, A 56%, S 56%, O 45%, C 41%, gaps 6/5/0
- Random 4: AIO, R 47%, I 59%, A 65%, S 49%, O 55%, C 47%, gaps 6/4/6
- Random 5: CIS, R 47%, I 58%, A 46%, S 57%, O 46%, C 64%, gaps 6/1/10
- Random 6: ORA, R 56%, I 51%, A 56%, S 46%, O 61%, C 53%, gaps 5/0/3
- Random 7: IRO, R 55%, I 71%, A 50%, S 47%, O 54%, C 47%, gaps 16/1/4
- Random 9: RIA, R 59%, I 59%, A 54%, S 54%, O 43%, C 53%, gaps 0/5/0

### Meest voorkomende opleidingensets

- 24x: Boulanger|MBO Rijnland / Creative Software Developer|Grafisch Lyceum Rotterdam / Fotografie|Grafisch Lyceum Rotterdam / Allround meubelmaker / (scheeps)interieurbouwer|HMC / Creatief vakman (ontwerpen en maken met hout)|HMC / Gespecialiseerd productiemedewerker voedingsmiddelenindustrie (VAPRO)|Lentiz
- 18x: Gespecialiseerd productiemedewerker voedingsmiddelenindustrie (VAPRO)|Lentiz / Administratief Medewerker|MBO Rijnland / Boulanger|MBO Rijnland / Pianotechnicus|HMC / Allround meubelmaker / (scheeps)interieurbouwer|HMC / Allround laborant|Techniek College Rotterdam
- 11x: Intercedent|ROC Mondriaan / Fotografie|Grafisch Lyceum Rotterdam / Creative Software Developer|Grafisch Lyceum Rotterdam / Creatief vakman (ontwerpen en maken met hout)|HMC / Assistant Fashion Tailor|Zadkine / Commercieel medewerker|ROC Mondriaan
- 10x: Gespecialiseerd productiemedewerker voedingsmiddelenindustrie (VAPRO)|Lentiz / Administratief Medewerker|MBO Rijnland / Boulanger|MBO Rijnland / Pianotechnicus|HMC / Kok|ROC Da Vinci College / Business Administration & Control Specialist|ROC Da Vinci College
- 10x: Gespecialiseerd productiemedewerker voedingsmiddelenindustrie (VAPRO)|Lentiz / Boulanger|MBO Rijnland / Kok|ROC Da Vinci College / Intercedent|ROC Mondriaan / Allround meubelmaker / (scheeps)interieurbouwer|HMC / Allround laborant|Techniek College Rotterdam

## Classificatiechecks

De classificatiecheck zoekt expliciet naar bekende false positives zoals dierverzorging als zorg/welzijn en autoschade/asfalt/metsel buiten techniek.

- Geen classificatie-waarschuwingen gevonden.

### Grote opleidingsstammen

Stammen met meer dan 10 records verdienen handmatige controle, omdat ze echte duplicaten kunnen zijn of juist te grof samengevoegde varianten.

- Geen opleidingsstammen met meer dan 10 records.

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

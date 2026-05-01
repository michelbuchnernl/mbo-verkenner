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
- Unieke sets van 6 opleidingen in random simulaties: 409.
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
| Zuiver R (Realistisch) | RCI | R 100%, I 45%, A 38%, S 36%, O 31%, C 82% | 18/37/7 | 12 | 6/6 | 4 | RCI |
| Zuiver I (Intellectueel) | IAR | R 38%, I 100%, A 92%, S 35%, O 34%, C 37% | 8/54/1 | 12 | 6/6 | 4 | AIR |
| Zuiver A (Artistiek) | AIS | R 35%, I 84%, A 100%, S 51%, O 36%, C 30% | 16/33/15 | 12 | 6/6 | 4 | AIS |
| Zuiver S (Sociaal) | SOA | R 29%, I 31%, A 46%, S 100%, O 90%, C 38% | 10/44/8 | 12 | 6/6 | 5 | OSA |
| Zuiver O (Ondernemend) | OSC | R 27%, I 30%, A 28%, S 91%, O 100%, C 53% | 9/38/23 | 12 | 6/6 | 4 | OSC |
| Zuiver C (Conventioneel) | CRI | R 95%, I 49%, A 22%, S 22%, O 39%, C 100% | 5/46/10 | 12 | 6/6 | 5 | RCI |
| Combinatie RI | IRA | R 89%, I 91%, A 69%, S 14%, O 13%, C 60% | 2/20/9 | 12 | 6/6 | 5 | RIA |
| Combinatie RA | ARI | R 82%, I 73%, A 85%, S 32%, O 13%, C 53% | 3/9/20 | 12 | 6/6 | 4 | RAI |
| Combinatie RS | SRC | R 80%, I 19%, A 31%, S 82%, O 60%, C 62% | 2/18/2 | 12 | 6/6 | 4 | RSC |
| Combinatie RO | ORC | R 80%, I 17%, A 11%, S 64%, O 83%, C 76% | 3/4/12 | 12 | 6/6 | 5 | ROC |
| Combinatie RC | CRI | R 97%, I 51%, A 22%, S 22%, O 38%, C 99% | 2/46/13 | 12 | 6/6 | 5 | RCI |
| Combinatie IA | IAS | R 38%, I 97%, A 97%, S 41%, O 31%, C 32% | 0/56/3 | 12 | 6/6 | 4 | AIS |
| Combinatie IS | ISA | R 15%, I 83%, A 79%, S 81%, O 60%, C 18% | 2/2/19 | 12 | 6/6 | 4 | OISA |
| Combinatie IO | IOA | R 12%, I 82%, A 63%, S 58%, O 75%, C 40% | 7/12/5 | 12 | 6/6 | 4 | OIA |
| Combinatie IC | CRI | R 80%, I 77%, A 50%, S 9%, O 26%, C 87% | 7/3/27 | 12 | 6/6 | 5 | RCI |
| Combinatie AS | ASO | R 12%, I 65%, A 88%, S 86%, O 70%, C 16% | 2/16/5 | 12 | 6/6 | 5 | OAS |
| Combinatie AO | AOS | R 11%, I 55%, A 89%, S 80%, O 83%, C 19% | 6/3/25 | 12 | 6/6 | 5 | OAS |
| Combinatie AC | CRA | R 73%, I 70%, A 71%, S 16%, O 21%, C 80% | 7/2/1 | 12 | 6/6 | 5 | RCA |
| Combinatie SO | SOC | R 27%, I 27%, A 35%, S 97%, O 96%, C 48% | 1/48/13 | 12 | 6/6 | 4 | OSC |
| Combinatie SC | SCO | R 61%, I 16%, A 17%, S 85%, O 71%, C 79% | 6/8/10 | 12 | 6/6 | 4 | RSCO |
| Combinatie OC | OCS | R 59%, I 26%, A 8%, S 65%, O 86%, C 82% | 4/17/6 | 12 | 6/6 | 5 | COS |
| Top-3 RIA | IAR | R 65%, I 97%, A 97%, S 22%, O 10%, C 46% | 0/32/19 | 12 | 6/6 | 4 | RAI |
| Top-3 RIS | IRS | R 70%, I 74%, A 58%, S 64%, O 32%, C 40% | 4/6/6 | 12 | 6/6 | 5 | RIS |
| Top-3 RIO | IRO | R 73%, I 75%, A 40%, S 31%, O 57%, C 57% | 2/16/0 | 12 | 6/6 | 5 | RIO |
| Top-3 RIC | RCI | R 100%, I 65%, A 35%, S 9%, O 23%, C 97% | 3/32/30 | 12 | 6/6 | 4 | RCI |
| Top-3 RAS | ASR | R 64%, I 53%, A 72%, S 69%, O 40%, C 40% | 3/5/11 | 12 | 6/6 | 5 | RAS |
| Top-3 RAO | AOR | R 62%, I 42%, A 74%, S 55%, O 66%, C 39% | 8/4/7 | 12 | 6/6 | 5 | RAO |
| Top-3 RAC | RCI | R 97%, I 62%, A 50%, S 16%, O 19%, C 87% | 10/25/12 | 12 | 6/6 | 4 | RCI |
| Top-3 RSO | SOC | R 45%, I 14%, A 19%, S 97%, O 95%, C 59% | 2/36/14 | 12 | 6/6 | 4 | SOC |
| Top-3 RSC | RCS | R 97%, I 17%, A 15%, S 58%, O 55%, C 89% | 8/31/3 | 12 | 6/6 | 4 | RCS |
| Top-3 ROC | CRO | R 95%, I 26%, A 8%, S 43%, O 57%, C 98% | 3/38/14 | 12 | 6/6 | 5 | RCO |
| Top-3 IAS | AIS | R 15%, I 87%, A 100%, S 66%, O 53%, C 16% | 13/21/13 | 12 | 6/6 | 4 | AIS |
| Top-3 IAO | IAO | R 12%, I 95%, A 94%, S 53%, O 56%, C 24% | 1/38/3 | 12 | 6/6 | 4 | AIO |
| Top-3 IAC | IAR | R 64%, I 97%, A 90%, S 14%, O 16%, C 54% | 7/26/10 | 12 | 6/6 | 4 | RAI |
| Top-3 ISO | SOA | R 12%, I 48%, A 56%, S 95%, O 92%, C 30% | 3/36/8 | 12 | 6/6 | 5 | OSA |
| Top-3 ISC | CIS | R 45%, I 70%, A 38%, S 58%, O 44%, C 72% | 2/12/13 | 12 | 6/6 | 5 | RCIS |
| Top-3 IOC | COI | R 42%, I 64%, A 38%, S 43%, O 68%, C 72% | 4/4/21 | 12 | 6/6 | 6 | COI |
| Top-3 ASO | SOA | R 11%, I 48%, A 74%, S 100%, O 87%, C 17% | 13/13/26 | 12 | 6/6 | 5 | OSA |
| Top-3 ASC | SAC | R 38%, I 40%, A 65%, S 77%, O 51%, C 60% | 12/5/9 | 12 | 6/6 | 5 | RSAC |
| Top-3 AOC | OCA | R 36%, I 39%, A 50%, S 50%, O 79%, C 72% | 7/22/0 | 12 | 6/6 | 5 | COA |
| Top-3 SOC | OSC | R 44%, I 16%, A 13%, S 91%, O 100%, C 66% | 9/25/22 | 12 | 6/6 | 4 | COS |
| Alle A-antwoorden | IRA | R 80%, I 83%, A 68%, S 24%, O 32%, C 49% | 3/12/19 | 12 | 6/6 | 5 | RIA |
| Alle B-antwoorden | SOC | R 30%, I 30%, A 40%, S 85%, O 78%, C 64% | 7/14/24 | 12 | 6/6 | 4 | CSO |
| Om-en-om A/B | RCI | R 59%, I 56%, A 54%, S 51%, O 56%, C 57% | 2/1/0 | 12 | 6/6 | 4 | RCI |
| Om-en-om B/A | SIC | R 52%, I 57%, A 54%, S 58%, O 55%, C 57% | 1/0/2 | 12 | 6/6 | 5 | RSIC |
| Seeded random 1 | RAI | R 67%, I 56%, A 57%, S 51%, O 53%, C 51% | 10/1/3 | 12 | 6/6 | 4 | RAI |
| Seeded random 2 | OSC | R 50%, I 40%, A 50%, S 62%, O 74%, C 56% | 12/6/6 | 12 | 6/6 | 4 | ROSC |
| Seeded random 3 | AIO | R 42%, I 62%, A 63%, S 53%, O 58%, C 53% | 1/4/5 | 12 | 6/6 | 5 | RAIO |
| Seeded random 4 | COR | R 59%, I 51%, A 57%, S 45%, O 60%, C 61% | 1/1/2 | 12 | 6/6 | 5 | RCO |
| Seeded random 5 | RSC | R 64%, I 55%, A 51%, S 62%, O 45%, C 57% | 2/5/2 | 12 | 6/6 | 5 | RSC |

## Voorbeeldsuggesties

Alle suggesties hieronder zijn de eerste 12 scenario's uit de audit. Dit is bedoeld als steekproef om te zien of de concrete opleidingen niet steeds uit dezelfde school of categorie komen.

| Scenario | Nr | Dim | Familie | Opleiding | School | Locatie | Match |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Zuiver R (Realistisch) | 1 | R | Techniek & maken | Pianotechnicus | HMC | Amsterdam | 40% |
| Zuiver R (Realistisch) | 2 | C | Administratie & juridisch | Administratief Medewerker | MBO Rijnland | Leiden B&#232;taplein / Lammenschans | 32% |
| Zuiver R (Realistisch) | 3 | R | Techniek & maken | Keukenmonteur | HMC | Amsterdam, Rotterdam | 40% |
| Zuiver R (Realistisch) | 4 | C | Horeca & toerisme | Boulanger | MBO Rijnland | Leiden B&#232;taplein / Lammenschans | 39% |
| Zuiver R (Realistisch) | 5 | I | Laboratorium & onderzoek | Allround laborant | Techniek College Rotterdam | Jan Ligthartstraat | 38% |
| Zuiver R (Realistisch) | 6 | I | Veiligheid & defensie | VeVa Bedrijfsautotechnicus | ROC Mondriaan | Den Haag | 38% |
| Zuiver I (Intellectueel) | 1 | A | Techniek & maken | Creatief vakman (ontwerpen en maken met hout) | HMC | Amsterdam | 36% |
| Zuiver I (Intellectueel) | 2 | A | Creatief & media | Fotografie | Grafisch Lyceum Rotterdam | Rotterdam | 36% |
| Zuiver I (Intellectueel) | 3 | I | Uiterlijke verzorging | Assistant Fashion Tailor | Zadkine | Zadkine Benthemplein &#8211; Rotterdam Centrum | 36% |
| Zuiver I (Intellectueel) | 4 | I | Uiterlijke verzorging | Fashion Retailer | Zadkine | Zadkine Benthemplein &#8211; Rotterdam Centrum | 36% |
| Zuiver I (Intellectueel) | 5 | R | Creatief & media | AV-Specialist | Grafisch Lyceum Rotterdam | Rotterdam | 34% |
| Zuiver I (Intellectueel) | 6 | R | Techniek & maken | Medewerker productietechniek | ROC Da Vinci College | Dordrecht | 33% |
| Zuiver A (Artistiek) | 1 | A | Techniek & maken | Creatief vakman (ontwerpen en maken met hout) | HMC | Amsterdam | 36% |
| Zuiver A (Artistiek) | 2 | A | Creatief & media | Fotografie | Grafisch Lyceum Rotterdam | Rotterdam | 36% |
| Zuiver A (Artistiek) | 3 | I | Uiterlijke verzorging | Assistant Fashion Tailor | Zadkine | Zadkine Benthemplein &#8211; Rotterdam Centrum | 36% |
| Zuiver A (Artistiek) | 4 | I | Uiterlijke verzorging | Fashion Retailer | Zadkine | Zadkine Benthemplein &#8211; Rotterdam Centrum | 36% |
| Zuiver A (Artistiek) | 5 | S | Commercieel & ondernemend | Intercedent | ROC Mondriaan | Den Haag | 32% |
| Zuiver A (Artistiek) | 6 | S | Commercieel & ondernemend | Commercieel medewerker | ROC Mondriaan | Den Haag | 32% |
| Zuiver S (Sociaal) | 1 | O | Commercieel & ondernemend | Intercedent | ROC Mondriaan | Den Haag | 39% |
| Zuiver S (Sociaal) | 2 | S | Zorg & welzijn | Mbo-Verpleegkundige | ROC Mondriaan | Den Haag, Delft, Leiden | 32% |
| Zuiver S (Sociaal) | 3 | S | Commercieel & ondernemend | 010 E-com Academy | MBO Rijnland | Woerden, Zoetermeer Van Doornenplantsoen | 39% |
| Zuiver S (Sociaal) | 4 | O | Horeca & toerisme | Evenementen & Hotelmanagement | Euro College | Amsterdam, Rotterdam, Utrecht, Groningen | 38% |
| Zuiver S (Sociaal) | 5 | A | Techniek & maken | Creatief vakman (ontwerpen en maken met hout) | HMC | Amsterdam | 30% |
| Zuiver S (Sociaal) | 6 | A | Uiterlijke verzorging | Assistant Fashion Tailor | Zadkine | Zadkine Benthemplein &#8211; Rotterdam Centrum | 30% |
| Zuiver O (Ondernemend) | 1 | O | Commercieel & ondernemend | Ondernemer handel en/of diensten | ROC Da Vinci College | Dordrecht | 40% |
| Zuiver O (Ondernemend) | 2 | S | Zorg & welzijn | Mbo-Verpleegkundige | ROC Mondriaan | Den Haag, Delft, Leiden | 32% |
| Zuiver O (Ondernemend) | 3 | O | Commercieel & ondernemend | Intercedent | ROC Mondriaan | Den Haag | 39% |
| Zuiver O (Ondernemend) | 4 | S | Administratie & juridisch | Administratief Medewerker | MBO Rijnland | Leiden B&#232;taplein / Lammenschans | 39% |
| Zuiver O (Ondernemend) | 5 | C | Administratie & juridisch | Business Administration & Control Specialist | ROC Da Vinci College | Dordrecht | 39% |
| Zuiver O (Ondernemend) | 6 | C | Horeca & toerisme | 010 Event Academy | Euro College | Zadkine Benthemplein &#8211; Rotterdam Centrum | 38% |
| Zuiver C (Conventioneel) | 1 | R | Techniek & maken | Medewerker productietechniek | ROC Da Vinci College | Dordrecht | 40% |
| Zuiver C (Conventioneel) | 2 | C | Administratie & juridisch | Administratief Medewerker | MBO Rijnland | Leiden B&#232;taplein / Lammenschans | 34% |
| Zuiver C (Conventioneel) | 3 | C | Techniek & maken | Pianotechnicus | HMC | Amsterdam | 40% |
| Zuiver C (Conventioneel) | 4 | R | Laboratorium & onderzoek | Allround laborant | Techniek College Rotterdam | Jan Ligthartstraat | 40% |
| Zuiver C (Conventioneel) | 5 | I | Laboratorium & onderzoek | Chemisch fysisch analist | MBO Rijnland | Leiden Zernikedreef | 40% |
| Zuiver C (Conventioneel) | 6 | I | Veiligheid & defensie | VeVa Bedrijfsautotechnicus | ROC Mondriaan | Den Haag | 40% |
| Combinatie RI | 1 | R | Techniek & maken | Medewerker productietechniek | ROC Da Vinci College | Dordrecht | 40% |
| Combinatie RI | 2 | I | Techniek & maken | Allround meubelmaker / (scheeps)interieurbouwer | HMC | Amsterdam, Rotterdam | 38% |
| Combinatie RI | 3 | I | Laboratorium & onderzoek | Allround laborant | Techniek College Rotterdam | Jan Ligthartstraat | 38% |
| Combinatie RI | 4 | R | Laboratorium & onderzoek | Chemisch fysisch analist | MBO Rijnland | Leiden Zernikedreef | 38% |
| Combinatie RI | 5 | A | Creatief & media | AV-Specialist | Grafisch Lyceum Rotterdam | Rotterdam | 35% |
| Combinatie RI | 6 | A | Creatief & media | Podium- en evenemententechnicus | Grafisch Lyceum Rotterdam | Rotterdam | 35% |
| Combinatie RA | 1 | R | Techniek & maken | Pianotechnicus | HMC | Amsterdam | 37% |
| Combinatie RA | 2 | A | Creatief & media | AV-Specialist | Grafisch Lyceum Rotterdam | Rotterdam | 35% |
| Combinatie RA | 3 | A | Creatief & media | Podium- en evenemententechnicus | Grafisch Lyceum Rotterdam | Rotterdam | 35% |
| Combinatie RA | 4 | R | Techniek & maken | Keukenmonteur | HMC | Amsterdam, Rotterdam | 37% |
| Combinatie RA | 5 | I | Laboratorium & onderzoek | Allround laborant | Techniek College Rotterdam | Jan Ligthartstraat | 35% |
| Combinatie RA | 6 | I | Laboratorium & onderzoek | Chemisch fysisch analist | MBO Rijnland | Leiden Zernikedreef | 35% |
| Combinatie RS | 1 | R | Voeding, natuur & dier | Gespecialiseerd productiemedewerker voedingsmiddelenindustrie (VAPRO) | Lentiz | MBO LIFE College (Schiedam) | 40% |
| Combinatie RS | 2 | S | Zorg & welzijn | Mbo-Verpleegkundige | ROC Mondriaan | Den Haag, Delft, Leiden | 31% |
| Combinatie RS | 3 | S | Horeca & toerisme | Kok | ROC Da Vinci College | Dordrecht | 39% |
| Combinatie RS | 4 | R | Horeca & toerisme | Medewerker foodservice | ROC Mondriaan | Den Haag | 39% |
| Combinatie RS | 5 | C | Techniek & maken | Pianotechnicus | HMC | Amsterdam | 36% |
| Combinatie RS | 6 | C | Techniek & maken | Keukenmonteur | HMC | Amsterdam, Rotterdam | 36% |
| Combinatie RO | 1 | R | Voeding, natuur & dier | Gespecialiseerd productiemedewerker voedingsmiddelenindustrie (VAPRO) | Lentiz | MBO LIFE College (Schiedam) | 41% |
| Combinatie RO | 2 | O | Commercieel & ondernemend | Ondernemer handel en/of diensten | ROC Da Vinci College | Dordrecht | 36% |
| Combinatie RO | 3 | C | Administratie & juridisch | Administratief Medewerker | MBO Rijnland | Leiden B&#232;taplein / Lammenschans | 38% |
| Combinatie RO | 4 | O | Horeca & toerisme | 010 Event Academy | Euro College | Zadkine Benthemplein &#8211; Rotterdam Centrum | 38% |
| Combinatie RO | 5 | R | Horeca & toerisme | Kok | ROC Da Vinci College | Dordrecht | 41% |
| Combinatie RO | 6 | C | Administratie & juridisch | Management Assistant | ROC Mondriaan | Delft | 38% |
| Combinatie RC | 1 | R | Techniek & maken | Medewerker productietechniek | ROC Da Vinci College | Dordrecht | 40% |
| Combinatie RC | 2 | C | Administratie & juridisch | Administratief Medewerker | MBO Rijnland | Leiden B&#232;taplein / Lammenschans | 33% |
| Combinatie RC | 3 | C | Techniek & maken | Pianotechnicus | HMC | Amsterdam | 40% |
| Combinatie RC | 4 | R | Laboratorium & onderzoek | Allround laborant | Techniek College Rotterdam | Jan Ligthartstraat | 40% |
| Combinatie RC | 5 | I | Laboratorium & onderzoek | Chemisch fysisch analist | MBO Rijnland | Leiden Zernikedreef | 40% |
| Combinatie RC | 6 | I | Veiligheid & defensie | VeVa Bedrijfsautotechnicus | ROC Mondriaan | Den Haag | 40% |
| Combinatie IA | 1 | A | Techniek & maken | Creatief vakman (ontwerpen en maken met hout) | HMC | Amsterdam | 36% |
| Combinatie IA | 2 | A | Creatief & media | Fotografie | Grafisch Lyceum Rotterdam | Rotterdam | 36% |
| Combinatie IA | 3 | I | Uiterlijke verzorging | Assistant Fashion Tailor | Zadkine | Zadkine Benthemplein &#8211; Rotterdam Centrum | 36% |
| Combinatie IA | 4 | I | Uiterlijke verzorging | Fashion Retailer | Zadkine | Zadkine Benthemplein &#8211; Rotterdam Centrum | 36% |
| Combinatie IA | 5 | S | Commercieel & ondernemend | Intercedent | ROC Mondriaan | Den Haag | 31% |
| Combinatie IA | 6 | S | Commercieel & ondernemend | Commercieel medewerker | ROC Mondriaan | Den Haag | 31% |

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
| Administratief Medewerker | 20 |
| Creatief vakman (ontwerpen en maken met hout) | 20 |
| Intercedent | 20 |
| Mbo-Verpleegkundige | 18 |
| Allround laborant | 15 |
| Fotografie | 15 |
| Gespecialiseerd productiemedewerker voedingsmiddelenindustrie (VAPRO) | 15 |
| Pianotechnicus | 14 |
| Assistant Fashion Tailor | 13 |
| Boulanger | 12 |
| Chemisch fysisch analist | 11 |
| Medewerker productietechniek | 11 |
| 010 Event Academy | 10 |
| Leidinggevende tourism (Versneld/Fast-Track) | 9 |
| Ondernemer handel en/of diensten | 9 |
| Fashion Retailer | 8 |
| Kok | 8 |
| 010 E-com Academy | 7 |
| Allround meubelmaker / (scheeps)interieurbouwer | 7 |
| AV-Specialist | 7 |

### Meest voorkomende CREBO's

| CREBO | Aantal |
| --- | --- |
| 25136 | 20 |
| 25548 | 20 |
| 25723 | 20 |
| 25655 | 18 |
| 25044 | 15 |
| 25718 | 15 |
| 25979 | 15 |
| 25663 | 14 |
| 25684 | 13 |
| 25614 | 12 |
| 25894 | 11 |
| 25952 | 11 |
| 25749 | 10 |
| 27058 | 9 |
| 27121 | 9 |
| 25685 | 8 |
| 27060 | 8 |
| 25017 | 7 |
| 25717 | 7 |
| 25725 | 7 |

### Meest voorkomende scholen

| School | Aantal |
| --- | --- |
| ROC Mondriaan | 65 |
| MBO Rijnland | 50 |
| HMC | 46 |
| ROC Da Vinci College | 38 |
| Grafisch Lyceum Rotterdam | 29 |
| Zadkine | 21 |
| Techniek College Rotterdam | 20 |
| Euro College | 16 |
| Lentiz | 15 |

Hoogste schoolconcentratie: ROC Mondriaan met 65/300 slots (22%).

### Sectorfamilies in alle suggesties

| Familie | Aantal |
| --- | --- |
| Techniek & maken | 60 |
| Horeca & toerisme | 46 |
| Commercieel & ondernemend | 43 |
| Administratie & juridisch | 31 |
| Creatief & media | 26 |
| Laboratorium & onderzoek | 26 |
| Uiterlijke verzorging | 21 |
| Zorg & welzijn | 18 |
| Voeding, natuur & dier | 17 |
| ICT & data | 5 |
| Veiligheid & defensie | 4 |
| Logistiek & transport | 2 |
| Onderwijs & sport | 1 |

Hoogste sectorfamilieconcentratie: Techniek & maken met 60/300 slots (20%).

### Scenario's met lage variatie

Een scenario wordt hier gemarkeerd als er minder dan 3 sectorfamilies zijn, als één familie of school 4 of meer plekken vult, of als dezelfde CREBO meer dan één keer voorkomt.

- Geen scenario’s met lage variatie gevonden.

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

### Matchscore per positie

| Positie | GemiddeldeMatch |
| --- | --- |
| 1 | 35.4 |
| 2 | 32.2 |
| 3 | 33.7 |
| 4 | 34.3 |
| 5 | 33.7 |
| 6 | 33.6 |

- Gemiddelde verhouding positie 6 / positie 1: 0.95.
- Random cases waarin positie 6 onder 65% van positie 1 valt: 0.

### S-top2 dekking

Random cases met S in top-2 en S >= 60:

| Cases | Zorg & welzijn | Onderwijs & sport | Een van beide |
| --- | --- | --- | --- |
| 230 | 230 (100%) | 0 (0%) | 230 (100%) |

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

- 24x: Boulanger|MBO Rijnland / Creative Software Developer|Grafisch Lyceum Rotterdam / Fotografie|Grafisch Lyceum Rotterdam / Allround meubelmaker / (scheeps)interieurbouwer|HMC / Creatief vakman (ontwerpen en maken met hout)|HMC / Gespecialiseerd productiemedewerker voedingsmiddelenindustrie (VAPRO)|Lentiz
- 24x: Gespecialiseerd productiemedewerker voedingsmiddelenindustrie (VAPRO)|Lentiz / Administratief Medewerker|MBO Rijnland / Boulanger|MBO Rijnland / Pianotechnicus|HMC / Allround meubelmaker / (scheeps)interieurbouwer|HMC / Allround laborant|Techniek College Rotterdam
- 20x: Gespecialiseerd productiemedewerker voedingsmiddelenindustrie (VAPRO)|Lentiz / Administratief Medewerker|MBO Rijnland / Boulanger|MBO Rijnland / Leidinggevende tourism (Versneld/Fast-Track)|ROC Mondriaan / Business Administration & Control Specialist|ROC Da Vinci College / Brede opleiding: Marketing & Sales|ROC Da Vinci College
- 16x: Pianotechnicus|HMC / Administratief Medewerker|MBO Rijnland / Keukenmonteur|HMC / Boulanger|MBO Rijnland / Allround laborant|Techniek College Rotterdam / VeVa Bedrijfsautotechnicus|ROC Mondriaan
- 12x: Gespecialiseerd productiemedewerker voedingsmiddelenindustrie (VAPRO)|Lentiz / Mbo-Verpleegkundige|ROC Mondriaan / Intercedent|ROC Mondriaan / Kok|ROC Da Vinci College / 010 E-com Academy|MBO Rijnland / Boulanger|MBO Rijnland

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

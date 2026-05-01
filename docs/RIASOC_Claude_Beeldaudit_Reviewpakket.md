# Claude reviewpakket - RIASOC beeldaudit

Datum: 2026-05-01

Status: historisch reviewpakket. Dit document was bedoeld om Claude de beeldaudit te laten reviewen zonder repo-toegang. De teruggekomen review is verwerkt in `index.html` en samengevat in `docs/RIASOC_Beeldaudit_62_plaatjes.md`.

Doel: dit pakket geeft Claude precies de gegevens die nodig zijn om de beeldaudit inhoudelijk te reviewen zonder toegang tot de lokale repo.

## Opdracht voor Claude

Review de beeldaudit kritisch. Beantwoord:

1. Is de conclusie "plaatjes behouden, eerst secundaire weging aanscherpen" logisch?
2. Zijn de gemarkeerde vragen terecht als secundaire-ruis aangemerkt, of zit er ergens een hoofdletter-fout?
3. Moet bij sommige vragen juist het plaatje aangepast worden in plaats van de weging?
4. Geef concrete voorstellen in dit format:

| Q | Huidige weging | Jouw oordeel | Voorstel | Reden |
|---|---|---|---|---|

Eindoordeel verplicht: `ACCEPT`, `ACCEPT MET RISICO'S` of `REJECT`.

Belangrijk:

- De 62 plaatjes zijn het meetinstrument, niet alleen illustratie.
- Maak onderscheid tussen hoofdletter-fout en secundaire-letter-ruis.
- Stel geen nieuwe plaatjes voor tenzij het beeld echt het verkeerde hoofdverhaal vertelt.
- Voorgestelde wijzigingen mogen de hoofd-pair volgens R-I-A-S-O-C niet conceptueel breken.

## Algemene auditconclusie

Er is geen rode mismatch gevonden waarbij een plaatje duidelijk het verkeerde hoofdverhaal vertelt. De beelden zijn als reeks bruikbaar.

Voorlopig advies: plaatjes behouden. Eerst alleen titels en/of secundaire gewichten herzien bij de gele vragen. De grootste twijfel zit bij Q50-Q53, Q56-Q61, Q22 en Q49.

## Geflagde vragen met benodigde context

| Q | Leerlingtekst | Huidige A | Huidige B | Beeldbeschrijving | Voorlopige audit | Voorlopig voorstel |
|---|---|---|---|---|---|---|
| 22 | Stand maken of stand uitleggen | `Stand maken` `wA:{R:3,C:1}` | `Stand uitleggen` `wB:{S:1,O:3}` | Links bouwt iemand een stand met boormachine. Rechts staat iemand bij een stand en legt iets uit aan bezoekers. | Beeld klopt, maar B voelt meer sociaal/presenterend dan ondernemend-leidend. | B-label naar "stand presenteren" als O dominant moet blijven, of B iets socialer wegen. |
| 27 | Uitleg maken of persoon begeleiden | `Uitleg maken` `wA:{I:3,C:1}` | `Persoon begeleiden` `wB:{S:3,O:1}` | Beide kanten tonen documenten/stappen op tafel; rechts is een persoon erbij die begeleiding krijgt. | Verschil is subtieler dan omliggende vragen; beeld is niet fout. | Eventueel labels aanscherpen: A "uitleg ontwerpen", B "persoon stap voor stap begeleiden". |
| 36 | Kraam leiden of kraam bijhouden | `Kraam leiden` `wA:{S:1,O:3}` | `Kraam bijhouden` `wB:{R:1,C:3}` | Links stuurt iemand activiteiten bij een kraam aan. Rechts zit iemand met checklist/voorraad. | Beeld klopt. A is vooral O; S is secundair zwak zichtbaar. | Geen beeldwissel. A O dominant houden; S laag houden. |
| 38 | Kans pakken of plan volhouden | `Kans pakken` `wA:{S:1,O:3}` | `Plan volhouden` `wB:{R:1,C:3}` | Links persoon wijst naar ster/kans en ideeën op tafel. Rechts persoon bij planning. | Links is wat abstract maar vooral ondernemend initiatief. | Eventueel A-label "nieuw idee oppakken"; S-bijmenging laag houden. |
| 48 | Muziek maken of makers helpen | `Muziek maken` `wA:{I:1,A:2,S:1}` | `Makers helpen` `wB:{A:1,S:2,O:1}` | Links componeert/maakt iemand muziek. Rechts ondersteunt iemand makers bij opname/creatief proces. | A-kant is vooral Artistiek; S is nauwelijks zichtbaar. B is sociaal/ondersteunend in makerscontext. | Overweeg A richting `{I:1,A:3}` of `{A:3,I:1}`; B kan `{S:2,A:1,O:1}` blijven. |
| 49 | Campagne maken of gesprek leiden | `Campagne maken` `wA:{I:1,A:2,S:1}` | `Gesprek leiden` `wB:{A:1,S:2,O:1}` | Links ontwerpt iemand een campagneposter. Rechts leidt iemand een groepsgesprek rond die campagne. | Campagnebeeld voelt A/O/S meer dan I/A/S; B voelt S/O. | Overweeg A `{A:2,O:1,I:1}` of `{A:2,O:1,S:1}`; B `{S:2,O:2}` of `{S:2,O:1}`. |
| 50 | Een persoon helpen of groep leiden | `Een persoon helpen` `wA:{A:1,S:2,O:1}` | `Groep leiden` `wB:{S:1,O:2,C:1}` | Links een-op-een hulp aan tafel. Rechts iemand wijst een groep richting doel. | Beeld is scherp S versus O. A in A-kant en C in B-kant zijn zwak zichtbaar. | Overweeg A vooral S, B vooral O: bijv. A `{S:3,A:1}` of `{S:3}`; B `{O:3,S:1}`. |
| 51 | Goed luisteren of snel overtuigen | `Goed luisteren` `wA:{A:1,S:2,O:1}` | `Snel overtuigen` `wB:{S:1,O:2,C:1}` | Links luistergesprek; rechts spreker overtuigt groep. | Beeld is scherp S versus O. | Overweeg A vooral S, B vooral O: A `{S:3,A:1}`; B `{O:3,S:1}`. |
| 52 | Mensen helpen of team motiveren | `Mensen helpen` `wA:{A:1,S:2,O:1}` | `Team motiveren` `wB:{S:1,O:2,C:1}` | Links hulp/begeleiding; rechts team in beweging. | Beeld is scherp S versus O. | Overweeg A `{S:3,A:1}`; B `{O:3,S:1}`. |
| 53 | Stap voor stap helpen of team in actie zetten | `Stap voor stap helpen` `wA:{A:1,S:2,O:1}` | `Team in actie zetten` `wB:{S:1,O:2,C:1}` | Links rustige een-op-een begeleiding; rechts iemand activeert groep. | Beeld is scherp S versus O. | Overweeg A `{S:3,C:1}` of `{S:3,A:1}`; B `{O:3,S:1}`. |
| 54 | Kans najagen of werkproces in de gaten houden | `Kans najagen` `wA:{S:1,O:2,C:1}` | `Werkproces bewaken` `wB:{R:1,O:1,C:2}` | Links snel naar kraam/kans; rechts checklist/procesbewaking. | A is vooral O; B vooral C. R in B is minder zichtbaar. | Overweeg A `{O:3,S:1}`; B `{C:3,O:1}` of `{C:3,R:1}`. |
| 55 | Energiek leiden of zorgvuldig controleren | `Energiek leiden` `wA:{S:1,O:2,C:1}` | `Zorgvuldig controleren` `wB:{R:1,O:1,C:2}` | Links teamoverleg met leider; rechts controle/inspectie. | Beeld klopt. B is sterker C dan huidige mix. | Eventueel A `{O:3,S:1}`; B `{C:3,R:1}`. |
| 56 | Voorraad netjes leggen of opstelling bouwen | `Voorraad leggen` `wA:{R:1,O:1,C:2}` | `Opstelling bouwen` `wB:{R:2,I:1,C:1}` | Links voorraad/labels/checklist. Rechts bouwt iemand een opstelling/blokkenset. | A is vooral C/ordenen; O is niet zichtbaar. B is duidelijk R. | Overweeg A `{C:3,R:1}`; B `{R:3,I:1}`. |
| 57 | Codes checken of apparatuur plaatsen | `Codes checken` `wA:{R:1,O:1,C:2}` | `Apparatuur plaatsen` `wB:{R:2,I:1,C:1}` | Links kantoor/checklist/codes. Rechts installeert iemand apparatuur buiten. | A is vooral C; B R/I. O in A is zwak. | Overweeg A `{C:3,I:1}` of `{C:3,R:1}`; B `{R:3,I:1}`. |
| 58 | Logboek bijwerken of onderhoud doen | `Logboek bijwerken` `wA:{R:1,O:1,C:2}` | `Onderhoud doen` `wB:{R:2,I:1,C:1}` | Links schrijft iemand logboek met mappen; rechts voert iemand onderhoud uit. | A is administratie/C; B is R. O in A is niet zichtbaar. | Overweeg A `{C:3,R:1}`; B `{R:3,I:1}`. |
| 59 | Gegevens netjes zetten of betekenis zoeken | `Gegevens zetten` `wA:{R:1,I:1,C:2}` | `Betekenis zoeken` `wB:{I:2,A:1,C:1}` | Links data invoeren/ordenen in tabel. Rechts patronen/verbanden zoeken. | Beeld is C versus I. R/A zijn visueel secundair zwak. | Overweeg A `{C:3,I:1}`; B `{I:3,C:1}`. |
| 60 | Resultaten opbergen of patronen zoeken | `Resultaten opbergen` `wA:{R:1,I:1,C:2}` | `Patronen zoeken` `wB:{I:2,A:1,C:1}` | Links archiveren/opbergen. Rechts analyses/patronen op tafel. | Beeld is C versus I. | Overweeg A `{C:3,R:1}` of `{C:3,I:1}`; B `{I:3,C:1}`. |
| 61 | Hulpvraag afhandelen of persoon helpen | `Hulpvraag afhandelen` `wA:{R:1,O:1,C:2}` | `Persoon helpen` `wB:{A:1,S:2,O:1}` | Links workflow/tickets/formulieren. Rechts gesprek met persoon. | Beeld is C/O versus S. R/A zijn zwak zichtbaar. | Overweeg A `{C:3,O:1}`; B `{S:3,O:1}`. |
| 62 | Bij een persoon blijven of groep regelen | `Bij een persoon blijven` `wA:{A:1,S:2,O:1}` | `Groep regelen` `wB:{S:1,O:2,C:1}` | Links een-op-een aanwezig blijven; rechts groep organiseren/leiden. | Beeld is scherp S versus O. A en C zijn zwak zichtbaar. | Overweeg A `{S:3,A:1}` of `{S:3}`; B `{O:3,S:1}`. |

## Niet-geflagde vragen

De overige vragen zijn als "bruikbaar / geen beeldwissel nodig" beoordeeld. De audit vond daar hooguit kleine labelnuances, maar geen hoofdletter-fout.

## Specifieke vraag aan Claude

Geef vooral kritisch tegengas op de voorlopige voorstellen:

- Moeten Q50-Q53 echt worden verscherpt naar S versus O, of is de huidige A/S/O versus S/O/C mix verdedigbaar?
- Is O terecht aanwezig in Q56-Q58, of is dat vooral meetruis?
- Moet Q59-Q60 A behouden als creatief/interpretatief signaal, of is I/C zuiverder?
- Is Q22 beter als "stand presenteren" met O, of als "stand uitleggen" met meer S?

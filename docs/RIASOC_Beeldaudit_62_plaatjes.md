# RIASOC Beeldaudit 62 plaatjes

Datum: 2026-05-01

Status: verwerkt in `index.html` op 2026-05-01. De plaatjes zijn behouden; labels en wegingen zijn aangescherpt bij Q22, Q27 en Q48-Q62. Daarna is `tests/riasoc_model_audit.js` opnieuw gedraaid met 0 vraagvalidatiefouten en 443 unieke opleidingensets in 1000 random simulaties.

> Update 2026-11-18: de verkenner gebruikt nu 30 van deze 62 plaatjes, met 1 punt per keuze in plaats van de weging hieronder. Zie `RIASOC_30_vragen_ontwerp.md`. Deze audit blijft de beeldbeoordeling van de volledige reeks.

Deze audit beoordeelt de 62 lokale PNG's in `assets/riasoc` als meetinstrument. De kernvraag per plaatje is:

> Geeft dit plaatje duidelijk aan wat de vraag en de RIASOC-weging bedoelen?

De beoordeling kijkt dus niet naar grafische smaak, maar naar meetwaarde: begrijpt een leerling zonder extra uitleg het verschil tussen A en B, en roept het beeld dezelfde RIASOC-letter(s) op als de software weegt?

## Rubric

Per vraag is gekeken naar:

- Verhaal: is zichtbaar wat A en B doen?
- RIASOC-fit: past A bij de bedoelde hoofdletter en B bij de bedoelde hoofdletter?
- Bias: is een kant visueel veel leuker, actiever of socialer zonder dat dit inhoudelijk bedoeld is?
- Ambiguiteit: roept het beeld per ongeluk een andere RIASOC-letter op?
- Advies: niets doen, titel aanscherpen, secundaire weging aanpassen, of later beeld vervangen.

## Samenvatting

Er is geen rode mismatch gevonden waarbij een plaatje duidelijk het verkeerde hoofdverhaal vertelt. De beelden zijn als reeks bruikbaar.

De gele aandachtspunten uit deze audit zijn verwerkt:

- Q22 gebruikt nu "stand presenteren" in plaats van "stand uitleggen".
- Q27 gebruikt nu "uitleg ontwerpen" en "stap voor stap begeleiden".
- Q48-Q62 zijn inhoudelijk aangescherpt zodat secundaire letters minder meetruis geven.
- Q50-Q53 en Q62 meten nu scherper S versus O.
- Q56-Q60 meten nu scherper C/R/I: ordenen, controleren, bouwen, onderhouden en betekenis zoeken.

Advies na verwerking: plaatjes voorlopig niet vervangen. Test nu eerst met leerlingen of de scenes hetzelfde worden gelezen als de labels en gewichten.

## Definitieve correcties

| Vraag | Correctie |
|---|---|
| Q22 | B-label naar "Stand presenteren"; weging blijft `wB:{S:1,O:3}`. |
| Q27 | Labels naar "Uitleg ontwerpen" en "Stap voor stap begeleiden"; weging blijft `I/C` versus `S/O`. |
| Q48 | A sterker Artistiek/Intellectueel, B sterker Sociaal/Artistiek. |
| Q49 | Campagne maken sterker Artistiek/Ondernemend; gesprek leiden blijft sociaal/ondernemend gemengd. |
| Q50-Q53 | A scherper Sociaal helpen; B scherper Ondernemend leiden. |
| Q54-Q55 | A scherper Ondernemend; B scherper Conventioneel met R of I als secundair signaal. |
| Q56-Q58 | A scherper Conventioneel; B scherper Realistisch/Intellectueel. |
| Q59-Q60 | A scherper Conventioneel; B scherper Intellectueel met A als betekenis-/patrooncomponent. |
| Q61 | A scherper Conventioneel/Ondernemend; B Sociaal/Ondernemend. |
| Q62 | A scherper Sociaal; B scherper Ondernemend. |

## Prioriteit

De hoogste prioriteit voor de wegingreview was:

- Q50-Q53: sociaal helpen versus ondernemend leiden.
- Q56-Q58: conventioneel ordenen/checken versus realistisch plaatsen/onderhouden.
- Q59-Q61: conventioneel verwerken/archiveren versus intellectueel zoeken of sociaal helpen.
- Q22 en Q49: label/weging tussen presenteren, uitleggen, overtuigen en gesprek leiden.

## Volledige audit

| Q | Beoogd verhaal | Beeldoordeel | Advies |
|---|---|---|---|
| 01 | Fiets maken [R,C] vs fiets uitleggen [S,O] | Duidelijk. Links is hands-on repareren, rechts is uitleg geven. | Niets doen. |
| 02 | Evenement klaarzetten [R,C] vs bezoekers helpen [S,O] | Duidelijk. Links techniek/opbouw, rechts ontvangen/begeleiden. | Niets doen. |
| 03 | Machine maken [R,C] vs gebruiker helpen [S,O] | Duidelijk. Links machine open, rechts gebruiker met probleem. | Niets doen. |
| 04 | Bankje maken [R,C] vs ruzie oplossen [S,O] | Duidelijk. Links bouwen, rechts bemiddelen. | Niets doen. |
| 05 | Speeltoestel maken [R,C] vs op kinderen letten [S,O] | Duidelijk. Links reparatie, rechts kind helpen/toezicht. | Niets doen. |
| 06 | Robot onderzoeken [I,A,C] vs team leiden [S,O,C] | Duidelijk. Links analyse, rechts presentatie/leiding. | Niets doen. |
| 07 | Oplossingen vergelijken [I,A,C] vs keuze uitleggen [S,O,C] | Duidelijk genoeg. Rechts is presentatie/uitleg; O is aanwezig, maar S ook duidelijk. | Eventueel B-label "keuze presenteren" als O leidend moet blijven. |
| 08 | Website bekijken [I,A,C] vs website idee verkopen [S,O,C] | Duidelijk. Links analyse, rechts pitch. | Niets doen. |
| 09 | Gegevens bekijken [I,A,C] vs keuze leiden [S,O,C] | Duidelijk. Links data/kaart, rechts beslissing toelichten aan groep. | Niets doen. |
| 10 | Probleem bekijken [I,A,C] vs team aan het werk zetten [S,O,C] | Duidelijk. Rechts is sterk ondernemend/activerend. | Niets doen. |
| 11 | Eigen poster maken [I,A] vs voorbeeld volgen [O,C] | Duidelijk. Links vrije expressie, rechts template volgen. | Niets doen. |
| 12 | Creatieve presentatie [I,A] vs materiaal sorteren [O,C] | Duidelijk. Links maken, rechts ordenen. | Niets doen. |
| 13 | Kostuum bedenken [I,A] vs kostuums bijhouden [O,C] | Duidelijk. Links ontwerpen/maken, rechts beheren/checken. | Niets doen. |
| 14 | Website uitproberen [I,A] vs website indelen [O,C] | Duidelijk. Links experimenteren, rechts structuur. | Niets doen. |
| 15 | Tentoonstelling snel inrichten [I,A] vs kaartjes controleren [O,C] | Duidelijk. Links creatief inrichten, rechts labels controleren. | Niets doen. |
| 16 | Stevig krukje [R,C] vs apart krukje [I,A] | Duidelijk. Rechts is bewust expressiever. | Niets doen. |
| 17 | Lamp maken [R,C] vs lamp omtoveren [I,A] | Duidelijk. Links reparatie, rechts ontwerp/transformatie. | Niets doen. |
| 18 | Wand maken [R,C] vs kamer inrichten [I,A] | Duidelijk. Links bouwen, rechts styling. | Niets doen. |
| 19 | Handige haak [R,C] vs opvallende haak [I,A] | Duidelijk. Links functie, rechts vorm/expressie. | Niets doen. |
| 20 | Geluid aansluiten [R,C] vs opbouw leiden [S,O] | Duidelijk. Rechts is leiding bij verplaatsen/opbouw. | Niets doen. |
| 21 | Pomp maken [R,C] vs tuinproject regelen [S,O] | Duidelijk. Links techniek, rechts project met mensen. | Niets doen. |
| 22 | Stand maken [R,C] vs stand uitleggen [S,O] | Beeld klopt, maar "uitleggen" voelt sociaal/presenterend; O is minder scherp dan bij "verkopen/pitchen". | Kies: B-label "stand presenteren" of B-weging iets socialer maken. |
| 23 | Machine bedienen [R,C] vs team motiveren [S,O] | Duidelijk. Rechts is motiveren/aanjagen. | Niets doen. |
| 24 | Water onderzoeken [I,C] vs bewoner praten [S,O] | Duidelijk. Links onderzoek, rechts gesprek met bewoner. | Niets doen. |
| 25 | App onderzoeken [I,C] vs app helpen [S,O] | Duidelijk. Links analytics, rechts begeleiding. | Niets doen. |
| 26 | Storing zoeken [I,C] vs gebruiker helpen [S,O] | Duidelijk. Links oorzaak/proces, rechts gebruiker geruststellen. | Niets doen. |
| 27 | Uitleg maken [I,C] vs persoon begeleiden [S,O] | Redelijk duidelijk, maar beide kanten werken met uitleg/documenten. Het verschil is subtieler dan bij omliggende vragen. | Eventueel A-label "uitleg ontwerpen" of B-label "persoon stap voor stap begeleiden". |
| 28 | Oorzaak zoeken [I,A] vs stappen checken [R,C] | Duidelijk. Links analyse, rechts checklist. | Niets doen. |
| 29 | Gegevens bekijken [I,A] vs gegevens sorteren [R,C] | Duidelijk. Links patronen zoeken, rechts ordenen. | Niets doen. |
| 30 | Ideeen uitproberen [I,A] vs stappenplan volgen [R,C] | Duidelijk. Links varianten, rechts procedure. | Niets doen. |
| 31 | Machineprobleem zoeken [I,A] vs machine in de gaten houden [R,C] | Duidelijk genoeg, maar beide tonen dezelfde machineomgeving. | Niets doen; eventueel later contrast sterker maken als leerlingen dit verwarren. |
| 32 | Fotoserie maken [I,A] vs leerling helpen [S,O] | Duidelijk. Links beeldverhaal, rechts leerlingondersteuning. | Niets doen. |
| 33 | Buurtmuur maken [I,A] vs buurtgesprek houden [S,O] | Duidelijk. Links creatief, rechts gesprek. | Niets doen. |
| 34 | Toneelscene maken [I,A] vs ruzie oplossen [S,O] | Duidelijk. Links expressie, rechts bemiddeling. | Niets doen. |
| 35 | Verhaal maken [I,A] vs bezoekers helpen [S,O] | Duidelijk. Links verhaal/beeldreeks, rechts rondleiding/hulp. | Niets doen. |
| 36 | Kraam leiden [S,O] vs kraam bijhouden [R,C] | Beeld klopt. Links is wel vooral aansturen bij kraam; S is minder zichtbaar dan O. | Geen beeldwissel nodig; eventueel A-weging O iets sterker dan S houden. |
| 37 | Sponsor overtuigen [S,O] vs formulieren invullen [R,C] | Duidelijk. Links overtuigen, rechts administratie. | Niets doen. |
| 38 | Kans pakken [S,O] vs plan volhouden [R,C] | Rechts is duidelijk. Links is iets abstract: ster/kans en initiatief, vooral O. | Eventueel A-label "nieuw idee oppakken" of S-bijmenging laag houden. |
| 39 | Spannend idee voorstellen [S,O] vs duidelijk plan maken [R,C] | Duidelijk. Links pitchen aan groep, rechts planning. | Niets doen. |
| 40 | Motor openmaken [R,I,C] vs schema bekijken [R,I,A] | Duidelijk. Beide liggen dicht bij R/I, maar links is meer doen, rechts meer begrijpen. | Niets doen. |
| 41 | Snel bouwen [R,I,C] vs eerst nadenken [R,I,A] | Duidelijk. Links prototype, rechts ontwerp/voorbereiding. | Niets doen. |
| 42 | Leren door doen [R,I,C] vs leren door vergelijken [R,I,A] | Duidelijk. Links bouwen, rechts vergelijken/testen. | Niets doen. |
| 43 | Storing oplossen [R,I,C] vs oorzaak vinden [R,I,A] | Duidelijk. Links repareren, rechts oorzaakmodel. | Niets doen. |
| 44 | Wind uitleggen [I,A,C] vs wind verbeelden [I,A,S] | Duidelijk. Links model/uitleg, rechts verbeelding. | Niets doen. |
| 45 | Goed antwoord zoeken [I,A,C] vs eigen uitleg maken [I,A,S] | Duidelijk. Links onderzoek/antwoord, rechts eigen interpretatie. | Niets doen. |
| 46 | Technische tekening [I,A,C] vs gevoel laten zien [I,A,S] | Duidelijk. Links technisch, rechts expressief. | Niets doen. |
| 47 | Schema begrijpen [I,A,C] vs idee verbeelden [I,A,S] | Duidelijk. Links schema/constructie, rechts vrije verbeelding. | Niets doen. |
| 48 | Muziek maken [I,A,S] vs makers helpen [A,S,O] | Beeld klopt. A-kant is vooral artistiek; S is nauwelijks zichtbaar. B-kant is sociaal/ondersteunend in makerscontext. | Overweeg A-weging richting A/I, minder S. |
| 49 | Campagne maken [I,A,S] vs gesprek leiden [A,S,O] | Beeld klopt, maar campagnebeeld voelt A/O/S meer dan I/A/S. | Overweeg A-weging A/O/S in plaats van I/A/S. |
| 50 | Een persoon helpen [A,S,O] vs groep leiden [S,O,C] | Visueel zeer helder S versus O. A bij A-kant is nauwelijks zichtbaar. C bij B-kant is nauwelijks zichtbaar. | Overweeg scherpere weging: A vooral S, B vooral O. |
| 51 | Goed luisteren [A,S,O] vs snel overtuigen [S,O,C] | Visueel helder. A is luisteren/helpen; B overtuigen/presenteren. | Overweeg A vooral S, B vooral O. |
| 52 | Mensen helpen [A,S,O] vs team motiveren [S,O,C] | Visueel helder. A is een-op-een helpen; B team activeren. | Overweeg A vooral S, B vooral O. |
| 53 | Stap voor stap helpen [A,S,O] vs team in actie zetten [S,O,C] | Visueel helder. A is begeleiding; B leiderschap. | Overweeg A vooral S, B vooral O. |
| 54 | Kans najagen [S,O,C] vs werkproces bewaken [R,O,C] | Beeld klopt. A is vooral O; B is vooral C. R in B is minder zichtbaar. | Overweeg A O/S, B C/O of C/R. |
| 55 | Energiek leiden [S,O,C] vs zorgvuldig controleren [R,O,C] | Beeld klopt. A is O/S, B is C/R. | Niets doen of B iets sterker C maken. |
| 56 | Voorraad leggen [R,O,C] vs opstelling bouwen [R,I,C] | Beeld klopt, maar A is vooral C/ordenen; O is niet zichtbaar. B is duidelijk R. | Overweeg A sterker C, B sterker R. |
| 57 | Codes checken [R,O,C] vs apparatuur plaatsen [R,I,C] | Beeld klopt. A is checken/procedure, B is installeren. O in A is weinig zichtbaar. | Overweeg A sterker C, B sterker R/I. |
| 58 | Logboek bijwerken [R,O,C] vs onderhoud doen [R,I,C] | Beeld klopt. A is administratie/logboek, B is onderhoud. O in A is weinig zichtbaar. | Overweeg A sterker C, B sterker R. |
| 59 | Gegevens zetten [R,I,C] vs betekenis zoeken [I,A,C] | Beeld klopt. A is vooral C, B vooral I. R/A zijn visueel secundair zwak. | Overweeg A C/I, B I/C. |
| 60 | Resultaten opbergen [R,I,C] vs patronen zoeken [I,A,C] | Beeld klopt. A is archiveren/ordenen, B analyseren. | Overweeg A sterker C, B sterker I. |
| 61 | Hulpvraag afhandelen [R,O,C] vs persoon helpen [A,S,O] | Beeld klopt. A is workflow/admin, B is sociaal gesprek. R/A zijn niet sterk zichtbaar. | Overweeg A sterker C/O, B sterker S/O. |
| 62 | Bij een persoon blijven [A,S,O] vs groep regelen [S,O,C] | Beeld klopt. A is sociaal een-op-een, B ondernemend groepsgericht. | Overweeg A vooral S, B vooral O. |

## Conclusie

De beelden vertellen in hoofdlijnen het juiste verhaal. De grootste winst zat niet in nieuwe plaatjes, maar in een korte wegingreview voor de gele vragen. Vooral de latere vragen zijn scherper gemaakt door de hoofdletter sterker te maken en minder secundaire letters mee te geven die het beeld niet duidelijk oproept.

Aanpak voor een volgende stap:

1. Laat een kleine groep leerlingen hardop vertellen wat ze bij enkele beelden zien.
2. Vergelijk hun woorden met de labels en primaire RIASOC-letter.
3. Vervang pas beelden als leerlingen in testgesprekken aangeven dat ze de scene zelf verkeerd lezen.
4. Houd de model-audit na elke inhoudelijke wijziging groen.

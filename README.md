# LinkeXtractor

## User Stories
| User Story | Beschrijving | Acceptatiecriteria                                                                                                                                                                                      |
|------------|--------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **Annoteren van Wetteksten met Labels** | Als jurist wil ik wetteksten kunnen annoteren met labels op basis van het kleurenmodel van het juridisch analyseschema. | - Mogelijkheid om tekst in de wet te selecteren en te labelen.<br>- Labels corresponderen met het kleurenmodel van het juridisch analyseschema.<br>- Verschillende labels toepasbaar op dezelfde tekst. |
| **Toevoegen van Optioneel Commentaar bij Labels** | Als jurist wil ik optioneel commentaar kunnen toevoegen bij labels. | - Mogelijkheid om commentaar te schrijven bij elk label.<br>- Commentaarveld is optioneel.<br>- Commentaar is zichtbaar voor alle gebruikers.                                                           |
| **Vastleggen van Relaties tussen Labels** | Als jurist wil ik relaties kunnen vastleggen tussen verschillende labels. | - Mogelijkheid om relaties te creëren tussen twee of meer labels.<br>- Aangeven van het type relatie (bijv. tegenstelling, overeenkomst).<br>- Relaties zijn visueel onderscheidbaar.                   |
| **Definiëren en Hergebruiken van Begrippen** | Als jurist wil ik begrippen kunnen definiëren en/of reeds vastgelegde begrippen kunnen hergebruiken. | - Functie om nieuwe begrippen te definiëren.<br>- Toegang tot bibliotheek van gedefinieerde begrippen.<br>- Gemakkelijk in te voegen begrippen in annotaties en labels.                                 |
| **Vastleggen van Metadata** | Als jurist wil ik metadata kunnen vastleggen bij annotaties. | - Mogelijkheid om metadata toe te voegen aan annotaties.<br>- Metadata bestaat uit: datum, auteur, titel, bron, versie.<br>- Metadata is zichtbaar voor alle gebruikers.                                |
| **Exporteren van Annotaties** | Als jurist wil ik annotaties kunnen exporteren naar een bestand. | - Mogelijkheid om annotaties te exporteren naar een bestand.<br>- Bestand is in een leesbaar formaat (bijv. JSON).<br>- Bestand bevat alle annotaties en metadata.                                      |


## Name
LinkeXtractor

## Description
De LinkeXtractor is software die juridische citaties in tekstdocumenten herkent en deze dan omzet
naar gestandaardiseerde identifiers. Deze identifiers kunnen vervolgens worden gebruikt in
hyperlinks of worden opgeslagen voor verder gebruik. De LinkeXtractor herkent (Nederlandse en
Europese) rechterlijke uitspraken, wetten en wetsartikelen, parlementaire documenten en Europese
regelgeving, zowel aan de hand van titels, afkortingen en roepnamen, als door middel van een brede
variatie aan documentnummers en vindplaatsaanduidingen.
De LinkeXtractor is tussen 2014 en 2017 ontwikkeld door het Kennis- en Exploitatiecentrum Officiële
Overheidspublicaties (KOOP), in samenwerking met de Raad voor de rechtspraak en het Ministerie
van Financiën, en wordt op dit moment onder meer gebruikt voor het detecteren van verwijzingen
in de rechterlijke uitspraken die worden gepubliceerd op Rechtspraak.nl.
De van hyperlinks voorziene uitspraken zijn toegankelijk op linkeddata.overheid.nl (de ‘LiDO-
website’) en via een deeplink ook toegankelijk vanaf de uitsprakendatabank van Rechtspraak.nl.
De miljoenen links die inmiddels zijn gevonden kunnen op de LiDO-website worden geraadpleegd;
ook vanaf wetten.overheid.nl kunnen bij ieder wetsartikel rechtstreeks de gerelateerde documenten
worden opgevraagd, waaronder de rechterlijke uitspraken waarin het wetsartikel voorkomt.


## Overzicht Tech Stack

### Frontend
- **Framework:** SvelteKit
    - Beschrijving: Een framework voor het bouwen van webapplicaties, gericht op eenvoud en snelheid.
- **Programmeertaal:** TypeScript
    - Beschrijving: Een getypeerde superset van JavaScript.

### Styling
- **CSS Framework:** TailwindCSS
    - Beschrijving: Een utility-first CSS framework. 

### Testen
- **Test Framework:** Vitest
    - Beschrijving: Een Vite-native testframework, werkt direct met Vite/SvelteKit projecten.

### Backend (Optie voor Database)
- **PostgreSQL**
    - Beschrijving: Een open-source relationele database met een sterke reputatie voor betrouwbaarheid, functionaliteit en prestaties. Goed geschikt voor schaalbare en veilige toepassingen.
### Deployment
- **Opties:** Deployment services zoals Vercel, Netlify of AWS. AWS is de veiligste optie denk ik?


***
## Usage
Use examples liberally, and show the expected output if you can. It's helpful to have inline the smallest example of usage that you can demonstrate, while providing links to more sophisticated examples if they are too long to reasonably include in the README.

## Support
Tell people where they can go to for help. It can be any combination of an issue tracker, a chat room, an email address, etc.

## Roadmap
If you have ideas for releases in the future, it is a good idea to list them in the README.

## Contributing
State if you are open to contributions and what your requirements are for accepting them.

For people who want to make changes to your project, it's helpful to have some documentation on how to get started. Perhaps there is a script that they should run or some environment variables that they need to set. Make these steps explicit. These instructions could also be useful to your future self.

You can also document commands to lint the code or run tests. These steps help to ensure high code quality and reduce the likelihood that the changes inadvertently break something. Having instructions for running tests is especially helpful if it requires external setup, such as starting a Selenium server for testing in a browser.

## Authors and acknowledgment
Show your appreciation to those who have contributed to the project.

## License
For open source projects, say how it is licensed.

## Project status
If you have run out of energy or time for your project, put a note at the top of the README saying that development has slowed down or stopped completely. Someone may choose to fork your project or volunteer to step in as a maintainer or owner, allowing your project to keep going. You can also make an explicit request for maintainers.

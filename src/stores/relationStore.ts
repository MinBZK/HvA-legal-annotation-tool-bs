import { localStorageStore } from '@skeletonlabs/skeleton';
import type { Writable } from 'svelte/store';
import Label from '../models/Label';
import Annotation from '../models/Annotation';

export let labels: Label[] = [
    new Label(1, "Rechtssubject", "#c2e7ff"),
    new Label(2, "Rechtsbetrekking", "#70a4ff"),
    new Label(3, "Rechtsobject", "#98bee1"),
    new Label(4, "Rechtsfeit", "#97d6fe"),
    new Label(5, "Voorwaarde", "#91e8d3"),
    new Label(6, "Afleidingsregel", "#ff7a7a"),
    new Label(7, "Variabele", "#ffd95d"),
    new Label(8, "Variabelewaarde", "#fff380"),
    new Label(9, "Parameter", "#ffb4b4"),
    new Label(10, "Parameterwaarde", "#ffd8ef"),
    new Label(11, "Operator", "#c1ebe1"),
    new Label(12, "Tijdsaanduiding", "#d8b0f9"),
    new Label(13, "Plaatsaanduiding", "#efcaf6"),
    new Label(14, "Delegatiebevoegdheid", "#cecece"),
    new Label(15, "Delegatie-invulling", "#e2e2e2"),
    new Label(16, "Brondefinitie", "#f6f6f6")
];

export let relationTypes: string[] = [
    "Wie heeft het recht",
    "Wie heeft de plicht",
    "Heeft als voorwerp",
    "Wordt gecreëerd door",
    "Wordt gewijzigd door",
    "Wordt beëindigd door",
    "Is geldig indien voldaan aan",
    "Wordt uitgevoerd door",
    "Vindt plaats op",
    "Vindt plaats in",
    "Is specalisatie van",
    "Heeft als invoer",
    "Heeft als uitvoer",
    "Gebruikt"
];

export let annotations: Annotation[] = [
    new Annotation(1, null as any, "Deze wet", "Rechtssubject", null as any, null as any, [
        { type: relationTypes[10], source: 1, target: 2 },
        { type: relationTypes[6], source: 1, target: 3 }
    ]),
    new Annotation(2, null as any, "Die andere wet", "Rechtssubject", null as any, null as any, [
        { type: relationTypes[10], source: 1, target: 2 },
    ]),
    new Annotation(3, null as any, "Als Bamischijf het toelaat", "Voorwaarden", null as any, null as any, [
        { type: relationTypes[6], source: 1, target: 3 }
    ])
];

// export let relationArray: Relation[] = [
//     new Relation(1, labels[1], labels[0], relationsText[0], true),
//     new Relation(2, labels[1], labels[0], relationsText[1], true),
//     new Relation(3, labels[1], labels[2], relationsText[2], true),
//     new Relation(4, labels[1], labels[3], relationsText[3], true),
//     new Relation(5, labels[1], labels[3], relationsText[4], true),
//     new Relation(6, labels[1], labels[3], relationsText[5], true),
//     new Relation(7, labels[1], labels[4], relationsText[6], true),

//     new Relation(8, labels[3], labels[0], relationsText[7], true),
//     new Relation(9, labels[3], labels[2], relationsText[2], true),
//     new Relation(10, labels[3], labels[4], relationsText[6], true),
//     new Relation(11, labels[3], labels[12], relationsText[9], true),
//     new Relation(12, labels[3], labels[11], relationsText[8], true),

//     new Relation(13, labels[0], labels[0], relationsText[10], true),
//     new Relation(14, labels[0], labels[4], relationsText[6], true),

//     new Relation(15, labels[2], labels[2], relationsText[10], true),
//     new Relation(16, labels[2], labels[4], relationsText[6], true),

//     new Relation(17, labels[5], labels[6], relationsText[12], true),
//     new Relation(18, labels[5], labels[6], relationsText[11], true),
//     new Relation(19, labels[5], labels[8], relationsText[11], true),
//     new Relation(20, labels[5], labels[9], relationsText[11], true),
//     new Relation(21, labels[5], labels[4], relationsText[6], true),
//     new Relation(22, labels[5], labels[10], relationsText[14], true),
// ];

export const labelStore: Writable<string> = localStorageStore('labels', JSON.parse(JSON.stringify(labels)));

export const relationsTypesStore: Writable<string> = localStorageStore('relationsTypes', JSON.parse(JSON.stringify(relationTypes)));

export const annotationsStore: Writable<string> = localStorageStore('FarajAnnotations', JSON.parse(JSON.stringify(annotations)));

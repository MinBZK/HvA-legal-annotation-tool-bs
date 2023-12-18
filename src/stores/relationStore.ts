import { localStorageStore } from '@skeletonlabs/skeleton';
import type { Writable } from 'svelte/store';
import Label from '../models/Label';
import Annotation from '../models/Annotation';

// export let labels: Label[] = [
//     new Label("Rechtssubject", "#c2e7ff", 1),
//     new Label("Rechtsbetrekking", "#70a4ff", 2),
//     new Label("Rechtsobject", "#98bee1", 3),
//     new Label("Rechtsfeit", "#97d6fe", 4),
//     new Label("Voorwaarde", "#91e8d3", 5),
//     new Label("Afleidingsregel", "#ff7a7a", 6),
//     new Label("Variabele", "#ffd95d", 7),
//     new Label("Variabelewaarde", "#fff380", 8),
//     new Label("Parameter", "#ffb4b4", 9),
//     new Label("Parameterwaarde", "#ffd8ef", 10),
//     new Label("Operator", "#c1ebe1", 11),
//     new Label("Tijdsaanduiding", "#d8b0f9", 12),
//     new Label("Plaatsaanduiding", "#efcaf6", 13),
//     new Label("Delegatiebevoegdheid", "#cecece", 14),
//     new Label("Delegatie-invulling", "#e2e2e2", 15),
//     new Label("Brondefinitie", "#f6f6f6", 16)
// ];

export const relationTypes: string[] = [
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

// export let annotations: Annotation[] = [
//     new Annotation(1, null as any, "Deze wet", "Rechtssubject", null as any, null as any, [
//         { type: relationTypes[10], source: 1, target: 2 },
//         { type: relationTypes[6], source: 1, target: 3 }
//     ]),
//     new Annotation(2, null as any, "Die andere wet", "Rechtssubject", null as any, null as any, [
//         { type: relationTypes[10], source: 1, target: 2 },
//     ]),
//     new Annotation(3, null as any, "Als Bamischijf het toelaat", "Voorwaarden", null as any, null as any, [
//         { type: relationTypes[6], source: 1, target: 3 }
//     ])
// ];


// export const relationsTypesStore: Writable<string> = localStorageStore('relationsTypes', JSON.parse(JSON.stringify(relationTypes)));

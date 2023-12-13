import { localStorageStore } from '@skeletonlabs/skeleton';
import type { Writable } from 'svelte/store';
import Label from '../models/Label';
import Relation from '../models/Relation';

export let labels: Label[] = [
    new Label(1, "Label1", "blue", null as any),
    new Label(2, "Label2", "blue", null as any),
    new Label(3, "Label3", "blue", null as any),
    new Label(4, "Label4", "blue", null as any),
    new Label(5, "Label5", "green", null as any)
];

export let relationsText: string[] = [
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

export let relationArray: Relation[] = [
    new Relation(1, labels[0], labels[1], relationsText[0]),
    new Relation(2, labels[0], labels[2], relationsText[1]),
    new Relation(3, labels[0], labels[3], relationsText[2]),
    new Relation(4, labels[1], labels[4], relationsText[3])
];

export const labelStore: Writable<string> = localStorageStore('labels', JSON.parse(JSON.stringify(labels)));

export const relationsTextStore: Writable<string> = localStorageStore('relationsText', JSON.parse(JSON.stringify(relationsText)));

export const relationsStore: Writable<string> = localStorageStore('relations', JSON.parse(JSON.stringify(relationArray)));

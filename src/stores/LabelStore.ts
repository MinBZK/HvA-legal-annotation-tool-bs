import type { Writable } from "svelte/store";
import { writable } from "svelte/store";
import Label from "../models/Label";
import type Annotation from "../models/Annotation";

// Create a writable store to hold the selected color and label ID
export const labelStore: Writable<Label[]> = writable([new Label('Rechtssubject', '#c2e7ff', 0)]);
export const selectedColor = writable({color: ''});
export const chipSelected = writable(false)
export const textSelection = writable({text:''});
export const selectedLabels = writable([] as Label[]);
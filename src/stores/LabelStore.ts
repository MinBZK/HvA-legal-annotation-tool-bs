import type { Writable } from "svelte/store";
import { writable } from "svelte/store";
import type Label from "../models/Label";

// Create a writable store to hold the selected color and label ID
export const labelStore: Writable<Label[]> = writable();
export const textSelection = writable({text:''});
export const selectedColor = writable({color: ''});
export const selectedLabels = writable([] as Label[]);
import type { Writable } from "svelte/store";
import { writable } from "svelte/store";
import Label from "../models/Label";

// Create a writable store to hold the selected color and label ID
export const labelStore: Writable<Label[]> = writable([new Label('TestLabel', '#D64526', 2023)]);
export const selectedColor = writable({color: ''});
export const chipSelected = writable(false)
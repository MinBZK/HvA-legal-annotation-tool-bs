import { writable } from "svelte/store";

// Create a writable store to hold the selected color and label ID
export const labelStore = writable({ selectedColor: '', labelID: '' });
export const isOpen = writable(false);
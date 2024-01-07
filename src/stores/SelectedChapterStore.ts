import { writable } from 'svelte/store';

export const selectedChaptersStore = writable(new Set());

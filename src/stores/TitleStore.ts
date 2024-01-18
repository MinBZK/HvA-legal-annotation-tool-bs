import { localStorageStore } from '@skeletonlabs/skeleton';
import type { Writable } from 'svelte/store';

export const titleStore: Writable<string> = localStorageStore('title', 'initial title');
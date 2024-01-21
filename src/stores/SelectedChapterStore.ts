import {localStorageStore} from "@skeletonlabs/skeleton";
import type {Writable} from "svelte/store";

export const selectedChaptersStore: Writable<Array<number>> =
    localStorageStore('selectedChapters', new Array<number>());

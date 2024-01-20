import {localStorageStore} from "@skeletonlabs/skeleton";
import type {Writable} from "svelte/store";

export const selectedChaptersStore: Writable<Array<string>> =
    localStorageStore('selectedChapters', new Array<string>());

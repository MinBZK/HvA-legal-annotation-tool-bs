// import { writable } from 'svelte/store';
import type {Writable} from 'svelte/store';
import type LegalDocument from '../models/LegalDocument';
import { localStorageStore } from '@skeletonlabs/skeleton';

export const documentStore:Writable<LegalDocument> = localStorageStore('legal-document',{
    title: '',
    filename: '',
    chapterTitles: [],
    chapterContents: [],
    annotations: [],
    history: []
});
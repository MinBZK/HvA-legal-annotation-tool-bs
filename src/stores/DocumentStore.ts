import { writable } from 'svelte/store';
import type LegalDocument from '../models/LegalDocument';

export const documentStore = writable<LegalDocument>({
    title: '',
    filename: '',
    chapterTitles: [],
    chapterContents: [],
    annotations: [],
    history: []
});
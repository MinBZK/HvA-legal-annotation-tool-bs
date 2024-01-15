import { writable } from 'svelte/store';
import type LegalDocument from '../models/LegalDocument';

const documentStore = writable<LegalDocument>({
    title: '',
    filename: '',
    chapterTitles: [],
    chapterContents: [],
    annotations: [],
    history: []
});

export default documentStore;
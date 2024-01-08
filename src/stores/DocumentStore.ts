import { writable } from 'svelte/store';
import type LegalDocument from '../models/LegalDocument';

const documentStore = writable<LegalDocument>({
    title: '',
    filename: '',
    text: '',
    chapters: [],
    annotations: []
});

export default documentStore;
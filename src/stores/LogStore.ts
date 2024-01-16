import { writable } from 'svelte/store';
import type EditHistory from '../models/EditHistory';

const logStore = writable<EditHistory[]>([]);

export default logStore;
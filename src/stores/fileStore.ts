import { writable } from 'svelte/store';

function createFileContentStore() {
    const { subscribe, set } = writable('');

    if (typeof window !== 'undefined') {
        const storedValue = localStorage.getItem('uploadedXML') || '';
        set(storedValue);

        subscribe((value) => {
            localStorage.setItem('uploadedXML', value);
        });
    }

    return {
        subscribe,
        set,
    };
}

export const fileContentStore = createFileContentStore();

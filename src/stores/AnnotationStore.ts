import  type {Writable}  from 'svelte/store';
import type Annotation from '../models/Annotation';
import { localStorageStore } from '@skeletonlabs/skeleton';

// Define the initial state of the store
const initialAnnotations: Annotation[] = [];

// Create a writable store with the initial state
export const annotationStore:Writable<Annotation[]> = localStorageStore('annotations',initialAnnotations);

// Function to add a new annotation to the store
export const addAnnotation = (annotation: Annotation) => {
    annotationStore.update((annotations: Annotation[]) => [...annotations, annotation]);
};

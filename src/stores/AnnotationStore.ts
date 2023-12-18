import { writable } from 'svelte/store';
import type Annotation from '../models/Annotation';

// Define the initial state of the store
const initialAnnotations: Annotation[] = [];

// Create a writable store with the initial state
export const annotationStore = writable(initialAnnotations);

// Function to add a new annotation to the store
export const addAnnotation = (annotation: Annotation) => {
    annotationStore.update((annotations: Annotation[]) => [...annotations, annotation]);
};

// Function to remove an annotation from the store
export const removeAnnotation = (annotation: Annotation) => {
    annotationStore.update((annotations) => annotations.filter((a) => a !== annotation));
};

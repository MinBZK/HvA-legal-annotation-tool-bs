import type Annotation from "./Annotation";

export default class LegalDoc {
    id: number;
    source: string;
    text: string;
    annotations: Annotation[];

    constructor(id: number, source: string, text: string, annotations: Annotation[]) {
        this.id = id;
        this.source = source;
        this.text = text;
        this.annotations = annotations;
    }

    exportDocument() {
        return {
            id: this.id,
            source: this.source,
            text: this.text,
            annotations: this.annotations
        }
    }

    importDocument() {
        // TODO: implement
    }
}
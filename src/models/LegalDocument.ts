import type Annotation from "./Annotation";

export default class LegalDocument {
    title: string;
    filename: string;
    text: string;
    chapters: string[];
    annotations: Annotation[];

    constructor(title: string, filename: string, text: string, chapters: string[], annotations: Annotation[]) {
        this.title = title;
        this.filename = filename;
        this.text = text;
        this.chapters = chapters;
        this.annotations = annotations;
    }
}
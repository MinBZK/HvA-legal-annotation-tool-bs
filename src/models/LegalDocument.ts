import type Annotation from "./Annotation";

export default class LegalDocument {
    title: string;
    filename: string;
    chapterTitles: string[];
    chapterContents: string[];
    annotations: Annotation[];

    constructor(title: string, filename: string, chapterTitles: string[],chapterContents: string[], annotations: Annotation[]) {
        this.title = title;
        this.filename = filename;
        this.chapterTitles = chapterTitles;
        this.chapterContents = chapterContents;
        this.annotations = annotations;
    }
}
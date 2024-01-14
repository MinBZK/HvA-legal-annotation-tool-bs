import type Annotation from "./Annotation";

interface History {
    user: string;
    date: Date;
}

export default class LegalDocument {
    title: string;
    filename: string;
    chapterTitles: string[];
    chapterContents: string[];
    annotations: Annotation[];
    history: History[];

    constructor(title: string, filename: string, chapterTitles: string[], chapterContents: string[], annotations: Annotation[], history: History[] = []) {
        this.title = title;
        this.filename = filename;
        this.chapterTitles = chapterTitles;
        this.chapterContents = chapterContents;
        this.annotations = annotations;
        this.history = history;
    }
}
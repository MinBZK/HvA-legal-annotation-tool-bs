import type Annotation from "./Annotation";
import type EditHistory from "./EditHistory";


export default class LegalDocument {
    title: string;
    filename: string;
    chapterTitles: string[];
    chapterContents: string[];
    annotations: Annotation[];
    history: EditHistory[];

    constructor(title: string, filename: string, chapterTitles: string[], chapterContents: string[], annotations: Annotation[], history: EditHistory[] = []) {
        this.title = title;
        this.filename = filename;
        this.chapterTitles = chapterTitles;
        this.chapterContents = chapterContents;
        this.annotations = annotations;
        this.history = history;
    }
}
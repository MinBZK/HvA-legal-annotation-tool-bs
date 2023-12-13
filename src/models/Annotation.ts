import type LegalDoc from "./LegalDoc";
import type Comment from "./Comment";
import type Definition from "./Definition";

export default class Annotation {
    id: number;
    parent: LegalDoc;
    text: string;
    label: string;
    // metadata: MetaData;
    comment: Comment;
    definition: Definition;

    constructor(id: number, parent: LegalDoc, text: string, label: string, comment: Comment, definition: Definition,
        // metadata: MetaData
        ) {
        this.id = id;
        this.parent = parent;
        this.text = text;
        this.label = label;
        this.comment = comment;
        this.definition = definition;
    }
}
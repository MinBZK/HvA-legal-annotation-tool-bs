import type LegalDoc from "./LegalDoc";
import type Comment from "./Comment";
import type Definition from "./Definition";
import type Label from "./Label";

interface Relation {
    type: string;
    source: number;
    target: number;
}

export default class Annotation {
    id: number;
    parent: LegalDoc;
    text: string;
    label: Label[];
    // metadata: MetaData;
    comment: Comment;
    definition: Definition;
    relationships: Relation[];

    constructor(id: number, parent: LegalDoc, text: string, label: Label[], comment: Comment, definition: Definition, relationships: Relation[] = []
        // metadata: MetaData
        ) {
        this.id = id;
        this.parent = parent;
        this.text = text;
        this.label = label;
        this.comment = comment;
        this.definition = definition;
        this.relationships = relationships;
    }
}
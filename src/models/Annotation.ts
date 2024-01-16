import type LegalDocument from "./LegalDocument";
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
    text: string;
    label: Label[];
    comment: Comment;
    definition: Definition;
    relationships: Relation[];
    startPosition: number;
    endPosition: number;

    constructor(id: number, text: string, label: Label[], comment: Comment, definition: Definition, relationships: Relation[] = [], 
        startPosition: number, endPosition: number) {
        this.id = id;
        this.text = text;
        this.label = label;
        this.comment = comment;
        this.definition = definition;
        this.relationships = relationships;
        this.startPosition = startPosition;
        this.endPosition = endPosition;
    }
}
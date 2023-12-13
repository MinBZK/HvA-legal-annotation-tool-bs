import type Label from "./Label";

export default class Relation {
    public relationId: number;
    public label1: Label;
    public label2: Label;
    public description: string;

    constructor(relationId: number, label1: Label, label2: Label, description: string) {
        this.relationId = relationId;
        this.label1 = label1;
        this.label2 = label2;
        this.description = description;
    }
}
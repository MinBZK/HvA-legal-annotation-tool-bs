import type { Label } from "./Label";

export class Relation {
    private relationId: number;
    public label1: Label;
    public label2: Label;
    public description: string;

    constructor(relationId: number, label1: Label, label2: Label, description: string) {
        this.relationId = relationId;
        this.label1 = label1;
        this.label2 = label2;
        this.description = description;
    }

    getRelationId() {
        return this.relationId;
    }

    setRelationId(relationId: number) {
        this.relationId = relationId;
    }

    getLabel1() {
        return this.label1;
    }

    setLabel1(label1: Label) {
        this.label1 = label1;
    }

    getLabel2() {
        return this.label2;
    }

    setLabel2(label2: Label) {
        this.label2 = label2;
    }

    getDescription() {
        return this.description;
    }

    setDescription(description: string) {
        this.description = description;
    }
}
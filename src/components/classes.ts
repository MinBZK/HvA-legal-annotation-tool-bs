export class Label {
    private labelId: number;
    public name: string;
    private color: string;
    private label: Label;
    private comment: string; // TODO: Change to comment object
    
    constructor(labelId: number, name: string, color: string, label: Label, comment: string) {
        this.labelId = labelId;
        this.name = name;
        this.color = color;
        this.label = label;
        this.comment = comment;
    }

    getLabelId() {
        return this.labelId;
    }

    setLabelId(labelId: number) {
        this.labelId = labelId;
    }

    getName() {
        return this.name;
    }

    setName(name: string) {
        this.name = name;
    }

    getColor() {
        return this.color;
    }

    setColor(color: string) {
        this.color = color;
    }

    getLabel() {
        return this.label;
    }

    setLabel(label: Label) {
        this.label = label;
    }

    getComment() {
        return this.comment;
    }

    setComment(comment: string) {
        this.comment = comment;
    }
}

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

export function loadRelations() {
    // Should get relationships from db/localstorage
    // Fake data

    let rechtsSubject = new Label(1, "Rechtssubject", "red", null as any, "");
    let rechtsObject = new Label(2, "Rechtsobject", "blue", null as any, "");
    let voorwaarden = new Label(3, "voorwaarden", "green", null as any, "");

    return [
        new Relation(1, rechtsSubject, rechtsSubject, "Is specialisatie van"),
        new Relation(2, rechtsSubject, voorwaarden, "Is geldig indien voldaan aan"),
        new Relation(3, rechtsObject, rechtsObject, "Is specialisatie van"),
        new Relation(4, rechtsObject, voorwaarden, "Is geldig indien voldaan aan")
    ];
}
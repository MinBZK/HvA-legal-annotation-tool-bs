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
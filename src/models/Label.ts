export default class Label {
    labelId: number;
    name: string;
    color: string;
    label: Label;

    constructor(labelId: number, name: string, color: string, label: Label) {
        this.labelId = labelId;
        this.name = name;
        this.color = color;
        this.label = label;
    }
}
export default class Label {
    labelId: number;
    name: string;
    color: string;

    constructor(labelId: number, name: string, color: string) {
        this.labelId = labelId;
        this.name = name;
        this.color = color;
    }
}
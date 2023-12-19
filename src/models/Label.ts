export default class Label {
    labelId: number;
    name: string;
    color: string;

    constructor(name: string, color: string, labelId: number) {
        this.labelId = labelId;
        this.name = name;
        this.color = color;
    }
}
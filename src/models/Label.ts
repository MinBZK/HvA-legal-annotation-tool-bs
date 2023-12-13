export default class Label {
    name: string;
    color: string;
    labelId: number;

    constructor(name: string, color: string, labelId: number) {
        this.name = name;
        this.color = color;
        this.labelId = labelId;
    }
}
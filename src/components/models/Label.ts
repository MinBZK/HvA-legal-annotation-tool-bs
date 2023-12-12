export class Label {
    public labelId: number;
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
}
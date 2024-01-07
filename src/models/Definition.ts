export default class Definition {
    definitionId: number;
    definition: string;
    creationDate: Date;

    constructor(definitionId: number, definition: string) {
        this.definitionId = definitionId;
        this.definition = definition;
        this.creationDate = new Date(Date.now());
    }
    static createEmpty(): Definition{
        return new Definition(0,"");
    }
}

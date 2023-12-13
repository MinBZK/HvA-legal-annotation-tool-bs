export default class Comment {
    commentId: number;
    comment: string;
    creationDate: Date;

    constructor(commentId: number, comment: string) {
        this.commentId = commentId;
        this.comment = comment;
        this.creationDate = new Date(Date.now());
    }
}
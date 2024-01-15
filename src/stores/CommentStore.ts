import {writable, type Writable} from "svelte/store";
import  Comment from "../models/Comment";


const initialComment = Comment.createEmpty();

export const comment = writable(initialComment);
// List of Comment
export const commentList = writable([] as Comment[]);

// Add Comment to list
export const addCommentToList = (comment: Comment) =>{
    commentList.update((comments: Comment[])=>[...comments,comment]);
}


// Update Comment
export const updateCommentToList = (updateComment: Comment) =>{
    commentList.update((comments)=>{
        return comments.map((comment)=>{
            // Check if the current comment matches the updated comment
            if(comment.commentId === updateComment.commentId){
                // If yes, update the comment with the new data
                return {...comment, ...updateComment};
            }
            // If not, return the original comment unchanged
            return comment;
        })
    })
}

// Remove Comment
export const removeCommentFromList = (comment: Comment)=>{
    commentList.update((comments)=> comments.filter((c)=> c !== comment));
}
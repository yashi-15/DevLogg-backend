import mongoose, { Schema } from "mongoose";

const commentSchema = new mongoose.Schema({
    post_id: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'posts'
    },
    post_author: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'users'
    },
    comment: {
        type: String,
        required: true
    },
    comment_author: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'users'
    },
    children: {
        type: [Schema.Types.ObjectId],
        ref: 'comments'
    },
    isReply: {
        type: Boolean,
        required: true,
        default: false
    },
    parent: {
        type: Schema.Types.ObjectId,
        ref: 'comments'
    }

}, {timestamps: true})
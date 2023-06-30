import mongoose, { Document, Schema } from 'mongoose';
import express, { NextFunction, Request, Response } from 'express';
import { ObjectId } from 'mongodb';

interface IFilelinks extends String {
    //define how you want the structure of the file links to be
}

type filelinksType = IFilelinks;

export interface IPost {
    comments: [Schema.Types.ObjectId];
    filenames: [String];
    filelinks: [IFilelinks];
    likes: [Schema.Types.ObjectId , ObjectId];
    likesCount: Number;
    author: Schema.Types.ObjectId;
    caption: String;
    createdAt: Date;
    status: string;

    updateLikesCount(): Promise<void>;
}
//you can implement a quote tweet type feature for the shares part
//, but not necessary now!!

export interface IPostModel extends IPost, Document {}

const PostSchema: Schema = new Schema(
    {
        comments: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Comment',
            },
        ],
        filenames: [
            {
                type: String,
            },
        ],
        filelinks: [
            {
                type: String,
            },
        ],
        likes: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
            },
        ],
        likesCount: {
            type: Number,
            required: true,
            default: 0,
        },
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        caption: {
            type: String,
            required: true,
        },
        createdAt: {
            type: Date,
            required: true,
            default: Date.now(),
        },
        status: {
            type: String,
            enum: ['active', 'archived', 'deleted'],
            default: 'active',
        },
    }
    // {
    //     toJSON: { virtuals: true },
    //     toObject: { virtuals: true },
    // }
);

console.log('about to enter the hooks');
PostSchema.pre(/^find/, function (next) {
    this.populate({
        path: 'author',
        select: '-__v -status',
    });

    next();
});

//create a schema method that updates the likesCount field
PostSchema.methods.updateLikesCount = async function () {
    const likesCount: number = this.likes.length;
    this.likesCount = likesCount;
};

// Define a virtual field for likesCount
// PostSchema.virtual('likesCount').get(function () {
//     return this.likes.length;
// });

//create a comment schema
//add a prehook that runs wwhen the like route is requested that
//increments the like count

//add a prehook that exludes posts that have status = deleted or archived except if the archived
//post belongs to current user

export default mongoose.model<IPostModel>('Post', PostSchema);

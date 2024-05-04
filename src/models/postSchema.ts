import mongoose, { Document, Schema } from 'mongoose';
import express, { NextFunction, Request, Response } from 'express';
import { ObjectId } from 'mongodb';

interface IFilelinks extends String {
    //define how you want the structure of the file links to be
}

type filelinksType = IFilelinks;

export interface IPost {
    filenames: [String];
    filelinks: [IFilelinks];
    likesCount: Number;
    author: Schema.Types.ObjectId;
    caption: String;
    createdAt: Date;
    status: string;
}
//you can implement a quote tweet type feature for the shares part
//, but not necessary now!!

export interface IPostModel extends IPost, Document {}

const PostSchema: Schema = new Schema(
    {
        //implement comments
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

//only fetch docs that have not being deleted
PostSchema.pre(/^find/, function (next) {
    // this points to the current query
    this.find({ status: { $ne: 'deleted' } });
    next();
});

//on the controller level, filter archived posts

//add a prehook that exludes posts that have status = deleted or archived except if the archived
//post belongs to current user

export default mongoose.model<IPostModel>('Post', PostSchema);

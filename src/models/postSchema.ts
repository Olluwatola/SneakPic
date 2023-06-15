import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcrypt';

interface IFilelinks extends String {
    //define how you want the structure of the file links to be
}

type filelinksType = IFilelinks;

export interface IPost {
    comments: [Schema.Types.ObjectId];
    filenames: [String];
    filelinks: [IFilelinks];
    likes: [Schema.Types.ObjectId];
    likesCount: Number;
    author: Schema.Types.ObjectId;
    caption: String;
    createdAt: Date;
}
//you can implement a quote tweet type feature for the shares part
//, but not necessary now!!

export interface IPostModel extends IPost, Document {}

const PostSchema: Schema = new Schema({
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
        required:true
    },
    caption:{
        type:String,
        required:true
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now(),
    },
});

//create a comment schema
//add a prehook that runs wwhen the like route is requested that
//increments the like count

export default mongoose.model<IPostModel>('Post', PostSchema);

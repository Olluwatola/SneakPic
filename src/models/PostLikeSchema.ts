import mongoose, { Document, Schema } from 'mongoose';
import Post from './postSchema';

export interface IPostLike {
    user: Schema.Types.ObjectId;
    postId: Schema.Types.ObjectId;
    updateLikesCount(): Promise<void>;
}

export interface IPostLikeModel extends IPostLike, Document {}

const PostLikeSchema: Schema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    postId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
        required: true,
    },
});

PostLikeSchema.index({ user: 1, postId: 1 }, { unique: true });

const PostModel = mongoose.model<IPostLikeModel>('PostLike', PostLikeSchema);

export default PostModel;

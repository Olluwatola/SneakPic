"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const PostSchema = new mongoose_1.Schema({
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
        type: mongoose_1.default.Schema.Types.ObjectId,
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
exports.default = mongoose_1.default.model('Post', PostSchema);

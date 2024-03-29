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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const PostSchema = new mongoose_1.Schema({
    comments: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
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
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: 'User',
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
console.log('about to enter the hooks');
PostSchema.pre(/^find/, function (next) {
    this.populate({
        path: 'author',
        select: '-__v -status',
    });
    next();
});
//create a schema method that updates the likesCount field
PostSchema.methods.updateLikesCount = function () {
    return __awaiter(this, void 0, void 0, function* () {
        const likesCount = this.likes.length;
        this.likesCount = likesCount;
    });
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
exports.default = mongoose_1.default.model('Post', PostSchema);

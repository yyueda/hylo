"use server";

import { revalidatePath } from "next/cache";
import Thread from "../models/thread.model";
import User from "../models/user.model";
import { connectToDB } from "../mongoose";
import mongoose from "mongoose";

type createThreadProps = {
    text: string,
    author: string,
    communityId: string | null,
    path: string,
};

type addCommentProps = { 
    threadId: string,
    commentText: string,
    userId: string,
    path: string 
};

export async function createThread({
    text,
    author,
    communityId,
    path
}: createThreadProps) {
    connectToDB();

    try {
        const session = await mongoose.startSession();
        await session.withTransaction(async () => {
            const [createdThread] = await Thread.create({
                text,
                author,
                community: null,
            }, { session: session });
    
            await User.findByIdAndUpdate(author, {
                $push : { threads: createdThread._id }
            }, { session: session });
        });
        
        revalidatePath(path);
    } catch (error: unknown) {
        if (error instanceof Error) {
            throw new Error(`Failed to create thread: ${error.message}`);
        }
    }
};

export async function fetchThreads({ pageNumber = 1, pageSize = 20 }) {
    connectToDB();

    const skipAmount = (pageNumber - 1) * pageSize;

    try {
        const threads = await Thread.find({ parentId: { $in: [null, undefined] } })
            .sort({ createdAt: 'desc' })
            .skip(skipAmount)
            .limit(pageSize)
            .populate({ path: 'author', model: User })
            .populate({ 
                path: 'children', 
                model: Thread,
                populate: {
                    path: 'author',
                    model: User,
                    select: '_id username image'
                }
            });

        const totalPostsCount = await Thread.countDocuments({ parentId: { $in: [null, undefined] } });

        const isNext = totalPostsCount > skipAmount + threads.length;

        return { threads, isNext };

    } catch (error: unknown) {
        if (error instanceof Error) {
            throw new Error(`Failed to fetch threads: ${error.message}`);
        }
    }
};

export async function fetchThreadById(id: string) {
    connectToDB();

    // TODO: Populate Community
    try {
        const thread = await Thread.findById(id)
            .populate({
                path: 'author',
                model: User,
                select: '_id id username image'
            })
            .populate({ 
                path: 'children', 
                model: Thread,
                populate: [
                    {
                        path: 'author',
                        model: User,
                        select: '_id id username parentId image'
                    },
                    {
                        path: 'children',
                        model: Thread,
                        populate: {
                            path: 'author',
                            model: User,
                            select: '_id id username parentId image'
                        }
                    }
                ]
            });
        
        return thread;
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(`Failed to fetch thread: ${error.message}`);
        }
    }
};

export async function addCommentToThread({
    threadId,
    commentText,
    userId,
    path
} : addCommentProps) {
    connectToDB();

    try {
        const session = await mongoose.startSession();
        await session.withTransaction(async () => {
            const originalThread = await Thread.findById(threadId);
            if (!originalThread) throw new Error('Thread not found');

            const commentThread = new Thread({
                text: commentText,
                author: userId,
                parentId: threadId
            });
            const savedCommentThread = await commentThread.save({ session });
            
            originalThread.children.push(savedCommentThread._id);
            await originalThread.save({ session });
        });

        revalidatePath(path);

    } catch (error) {
        if (error instanceof Error) {
            throw new Error(`Failed to fetch thread: ${error.message}`);
        }
    }
}

export async function fetchUserPosts(userId: string) {
    connectToDB();

    try {
        return await User
            .findOne({ id: userId })
            .populate({
                path: 'threads',
                model: Thread,
                populate: {
                    path: 'children',
                    model: Thread,
                    populate: {
                        path: 'author',
                        model: User,
                        select: 'id username image'
                    }
                }
            });

    } catch (error) {
        if (error instanceof Error) {
            throw new Error(`Failed to fetch user's posts: ${error.message}`);
        }
    }
}

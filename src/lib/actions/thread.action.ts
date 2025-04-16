"use server";

import { revalidatePath } from "next/cache";
import Thread, { threadSchema } from "../models/thread.model";
import User from "../models/user.model";
import { connectToDB } from "../mongoose";
import mongoose, { HydratedDocumentFromSchema } from "mongoose";
import Community from "../models/community.model";

type threadDocument = HydratedDocumentFromSchema<typeof threadSchema>;

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
            const communityIdObject = await Community.findOne({ id: communityId })
                .select('_id');

            const [createdThread] = await Thread.create([{
                text,
                author,
                community: communityIdObject,
            }], { session: session });
            
            await User.findByIdAndUpdate(author, {
                $push : { threads: createdThread._id }
            }, { session: session });

            if (communityIdObject) {
                await Community.findByIdAndUpdate(communityIdObject, {
                  $push: { threads: createdThread._id },
                });
              }
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
            .populate({ path: 'community', model: Community })
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
                path: 'community',
                model: Community,
                select: '_id id name image'
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
};

export async function fetchUserPosts(userId: string) {
    connectToDB();

    try {
        return await User
            .findOne({ id: userId })
            .populate({
                path: 'threads',
                model: Thread,
                populate: [
                    {
                        path: 'community',
                        model: Community,
                        select: '_id id name image',
                    },
                    {
                    path: 'children',
                    model: Thread,
                    populate: {
                        path: 'author',
                        model: User,
                        select: 'id username image'
                    }
                }]
            });

    } catch (error) {
        if (error instanceof Error) {
            throw new Error(`Failed to fetch user's posts: ${error.message}`);
        }
    }
};

async function fetchAllChildThreads(threadId: string): Promise<threadDocument[]> {
    const childThreads = await Thread.find({ parentId: threadId });
  
    const descendantThreads = [];
    for (const childThread of childThreads) {
        const descendants = await fetchAllChildThreads(childThread._id);
        descendantThreads.push(childThread, ...descendants);
    }
  
    return descendantThreads;
};

export async function deleteThread(id: string, path: string) {
    connectToDB();

    try {
        const session = await mongoose.startSession();
        await session.withTransaction(async () => {
            const mainThread = await Thread.findById(id).populate('author community');
            if (!mainThread) throw new Error('Thread not found');

            const descendantThreads = await fetchAllChildThreads(id);
            const allThreadIds = [
                mainThread._id,
                ...descendantThreads.map(t => t._id),
            ];

            await Thread.deleteMany({ _id: { $in: allThreadIds } });

            const uniqueAuthorIds = new Set(
                [
                  ...descendantThreads.map((t) => t.author._id),
                  mainThread.author._id,
                ]
            );

            const uniqueCommunityIds = new Set(
                [
                  ...descendantThreads.map((t) => t.community?._id),
                  mainThread.community?._id,
                ]
            );

            await User.updateMany(
                { _id: { $in: Array.from(uniqueAuthorIds) } },
                { $pull: { threads: { $in: allThreadIds} } }
            );

            await Community.updateMany(
                { _id: { $in: Array.from(uniqueCommunityIds) } },
                { $pull: { threads: { $in: allThreadIds } } }
            );
        });

        revalidatePath(path);

    } catch (error) {
        if (error instanceof Error) {
            throw new Error(`Failed to delete post: ${error.message}`);
        }
    }
};

"use server";

import { revalidatePath } from "next/cache";
import Thread from "../models/thread.model";
import User from "../models/user.model";
import { connectToDB } from "../mongoose";

type createThreadProps = {
    text: string,
    author: string,
    communityId: string | null,
    path: string,
};

export async function createThread({
    text,
    author,
    communityId,
    path
}: createThreadProps) {
    connectToDB();

    try {
        const createdThread = await Thread.create({
            text,
            author,
            community: null,
        })

        await User.findByIdAndUpdate(author, {
            $push : { threads: createdThread._id }
        })

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
            throw new Error(`Failed to create thread: ${error.message}`);
        }
    }
};

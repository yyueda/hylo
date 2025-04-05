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

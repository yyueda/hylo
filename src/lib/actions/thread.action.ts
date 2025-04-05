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

    const createdThread = await Thread.create({
        text,
        author,
        community: null,
    })

    // Author is the id and not the _id
    await User.findByIdAndUpdate(author, {
        $push : { threads: createdThread._id }
    })

    revalidatePath(path);
};

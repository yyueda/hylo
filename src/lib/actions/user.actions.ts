"use server"

import { revalidatePath } from "next/cache";
import User from "../models/user.model";
import { connectToDB } from "../mongoose"

type updateUserProps = {
    userId: string,
    username: string,
    name: string,
    bio: string,
    image: string,
    path: string,
};

export async function updateUser({
    userId,
    username,
    name,
    bio,
    image,
    path
}: updateUserProps): Promise<void> {
    connectToDB();

    try {
        await User.findOneAndUpdate(
            { id: userId },
            { 
                username: username.toLowerCase(),
                name,
                bio,
                image,
                onBoarded: true
            },
            { new: true, upsert: true }
        )
    
        if (path === '/profile/edit') {
            revalidatePath(path);
        }
    } catch (error: unknown) {
        if (error instanceof Error) {
            throw new Error(`Failed to create/update user: ${error.message}`);
        }
    }
}

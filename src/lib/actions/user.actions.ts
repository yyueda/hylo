"use server";

import { revalidatePath } from "next/cache";
import User from "../models/user.model";
import { connectToDB } from "../mongoose"
import { FilterQuery, SortOrder } from "mongoose";
import Thread from "../models/thread.model";
import Community from "../models/community.model";

type updateUserProps = {
    userId: string,
    username: string,
    name: string,
    bio: string,
    image: string,
    path: string,
};

type fetchUsersProps = {
    userId: string,
    searchString?: string,
    pageNumber?: number,
    pageSize?: number,
    sortBy?: SortOrder
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

export async function fetchUser(userId: string) {
    connectToDB();

    try {
        return await User
            .findOne({ id: userId })
            .populate({
                path: 'communities',
                model: Community
            });
    } catch (error: unknown) {
        if (error instanceof Error) {
            throw new Error(`Failed to fetch user: ${error.message}`);
        }
    }
}

export async function fetchUsers({
    userId,
    searchString = '',
    pageNumber = 1,
    pageSize = 20,
    sortBy = 'desc'
}: fetchUsersProps) {
    connectToDB();

    try {
        const skipAmount = (pageNumber - 1) * pageSize;
        const regex = new RegExp(searchString, 'i');

        const query: FilterQuery<typeof User> = {
            id: { $ne: userId }
        };
        if (searchString.trim() !== '') {
            query.$or = [
                { username: { $regex: regex } },
                { name: { $regex: regex } },
            ];
        }
        const sortOptions = { createdAt: sortBy };
        const users = await User.find(query)
            .sort(sortOptions)
            .skip(skipAmount)
            .limit(pageSize);

        const totalUsersCount = await User.countDocuments(query);
        
        const isNext = totalUsersCount > skipAmount + users.length;    

        return { users, isNext };
    } catch (error: unknown) {
        if (error instanceof Error) {
            throw new Error(`Failed to fetch users: ${error.message}`);
        }
    }
}

export async function getActivity(userId: string) {
    connectToDB();

    try {
        const userThreads = await Thread.find({ author: userId });

        const childThreadIds = userThreads.reduce((acc, userThread) => {
            return acc.concat(userThread.children);
        }, []);

        const replies = await Thread.find({
            _id: { $in: childThreadIds },
            author: { $ne: userId }
        }).populate({
            path: 'author',
            model: User,
            select: '_id username image'
        });

        return replies;

    } catch (error: unknown) {
        if (error instanceof Error) {
            throw new Error(`Failed to get activity: ${error.message}`);
        }
    }
}

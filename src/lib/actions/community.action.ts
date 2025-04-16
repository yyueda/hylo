"use server";

import Community from "../models/community.model";
import Thread from "../models/thread.model";
import User from "../models/user.model";
import { connectToDB } from "../mongoose";
import { FilterQuery, SortOrder } from "mongoose";

type createCommunityProps = {
    id: string,
    username: string,
    name: string,
    image: string,
    bio: string,
    createdBy: string,
}

type fetchCommuntiesProps = {
    searchString?: string,
    pageNumber?: number,
    pageSize?: number,
    sortBy?: SortOrder
};

export async function createCommunity({
    id,
    username,
    name,
    image,
    bio,
    createdBy
}: createCommunityProps) {
    connectToDB();

    try {
        const user = await User.findOne({ id: createdBy });
        if (!user) throw new Error('User not found');

        const createdCommunity = await Community.create({
            id,
            username,
            name,
            image,
            bio,
            createdBy: user._id
        });

        user.communities.push(createdCommunity._id);
        await user.save();

        return createdCommunity;

    } catch (error: unknown) {
        if (error instanceof Error) {
            throw new Error(`Failed to create community: ${error.message}`);
        }
    }
};

export async function fetchCommunityDetails(id: string) {
    connectToDB();

    try {
        const communityDetails = await Community
            .findOne({ id })
            .populate({
                path: 'createdBy',
                model: User,
                select: '_id id name username image'
            })
            .populate({
                path: 'members',
                model: User,
                select: '_id id name username image'
            }
        );
        
        return communityDetails;

    } catch (error: unknown) {
        if (error instanceof Error) {
            throw new Error(`Failed to fetch community details: ${error.message}`);
        }
    }
};

export async function fetchCommunityPosts(id: string) {
    connectToDB();

    try {
        const communityPosts = await Community
            .findById(id)
            .populate({
                path: 'threads',
                model: Thread,
                populate: [
                    {
                        path: 'author',
                        model: User,
                        select: '_id id username image'
                    },
                    {
                        path: 'children',
                        model: Thread,
                        populate: {
                            path: 'author',
                            model: User,
                            select: '_id image'
                        }
                    }
                ]
            }
        );

        return communityPosts;
        
    } catch (error: unknown) {
        if (error instanceof Error) {
            throw new Error(`Failed to fetch community posts: ${error.message}`);
        }
    }
};

export async function fetchCommunities({
    searchString = '',
    pageNumber = 1,
    pageSize = 20,
    sortBy = 'desc'
}: fetchCommuntiesProps) {
    connectToDB();

    try {
        const skipAmount = (pageNumber - 1) * pageSize;
        const regex = new RegExp(searchString, 'i');
        const query: FilterQuery<typeof Community> = {};

        if (searchString.trim() !== '') {
            query.$or = [
                { username: { $regex: regex } },
                { name: { $regex: regex } },
            ];
        }

        const sortOptions = { createdAt: sortBy };
        const communities = await Community.find(query)
            .sort(sortOptions)
            .skip(skipAmount)
            .limit(pageSize)
            .populate({
                path: 'members',
                model: User
            });
        
        const totalCommuntiesCount = await Community.countDocuments(query);
        const isNext = totalCommuntiesCount > skipAmount + communities.length;

        return { communities, isNext };

    } catch (error: unknown) {
        if (error instanceof Error) {
            throw new Error(`Failed to fetch communities: ${error.message}`);
        }
    }
};

export async function addMemberToCommunity(
    communityId: string,
    memberId: string
) {
    connectToDB();

    try {
        const community = await Community.findOne({ id: communityId }, '_id members');
        if (!community) throw new Error('Community not found');

        const user = await User.findOne({ id: memberId }, '_id');
        if (!user) throw new Error('User not found');

        if (community.members.includes(user._id)) {
            throw new Error('User already a member of the community');
        }

        community.members.push(user._id);
        await community.save()

        user.communities.push(community._id);
        await user.save();

        return community;

    } catch (error: unknown) {
        if (error instanceof Error) {
            throw new Error(`Failed to add member: ${error.message}`);
        }
    }
};

export async function removeMemberFromCommunity(
    communityId: string,
    memberId: string
) {
    connectToDB();

    try {
        const community = await Community.findOne({ id: communityId }, '_id');
        if (!community) throw new Error('Community not found');

        const user = await User.findOne({ id: memberId }, '_id');
        if (!user) throw new Error('User not found');

        await Community.updateOne(
            { _id: community._id },
            { $pull: { members: user._id } }
        );

        await User.updateOne(
            { _id: user._id },
            { $pull: { communities: community._id } }
        );

        return { success: true };

    } catch (error: unknown) {
        if (error instanceof Error) {
            throw new Error(`Failed to remove member: ${error.message}`);
        }
    }
};

export async function updateCommunityInfo(
    communityId: string,
    name: string,
    username: string,
    image: string
) {
    connectToDB();

    try {
        const updatedCommunity = await Community.findOneAndUpdate(
            { id: communityId },
            { name, username, image }
        );
        if (!updatedCommunity) throw new Error('Community not found');
        
        return updatedCommunity;

    } catch (error: unknown) {
        if (error instanceof Error) {
            throw new Error(`Failed to add member: ${error.message}`);
        }
    }
};

export async function deleteCommunity(communityId: string) {
    connectToDB();

    try {
        const deletedCommunity = Community.findOneAndDelete(
            { id: communityId }
        );
        if (!deletedCommunity) throw new Error('Community not found');

        await Thread.deleteMany({ community: communityId });

        User.updateMany(
            { communities: communityId },
            { $pull: { communities: communityId } }
        );

        return deletedCommunity;

    } catch (error: unknown) {
        if (error instanceof Error) {
            throw new Error(`Failed to delete community: ${error.message}`);
        }
    }
}

"use client";

import Image from "next/image";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";

type userCardProps = {
    id: string,
    name: string,
    username: string,
    image: string,
    personType: string,
};

function UserCard({
    id,
    name,
    username,
    image,
    personType
}: userCardProps) {
    const router = useRouter();
    const isCommunity = personType === 'Community';

    return (
        <section className="user-card">
            <div className="user-card_avatar">
                <Image 
                    src={image}
                    alt="Profile picture"
                    width={48}
                    height={48}
                    className="rounded-full"
                />

                <div className="flex-1 text-ellipsis">
                    <h4 className="font-semibold text-light-1">{name}</h4>
                    <p className="text-sm font-medium text-gray-1">@{username}</p>
                </div>
            </div>

            <Button 
                className="user-card_btn cursor-pointer" 
                onClick={() => {
                    if (isCommunity) { 
                        router.push(`/communities/${id}`)
                    } else {
                        router.push(`/profile/${id}`)
                    }
                }}
            >
                View
            </Button>
        </section>
    );
}

export default UserCard;

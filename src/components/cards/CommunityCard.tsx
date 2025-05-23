import Image from "next/image";
import { Button } from "../ui/button";
import Link from "next/link";

type communityCardProps = {
    id: string,
    name: string,
    username: string,
    image: string,
    bio: string,
    members: {
        image: string
    }[]
};

function CommunityCard({
    id,
    name,
    username,
    image,
    bio,
    members
}: communityCardProps) {

    return (
        <section className="community-card">
            <div className="flex items-center gap-3 w-full">
                <Link href={`communities/${id}`} className="relative h-12 w-12">
                    <Image 
                        src={image}
                        alt="Community logo"
                        fill
                        className="rounded-full object-cover"
                    />
                </Link>

                <div>
                    <Link href={`communities/${id}`}>
                        <h4 className="font-semibold text-light-1">{name}</h4>
                    </Link>
                    <p className="text-sm font-medium text-gray-1">@{username}</p>
                </div>
            </div>

            <p className="mt-4 text-xs font-medium text-gray-1">{bio}</p>

            <div className="mt-5 flex items-center justify-between gap-3">
                <Link href={`communities/${id}`}>
                    <Button size='sm' className="community-card_btn cursor-pointer">
                        View
                    </Button>
                </Link>

                {members.length > 0 && (
                    <div className="flex items-center">
                        {members.map((member, index) => (
                            <Image 
                                key={index}
                                src={member.image}
                                alt={`user_${index}`}
                                width={28}
                                height={28}
                                className={`${index !== 0 && 'ml-2'} rounded-full object-cover`}
                            />
                        ))}
                        {members.length > 3 && (
                            <p className="ml-1 text-xs font-medium text-gray-1">{members.length}+ Users</p>
                        )}
                    </div>
                )}
            </div>
        </section>
    );
}

export default CommunityCard;

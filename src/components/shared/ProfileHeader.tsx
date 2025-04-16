import Image from "next/image";

type profileProps = {
    accountId: string,
    authUserId: string,
    name: string,
    username: string,
    image: string,
    bio: string,
    type?: 'User' | 'Community'
}

function ProfileHeader({
    accountId,
    authUserId,
    name,
    username,
    image,
    bio,
    type
}: profileProps) {
    return (
        <div className="flex w-full flex-col justify-start">
            <div>
                <div className="flex items-center gap-3">
                    <div className="relative h-20 w-20">
                        <Image 
                            src={image}
                            alt="Profile picture"
                            fill
                            className="rounded-full object-cover shadow-2xl"
                        />
                    </div>

                    <div className="flex-1">
                        <h2 className="text-left text-heading3-bold text-light-1">{name}</h2>
                        <p className="text-gray-1 font-medium">@{username}</p>
                    </div>
                </div>

                {/* Community */}

            </div>

            <p className="mt-6 max-w-lg text-base-regular text-light-2">{bio}</p>
            <div className="mt-12 h-0.5 w-full bg-dark-3" />
        </div>
    );
}

export default ProfileHeader;

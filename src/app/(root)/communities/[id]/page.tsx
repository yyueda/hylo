import ProfileHeader from "@/components/shared/ProfileHeader";
import { currentUser } from "@clerk/nextjs/server";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Image from "next/image";
import ThreadsTab from "@/components/shared/ThreadsTab";
import { fetchCommunityDetails } from "@/lib/actions/community.action";
import { communityTabs } from "@/constants";
import UserCard from "@/components/cards/UserCard";

type CommunityDetails = {
    _id: string,
    id: string,
    username: string,
    name: string,
    image: string,
    bio: string,
    createdBy: string,
    members: {
        id: string,
        username: string,
        name: string,
        image: string
    }[]
};

async function Page({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    const user = await currentUser();
    if (!user) return null;

    const communityDetails = await fetchCommunityDetails(id);

    return (
        <section className="">
            <ProfileHeader 
                accountId={id}
                authUserId={user.id}
                name={communityDetails.name}
                username={communityDetails.username}
                image={communityDetails.image}
                bio={communityDetails.bio}
            />

            <div className="mt-9">
            <Tabs defaultValue="threads">
                <TabsList className="w-full tab">
                    {communityTabs.map((tab) => (
                        <TabsTrigger key={tab.label} value={tab.value} className="tab">
                            <Image 
                                src={tab.icon}
                                alt={tab.label}
                                width={24}
                                height={24}
                                className="object-contain"
                            />
                            <p className="max-sm:hidden">{tab.label}</p>

                            {tab.label === 'Threads' && (
                                <p className="ml-1 rounded-sm bg-light-4 px-2 py-1 text-xs font-medium">
                                    {communityDetails.threads.length}
                                </p>
                            )}
                        </TabsTrigger>
                    ))}
                </TabsList>

                    <TabsContent value='threads' className="w-full text-light-1">
                        <ThreadsTab 
                            currentUserId={user.id}
                            accountId={communityDetails._id}
                            accountType="Community"
                        />
                    </TabsContent>
                    <TabsContent value='members' className="w-full text-light-1">
                        <section>
                            {communityDetails.members.map((member: CommunityDetails) => (
                                <UserCard 
                                    key={member.id}
                                    id={member.id}
                                    name={member.name}
                                    username={member.username}
                                    image={member.image}
                                    personType='User'
                                />
                            ))}
                        </section>
                    </TabsContent>
                    <TabsContent value='requests' className="w-full text-light-1">
                        <ThreadsTab 
                                currentUserId={user.id}
                                accountId={communityDetails._id}
                                accountType="Community"
                            />
                    </TabsContent>
            </Tabs>

            </div>
        </section>
    );
}

export default Page;

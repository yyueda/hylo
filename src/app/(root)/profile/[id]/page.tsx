import ProfileHeader from "@/components/shared/ProfileHeader";
import { fetchUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { profileTabs } from "@/constants";
import Image from "next/image";
import ThreadsTab from "@/components/shared/ThreadsTab";


async function Page({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    const user = await currentUser();
    if (!user) return null;

    const userInfo = await fetchUser(id);
    const currUserInfo = await fetchUser(user.id);
    if (!currUserInfo.onBoarded) redirect('/onboarding');

    return (
        <section className="">
            <ProfileHeader 
                accountId={id}
                authUserId={user.id}
                name={userInfo.name}
                username={userInfo.username}
                image={userInfo.image}
                bio={userInfo.bio}
            />

            <div className="mt-9">
            <Tabs defaultValue="threads">
                <TabsList className="w-full tab">
                    {profileTabs.map((tab) => (
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
                                    {userInfo.threads.length}
                                </p>
                            )}
                        </TabsTrigger>
                    ))}
                </TabsList>

                {profileTabs.map((tab) => (
                    <TabsContent key={`content-${tab.label}`} value={tab.value}>
                        <ThreadsTab 
                            currentUserId={user.id}
                            accountId={id}
                            accountType="User"
                        />
                    </TabsContent>
                ))}
            </Tabs>

            </div>
        </section>
    );
}

export default Page;

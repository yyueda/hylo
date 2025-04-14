import CommunityCard from "@/components/cards/CommunityCard";
import { fetchCommunities } from "@/lib/actions/community.action";
import { fetchUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

async function Page() {
    const user = await currentUser();
    if (!user) return null;

    const userInfo = await fetchUser(user.id);
    if (!userInfo?.onBoarded) redirect('/onboarding');

    const results = await fetchCommunities({
        searchString: '',
        pageNumber: 1,
        pageSize: 25,
        sortBy: 'desc'
    });
    if (!results) redirect('/');

    return (
        <section>
            <h1 className="head-text mb-10">Search</h1>

            <div>
                {results.communities.length === 0 ? (
                    <p>No users</p>
                ) : (
                    <>
                        {results.communities.map((community) => (
                            <CommunityCard
                                key={community.id}
                                id={community.id}
                                name={community.name}
                                username={community.username}
                                image={community.image}
                                bio={community.bio}
                                members={community.members}
                            />
                        ))}
                    </>
                )}
            </div>
        </section>
    );
}

export default Page;

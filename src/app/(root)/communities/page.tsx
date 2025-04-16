import CommunityCard from "@/components/cards/CommunityCard";
import Pagination from "@/components/shared/Pagination";
import Searchbar from "@/components/shared/Searchbar";
import { fetchCommunities } from "@/lib/actions/community.action";
import { fetchUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

async function Page({
    searchParams
}: { searchParams: Promise<{ [key: string]: string | undefined }> }) {
    const user = await currentUser();
    if (!user) return null;

    const userInfo = await fetchUser(user.id);
    if (!userInfo?.onBoarded) redirect('/onboarding');

    const resolvedParams = await searchParams;
    const results = await fetchCommunities({
        searchString: resolvedParams.q,
        pageNumber: resolvedParams.page ? +resolvedParams.page : 1,
        pageSize: 25,
        sortBy: 'desc'
    });
    if (!results) redirect('/');

    return (
        <section>
            <h1 className="head-text">Communities</h1>

            <div className="mt-5">
                <Searchbar
                    routeType="communities"
                />
            </div>

            <section className="mt-9 flex flex-wrap gap-4">
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
            </section>

            <Pagination 
                path="communities"
                pageNumber={resolvedParams.page ? + resolvedParams.page : 1}
                isNext={results.isNext}
            />
        </section>
    );
}

export default Page;

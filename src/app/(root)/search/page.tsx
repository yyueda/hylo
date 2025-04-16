import UserCard from "@/components/cards/UserCard";
import Pagination from "@/components/shared/Pagination";
import Searchbar from "@/components/shared/Searchbar";
import { fetchUser, fetchUsers } from "@/lib/actions/user.actions";
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
    const results = await fetchUsers({
        userId: user.id,
        searchString: resolvedParams.q,
        pageNumber: resolvedParams.page ? +resolvedParams.page : 1,
        pageSize: 25,
        sortBy: 'desc'
    });
    if (!results) redirect('/');

    return (
        <section>
            <h1 className="head-text mb-10">Search</h1>

            <Searchbar 
                routeType="search"
            />

            <div className="mt-14 flex flex-col gap-9">
                {results.users.length === 0 ? (
                    <p>No users</p>
                ) : (
                    <>
                        {results.users.map((user) => (
                            <UserCard 
                                key={user.id}
                                id={user.id}
                                name={user.name}
                                username={user.username}
                                image={user.image}
                                personType="User"
                            />
                        ))}
                    </>
                )}
            </div>

            <Pagination 
                path="search"
                pageNumber={resolvedParams.page ? + resolvedParams.page : 1}
                isNext={results.isNext}
            />
        </section>
    );
}

export default Page;

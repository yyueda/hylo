import UserCard from "@/components/cards/UserCard";
import { fetchUserPosts } from "@/lib/actions/thread.action";
import { fetchUser, fetchUsers } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

async function Page() {
    const user = await currentUser();
    if (!user) return null;

    const userInfo = await fetchUser(user.id);
    if (!userInfo?.onBoarded) redirect('/onboarding');

    const results = await fetchUsers({
        userId: user.id
    });
    if (!results) redirect('/');

    return (
        <section>
            <h1 className="head-text mb-10">Search</h1>

            <div>
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
        </section>
    );
}

export default Page;

import { fetchCommunities } from "@/lib/actions/community.action";
import { fetchUsers } from "@/lib/actions/user.actions";
import UserCard from "../cards/UserCard";

async function RightSidebar({ userId }: { userId: string }) {
    const suggestedUsers = await fetchUsers({
        userId: userId,
        pageSize: 4,
    });
    const users = suggestedUsers?.users ?? [];
    
    const suggestedCommunities = await fetchCommunities({ pageSize: 4 });
    const communities = suggestedCommunities?.communities ?? [];

    return (
        <section className="custom-scrollbar rightsidebar">
            <div className="flex flex-1 flex-col justify-start">
                <h3 className="text-heading4-medium text-light-1">Suggested Communities</h3>

                <div className="mt-7 flex w-[350px] flex-col gap-9">
                    {communities.length > 0 ? (
                        <>
                            {communities.map((community) => (
                                <UserCard
                                    key={community.id}
                                    id={community.id}
                                    name={community.name}
                                    username={community.username}
                                    image={community.image}
                                    personType="Community"
                                />
                            ))}
                        </>
                    ) : (
                        <p className="text-light-3">No communities yet</p>
                    )}
                </div>
            </div>
            <div className="flex flex-1 flex-col justify-start">
                <h3 className="text-heading4-medium text-light-1">Suggested Users</h3>

                <div className="mt-7 flex w-[350px] flex-col gap-10">
                    {users.length > 0 ? (
                        <>
                            {users.map((user) => (
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
                    ) : (
                        <p className="text-light-3">No users yet</p>
                    )}
                </div>
            </div>
        </section>
    );
}

export default RightSidebar;

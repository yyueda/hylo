import ThreadCard from "@/components/cards/ThreadCard";
import Comment from "@/components/forms/Comment";
import { fetchThreadById } from "@/lib/actions/thread.action";
import { fetchUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

async function Page({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    const user = await currentUser();
    if (!user) return null;

    const userInfo = await fetchUser(user.id);
    if (!userInfo.onBoarded) redirect('/onboarding');

    const thread = await fetchThreadById(id);

    return (
        <section className="relative">
            <div>
                <ThreadCard
                    key={id}
                    id={id}
                    currentUserId={user.id}
                    parentId={thread.parentId}
                    content={thread.text}
                    author={thread.author}
                    community={thread.community}
                    createdAt={thread.createdAt}
                    comments={thread.children}
                />
            </div>
            
            <div className="mt-7">
                <Comment 
                    threadId={id}
                    currentUserImg={user.imageUrl}
                    currentUserId={userInfo._id.toString()}
                />
            </div>
        </section>
    );
}

export default Page;

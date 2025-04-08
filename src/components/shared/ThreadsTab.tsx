import { fetchUserPosts } from "@/lib/actions/thread.action";
import ThreadCard from "../cards/ThreadCard";

type threadsTabProps = {
    currentUserId: string,
    accountId: string,
    accountType: string
}

async function ThreadsTab({
    currentUserId,
    accountId,
    accountType
}: threadsTabProps) {
    const result = await fetchUserPosts(accountId);

    return (
        <section className="mt-9 flex flex-col gap-10">
            {result.threads.map((thread: any) => (
                <ThreadCard 
                    key={thread._id}
                    id={thread._id}
                    currentUserId={currentUserId}
                    parentId={thread.parentId}
                    content={thread.text}
                    author={result}
                    community={thread.community}
                    createdAt={thread.createdAt}
                    comments={thread.children}
                />
            ))}
        </section>
    );
}

export default ThreadsTab;

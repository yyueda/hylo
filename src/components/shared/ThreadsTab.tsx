import { fetchUserPosts } from "@/lib/actions/thread.action";
import ThreadCard from "../cards/ThreadCard";
import { fetchCommunityPosts } from "@/lib/actions/community.action";

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
    let results;

    if (accountType === 'Community') {
        results = await fetchCommunityPosts(accountId);
    } else {
        results = await fetchUserPosts(accountId);
    }

    if (!results) return;

    return (
        <section className="mt-9 flex flex-col gap-10">
            {results.threads.map((thread: any) => (
                <ThreadCard 
                    key={thread._id}
                    id={thread._id}
                    currentUserId={currentUserId}
                    parentId={thread.parentId}
                    content={thread.text}
                    author={
                        accountType == 'User' 
                            ? results 
                            : thread.author
                    }
                    community={
                        accountType == 'User'
                            ? thread.community
                            : results
                    }
                    createdAt={thread.createdAt}
                    comments={thread.children}
                />
            ))}
        </section>
    );
}

export default ThreadsTab;

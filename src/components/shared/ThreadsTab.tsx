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
    return (
        <section>
            Threads Tab
        </section>
    );
}

export default ThreadsTab;

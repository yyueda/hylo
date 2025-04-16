'use client';

import { deleteThread } from "@/lib/actions/thread.action";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";

type deleteThreadProps = {
    threadId: string,
    currentUserId: string,
    authorId: string,
    parentId: string | null,
    isComment?: boolean
};

function DeleteThread({ 
    threadId,
    currentUserId,
    authorId,
    parentId,
    isComment,
}: deleteThreadProps) {
    const router = useRouter();
    const pathName = usePathname();

    if (currentUserId !== authorId || pathName === '/') return null;

    return (
        <Image 
            src='/assets/delete.svg'
            alt="delete"
            width={18}
            height={18}
            className="cursor-pointer object-contain"
            onClick={async () => {
                await deleteThread(threadId, pathName);
                if (!parentId || !isComment) {
                    router.push('/');
                }
            }}
        />
    );
}

export default DeleteThread;

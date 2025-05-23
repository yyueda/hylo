import { formatDateString } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import DeleteThread from "../forms/DeleteThread";

export type ThreadCardProps = {
    id: string,
    currentUserId: string,
    parentId: string | null,
    content: string,
    author: {
        id: string,
        username: string,
        image: string
    },
    community: {
        id: string,
        name: string,
        image: string
    } | null,
    createdAt: string,
    comments: {
        author: {
            image: string
        }
    }[],
    isComment?: boolean
};

function ThreadCard({
    id,
    currentUserId,
    parentId,
    content,
    author,
    community,
    createdAt,
    comments,
    isComment
}: ThreadCardProps) {
    return (
        <section className={`w-full flex flex-col rounded-xl ${isComment ? 'px-0 xs:px-7' : 'bg-dark-2 p-7'}`}>
            <div className="flex items-start justify-between">
                <div className="flex w-full flex-1 gap-4">
                    <div className="flex flex-col items-center">
                        <Link href={`/profile/${author.id}`} className="relative h-11 w-11">
                            <Image 
                                src={author.image}
                                alt="Profile picture"
                                fill
                                className="cursor-pointer rounded-full object-cover"
                            />
                        </Link>

                        <div className="thread-card_bar" />
                    </div>

                    <div className="flex w-full flex-col">
                        <Link href={`/profile/${author.id}`} className="w-fit">
                            <h4 className="cursor-pointer font-semibold text-light-1">{author.username}</h4>
                        </Link>

                        <pre className="mt-2 text-sm text-light-2 font-sans">{content}</pre>

                        <div className={`${isComment && 'mb-10'} mt-5 flex flex-col gap-3`}>
                            <div className="flex gap-3.5">
                                <Image 
                                    src="/assets/heart-gray.svg"
                                    alt="heart"
                                    width={24}
                                    height={24}
                                    className="cursor-pointer object-contain"
                                />
                                <Link href={`/thread/${id}`}>
                                    <Image
                                        src="/assets/reply.svg"
                                        alt="reply"
                                        width={24}
                                        height={24}
                                        className="cursor-pointer object-contain"
                                    />
                                </Link>
                                <Image 
                                    src="/assets/repost.svg"
                                    alt="repost"
                                    width={24}
                                    height={24}
                                    className="cursor-pointer object-contain"
                                />
                                <Image 
                                    src="/assets/share.svg"
                                    alt="share"
                                    width={24}
                                    height={24}
                                    className="cursor-pointer object-contain"
                                />
                            </div>

                            {isComment && comments.length > 0 && (
                                <Link href={`/thread/${id}`}>
                                    <p className="mt-1 text-subtle-medium text-gray-1">
                                        {comments.length} repl{comments.length > 1 ? 'ies' : 'y'}
                                    </p>
                                </Link>
                            )}
                        </div>
                    </div>
                </div>

                <DeleteThread 
                    threadId={id.toString()}
                    currentUserId={currentUserId}
                    authorId={author.id}
                    parentId={parentId}
                    isComment={isComment}
                />
            </div>

            {!isComment && comments.length > 0 && (
                <div className="ml-1 mt-3 flex items-center gap-2">
                    {comments.slice(0, 2).map((c, i) => (
                        <Image 
                            key={i}
                            src={c.author.image}
                            alt={`user_${i} profile picture`}
                            width={100}
                            height={100}
                            className={`${i !== 0 && '-ml-5'} rounded-full object-cover w-6 h-6`}
                        />
                    ))}

                    <Link href={`/thread/${id}`}>
                        <p className="mt-1 text-xs font-medium text-gray-1">
                            {comments.length} repl{comments.length > 1 ? 'ies' : 'y'}
                        </p>
                    </Link>
                </div>
            )}

            {!isComment && community && (
                    <Link href={`/communities/${community.id}`} className="mt-5 flex items-center">
                        <p className="text-subtle-medium text-gray-1">
                            {formatDateString(createdAt)}
                            {' -'} {community.name} Community
                        </p>

                        <Image 
                            src={community.image}
                            alt={community.name}
                            width={28}
                            height={28}
                            className="ml-1 rounded-full object-cover w-3.5 h-3.5"
                        />
                    </Link>
                )}
        </section>
    );
}

export default ThreadCard;

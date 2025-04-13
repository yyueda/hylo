import { fetchUser, getActivity } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs/server";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

async function Page() {
    const user = await currentUser();
    if (!user) return null;

    const userInfo = await fetchUser(user.id);
    if (!userInfo?.onBoarded) redirect('/onboarding');

    const activity = await getActivity(userInfo._id);
    if (!activity) redirect('/');

    return (
        <section>
            <h1 className="head-text mb-10">Activity</h1>

            <section>
                {activity.length > 0 ? (
                    <>
                        {activity.map((activity) => (
                            <Link 
                                key={activity._id}
                                href={`/thread/${activity.parentId}`}
                            >
                                <div className="activity-card">
                                    <Image 
                                        src={activity.author.image}
                                        alt="Profile picture"
                                        height={20}
                                        width={20}
                                        className="rounded-full object-cover"
                                    />
                                    <p className="text-sm text-light-1">
                                        <span className="mr-1 text-primary-500">{activity.author.name}</span>{' '}
                                        replied to your thread
                                    </p>
                                </div>
                            </Link>
                        ))}
                    </>
                ) : (
                    <p className="text-light-3">No activity yet</p>
                )}
            </section>
        </section>
    );
}

export default Page;

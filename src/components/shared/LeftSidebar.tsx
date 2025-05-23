'use client'

import Link from "next/link";
import { sidebarLinks } from "../../constants";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { SignOutButton } from "@clerk/nextjs";
import { SignedIn } from "@clerk/clerk-react";

function LeftSidebar({ userId }: { userId: string }) {
    const pathname = usePathname();

    return (
        <section className="custom-scrollbar leftsidebar">
            <div className="flex w-full flex-1 flex-col gap-6 px-6">
                {sidebarLinks.map((link) => {
                    const isActive = (pathname.includes(link.route) && link.route.length > 1) ||
                                        pathname == link.route;

                    const href = link.route === '/profile' ? `/profile/${userId}` : link.route;
                    return (
                        <Link
                            href={href}
                            key={link.label}
                            className={`leftsidebar_link ${isActive && 'bg-primary-500'}`}
                        >
                            <Image
                                src={link.imgURL}
                                alt={link.label}
                                width={24}
                                height={24}
                            />

                            <p className="text-light-1 max-lg:hidden">{link.label}</p>
                        </Link>
                    )}
                )}
            </div>
            <div className="mt-10 px-6">
                <SignedIn>
                    <SignOutButton redirectUrl="/sign-in">
                        <div className="flex cursor-pointer gap-4 p-4">
                            <Image 
                                src={'/assets/logout.svg'}
                                alt="logout"
                                width={24}
                                height={24}
                            />
                            <p className="text-light-2 max-lg:hidden">Logout</p>
                        </div>
                    </SignOutButton>
                </SignedIn>
            </div>
        </section>
    );
}

export default LeftSidebar;

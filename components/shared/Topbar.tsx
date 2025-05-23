import Image from "next/image";
import Link from "next/link";
import { OrganizationSwitcher, SignInButton, SignUpButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs';

function Topbar() {
    return (
        <nav className="topbar">
            <Link 
                href="/"
                className="flex items-center gap-4"  
            >
                <Image src="./assets/logo.svg" alt="logo" width={28} height={28} />
                <p className="text-heading3-bold text-light-1 max-xs:hidden">Threads</p>
            </Link>

            <div className="flex items-center gap-1">
                <div className="md:hidden flex items-center">
                    <SignedOut><SignInButton /><SignUpButton /></SignedOut>
                    <SignedIn><UserButton /></SignedIn>
                </div>
                
                <OrganizationSwitcher 
                    appearance={{
                        elements: {
                            organizationSwitcherTrigger: '!py-2 !px-4'
                        }
                    }}
                />
            </div>
        </nav>
    );
}

export default Topbar;

import { addMemberToCommunity, createCommunity, deleteCommunity, removeMemberFromCommunity, updateCommunityInfo } from "@/lib/actions/community.action";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { Webhook, WebhookRequiredHeaders } from "svix";

type EventType =
  | "organization.created"
  | "organizationInvitation.created"
  | "organizationMembership.created"
  | "organizationMembership.deleted"
  | "organization.updated"
  | "organization.deleted";

type Event = {
    data: Record<string, string | number | Record<string, string>[]>;
    object: "event";
    type: EventType;
  };

export async function POST(req: Request) {
    const payload = await req.json();
    const header = await headers();

    const heads = {
    "svix-id": header.get("svix-id"),
    "svix-timestamp": header.get("svix-timestamp"),
    "svix-signature": header.get("svix-signature"),
    };

    const wh = new Webhook(process.env.NEXT_CLERK_WEBHOOK_SECRET || "");
    let evt: Event;
    
    try {
        evt = wh.verify(JSON.stringify(payload),
            heads as WebhookRequiredHeaders
        ) as Event;

    } catch (error) {
        console.error('Error verifying webhook:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }

    const eventType = evt.type;

    if (eventType == 'organization.created') {
        const { id, name, slug, image_url, created_by } = evt.data;

        try {
            await createCommunity({
                id: id as string,
                username: slug as string,
                name: name as string,
                image: image_url as string,
                bio: 'org bio',
                createdBy: created_by as string
            });
            return NextResponse.json({ message: 'Community created' }, { status: 201 })

        } catch (error) {
            console.error(error);
            return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
        }
    }

    if (eventType == 'organizationInvitation.created') {
        try {
            return NextResponse.json({ message: 'Invitation created' }, { status: 201 })

        } catch (error) {
            console.error(error);
            return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
        }
    }

    if (eventType == 'organizationMembership.created') {
        try {
            const { organization, public_user_data } = evt.data

            // @ts-expect-error: evt.data is from clerk
            await addMemberToCommunity(organization.id, public_user_data.user_id)

            return NextResponse.json({ message: 'Invitation accepted' }, { status: 201 })

        } catch (error) {
            console.error(error);
            return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
        }
    }

    if (eventType == 'organizationMembership.deleted') {
        try {
            const { organization, public_user_data } = evt.data

            // @ts-expect-error: evt.data is from clerk
            await removeMemberFromCommunity(organization.id, public_user_data.user_id)

            return NextResponse.json({ message: 'Member removed' }, { status: 200 })

        } catch (error) {
            console.error(error);
            return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
        }
    }

    if (eventType === 'organization.updated') {
        try {
            const { id, name, slug, image_url } = evt.data

            // @ts-expect-error: evt.data is from clerk
            await updateCommunityInfo(id, name, slug, image_url);

            return NextResponse.json({ message: 'Community updated' }, { status: 200 })

        } catch (error) {
            console.error(error);
            return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
        }
    }

    if (eventType === 'organization.deleted') {
        try {
            const { id } = evt.data

            // @ts-expect-error: evt.data is from clerk
            await deleteCommunity(id);

            return NextResponse.json({ message: 'Community deleted' }, { status: 200 })

        } catch (error) {
            console.error(error);
            return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
        }
    }
}

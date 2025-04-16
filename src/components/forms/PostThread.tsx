'use client'

import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { ThreadValidation } from "@/lib/validations/thread";
import { zodResolver } from "@hookform/resolvers/zod";
import { Textarea } from "../ui/textarea";
import { createThread } from "@/lib/actions/thread.action";
import { usePathname, useRouter } from "next/navigation";
import { useOrganization } from "@clerk/nextjs";

function PostThread({ userId }: { userId: string }) {
    const router = useRouter();
    const pathName = usePathname();
    const { organization } = useOrganization();

    const form = useForm<z.infer<typeof ThreadValidation>>({
        resolver: zodResolver(ThreadValidation),
        defaultValues: {
            thread: '',
            accountId: userId
        }
    });

    const onSubmit = async (values: z.infer<typeof ThreadValidation>) => {
        await createThread({
            text: values.thread,
            author: values.accountId,
            communityId: organization ? organization.id : null,
            path: pathName
        });

        router.push('/');
    }

    return (
        <Form {...form}>
            <form 
                onSubmit={form.handleSubmit(onSubmit)} 
                className='mt-10 flex flex-col justify-start gap-10'
            >
                <FormField
                    control={form.control}
                    name='thread'
                    render={({ field }) => (
                        <FormItem className='flex flex-col gap-3 w-full'>
                            <FormLabel className='text-base-semibold text-light-2'>
                                Content
                            </FormLabel>
                            <FormControl>
                                <Textarea
                                    className='bg-dark-3 border-dark-4 no-focus text-light-1 min-h-30'
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type='submit' className='bg-primary-500 cursor-pointer'>Submit</Button>
            </form>
        </Form>
    );
}

export default PostThread;

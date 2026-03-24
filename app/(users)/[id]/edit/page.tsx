"use client";

import { useParams, useRouter } from "next/navigation";
import { useGet } from "@/hooks/use-get";
import { useUpdate } from "@/hooks/use-update";
import { API } from "@/constants/endpoints";
import UserForm from "@/components/forms/user-form";
import { IconLoader } from "@tabler/icons-react";

export default function Page() {
    const { id } = useParams<{ id: any }>();
    const router = useRouter();

    const { data, isLoading } = useGet(
        API.users.detail(id).key,
        API.users.detail(id).endpoint,
        undefined,
        { enabled: !!id }
    );

    const update = useUpdate(API.users.list.key);

    if (isLoading) {
        return (
            <div className="flex h-64 items-center justify-center">
                <IconLoader className="h-10 w-10 animate-spin text-gray-500" />
            </div>
        );
    }

    return (
        <main className="p-6 space-y-4">
            <UserForm
                initialData={data?.data ?? data}
                loading={update.isPending}
                onSubmit={async (form) => {
                    await update.mutateAsync({
                        endpoint: API.users.detail(id).endpoint,
                        data: form,
                    });
                    router.push("/");
                }}
            />
        </main>
    );
}
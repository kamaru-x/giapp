"use client";

import { useRouter } from "next/navigation";
import { useCreate } from "@/hooks/use-create";
import { API } from "@/constants/endpoints";
import UserForm from "@/components/forms/user-form";

export default function Page() {
    const router = useRouter();
    const create = useCreate(API.users.list.endpoint, API.users.list.key);

    return (
        <main className="p-6 space-y-4">
            <UserForm
                loading={create.isPending}
                onSubmit={async (data) => {
                    await create.mutateAsync(data);
                    router.push("/");
                }}
            />
        </main>
    );
}
"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Eye, Pencil } from "lucide-react";
import { useDelete } from "@/hooks/use-delete";
import { API} from "@/constants/endpoints";
import Link from "next/link";
import { DeleteDialog } from "@/components/modals/deleteModal";

export type User = {
    id: number;
    name: string;
    email: string;
    age: number;
};

export const columns: ColumnDef<User>[] = [
    {
        id: "slNo",
        header: "Sl No",
        cell: ({ row }) => row.index + 1,
    },
    {
        accessorKey: "name",
        header: "Name",
    },
    {
        accessorKey: "email",
        header: "Email",
    },
    {
        accessorKey: "age",
        header: "Age",
    },
    {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
            const user = row.original;

            const { mutate: deleteUser, isPending } = useDelete(["users"]);

            return (
                <div className="flex gap-2 justify-center">
                    {/* <Button size="icon" variant="outline" asChild className="h-8 w-8">
                        <Link href={`/users/${user.id}/details`}>
                            <Eye className="h-4 w-4" />
                        </Link>
                    </Button> */}

                    <Button size="icon" variant="outline" asChild className="h-8 w-8">
                        <Link href={`/${user.id}/edit`}>
                            <Pencil className="h-4 w-4" />
                        </Link>
                    </Button>

                    <DeleteDialog
                        title="Delete User?"
                        description={`This will permanently delete "${user.name}".`}
                        isLoading={isPending}
                        onConfirm={() =>
                            deleteUser({ endpoint: API.users.detail(user.id).endpoint })
                        }
                    />
                </div>
            );
        },
    },
];
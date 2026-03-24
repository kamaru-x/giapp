"use client";

import React, { useState } from "react";
import { columns } from "./columns";
import { IconLoader, IconPlus, IconUpload } from "@tabler/icons-react";
import { DataTable } from "@/components/data-table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useGet } from "@/hooks/use-get";
import { API } from "@/constants/endpoints";

const Page = () => {
    const router = useRouter();
    const [search, setSearch] = useState("");

    const { data, isLoading } = useGet(API.users.list.key, API.users.list.endpoint, {
        search,
    });

    const users = data ?? [];

    return (
        <div>
            <div className="flex flex-col gap-4 p-4 lg:p-6 sm:flex-row sm:items-center sm:justify-between">
                {/* TITLE */}
                <h2 className="text-lg font-semibold">Users</h2>

                {/* FILTERS */}
                <div className="flex w-full flex-col gap-3 rounded-lg border p-3 sm:w-auto sm:flex-row sm:items-center sm:border-0 sm:p-0">
                    <Input
                        placeholder="Search Users..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full sm:w-64"
                    />

                    <Button
                        variant="outline"
                        onClick={() => router.push("/upload")}
                        className="w-full sm:w-auto"
                    >
                        <IconUpload className="mr-2 h-4 w-4" />
                        Upload CSV
                    </Button>

                    <Button
                        onClick={() => router.push("/create")}
                        className="w-full sm:w-auto"
                    >
                        <IconPlus className="mr-2 h-4 w-4" />
                        Add User
                    </Button>
                </div>
            </div>

            {isLoading ? (
                <div className="flex h-64 items-center justify-center">
                    <IconLoader className="h-10 w-10 animate-spin text-gray-500" />
                </div>
            ) : (
                <div className="px-4 lg:px-6">
                    <DataTable columns={columns} data={users} />
                </div>
            )}
        </div>
    );
};

export default Page;
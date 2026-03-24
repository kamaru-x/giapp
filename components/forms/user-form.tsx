"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type FormState = {
    name:  string;
    email: string;
    age:   string;
};

type Props = {
    initialData?: any;
    loading?:     boolean;
    onSubmit:     (data: any) => Promise<void>;
};

export default function UserForm({ initialData, loading, onSubmit }: Props) {
    const [form, setForm] = useState<FormState>({
        name:  "",
        email: "",
        age:   "",
    });
    const [errors, setErrors] = useState<any>({});

    useEffect(() => {
        if (initialData) {
            setForm({
                name:  initialData.name  ?? "",
                email: initialData.email ?? "",
                age:   String(initialData.age ?? ""),
            });
        }
    }, [initialData]);

    function handleChange(name: keyof FormState, value: string) {
        setForm((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors((prev: any) => ({ ...prev, [name]: undefined }));
    }

    async function handleSubmit() {
        setErrors({});
        try {
            await onSubmit({
                ...form,
                age: form.age ? Number(form.age) : "",
            });
        } catch (err: any) {
            setErrors(err?.data?.errors?.form_errors || err?.data || {});
        }
    }

    function getError(field: keyof FormState) {
        const err = errors?.[field];
        if (!err) return null;
        return Array.isArray(err) ? err[0] : err;
    }

    return (
        <Card className="">
            <CardHeader>
                <CardTitle>{initialData ? "Edit User" : "New User"}</CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">

                {/* Name */}
                <div className="space-y-1.5">
                    <label className="text-sm font-medium">Name</label>
                    <Input
                        placeholder="Enter name"
                        value={form.name}
                        onChange={(e) => handleChange("name", e.target.value)}
                        className={cn(getError("name") && "border-destructive")}
                    />
                    {getError("name") && (
                        <p className="text-destructive text-xs">{getError("name")}</p>
                    )}
                </div>

                {/* Email */}
                <div className="space-y-1.5">
                    <label className="text-sm font-medium">Email</label>
                    <Input
                        type="email"
                        placeholder="Enter email"
                        value={form.email}
                        onChange={(e) => handleChange("email", e.target.value)}
                        className={cn(getError("email") && "border-destructive")}
                    />
                    {getError("email") && (
                        <p className="text-destructive text-xs">{getError("email")}</p>
                    )}
                </div>

                {/* Age */}
                <div className="space-y-1.5">
                    <label className="text-sm font-medium">Age</label>
                    <Input
                        type="number"
                        placeholder="Enter age"
                        min={0}
                        max={150}
                        value={form.age}
                        onChange={(e) => handleChange("age", e.target.value)}
                        className={cn(getError("age") && "border-destructive")}
                    />
                    {getError("age") && (
                        <p className="text-destructive text-xs">{getError("age")}</p>
                    )}
                </div>

            </CardContent>

            <CardFooter className="flex justify-end gap-3">
                <Button
                    variant="outline"
                    type="button"
                    onClick={() => window.history.back()}
                    disabled={loading}
                >
                    Cancel
                </Button>
                <Button onClick={handleSubmit} disabled={loading} className="min-w-24">
                    {loading ? "Saving..." : "Save"}
                </Button>
            </CardFooter>
        </Card>
    );
}
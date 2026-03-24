"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { IconUpload, IconFile, IconX, IconLoader } from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { request } from "@/lib/api";
import { API } from "@/constants/endpoints";

type UploadResult = {
    saved: number;
    rejected: number;
    errors: {
        row: number;
        data?: Record<string, string>;
        error: Record<string, string[]> | string;
    }[];
};

export default function Page() {
    const router = useRouter();
    const inputRef = useRef<HTMLInputElement>(null);

    const [file, setFile]         = useState<File | null>(null);
    const [dragging, setDragging] = useState(false);
    const [loading, setLoading]   = useState(false);
    const [result, setResult]     = useState<UploadResult | null>(null);
    const [error, setError]       = useState<string | null>(null);

    function handleFile(selected: File) {
        if (!selected.name.endsWith(".csv")) {
            setError("Only CSV files are allowed.");
            setFile(null);
            return;
        }
        setError(null);
        setResult(null);
        setFile(selected);
    }

    function handleDrop(e: React.DragEvent) {
        e.preventDefault();
        setDragging(false);
        const dropped = e.dataTransfer.files[0];
        if (dropped) handleFile(dropped);
    }

    async function handleUpload() {
        if (!file) return;

        const formData = new FormData();
        formData.append("file", file);

        setLoading(true);
        setError(null);
        setResult(null);

        try {
            const res = await request(API.users.upload.endpoint, {
                method: "POST",
                data: formData,
            });
            setResult(res);
            setFile(null);
        } catch (err: any) {
            setError(err?.data?.error || "Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="flex items-center justify-center p-6">
            <Card className="w-full">
                <CardHeader>
                    <CardTitle>Upload CSV</CardTitle>
                    <CardDescription>
                        Upload a CSV file to bulk import users. The file must contain
                        <span className="font-medium text-foreground"> name</span>,
                        <span className="font-medium text-foreground"> email</span>, and
                        <span className="font-medium text-foreground"> age</span> columns.
                    </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">

                    {/* Drop Zone */}
                    <div
                        onClick={() => inputRef.current?.click()}
                        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                        onDragLeave={() => setDragging(false)}
                        onDrop={handleDrop}
                        className={cn(
                            "flex flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed p-10 cursor-pointer transition-colors",
                            dragging
                                ? "border-primary bg-primary/5"
                                : "border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/40"
                        )}
                    >
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                            <IconUpload className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <div className="text-center">
                            <p className="text-sm font-medium">
                                Drag & drop your CSV here
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                                or click to browse files
                            </p>
                        </div>
                        <input
                            ref={inputRef}
                            type="file"
                            accept=".csv"
                            className="hidden"
                            onChange={(e) => {
                                const selected = e.target.files?.[0];
                                if (selected) handleFile(selected);
                                e.target.value = "";
                            }}
                        />
                    </div>

                    {/* Selected File */}
                    {file && (
                        <div className="flex items-center justify-between rounded-md border px-4 py-2.5 bg-muted/40">
                            <div className="flex items-center gap-2 text-sm">
                                <IconFile className="h-4 w-4 text-muted-foreground shrink-0" />
                                <span className="font-medium truncate max-w-xs">{file.name}</span>
                                <span className="text-muted-foreground shrink-0">
                                    ({(file.size / 1024).toFixed(1)} KB)
                                </span>
                            </div>
                            <button
                                onClick={() => setFile(null)}
                                className="text-muted-foreground hover:text-destructive transition-colors"
                            >
                                <IconX className="h-4 w-4" />
                            </button>
                        </div>
                    )}

                    {/* Error */}
                    {error && (
                        <p className="text-sm text-destructive">{error}</p>
                    )}

                    {/* Result */}
                    {result && (
                        <div className="space-y-3">

                            {/* Summary */}
                            <div className="flex gap-3">
                                <div className="flex-1 rounded-md border bg-green-50 dark:bg-green-950/30 p-3 text-center">
                                    <p className="text-2xl font-bold text-green-600 dark:text-green-400">{result.saved}</p>
                                    <p className="text-xs text-green-700 dark:text-green-500 mt-0.5">Imported</p>
                                </div>
                                <div className="flex-1 rounded-md border bg-red-50 dark:bg-red-950/30 p-3 text-center">
                                    <p className="text-2xl font-bold text-red-500 dark:text-red-400">{result.rejected}</p>
                                    <p className="text-xs text-red-600 dark:text-red-500 mt-0.5">Rejected</p>
                                </div>
                            </div>

                            {/* Error Table */}
                            {result.errors.length > 0 && (
                                <div className="rounded-md border overflow-hidden">
                                    <div className="bg-muted px-4 py-2.5 border-b">
                                        <p className="text-sm font-medium">Failed Rows</p>
                                    </div>
                                    <div className="max-h-72 overflow-y-auto">
                                        <table className="w-full text-sm">
                                            <thead className="bg-muted sticky top-0 border-b">
                                                <tr>
                                                    <th className="text-left px-4 py-2 font-medium text-muted-foreground w-16">Row</th>
                                                    <th className="text-left px-4 py-2 font-medium text-muted-foreground">Name</th>
                                                    <th className="text-left px-4 py-2 font-medium text-muted-foreground">Email</th>
                                                    <th className="text-left px-4 py-2 font-medium text-muted-foreground">Age</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {result.errors.map((e) => {
                                                    const fieldErrors = typeof e.error === "string"
                                                        ? {}
                                                        : e.error as Record<string, string[]>

                                                    const row = (e.data ?? {}) as Record<string, string>

                                                    function Cell({ field }: { field: string }) {
                                                        const hasError = !!fieldErrors[field]
                                                        const message  = hasError
                                                            ? Array.isArray(fieldErrors[field])
                                                                ? fieldErrors[field][0]
                                                                : fieldErrors[field]
                                                            : null

                                                        return (
                                                            <td className={cn(
                                                                "px-4 py-2.5",
                                                                hasError && "bg-red-50 dark:bg-red-950/30"
                                                            )}>
                                                                <p className={cn(
                                                                    "font-medium",
                                                                    hasError ? "text-destructive" : "text-foreground"
                                                                )}>
                                                                    {row[field] || <span className="text-muted-foreground italic">empty</span>}
                                                                </p>
                                                                {message && (
                                                                    <p className="text-xs text-destructive/80 mt-0.5">{message}</p>
                                                                )}
                                                            </td>
                                                        )
                                                    }

                                                    return (
                                                        <tr key={e.row} className="border-t">
                                                            <td className="px-4 py-2.5 text-muted-foreground font-medium">{e.row}</td>
                                                            <Cell field="name" />
                                                            <Cell field="email" />
                                                            <Cell field="age" />
                                                        </tr>
                                                    )
                                                })}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                </CardContent>

                <CardFooter className="flex justify-end gap-3">
                    <Button
                        variant="outline"
                        onClick={() => router.push("/users")}
                        disabled={loading}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleUpload}
                        disabled={!file || loading}
                        className="min-w-32"
                    >
                        {loading
                            ? <><IconLoader className="mr-2 h-4 w-4 animate-spin" /> Uploading...</>
                            : <><IconUpload className="mr-2 h-4 w-4" /> Upload CSV</>
                        }
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}
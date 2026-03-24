import { useMutation, useQueryClient } from "@tanstack/react-query"
import { request } from "@/lib/api"

// --------------------------------------------------
// CREATE (POST)
// --------------------------------------------------

export function useCreate(endpoint: string, invalidate?: string | string[]) {
    const qc = useQueryClient()

    return useMutation({
        mutationFn: (data: any) =>
            request(endpoint, { method: "POST", data }),
        onSuccess: () => {
            if (invalidate) {
                const keys = Array.isArray(invalidate) ? invalidate : [invalidate]
                keys.forEach((key) => qc.invalidateQueries({ queryKey: [key] }))
            }
        },
    })
}

// usage:
// const create = useCreate("/todos/", "todos")
// create.mutate({ title: "New task", priority: "high" })
// create.mutate(data, { onSuccess: () => router.push("/todos") })
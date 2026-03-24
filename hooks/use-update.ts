import { useMutation, useQueryClient } from "@tanstack/react-query"
import { request } from "@/lib/api"

// --------------------------------------------------
// PARTIAL UPDATE (PATCH)
// --------------------------------------------------
export function useUpdate(invalidate?: string | string[]) {
    const qc = useQueryClient()

    return useMutation({
        mutationFn: ({ endpoint, data }: { endpoint: string; data: any }) =>
            request(endpoint, { method: "PATCH", data }),
        onSuccess: () => {
            if (invalidate) {
                const keys = Array.isArray(invalidate) ? invalidate : [invalidate]
                keys.forEach((key) => qc.invalidateQueries({ queryKey: [key] }))
            }
        },
    })
}

// usage:
// const update = useUpdate("todos")
// update.mutate({ endpoint: `/todos/${slug}/`, data: { is_completed: true } })
//
// multiple keys:
// const update = useUpdate(["todos", "accounts"])
// update.mutate({ endpoint: `/todos/${slug}/`, data: { is_completed: true } })

// --------------------------------------------------
// FULL UPDATE (PUT)
// --------------------------------------------------
export function useReplace(invalidate?: string | string[]) {
    const qc = useQueryClient()

    return useMutation({
        mutationFn: ({ endpoint, data }: { endpoint: string; data: any }) =>
            request(endpoint, { method: "PUT", data }),
        onSuccess: () => {
            if (invalidate) {
                const keys = Array.isArray(invalidate) ? invalidate : [invalidate]
                keys.forEach((key) => qc.invalidateQueries({ queryKey: [key] }))
            }
        },
    })
}

// usage:
// const replace = useReplace("todos")
// replace.mutate({ endpoint: `/todos/${slug}/`, data: { ...allFields } })
//
// multiple keys:
// const replace = useReplace(["todos", "accounts"])
// replace.mutate({ endpoint: `/todos/${slug}/`, data: { ...allFields } })
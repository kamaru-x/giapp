import { useMutation, useQueryClient } from "@tanstack/react-query"
import { request } from "@/lib/api"

// --------------------------------------------------
// DELETE
// --------------------------------------------------

export function useDelete(invalidate?: string | string[]) {
    const qc = useQueryClient()

    return useMutation({
        mutationFn: ({ endpoint }: { endpoint: string }) =>
            request(endpoint, { method: "DELETE" }),
        onSuccess: () => {
            if (invalidate) {
                const keys = Array.isArray(invalidate) ? invalidate : [invalidate]
                keys.forEach((key) => qc.invalidateQueries({ queryKey: [key] }))
            }
        },
    })
}

// usage:
// const remove = useDelete("todos")
// remove.mutate({ endpoint: `/todos/${slug}/` })
// remove.mutate({ endpoint: `/todos/${slug}/` }, { onSuccess: () => router.push("/todos") })
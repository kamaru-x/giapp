import { useQuery } from "@tanstack/react-query"
import { request } from "@/lib/api"

// --------------------------------------------------
// GET (LIST & DETAIL)
// --------------------------------------------------
export function useGet(
    key: string,
    endpoint: string,
    params?: Record<string, any>,
    options?: { enabled?: boolean }
) {
    return useQuery({
        queryKey: [key, params],
        queryFn: () => request(endpoint, { params }),
        enabled: options?.enabled ?? true,
    })
}

// usage:
// const { data, isLoading, isError } = useGet("todos", "/todos/")
// const todos = data?.todos ?? []
// const stats = data?.stats ?? {}
//
// const { data, isLoading } = useGet("todo", `/todos/${slug}/`, undefined, { enabled: !!slug })
// const todo = data?.data
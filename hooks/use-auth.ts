import { useMutation, useQueryClient } from "@tanstack/react-query"
import { request, setTokens, clearTokens } from "@/lib/api"

// --------------------------------------------------
// LOGIN
// --------------------------------------------------
export function useLogin() {
    return useMutation({
        mutationFn: (data: { username: string; password: string }) =>
            request("/auth/login/", { method: "POST", data, auth: false }),
        onSuccess: (res) => {
            if (res?.data?.access) setTokens(res.data.access, res.data.refresh)
        },
    })
}

// usage:
// const login = useLogin()
// login.mutate({ username, password })
// const { access, refresh } = login.data?.data ?? {}

// --------------------------------------------------
// LOGOUT
// --------------------------------------------------
export function useLogout() {
    const qc = useQueryClient()
    return () => {
        clearTokens()
        qc.clear()
        window.location.href = "/login"
    }
}

// usage:
// const logout = useLogout()
// logout()
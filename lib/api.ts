const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"

// --------------------------------------------------
// TOKEN HELPERS
// --------------------------------------------------
export function getAccessToken() {
    return localStorage.getItem("access_token")
}

export function getRefreshToken() {
    return localStorage.getItem("refresh_token")
}

export function setTokens(access: string, refresh?: string) {
    localStorage.setItem("access_token", access)
    if (refresh) localStorage.setItem("refresh_token", refresh)

    // Sync to cookie for proxy.ts
    document.cookie = `access_token=${access}; path=/; max-age=${60 * 60 * 24 * 7}`
}

export function clearTokens() {
    localStorage.removeItem("access_token")
    localStorage.removeItem("refresh_token")

    // Clear cookie too
    document.cookie = "access_token=; path=/; max-age=0"
}

// --------------------------------------------------
// TOKEN REFRESH
// --------------------------------------------------
async function refreshAccessToken(): Promise<string | null> {
    const refresh = getRefreshToken()
    if (!refresh) return null

    const res = await fetch(`${API_URL}/auth/refresh/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh }),
    })

    if (!res.ok) {
        clearTokens()
        return null
    }

    const data = await res.json()
    setTokens(data.data.access)
    return data.data.access
}

// --------------------------------------------------
// TOKEN VERIFICATION (JWT decode — no network call)
// --------------------------------------------------
function isTokenExpired(token: string): boolean {
    try {
        const payload = JSON.parse(atob(token.split(".")[1]))
        return payload.exp * 1000 < Date.now() + 30_000 // 30s buffer
    } catch {
        return true
    }
}

async function verifyAndRefreshToken(): Promise<string | null> {
    const token = getAccessToken()
    if (!token) return null
    if (!isTokenExpired(token)) return token  // skip network call if still valid
    return await refreshAccessToken()
}

// --------------------------------------------------
// REQUEST
// --------------------------------------------------
export async function request(
    endpoint: string,
    options?: {
        method?: string
        data?: any
        params?: Record<string, any>
        auth?: boolean
    }
) {
    const url = new URL(`${API_URL}${endpoint}`)
    const auth = options?.auth ?? false

    if (options?.params) {
        Object.entries(options.params).forEach(([k, v]) => {
            if (v !== undefined && v !== null && v !== "") {
                url.searchParams.append(k, String(v))
            }
        })
    }

    const isFormData = options?.data instanceof FormData
    const headers: Record<string, string> = {}

    if (!isFormData) {
        headers["Content-Type"] = "application/json"
    }

    if (auth) {
        const token = await verifyAndRefreshToken()
        if (token) {
            headers["Authorization"] = `Bearer ${token}`
        }
    }

    const res = await fetch(url.toString(), {
        method: options?.method || "GET",
        headers,
        body: options?.data
            ? isFormData
                ? options.data
                : JSON.stringify(options.data)
            : undefined,
    })

    if (!res.ok) {
        const err = await res.json().catch(() => ({ detail: "Unknown error" }))
        const e: any = new Error("API Error")
        e.status = res.status
        e.data = err
        throw e
    }

    if (res.status === 204) return null

    return res.json()
}
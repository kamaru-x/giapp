export const API = {
    users: {
        list: {
            key: "users",
            endpoint: "users/list/",
        },
        detail: (slug: number) => ({
            key: "user",
            endpoint: `users/details/${slug}/`,
        }),
        upload: {
            key: "users",
            endpoint: 'users/upload/'
        }
    },
}
import type { Meta, User } from "~/types"

type FilterUserResponse = {
    data: User[],
    meta: Meta
}

export default {
    filterUser(query) {
        return useFetch<FilterUserResponse>('/api/client-api/v1/users', { query: query, server: false, default: () => paginationUtil.defaultResponse()})
    },
    updateUser(userId, data) {
        return useFetch<User>(`/api/client-api/v1/users/${userId}`, { method: 'PUT', body: data, default: () => null })
    }
}
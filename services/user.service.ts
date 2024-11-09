import { type Role, type Meta, type User } from "~/types"

type FilterUserResponse = {
    data: User[],
    meta: Meta
}

export default {
    filterUser(query) {
        return useFetch<FilterUserResponse>('/api/client-api/v1/users', { key: 'filter-user', query: query, server: false, default: () => paginationUtil.defaultResponse()})
    },
    updateUser(userId, data) {
        return useFetch<User>(`/api/client-api/v1/users/${userId}`, { method: 'PUT', body: data, server: false, default: () => null })
    },
    createUser(data) {
        return useFetch<User>('/api/client-api/v1/users', { method: 'POST', body: data, server: false, default: () => null });
    },
    logout(userId) {
        return useFetch<any>(`/api/client-api/v1/users/${userId}/logout`, { method: 'POST', server: false });
    },
    getAssignedRoleByUserId(userId: string) {
        return useFetch<Role[]>(`/api/client-api/v1/users/${userId}/roles`, { server: false})
    }
}
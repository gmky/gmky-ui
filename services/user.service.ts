import { type Role, type Meta, type User } from "~/types"

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
    },
    createUser(data) {
        return useFetch<User>('/api/client-api/v1/users', { method: 'POST', body: data, default: () => null });
    },
    logout(userId) {
        return useFetch<any>(`/api/client-api/v1/users/${userId}/logout`, { method: 'POST'});
    },
    getAssignedRoleByUserId(userId: string) {
        return useFetch<Role[]>(`/api/client-api/v1/users/${userId}/roles`)
    }
}
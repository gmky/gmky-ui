import type { Meta, Role } from "~/types"

export type FilterRoleResponse = {
    data: Role[]
    meta: Meta
}

export default {
    filterRole(query) {
        return useFetch<FilterRoleResponse>('/api/client-api/v1/roles', { server: false, default: () => {
            return paginationUtil.defaultResponse()
        }, query })
    },
    createRole(data) {
        return useFetch<Role>('/api/client-api/v1/roles', { method: 'POST', server: false, body: data, default: () => null })
    },
    updateById(id: Number, data: any) {
        return useFetch<Role>(`/api/client-api/v1/roles/${id}`, { method: 'PUT', server: false, body: data, default: () => null })
    },
    deleteById(id: Number) {
        return useFetch<Role>(`/api/client-api/v1/roles/${id}`, { method: 'DELETE', server: false, default: () => null })
    }
}
import type { Meta, Role } from "~/types"

type FilterRoleResponse = {
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
}
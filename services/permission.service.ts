import type { Meta, Permission } from "~/types"

type FilterPermissionResponse = {
    data: Permission[]
    meta: Meta
}

export default {
    filterPermission(query) {
        return useFetch<FilterPermissionResponse>('/api/client-api/v1/permissions', { server: false, default: () => {
            return paginationUtil.defaultResponse()
        }, query })
    }
}
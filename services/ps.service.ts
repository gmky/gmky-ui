import type { Meta, PermissionSet } from "~/types"

type FilterPermissionSetResponse = {
    data: PermissionSet[],
    meta: Meta
}

export default {
    filterPermissionSet(query) {
        return useFetch<FilterPermissionSetResponse>('/api/client-api/v1/permission-set', { server: false, default: () => {
            return paginationUtil.defaultResponse()
        }, query })
    },
    createPermissionSet(data) {
        return useFetch<PermissionSet>('/api/client-api/v1/permission-set', { method: 'POST', server: false, default: () => null, body: data })
    }
}
import { type Permission, type Meta, type PermissionSet } from "~/types"

export type FilterPermissionSetResponse = {
    data: PermissionSet[],
    meta: Meta
}

export default {
    filterPermissionSet(query) {
        return useFetch<FilterPermissionSetResponse>('/api/client-api/v1/permission-set', {
            server: false, default: () => {
                return paginationUtil.defaultResponse()
            }, query
        })
    },
    createPermissionSet(data) {
        return useFetch<PermissionSet>('/api/client-api/v1/permission-set', { method: 'POST', server: false, default: () => null, body: data })
    },
    getAssignedPermission(psId: Number) {
        return useFetch<Permission[]>(`/api/client-api/v1/permission-set/${psId}/permissions`, { server: false, default: () => [] })
    },
    updatePs(psId: Number, data: any) {
        return useFetch<PermissionSet>(`/api/client-api/v1/permission-set/${psId}`, { method: 'PUT', server: false, body: data, default: () => null })
    }
}
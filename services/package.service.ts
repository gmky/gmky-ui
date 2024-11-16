import type { Package, Meta } from "~/types"

export type FilterPackageResponse = {
  data: Package[],
  meta: Meta
}

export default {
  filterMyPackages(query) {
    return useFetch<FilterPackageResponse>('/api/client-api/v1/packages/me', { server: false, query, default: () => (paginationUtil.defaultResponse()) })
  }
}
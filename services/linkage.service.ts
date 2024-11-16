import type { Linkage, Meta } from "~/types"

export type FilterLinkageResponse = {
  data: Linkage[],
  meta: Meta
}

export default {
  filterLinkages(query) {
    return useFetch<FilterLinkageResponse>('/api/client-api/v1/linkages/me', { server: false, query, default: () => (paginationUtil.defaultResponse()) })
  }
}
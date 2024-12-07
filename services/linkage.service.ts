import type { Linkage, Meta } from "~/types"

export type FilterLinkageResponse = {
  data: Linkage[],
  meta: Meta
}

export default {
  filterLinkages(query) {
    return useFetch<FilterLinkageResponse>('/api/client-api/v1/linkages/me', { server: false, query, default: () => (paginationUtil.defaultResponse()) })
  },
  createLinkage(data) {
    return useFetch<Linkage>('/api/client-api/v1/linkages', { method: 'POST', body: data, server: false, default: () => null });
  },
  getLinkageById(linkageId) {
    return useFetch<Linkage>(`/api/client-api/v1/linkages/${linkageId}`, { server: false, default: () => null })
  }
}
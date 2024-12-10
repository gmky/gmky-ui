import type { SummaryItem } from "~/types"

export default {
  getSummary() {
    return useFetch<SummaryItem[]>('/api/client-api/v1/summary', { default: () => [], server: false })
  },
  register(data) {
    return useFetch<any>('/api/client-api/v1/register', { method: 'POST', body: data, server: false });
  }
}
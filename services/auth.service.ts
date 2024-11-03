import type { SummaryItem } from "~/types"

export default {
    getSummary() {
      return useFetch<SummaryItem[]>('/api/client-api/v1/summary', { default: () => [], server: false })
    }
}
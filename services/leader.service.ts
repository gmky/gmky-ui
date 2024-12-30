import type { InvestmentChart, LeaderHistory, LeaderStat, Meta } from "~/types"

export type FilterLeaderHistoryResponse = {
  data: LeaderHistory[],
  meta: Meta
}

export default {
  leaderBet(data) {
    return useFetch(`/api/client-api/v1/leader/bet`, { method: 'POST', server: false, body: data })
  },
  getLeaderStat({ linkageId }) {
    return useFetch<LeaderStat>('/api/client-api/v1/leader/stats', { query: { linkageId }, server: false })
  },
  getLeaderHistory(query) {
    return useFetch<FilterLeaderHistoryResponse>(`/api/client-api/v1/leader/history`, { query, server: false, default: () => (paginationUtil.defaultResponse()) })
  },
  getChart(linkageId) {
    return useFetch<InvestmentChart[]>(`/api/client-api/v1/leader/${linkageId}/chart`, { server: false })
  }
}
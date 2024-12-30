import type { LeaderStat } from "~/types"

export default {
  leaderBet(data) {
    return useFetch(`/api/client-api/v1/leader/bet`, { method: 'POST', server: false, body: data })
  },
  getLeaderStat({ linkageId }) {
    return useFetch<LeaderStat>('/api/client-api/v1/leader/stats', { query: { linkageId }, server: false })
  }
}
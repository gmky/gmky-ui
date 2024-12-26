export default {
  leaderBet(data) {
    return useFetch(`/api/client-api/v1/leader/bet`, { method: 'POST', server: false, body: data })
  }
}
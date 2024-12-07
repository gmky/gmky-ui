import type { BotStrategy, Investment, Meta } from "~/types"

export type FilterPackageResponse = {
  data: Investment[],
  meta: Meta
}

export type GetBotStrategyResponse = {
  data: BotStrategy[],
  meta: Meta
}

export default {
  filterMyInvestment(query) {
    return useFetch<FilterPackageResponse>('/api/client-api/v1/investments/me', { server: false, query, default: () => (paginationUtil.defaultResponse()) })
  },
  filterBotStrategies(query) {
    return useFetch<GetBotStrategyResponse>('/api/client-api/v1/investments/bot-strategies', { server: false, query, default: () => (paginationUtil.defaultResponse()) })
  },
  getAllBotStrategies() {
    return useFetch<BotStrategy[]>('/api/client-api/v1/investments/all-bot-strategies', { server: false, default: () => [] })
  },
  updateInvestmentById(investmentId, data) {
    return useFetch<any>(`/api/client-api/v1/investments/${investmentId}`, { method: 'PUT', server: false, body: data, default: () => null })
  }
}
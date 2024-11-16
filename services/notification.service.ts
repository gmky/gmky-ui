import type { Meta, Notification, UnreadCount } from "~/types"

export type GetNotificationResponse = {
  data: Notification[],
  meta: Meta
}

export default {
  getUnreadCount() {
    return useFetch<UnreadCount>('/api/client-api/v1/notifications/unread-count', { default: () => null, server: false })
  },

  getNotification(data) {
    return useFetch<GetNotificationResponse>('/api/client-api/v1/notifications', { server: false, query: data, default: () => (paginationUtil.defaultResponse()) })
  }
}
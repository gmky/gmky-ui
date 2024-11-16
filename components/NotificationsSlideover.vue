<script setup lang="ts">
import { formatTimeAgo } from '@vueuse/core'
import notificationService from '~/services/notification.service';

const { isNotificationsSlideoverOpen } = useDashboard()

const { data: response } = await notificationService.getNotification({ page: 0, size: 20 })
const notifications = computed(() => response.value.data)
</script>

<template>
  <UDashboardSlideover v-model="isNotificationsSlideoverOpen" title="Notifications">
    <NuxtLink v-for="notification in notifications" :key="notification.id" :to="`/inbox?id=${notification.id}`"
      class="p-3 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer flex items-center gap-3 relative">
      <UChip color="red" :show="!notification.read" inset>
        <UAvatar :v-bind="{ src: 'https://i.pravatar.cc/128?u=2' }" :alt="notification.createdBy" size="md" />
      </UChip>

      <div class="text-sm flex-1">
        <p class="flex items-center justify-between">
          <span class="text-gray-900 dark:text-white font-medium">{{ notification.createdBy }}</span>

          <time :datetime="notification.createdAt" class="text-gray-500 dark:text-gray-400 text-xs"
            v-text="formatTimeAgo(new Date(notification.createdAt))" />
        </p>
        <p class="text-gray-500 dark:text-gray-400">
          {{ notification.message }}
        </p>
      </div>
    </NuxtLink>
  </UDashboardSlideover>
</template>

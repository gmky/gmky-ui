<script setup lang="ts">
import type { FormError, FormSubmitEvent } from '#ui/types'
import { useI18n } from 'vue-i18n';
import linkageService from '~/services/linkage.service';
import type { Linkage } from '~/types';

const emit = defineEmits(['close', 'create'])

const { data: response, status } = await linkageService.filterLinkages({})

const linkages = computed(() => response.value.data || [])

const router = useRouter()
const authStore = useAuthStore()
async function setLinkageId(item: Linkage) {
  await authStore.setLinkageId(item.id)
  await authStore.setLinkage(item)
  router.push('/admin')
}

async function createNewLinkage() {
  emit('create')
}

</script>

<template>
  <div class="p-4">
    <span class="italic">Select context</span>
    <UDashboardCard
      class="my-2 pb-1 hover:primary hover:cursor-pointer dark:hover:bg-gray-700/50 hover:bg-gray-100 text-gray-700 dark:text-gray-200"
      v-for="item in linkages" :title="item.username" :description="item.domain" @click="setLinkageId(item)">
    </UDashboardCard>
    <UButton block @click="createNewLinkage">Create new linkage</UButton>
  </div>
</template>

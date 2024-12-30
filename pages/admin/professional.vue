<script setup lang="ts">

import { format, sub } from 'date-fns';
import { useI18n } from 'vue-i18n';
import ProBet from '~/components/professional/ProBet.vue';
import ProInfo from '~/components/professional/ProInfo.vue';
import leaderService from '~/services/leader.service';
import type { Period, Range } from '~/types';


definePageMeta({
  middleware: [
    'authority'
  ],
  authority: 'public'
})

const round = ref(null)

const amount = ref(5)

const countDown = ref(null)

const sessionId = ref(null)


const authStore = useAuthStore()
const linkageId = computed(() => authStore.getLinkageId)
const linkage = authStore.getLinkage

const accountId = ref(linkage?.liveId)

const wssURL = computed(() => `wss://${linkage.domain}:2096`)

const ws = new WebSocket(wssURL.value)

ws.onopen = function (event) {
  console.log('Connected')
  sendInfo()
}

ws.onmessage = function (event) {
  let data = JSON.parse(event.data)
  let dl = data.data;
  if (data.type === 'allData') {
    countDown.value = dl.candleClose
    round.value = dl.type == 'watting' ? 'WAITING' : 'ORDER'
    sessionId.value = dl.session
  }
}

function sendInfo() {
  let data = { type: 'accountDetail', data: { uid: accountId.value, email: linkage.username } }
  ws.send(JSON.stringify(data))
}

function getColorFromStatus(status: string) {
  if (status === 'WIN') return 'green'
  if (status === 'LOSE') return 'red'
  return 'blue'
}

function getColorFromAction(action: string) {
  if (action === 'BUY') return 'green'
  return 'red'
}

const { t } = useI18n()

const defaultColumns = [{
  key: 'id',
  label: '#'
}, {
  key: 'accountId',
  label: t('investment_detail_table_account_id'),
  sortable: true
}, {
  key: 'professional',
  label: t('professional_mode_title'),
  sortable: true
}, {
  key: 'action',
  label: t('investment_detail_table_action'),
  sortable: true
}, {
  key: 'status',
  label: t('investment_detail_table_status'),
  sortable: true
}, {
  key: 'amount',
  label: t('investment_detail_table_amount'),
  sortable: true
}, {
  key: 'amountWin',
  label: t('investment_detail_table_amount_win'),
  sortable: true
}, {
  key: 'amountLose',
  label: t('investment_detail_table_amount_lose'),
  sortable: true
}, {
  key: 'createdAt',
  label: t('investment_detail_table_created_at'),
  sortable: true
}, {
  key: 'updatedAt',
  label: t('investment_detail_table_updated_at'),
  sortable: true
}]

const range = ref<Range>({ start: sub(new Date(), { days: 7 }), end: new Date() })
const period = ref<Period>('daily')

const currentPage = ref(1)
const pageSize = ref(20)

const query = computed(() => ({ page: currentPage.value - 1, size: pageSize.value, linkageId: linkageId.value }))

const { data: response, status } = await leaderService.getLeaderHistory(query);

async function reloadHistory() {
  const { data: tmp, status: tmpStatus } = await leaderService.getLeaderHistory(query);
  response.value = tmp.value
  status.value = tmpStatus.value
}

const { data: cData } = await leaderService.getChart(linkageId.value);

const histories = computed(() => response.value.data || [])
const loading = computed(() => status.value == 'pending')

const selectedColumns = ref(defaultColumns)
const selectedColumnOpts = ref(defaultColumns.filter(item => !!item.label))
const sort = ref({ column: 'id', direction: 'asc' as const })
const columns = computed(() => defaultColumns.filter(column => selectedColumns.value.includes(column)))
const totalItems = computed(() => response.value.meta.total || 0)

</script>
<template>
  <UDashboardPage>
    <UDashboardPanel grow>
      <UDashboardNavbar :title="$t('professional_title')">
      </UDashboardNavbar>
      <UDashboardPanelContent>
        <div class="grid lg:grid-cols-2 lg:items-start gap-8 mb-4">
          <ProBet :round="round" :account-id="accountId" :linkage="linkage" :session-id="`${sessionId}`"
            :linkage-id="Number(linkageId)" :count-down="`${countDown}`" @reload-history="reloadHistory" />
          <ProInfo :linkage-id="Number(linkageId)" />
        </div>
        <HomeChart :period="period" :range="range" :c-data="cData" class="mb-4" />
        <UTable v-model:sort="sort" :rows="histories" :columns="columns" :loading="loading" sort-mode="manual"
          class="w-full" :ui="{ divide: 'divide-gray-200 dark:divide-gray-800 mt-2' }">

          <template #action-data="{ row }">
            <UBadge :label="row.action" :color="getColorFromAction(row.action)" variant="subtle" class="capitalize" />
          </template>

          <template #professional-data="{ row }">
            <UBadge :label="row.professional ? 'YES' : 'NO'" :color="row.professional ? 'green' : 'gray'"
              variant="subtle" class="capitalize" />
          </template>

          <template #status-data="{ row }">
            <UBadge :label="row.status || 'PENDING'" :color="getColorFromStatus(row.status)" variant="subtle"
              class="capitalize" />
          </template>

          <template #amountWin-data="{ row }">
            <span class="text-green-500" variant="subtle">{{ row.amountWin ? `+ ${row.amountWin}` : ''
              }}</span>
          </template>

          <template #amountLose-data="{ row }">
            <span class="text-red-500" variant="subtle">{{ row.amountLose ? `- ${row.amountLose}` : ''
              }}</span>
          </template>

          <template #createdAt-data="{ row }">
            {{ format(row.createdAt, 'HH:mm:ss dd/MM/yyyy') }}
          </template>

          <template #updatedAt-data="{ row }">
            {{ format(row.createdAt, 'HH:mm:ss dd/MM/yyyy') }}
          </template>
        </UTable>
        <div class="flex justify-end px-3 py-3.5 border-t border-gray-200 dark:border-gray-700">
          <UPagination v-model="currentPage" :page-count="pageSize" :total="totalItems" />
        </div>
      </UDashboardPanelContent>
    </UDashboardPanel>
  </UDashboardPage>
</template>
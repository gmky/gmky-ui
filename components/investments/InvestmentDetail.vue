<script setup lang="ts">
import { sub, format } from 'date-fns'
import { useI18n } from 'vue-i18n';
import investmentService from '~/services/investment.service';
import type { Period, Range } from '~/types';

const props = defineProps({
  investmentId: Number
})

const emit = defineEmits(['close'])

const { t } = useI18n()

function close() {
  emit('close')
}

const range = ref<Range>({ start: sub(new Date(), { days: 14 }), end: new Date() })
const period = ref<Period>('daily')

const defaultColumns = [{
  key: 'id',
  label: '#'
}, {
  key: 'accountId',
  label: t('investment_detail_table_account_id'),
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

function getColorFromStatus(status: string) {
  if (status === 'WIN') return 'green'
  if (status === 'LOSE') return 'red'
  return 'blue'
}

function getColorFromAction(action: string) {
  if (action === 'BUY') return 'green'
  return 'red'
}

const currentPage = ref(1)
const pageSize = ref(5)

const query = computed(() => ({ page: currentPage.value - 1, size: pageSize.value }))


const { data: response, status } = await investmentService.getHistoryByInvestmentId(props.investmentId, query);

const histories = computed(() => response.value.data || [])

const selectedColumns = ref(defaultColumns)
const selectedColumnOpts = ref(defaultColumns.filter(item => !!item.label))
const sort = ref({ column: 'id', direction: 'asc' as const })
const columns = computed(() => defaultColumns.filter(column => selectedColumns.value.includes(column)))
const totalItems = computed(() => response.value.meta.total || 0)
</script>

<template>
  <div>
    <HomeChart :period="period" :range="range" />
    <UTable v-model:sort="sort" :rows="histories" :columns="columns" sort-mode="manual" class="w-full"
      :ui="{ divide: 'divide-gray-200 dark:divide-gray-800' }">

      <template #action-data="{ row }">
        <UBadge :label="row.action" :color="getColorFromAction(row.action)" variant="subtle" class="capitalize" />
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
        {{ format(new Date(row.createdAt), 'HH:mm:ss dd/MM/yyyy') }}
      </template>

      <template #updatedAt-data="{ row }">
        {{ format(new Date(row.updatedAt), 'HH:mm:ss dd/MM/yyyy') }}
      </template>
    </UTable>
    <div class="flex justify-end px-3 py-3.5 border-t border-gray-200 dark:border-gray-700">
      <UPagination v-model="currentPage" :page-count="pageSize" :total="totalItems" />
    </div>
  </div>
</template>
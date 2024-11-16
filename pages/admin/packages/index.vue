<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import linkageService from '~/services/linkage.service';
import packageService from '~/services/package.service';
import type { Linkage } from '~/types';

definePageMeta({
  middleware: [
    'authority'
  ],
  authority: 'public'
})

const itemPerPages = ref(10)
const currentPage = ref(1)

const { t } = useI18n()

const defaultColumns = [{
  key: 'id',
  label: '#'
}, {
  key: 'name',
  label: t('package_table_name'),
  sortable: true
}, {
  key: 'initialBalance',
  label: t('package_table_initial_balance'),
  sortable: true
}, {
  key: 'remainingBalance',
  label: t('package_table_remaining_balance'),
  sortable: true
}, {
  key: 'startAt',
  label: t('package_table_start_at'),
  sortable: true
}, {
  key: 'endAt',
  label: t('package_table_end_at'),
  sortable: true
}, {
  key: 'status',
  label: t('common_table_status'),
  sortable: true
}, {
  key: 'actions',
  label: t('common_table_action')
}]

const items = (row: Linkage) => [
  [
    {
      label: t('common_table_edit'),
      icon: 'i-heroicons-pencil-square-20-solid',
      click: async () => {

      }
    },
    {
      label: row.status === 'ACTIVE' ? t('package_table_action_disable') : t('package_table_action_enable'),
      icon: 'i-heroicons-lock-closed',
      click: async () => {
      }
    }
  ],
  [
    {
      label: t('common_table_delete'),
      icon: 'i-heroicons-arrow-left-end-on-rectangle',
      click: () => {
      }
    }
  ]
]

const selectedColumns = ref(defaultColumns)
const selectedColumnOpts = ref(defaultColumns.filter(item => !!item.label))
const sort = ref({ column: 'id', direction: 'asc' as const })

const query = computed(() => ({ page: currentPage.value - 1, size: itemPerPages.value }))
const { data: response, status } = await packageService.filterMyPackages(query)
const packages = computed(() => response.value.data || [])
const totalItems = computed(() => response.value.meta.total || 0)
const linkageLoading = computed(() => status.value == 'pending')

// Computed
const columns = computed(() => defaultColumns.filter(column => selectedColumns.value.includes(column)))
</script>
<template>
  <UDashboardPage>
    <UDashboardPanel grow>
      <UDashboardNavbar :title="$t('package_title')" :badge="totalItems" />
      <UDashboardToolbar>
        <template #right>
          <UPagination v-model="currentPage" :page-count="+itemPerPages" :total="totalItems" />
          <USelect v-model="itemPerPages" :options="[10, 20, 50, 100]" />
          <USelectMenu v-model="selectedColumns" icon="i-heroicons-adjustments-horizontal-solid"
            :options="selectedColumnOpts" multiple class="hidden lg:block">
            <template #label>
              {{ $t('common_table_display') }}
            </template>
          </USelectMenu>
        </template>
      </UDashboardToolbar>

      <UTable v-model:sort="sort" :rows="packages" :columns="columns" :loading="linkageLoading" sort-mode="manual"
        class="w-full" :ui="{ divide: 'divide-gray-200 dark:divide-gray-800' }">
        <template #name-data="{ row }">
          <div class="flex items-center gap-3">
            <span class="text-gray-900 dark:text-white font-medium">{{ row.name }}</span>
          </div>
        </template>

        <template #initial-balance-data="{ row }">
          <div class="flex items-center gap-3">
            <span class="text-gray-900 dark:text-white font-medium">{{ row.initialBalance }}</span>
          </div>
        </template>

        <template #remaining-balance-data="{ row }">
          <div class="flex items-center gap-3">
            <span class="text-gray-900 dark:text-white font-medium">{{ row.reaminingBalance }}</span>
          </div>
        </template>

        <template #start-at-data="{ row }">
          <div class="flex items-center gap-3">
            <span class="text-gray-900 dark:text-white font-medium">{{ new Date(row.startAt) }}</span>
          </div>
        </template>

        <template #end-at-data="{ row }">
          <div class="flex items-center gap-3">
            <span class="text-gray-900 dark:text-white font-medium">{{ new Date(row.endAt) }}</span>
          </div>
        </template>

        <template #status-data="{ row }">
          <UBadge :label="row.status" :color="row.status === 'ACTIVE' ? 'green' : 'red'" variant="subtle"
            class="capitalize" />
        </template>

        <template #actions-data="{ row }">
          <UDropdown :items="items(row)">
            <UButton color="gray" variant="ghost" icon="i-heroicons-ellipsis-horizontal-20-solid" />
          </UDropdown>
        </template>
      </UTable>
    </UDashboardPanel>
  </UDashboardPage>
</template>
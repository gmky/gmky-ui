<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import ConfirmationModal from '~/components/common/ConfirmationModal.vue';
import investmentService from '~/services/investment.service';
import type { Investment } from '~/types';
import { useAuthStore } from '~/stores/auth';
import InvestmentForm from '~/components/investments/InvestmentForm.vue';
import InvestmentDetail from '~/components/investments/InvestmentDetail.vue';
import UpdateInvestmentForm from '~/components/investments/UpdateInvestmentForm.vue';

definePageMeta({
  middleware: [
    'authority'
  ],
  authority: 'public'
})

const authStore = useAuthStore()
const linkageId = computed(() => authStore.getLinkageId)

const itemPerPages = ref(10)
const currentPage = ref(1)

const { t } = useI18n()

const defaultColumns = [{
  key: 'id',
  label: '#'
}, {
  key: 'botName',
  label: t('investment_table_name'),
  sortable: true
}, {
  key: 'strategyCapital.botMethod',
  label: t('investment_table_strategy_capital'),
  sortable: true
}, {
  key: 'strategySignal.botMethod',
  label: t('investment_table_strategy_signal'),
  sortable: true
}, {
  key: 'betCount',
  label: t('investment_table_bet_count'),
  sortable: true
}, {
  key: 'balance',
  label: t('investment_table_balance'),
  sortable: true
}, {
  key: 'countWin',
  label: t('investment_table_count_win'),
  sortable: true
}, {
  key: 'amountWin',
  label: t('investment_table_amount_win'),
  sortable: true
}, {
  key: 'countLose',
  label: t('investment_table_count_lose'),
  sortable: true
}, {
  key: 'amountLose',
  label: t('investment_table_amount_lose'),
  sortable: true
}, {
  key: 'status',
  label: t('common_table_status'),
  sortable: true
}, {
  key: 'actions',
  label: t('common_table_action')
}]
const modal = useModal()
const toast = useToast()
function openCloseInvestmentModal(row: Investment) {
  modal.open(ConfirmationModal, {
    title: row.status == 'ACTIVE' ? t('investment_table_action_disable_title') : t('investment_table_action_enable_title'),
    message: row.status == 'ACTIVE' ? t('investment_table_action_disable_msg') : t('investment_table_action_enable_msg'),
    async onConfirm() {
      const { error } = await investmentService.updateInvestmentById(row.id, { status: row.status == 'ACTIVE' ? 'INACTIVE' : 'ACTIVE' })
      notificationUtil.toastRes(toast, error.value, t('investment_update_success'), t('investment_update_failed'))
      await filterInvestment()
      modal.close()
    },
    async onClose() {
      modal.close()
    }
  })
}

async function filterInvestment() {
  const { data: r, status: s } = await investmentService.filterMyInvestment(query)
  response.value = r.value
  status.value = s.value
}

const selectedInvestmentId = ref(0)

const items = (row: Investment) => [
  [
    {
      label: t('common_table_detail'),
      icon: 'i-heroicons-eye',
      click: async () => {
        selectedInvestmentId.value = row.id
        isInvestmentDetailModalOpen.value = true
      }
    },
    {
      disabled: row.status === 'ACTIVE',
      label: t('common_table_edit'),
      icon: 'i-heroicons-pencil-square-20-solid',
      click: async () => {
        selectedInvestmentId.value = row.id
        isUpdateInvestmentModalOpen.value = true
      }
    },
    {
      label: row.status === 'ACTIVE' ? t('investment_table_action_disable') : t('investment_table_action_enable'),
      icon: 'i-heroicons-lock-closed',
      click: async () => {
        openCloseInvestmentModal(row)
      }
    }
  ]
]

const selectedColumns = ref(defaultColumns)
const selectedColumnOpts = ref(defaultColumns.filter(item => !!item.label))
const sort = ref({ column: 'id', direction: 'asc' as const })

const query = computed(() => ({ page: currentPage.value - 1, size: itemPerPages.value, linkageId: linkageId.value }))
const { data: response, status } = await investmentService.filterMyInvestment(query)
const investment = computed(() => response.value.data || [])
const totalItems = computed(() => response.value.meta.total || 0)
const investmentLoading = computed(() => status.value == 'pending')

const isNewInvestmentModalOpen = ref(false)
const isUpdateInvestmentModalOpen = ref(false)
const canCreateInvestment = true // await useAuthorize('investment:create')

const isInvestmentDetailModalOpen = ref(false)

// Computed
const columns = computed(() => defaultColumns.filter(column => selectedColumns.value.includes(column)))
</script>
<template>
  <UDashboardPage>
    <UDashboardPanel grow>
      <UDashboardNavbar :title="$t('investment_title')" :badge="totalItems">
        <template #right>
          <UButton :label="$t('investment_new_investment_btn')" trailing-icon="i-heroicons-plus" color="gray"
            @click="isNewInvestmentModalOpen = true" v-if="canCreateInvestment" />
        </template>
      </UDashboardNavbar>
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

      <UDashboardModal v-model="isNewInvestmentModalOpen" :title="t('investment_new_investment_modal_title')"
        :description="t('investment_new_investment_modal_desc')" v-if="canCreateInvestment"
        :ui="{ width: 'sm:max-w-md' }">
        <InvestmentForm @close="isNewInvestmentModalOpen = false" @success="filterInvestment()" />
      </UDashboardModal>

      <UDashboardModal v-model="isInvestmentDetailModalOpen" :title="t('investment_detail_title')"
        :description="t('investment_detail_desc')" :ui="{ width: 'sm:max-w-md' }" fullscreen>
        <InvestmentDetail @close="isInvestmentDetailModalOpen = false" :investment-id="selectedInvestmentId" />
      </UDashboardModal>

      <UDashboardModal v-model="isUpdateInvestmentModalOpen" :title="t('investment_update_modal_title')"
        :description="t('investment_update_modal_desc')" v-if="canCreateInvestment" :ui="{ width: 'sm:max-w-md' }">
        <UpdateInvestmentForm @close="isUpdateInvestmentModalOpen = false" @success="filterInvestment()"
          :investment-id="selectedInvestmentId" />
      </UDashboardModal>

      <UTable v-model:sort="sort" :rows="investment" :columns="columns" :loading="investmentLoading" sort-mode="manual"
        class="w-full" :ui="{ divide: 'divide-gray-200 dark:divide-gray-800' }">

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
<script setup lang="ts">
import psService from '~/services/ps.service';

definePageMeta({
    middleware: [
        'authority'
    ],
    authority: 'permissionset:view'
})

const q = ref('')
const isNewPSModalOpen = ref(false)

const defaultPSTypes = ['TEMPLATE', 'CUSTOM']
const selectedPSTypes = ref([...defaultPSTypes])

const itemPerPages = ref(10)
const currentPage = ref(1)

const defaultColumns = [{
    key: 'id',
    label: '#'
}, {
    key: 'name',
    label: 'Name',
    sortable: true
}, {
    key: 'description',
    label: 'Description',
    sortable: true
}, {
    key: 'type',
    label: 'Type',
    sortable: true
}, {
    key: 'actions'
}]

const actions = (row) => [
  [{
    label: 'Edit',
    icon: 'i-heroicons-pencil-square-20-solid',
    click: () => console.log('Edit', row.id)
  }, {
    label: 'Set as default',
    icon: 'i-heroicons-exclamation-triangle'
  }, {
    label: row.isEnable ? 'Disable' : 'Enable',
    icon: 'i-heroicons-adjustments-vertical'
  }], [{
    label: 'Delete',
    icon: 'i-heroicons-trash'
  }]
]

const selectedColumns = ref(defaultColumns)
const selectedColumnOpts = ref(defaultColumns.filter(item => !!item.label))
const sort = ref({ column: 'id', direction: 'asc' as const })

const query = computed(() => ({ type: selectedPSTypes.value, page: currentPage.value - 1, size: itemPerPages.value }))
const { data: response, pending: psListLoading } = await psService.filterPermissionSet(query)
const psList = computed(() => response.value.data)
const totalItems = computed(() => response.value.meta.total || 0)

// Computed
const columns = computed(() => defaultColumns.filter(column => selectedColumns.value.includes(column)))
const canCreatePS = await useAuthorize('permissionset:create')

</script>
<template>
    <UDashboardPage>
        <UDashboardPanel grow>
            <UDashboardNavbar title="Permission Set" :badge="totalItems">
                <template #right>
                    <UInput ref="input" v-model="q" icon="i-heroicons-funnel" autocomplete="off"
                        placeholder="Filter permission set..." class="hidden lg:block" @keydown.esc="$event.target.blur()">
                        <template #trailing>
                            <UKbd value="/" />
                        </template>
                    </UInput>

                    <UButton label="New permission set" trailing-icon="i-heroicons-plus" color="gray" v-if="canCreatePS"
                        @click="isNewPSModalOpen = true" />
                </template>
            </UDashboardNavbar>

            <UDashboardModal v-model="isNewPSModalOpen" title="New user" description="Add a new user to your database" v-if="canCreatePS"
                :ui="{ width: 'sm:max-w-md' }">
                <!-- ~/components/users/UsersForm.vue -->
                <PsForm @close="isNewPSModalOpen = false" />
            </UDashboardModal>

            <UDashboardToolbar>
                <template #left>
                    <USelectMenu v-model="selectedPSTypes" icon="i-heroicons-check-circle" placeholder="No type"
                        multiple :options="defaultPSTypes" :ui-menu="{ option: { base: 'capitalize' } }" />
                </template>

                <template #right>
                    <UPagination v-model="currentPage" :page-count="+itemPerPages" :total="totalItems" />
                    <USelect v-model="itemPerPages" :options="[10, 20, 50, 100]" />
                    <USelectMenu v-model="selectedColumns" icon="i-heroicons-adjustments-horizontal-solid"
                        :options="selectedColumnOpts" multiple class="hidden lg:block">
                        <template #label>
                            Display
                        </template>
                    </USelectMenu>
                </template>
            </UDashboardToolbar>

            <UTable v-model:sort="sort" :rows="psList" :columns="columns" :loading="psListLoading" sort-mode="manual"
                class="w-full" :ui="{ divide: 'divide-gray-200 dark:divide-gray-800' }">
                <template #name-data="{ row }">
                    <div class="flex items-center gap-3">
                        <span class="text-gray-900 dark:text-white font-medium">{{ row.name }}</span>
                    </div>
                </template>

                <template #type-data="{ row }">
                    <UBadge :label="row.type"
                        :color="row.type === 'TEMPLATE' ? 'green' : 'red'"
                        variant="subtle" class="capitalize" />
                </template>

                <template #actions-data="{ row }">
                    <UDropdown :items="actions(row)">
                        <UButton color="gray" variant="ghost" icon="i-heroicons-ellipsis-horizontal-20-solid" />
                    </UDropdown>
                </template>
            </UTable>
        </UDashboardPanel>
    </UDashboardPage>
</template>
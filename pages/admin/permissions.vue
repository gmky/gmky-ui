<script setup lang="ts">
import permissionService from '~/services/permission.service';

definePageMeta({
    middleware: [
        'authority'
    ],
    authority: 'permission:view'
})

const q = ref('')
const isNewPermissionModalOpen = ref(false)

const itemPerPages = ref(10)
const currentPage = ref(1)
const resourceCode = ref('')
const permissionCode = ref('')

const defaultColumns = [{
    key: 'id',
    label: '#'
}, {
    key: 'resourceCode',
    label: 'Resource',
    sortable: true
},{
    key: 'permissionCode',
    label: 'Permission',
    sortable: true
}, {
    key: 'description',
    label: 'Description',
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

const query = computed(() => ({ page: currentPage.value - 1, size: itemPerPages.value, resourceCode: resourceCode.value, permissionCode: permissionCode.value }))
const { data: response, pending: permissionsLoading } = await permissionService.filterPermission(query)
const permissions = computed(() => response.value.data)
const totalItems = computed(() => response.value.meta.total || 0)

// Computed
const columns = computed(() => defaultColumns.filter(column => selectedColumns.value.includes(column)))
</script>
<template>
    <UDashboardPage>
        <UDashboardPanel grow>
            <UDashboardNavbar title="Permission" :badge="totalItems">
                <template #right>
                    <UInput ref="input" v-model="q" icon="i-heroicons-funnel" autocomplete="off"
                        placeholder="Filter permission..." class="hidden lg:block" @keydown.esc="$event.target.blur()">
                        <template #trailing>
                            <UKbd value="/" />
                        </template>
                    </UInput>
                </template>
            </UDashboardNavbar>
            <UDashboardToolbar>
                <template #left>
                    <UInput
                        icon="i-heroicons-magnifying-glass-20-solid"
                        size="sm"
                        color="white"
                        :trailing="false"
                        placeholder="Search resource..."
                        v-model="resourceCode"
                    />
                    <UInput
                        icon="i-heroicons-magnifying-glass-20-solid"
                        size="sm"
                        color="white"
                        :trailing="false"
                        placeholder="Search permission..."
                        v-model="permissionCode"
                    />
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

            <UTable v-model:sort="sort" :rows="permissions" :columns="columns" :loading="permissionsLoading" sort-mode="manual"
                class="w-full" :ui="{ divide: 'divide-gray-200 dark:divide-gray-800' }">
                <template #name-data="{ row }">
                    <div class="flex items-center gap-3">
                        <span class="text-gray-900 dark:text-white font-medium">{{ row.name }}</span>
                    </div>
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
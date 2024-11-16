<script lang="ts" setup>
import ConfirmationModal from '~/components/common/ConfirmationModal.vue';
import RoleForm from '~/components/roles/RoleForm.vue';
import roleService from '~/services/role.service'
import type { Role } from '~/types';

definePageMeta({
    middleware: [
        'authority'
    ],
    authority: 'role:view'
})

const isNewRoleModalOpen = ref(false)

const defaultRoleTypes = ['TEMPLATE', 'CUSTOM']
const selectedRoleTypes = ref([...defaultRoleTypes])

const defaultStatuses = ['ACTIVE', 'IN_ACTIVE']
const selectedStatuses = ref([...defaultStatuses])

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
    key: 'isDefault',
    label: 'Default',
    sortable: true
}, {
    key: 'isEnable',
    label: 'Status',
    sortable: true
}, {
    key: 'actions'
}]

const modal = useModal()
const toast = useToast()

function openSetAsDefaultModal(row: Role) {
    modal.open(ConfirmationModal, {
        title: 'Update role',
        message: row.isDefault ? 'Do you want to remove this role from default role?' : 'Do you want to set this role as default?',
        async onConfirm() {
            const { error } = await roleService.updateById(row.id, { isDefault: !row.isDefault })
            notificationUtil.toastRes(toast, error.value, 'Update role successfully', 'Failed to update role')
            await filterRoles()
            modal.close()
        },
        onClose() {
            modal.close()
        }
    })
}

function openDisableRoleModal(row: Role) {
    modal.open(ConfirmationModal, {
        title: 'Update role',
        message: row.isEnable ? 'Do you want to disable this role?' : 'Do you want to enable this role?',
        async onConfirm() {
            const { error } = await roleService.updateById(row.id, { isEnable: !row.isEnable })
            notificationUtil.toastRes(toast, error.value, 'Update role successfully', 'Failed to update role')
            await filterRoles()
            modal.close()
        },
        async onClose() {
            modal.close()
        }
    })
}
function openDeleteRoleModal(row: Role) {
    modal.open(ConfirmationModal, {
        title: 'Update role',
        message: 'Do you want to delete this role?',
        async onClose() {
            modal.close()
        },
        async onConfirm() {
            const { error } = await roleService.deleteById(row.id)
            notificationUtil.toastRes(toast, error.value, 'Delete role successfully', 'Failed to delete role')
            await filterRoles()
            modal.close()
        }
    })
}

const actions = (row: Role) => [
    [{
        label: 'Edit permission set',
        icon: 'i-heroicons-pencil-square-20-solid',
        click: () => console.log('Edit', row.id)
    }, {
        label: row.isDefault ? 'Remove as default' : 'Set as default',
        icon: 'i-heroicons-exclamation-triangle',
        click: () => {
            openSetAsDefaultModal(row)
        }
    }, {
        label: row.isEnable ? 'Disable' : 'Enable',
        icon: 'i-heroicons-adjustments-vertical',
        click: () => {
            openDisableRoleModal(row)
        }
    }], [{
        label: 'Delete',
        icon: 'i-heroicons-trash',
        click: () => {
            openDeleteRoleModal(row)
        }
    }]
]
const router = useRoute()
const q = ref('')
const itemPerPages = ref(+router.query.size || 10)
const currentPage = ref(+router.query.page || 1)
const selectedColumns = ref(defaultColumns)
const selectedColumnOpts = ref(defaultColumns.filter(item => !!item.label))
const sort = ref({ column: 'id', direction: 'asc' as const })

const query = computed(() => ({ type: selectedRoleTypes.value, page: currentPage.value - 1, size: itemPerPages.value }))

const { data: response, status } = await roleService.filterRole(query);
const rolesLoading = computed(() => status.value == 'pending')
const roles = computed(() => response.value.data || [])
const totalItems = computed(() => response.value.meta.total)

async function filterRoles() {
    const { data, status } = await roleService.filterRole(query);
    response.value = data.value
    status.value = status.value
}

// Computed
const columns = computed(() => defaultColumns.filter(column => selectedColumns.value.includes(column)))
const canCreateRole = await useAuthorize('role:create')

</script>

<template>
    <UDashboardPage>
        <UDashboardPanel grow>
            <UDashboardNavbar title="Roles" :badge="totalItems">
                <template #right>
                    <UInput v-model="q" icon="i-heroicons-funnel" autocomplete="off" placeholder="Filter roles..."
                        class="hidden lg:block" @keydown.esc="$event.target.blur()">
                        <template #trailing>
                            <UKbd value="/" />
                        </template>
                    </UInput>

                    <UButton label="New role" trailing-icon="i-heroicons-plus" color="gray" v-if="canCreateRole"
                        @click="isNewRoleModalOpen = true" />
                </template>
            </UDashboardNavbar>

            <UDashboardModal v-model="isNewRoleModalOpen" title="New user" description="Add a new user to your database"
                v-if="canCreateRole" :ui="{ width: 'sm:max-w-md' }">
                <!-- ~/components/users/UsersForm.vue -->
                <RoleForm @close="isNewRoleModalOpen = false" />
            </UDashboardModal>

            <UDashboardToolbar>
                <template #left>
                    <USelectMenu v-model="selectedRoleTypes" icon="i-heroicons-check-circle" placeholder="No type"
                        multiple :options="defaultRoleTypes" :ui-menu="{ option: { base: 'capitalize' } }" />
                    <USelectMenu v-model="selectedStatuses" icon="i-heroicons-check-circle" placeholder="No type"
                        multiple :options="defaultStatuses" :ui-menu="{ option: { base: 'capitalize' } }" />
                </template>

                <template #right>
                    <UPagination v-model="currentPage" :page-count="+itemPerPages" :total="totalItems"
                        :to="paginationUtil.nextPageLink" />
                    <USelect v-model="itemPerPages" :options="[10, 20, 50, 100]" />
                    <USelectMenu v-model="selectedColumns" icon="i-heroicons-adjustments-horizontal-solid"
                        :options="selectedColumnOpts" multiple class="hidden lg:block">
                        <template #label>
                            Display
                        </template>
                    </USelectMenu>
                </template>
            </UDashboardToolbar>

            <UTable v-model:sort="sort" :rows="roles" :columns="columns" :loading="rolesLoading" sort-mode="manual"
                class="w-full" :ui="{ divide: 'divide-gray-200 dark:divide-gray-800' }">
                <template #name-data="{ row }">
                    <div class="flex items-center gap-3">
                        <span class="text-gray-900 dark:text-white font-medium">{{ row.name }}</span>
                    </div>
                </template>

                <template #type-data="{ row }">
                    <UBadge :label="row.type" :color="row.type === 'TEMPLATE' ? 'green' : 'orange'" variant="subtle"
                        class="capitalize" />
                </template>

                <template #isDefault-data="{ row }">
                    <UBadge :label="row.isDefault ? 'YES' : 'NO'" :color="row.isDefault ? 'green' : 'orange'"
                        variant="subtle" class="capitalize" />
                </template>

                <template #isEnable-data="{ row }">
                    <UBadge :label="row.isEnable ? 'ACTIVE' : 'IN ACTIVE'" :color="row.isEnable ? 'green' : 'red'"
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

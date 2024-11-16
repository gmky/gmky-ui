<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
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

const { t } = useI18n()

const defaultColumns = [{
    key: 'id',
    label: '#'
}, {
    key: 'name',
    label: t('role_table_name'),
    sortable: true
}, {
    key: 'description',
    label: t('role_table_desc'),
    sortable: true
}, {
    key: 'type',
    label: t('role_table_type'),
    sortable: true
}, {
    key: 'isDefault',
    label: t('role_table_default'),
    sortable: true
}, {
    key: 'isEnable',
    label: t('common_table_status'),
    sortable: true
}, {
    key: 'actions'
}]

const modal = useModal()
const toast = useToast()

function openSetAsDefaultModal(row: Role) {
    modal.open(ConfirmationModal, {
        title: t('role_table_update_modal_title'),
        message: row.isDefault ? t('role_table_unset_default_msg') : t('role_table_set_default_msg'),
        async onConfirm() {
            const { error } = await roleService.updateById(row.id, { isDefault: !row.isDefault })
            notificationUtil.toastRes(toast, error.value, t('role_update_success'), t('role_update_failed'))
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
        title: t('role_table_update_modal_title'),
        message: row.isEnable ? t('role_table_disable_msg') : t('role_table_enable_msg'),
        async onConfirm() {
            const { error } = await roleService.updateById(row.id, { isEnable: !row.isEnable })
            notificationUtil.toastRes(toast, error.value, t('role_update_success'), t('role_update_failed'))
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
        title: t('role_table_update_modal_title'),
        message: t('role_table_delete_msg'),
        async onClose() {
            modal.close()
        },
        async onConfirm() {
            const { error } = await roleService.deleteById(row.id)
            notificationUtil.toastRes(toast, error.value, t('role_update_success'), t('role_update_failed'))
            await filterRoles()
            modal.close()
        }
    })
}

const actions = (row: Role) => [
    [{
        label: t('common_table_edit'),
        icon: 'i-heroicons-pencil-square-20-solid',
        click: () => console.log('Edit', row.id)
    }, {
        label: row.isDefault ? t('role_table_action_unset_default_btn') : t('role_table_action_set_default_btn'),
        icon: 'i-heroicons-exclamation-triangle',
        click: () => {
            openSetAsDefaultModal(row)
        }
    }, {
        label: row.isEnable ? t('role_table_action_disable_btn') : t('role_table_action_enable_btn'),
        icon: 'i-heroicons-adjustments-vertical',
        click: () => {
            openDisableRoleModal(row)
        }
    }], [{
        label: t('common_table_delete'),
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
            <UDashboardNavbar :title="$t('role_title')" :badge="totalItems">
                <template #right>
                    <!-- <UInput v-model="q" icon="i-heroicons-funnel" autocomplete="off"
                        :placeholder="$t('role_filter_placeholder')" class="hidden lg:block"
                        @keydown.esc="$event.target.blur()">
                        <template #trailing>
                            <UKbd value="/" />
                        </template>
</UInput> -->

                    <UButton :label="$t('role_create_btn')" trailing-icon="i-heroicons-plus" color="gray"
                        v-if="canCreateRole" @click="isNewRoleModalOpen = true" />
                </template>
            </UDashboardNavbar>

            <UDashboardModal v-model="isNewRoleModalOpen" :title="t('role_create_modal_title')"
                :description="$t('role_create_modal_desc')" v-if="canCreateRole" :ui="{ width: 'sm:max-w-md' }">
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
                            {{ $t('common_table_display') }}
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

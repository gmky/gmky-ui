<script setup lang="ts">
import ConfirmationModal from '~/components/common/ConfirmationModal.vue';
import UpdatePsPermission from '~/components/ps/UpdatePsPermission.vue';
import psService from '~/services/ps.service';
import type { PermissionSet } from '~/types';

definePageMeta({
    middleware: [
        'authority'
    ],
    authority: 'permissionset:view'
})

const q = ref('')
const isNewPSModalOpen = ref(false)
const isUpdatePsModalOpen = ref(false)

const defaultPSTypes = ['TEMPLATE', 'CUSTOM']
const selectedPSTypes = ref([...defaultPSTypes])

const router = useRoute()

const itemPerPages = ref(+router.query.page || 10)
const currentPage = ref(+router.query.size || 1)

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

const modal = useModal()

function openDeleteRoleModal(row: PermissionSet) {
    modal.open(ConfirmationModal, {
        title: 'Delete permission set',
        message: 'Do you want to delete this permission set?',
        async onClose() {
            modal.close()
        },
        async onConfirm() {
            await filterPS()
            modal.close()
        }
    })
}

const selectedPsId = ref(null);

const actions = (row: PermissionSet) => [
    [{
        label: 'Edit permission',
        icon: 'i-heroicons-pencil-square-20-solid',
        click: () => {
            isUpdatePsModalOpen.value = true
            selectedPsId.value = row.id
        }
    }], [{
        label: 'Delete',
        icon: 'i-heroicons-trash',
        click: () => {
            openDeleteRoleModal(row)
        }
    }]
]

const selectedColumns = ref(defaultColumns)
const selectedColumnOpts = ref(defaultColumns.filter(item => !!item.label))
const sort = ref({ column: 'id', direction: 'asc' as const })

const query = computed(() => ({ type: selectedPSTypes.value, page: currentPage.value - 1, size: itemPerPages.value }))
const { data: response, status } = await psService.filterPermissionSet(query)
const psList = computed(() => response.value.data)
const totalItems = computed(() => response.value.meta.total)
const psListLoading = computed(() => status.value == 'pending')

async function filterPS() {
    const { data: r, status: s } = await psService.filterPermissionSet(query)
    response.value = r.value
    status.value = status.value
}

// Computed
const columns = computed(() => defaultColumns.filter(column => selectedColumns.value.includes(column)))
const canCreatePS = await useAuthorize('permissionset:create')
const canUpdatePS = await useAuthorize('permissionset:edit')

</script>
<template>
    <UDashboardPage>
        <UDashboardPanel grow>
            <UDashboardNavbar title="Permission Set" :badge="totalItems">
                <template #right>
                    <UInput ref="input" v-model="q" icon="i-heroicons-funnel" autocomplete="off"
                        placeholder="Filter permission set..." class="hidden lg:block"
                        @keydown.esc="$event.target.blur()">
                        <template #trailing>
                            <UKbd value="/" />
                        </template>
                    </UInput>

                    <UButton label="New permission set" trailing-icon="i-heroicons-plus" color="gray" v-if="canCreatePS"
                        @click="isNewPSModalOpen = true" />
                </template>
            </UDashboardNavbar>

            <UDashboardModal v-model="isNewPSModalOpen" title="New user" description="Add a new user to your database"
                v-if="canCreatePS" :ui="{ width: 'sm:max-w-md' }">
                <!-- ~/components/users/UsersForm.vue -->
                <PsForm @close="isNewPSModalOpen = false" />
            </UDashboardModal>

            <UDashboardModal v-model="isUpdatePsModalOpen" title="Update permission set"
                description="Assign/Unassign permission" v-if="canUpdatePS" :ui="{ width: 'sm:max-w-md' }">
                <UpdatePsPermission @close="isUpdatePsModalOpen = false" :ps-id="selectedPsId" />
            </UDashboardModal>

            <UDashboardToolbar>
                <template #left>
                    <USelectMenu v-model="selectedPSTypes" icon="i-heroicons-check-circle" placeholder="No type"
                        multiple :options="defaultPSTypes" :ui-menu="{ option: { base: 'capitalize' } }" />
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

            <UTable v-model:sort="sort" :rows="psList" :columns="columns" :loading="psListLoading" sort-mode="manual"
                class="w-full" :ui="{ divide: 'divide-gray-200 dark:divide-gray-800' }">
                <template #name-data="{ row }">
                    <div class="flex items-center gap-3">
                        <span class="text-gray-900 dark:text-white font-medium">{{ row.name }}</span>
                    </div>
                </template>

                <template #type-data="{ row }">
                    <UBadge :label="row.type" :color="row.type === 'TEMPLATE' ? 'green' : 'red'" variant="subtle"
                        class="capitalize" />
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
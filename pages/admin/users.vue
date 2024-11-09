<script lang="ts" setup>
import ConfirmationModal from '~/components/common/ConfirmationModal.vue';
import UpdateUserRoleForm from '~/components/users/UpdateUserRoleForm.vue';
import userService from '~/services/user.service';
import type { Role, User } from '~/types'

definePageMeta({
  middleware: [
    'authority'
  ],
  authority: 'user:view'
})

const defaultColumns = [{
  key: 'id',
  label: '#'
}, {
  key: 'username',
  label: 'Username',
  sortable: true
}, {
  key: 'fullName',
  label: 'Full name',
  sortable: true
}, {
  key: 'email',
  label: 'Email',
  sortable: true
}, {
  key: 'status',
  label: 'Status',
  sortable: true
}, {
  key: 'actions'
}]

const q = ref('')
const selectColumnOptions = ref(defaultColumns.filter(item => !!item.label))
const selectedColumns = ref(defaultColumns)
const sort = ref({ column: 'id', direction: 'asc' as const })
const input = ref<{ input: HTMLInputElement }>()
const isNewUserModalOpen = ref(false)
const isUpdateRoleModelOpen = ref(false)

const router = useRoute()

const page = ref(+router.query.page || 1)
const itemPerPages = ref(+router.query.size || 10)

const columns = computed(() => defaultColumns.filter(column => selectedColumns.value.includes(column)))

const initialStatuses = ref(['PENDING', 'ACTIVE', 'LOCKED'])

const defaultStatuses = initialStatuses

const selectedStatuses = ref([...initialStatuses.value])

const query = computed(() => ({ statuses: selectedStatuses.value, page: page.value - 1, size: itemPerPages.value }))

const { data: response, status } = await userService.filterUser(query);
const users = computed(() => response.value.data);
const totalItems = computed(() => response.value.meta.total || 0);

const pending = computed(() => status.value == 'pending')

async function filterUser() {
  const { data: res, status } = await userService.filterUser(query);
  response.value = res.value;
  status.value = status.value
}

async function toggleUserStatus(row: User) {
  const userId = row.userId
  const userStatus = row.status == 'LOCKED' ? 'ACTIVE' : 'LOCKED'
  const { error } = await userService.updateUser(userId, { status: userStatus })
  addToast(error.value, 'Update user successfully', 'Failed to update user')
}

async function closeUpdateRoleModel() {
  isUpdateRoleModelOpen.value = false
}

const modal = useModal()

function openLogoutConfirmationModal(row: User) {
  modal.open(ConfirmationModal, {
    title: 'Logout all sessions of this user',
    message: 'Are you sure to force logout all sessions of this user',
    async onConfirm() {
      const userId = row.userId
      const { error } = await userService.logout(userId)
      addToast(error.value, 'Logout user successfully', 'Failed to logout user')
      modal.close()
    },
    async onClose() {
      modal.close()
    }
  })
}

function openLockUserModal(row: User) {
  modal.open(ConfirmationModal, {
    title: 'Lock user',
    message: row.status == 'ACTIVE' ? 'Are you sure to lock this user' : 'Are your sure to unlock this user',
    async onConfirm() {
      await toggleUserStatus(row)
      await filterUser()
      modal.close()
    },
    async onClose() {
      modal.close()
    }
  })
}

const selectedUserId = ref('');

const items = (row: User) => [
  [
    {
      label: 'Edit role',
      icon: 'i-heroicons-pencil-square-20-solid',
      click: async () => {
        isUpdateRoleModelOpen.value = true
        selectedUserId.value = row.userId
      }
    },
    {
      label: row.status === 'ACTIVE' ? 'Lock' : 'Unlock',
      icon: 'i-heroicons-lock-closed',
      click: async () => {
        openLockUserModal(row)
      }
    }
  ],
  [
    {
      label: 'Logout',
      icon: 'i-heroicons-arrow-left-end-on-rectangle',
      click: () => {
        openLogoutConfirmationModal(row)
      }
    }
  ]
]

const canCreateUser = await useAuthorize('user:create')

defineShortcuts({
  '/': () => {
    input.value?.input?.focus()
  }
})
</script>

<template>
  <UDashboardPage>
    <UDashboardPanel grow>
      <UDashboardNavbar title="Users" :badge="totalItems">
        <template #right>
          <UInput ref="input" v-model="q" icon="i-heroicons-funnel" autocomplete="off" placeholder="Filter users..."
            class="hidden lg:block" @keydown.esc="$event.target.blur()">
            <template #trailing>
              <UKbd value="/" />
            </template>
          </UInput>

          <UButton label="New user" trailing-icon="i-heroicons-plus" color="gray" @click="isNewUserModalOpen = true"
            v-if="canCreateUser" />
        </template>
      </UDashboardNavbar>

      <UDashboardToolbar>
        <template #left>
          <USelectMenu v-model="selectedStatuses" icon="i-heroicons-check-circle" placeholder="No status" multiple
            :options="defaultStatuses" :ui-menu="{ option: { base: 'capitalize' } }" />
        </template>

        <template #right>
          <UPagination v-model="page" :page-count="+itemPerPages" :total="totalItems"
            :to="paginationUtil.nextPageLink" />
          <USelect v-model="itemPerPages" :options="[10, 20, 50, 100]" />
          <USelectMenu v-model="selectedColumns" icon="i-heroicons-adjustments-horizontal-solid"
            :options="selectColumnOptions" multiple class="hidden lg:block">
            <template #label>
              Display
            </template>
          </USelectMenu>
        </template>
      </UDashboardToolbar>

      <UDashboardModal v-model="isNewUserModalOpen" title="New user" description="Add a new user to your database"
        v-if="canCreateUser" :ui="{ width: 'sm:max-w-md' }">
        <!-- ~/components/users/UsersForm.vue -->
        <UsersForm @close="isNewUserModalOpen = false" />
      </UDashboardModal>

      <UDashboardModal v-model="isUpdateRoleModelOpen" title="Update role" description="Update role of user"
        v-if="canCreateUser" :ui="{ width: 'sm:max-w-md' }">
        <UpdateUserRoleForm @close="closeUpdateRoleModel" :user-id="selectedUserId" />
      </UDashboardModal>

      <UTable v-model:sort="sort" :rows="users" :columns="columns" :loading="pending" sort-mode="manual" class="w-full"
        :ui="{ divide: 'divide-gray-200 dark:divide-gray-800' }">
        <template #name-data="{ row }">
          <div class="flex items-center gap-3">
            <UAvatar v-bind="row.avatar" :alt="row.name" size="xs" />

            <span class="text-gray-900 dark:text-white font-medium">{{ row.name }}</span>
          </div>
        </template>

        <template #status-data="{ row }">
          <UBadge :label="row.status"
            :color="row.status === 'ACTIVE' ? 'green' : row.status === 'PENDING' ? 'blue' : row.status === 'BANNED' ? 'orange' : row.status === 'LOCKED' ? 'red' : 'black'"
            variant="subtle" class="capitalize" />
        </template>

        <template #actions-data="{ row }">
          <UDropdown :items="items(row)">
            <UButton color="gray" variant="ghost" icon="i-heroicons-ellipsis-horizontal-20-solid" />
          </UDropdown>
        </template>
      </UTable>
      <UContainer class="flex mt-2 items-end">

      </UContainer>
    </UDashboardPanel>
  </UDashboardPage>
</template>

<script lang="ts" setup>
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

const page = ref(1)
const itemPerPages = ref(10)

const columns = computed(() => defaultColumns.filter(column => selectedColumns.value.includes(column)))

const initialStatuses = ref(['PENDING', 'ACTIVE', 'LOCKED'])

const defaultStatuses = initialStatuses

const selectedStatuses = ref([...initialStatuses.value])

const query = computed(() => ({ statuses: selectedStatuses.value, page: page.value - 1, size: itemPerPages.value }))
const users = ref([] as User[])
const totalItems = ref(0)
const pending = ref(false)

await filterUser()

async function filterUser() {
  const { data: response, pending: loading } = await userService.filterUser(query);
  users.value = response.value.data;
  totalItems.value = response.value.meta.total || 0
  pending.value = loading.value
}

async function toggleUserStatus(row: User) {
  const userId = row.userId
  const userStatus = row.status == 'LOCKED' ? 'ACTIVE' : 'LOCKED'
  const { error } = await userService.updateUser(userId, { status: userStatus })
  addToast(error.value, 'Update user successfully', 'Failed to update user')
}

async function logoutByUserId(row: User) {
  const userId = row.userId
  const { error } =  await userService.logout(userId)
  addToast(error.value, 'Logout user successfully', 'Failed to logout user')
}

async function closeUpdateRoleModel() {
  isUpdateRoleModelOpen.value = false
}

const selectedUserId = ref('');

const items = (row: User) => [
  [
    {
      label: 'Update role',
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
        await toggleUserStatus(row)
        await filterUser()
      }
    }
  ],
  [
    {
      label: 'Logout',
      icon: 'i-heroicons-arrow-left-end-on-rectangle',
      click: () => logoutByUserId(row)
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

          <UButton label="New user" trailing-icon="i-heroicons-plus" color="gray" @click="isNewUserModalOpen = true" v-if="canCreateUser" />
        </template>
      </UDashboardNavbar>

      <UDashboardToolbar>
        <template #left>
          <USelectMenu v-model="selectedStatuses" icon="i-heroicons-check-circle" placeholder="No status" multiple
            :options="defaultStatuses" :ui-menu="{ option: { base: 'capitalize' } }" />
        </template>

        <template #right>
          <UPagination v-model="page" :page-count="+itemPerPages" :total="totalItems" />
          <USelect v-model="itemPerPages" :options="[10, 20, 50, 100]" />
          <USelectMenu v-model="selectedColumns" icon="i-heroicons-adjustments-horizontal-solid"
            :options="selectColumnOptions" multiple class="hidden lg:block">
            <template #label>
              Display
            </template>
          </USelectMenu>
        </template>
      </UDashboardToolbar>

      <UDashboardModal v-model="isNewUserModalOpen" title="New user" description="Add a new user to your database" v-if="canCreateUser"
        :ui="{ width: 'sm:max-w-md' }">
        <!-- ~/components/users/UsersForm.vue -->
        <UsersForm @close="isNewUserModalOpen = false" />
      </UDashboardModal>

      <UDashboardModal v-model="isUpdateRoleModelOpen" title="Update role" description="Update role of user" v-if="canCreateUser"
        :ui="{ width: 'sm:max-w-md' }">
        <UpdateUserRoleForm @close="closeUpdateRoleModel" :user-id="selectedUserId" />
      </UDashboardModal>

      <UTable v-model:sort="sort" :rows="users" :columns="columns" :loading="pending"
        sort-mode="manual" class="w-full" :ui="{ divide: 'divide-gray-200 dark:divide-gray-800' }">
        <template #name-data="{ row }">
          <div class="flex items-center gap-3">
            <UAvatar v-bind="row.avatar" :alt="row.name" size="xs" />

            <span class="text-gray-900 dark:text-white font-medium">{{ row.name }}</span>
          </div>
        </template>

        <template #status-data="{ row }">
          <UBadge :label="row.status"
            :color="row.status === 'ACTIVE' ? 'green' : row.status === 'PENDING' ? 'blue' : row.status === 'BANNED' ? 'orange' : row.status === 'LOCKED' ? 'red' : 'back'"
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

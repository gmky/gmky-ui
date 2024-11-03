<script lang="ts" setup>
import userService from '~/services/user.service';
import type { User } from '~/types'

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
const selected = ref<User[]>([])
const selectColumnOptions = ref(defaultColumns.filter(item => !!item.label))
const selectedColumns = ref(defaultColumns)
const sort = ref({ column: 'id', direction: 'asc' as const })
const input = ref<{ input: HTMLInputElement }>()
const isNewUserModalOpen = ref(false)

const page = ref(1)
const itemPerPages = ref(10)

const columns = computed(() => defaultColumns.filter(column => selectedColumns.value.includes(column)))

const initialStatuses = ref(['PENDING', 'ACTIVE', 'LOCKED'])

const defaultStatuses = initialStatuses

const selectedStatuses = ref([...initialStatuses.value])

const query = computed(() => ({ statuses: selectedStatuses.value, page: page.value - 1, size: itemPerPages.value }))

const { data: response, pending } = await userService.filterUser(query);
const users = computed(() => response.value.data);
const totalItems = computed(() => response.value.meta.total || 0)

function onSelect(row: User) {
  const index = selected.value.findIndex(item => item.id === row.id)
  if (index === -1) {
    selected.value.push(row)
  } else {
    selected.value.splice(index, 1)
  }
}

async function toggleUserStatus(row: User) {
  const userId = row.userId
  const userStatus = row.status == 'LOCKED' ? 'ACTIVE' : 'LOCKED'
  const { error } = await userService.updateUser(userId, { status: userStatus })
  addToast(error.value, 'Create new user successfully', 'Failed to create new user')
}

const items = (row) => [
  [{
    label: 'Edit',
    icon: 'i-heroicons-pencil-square-20-solid',
    click: () => console.log('Edit', row.id)
  }, {
    label: row.status === 'ACTIVE' ? 'Lock' : 'Unlock',
    icon: 'i-heroicons-lock-closed',
    click: () => toggleUserStatus(row)
  }], [{
    label: 'Attach role',
    icon: 'i-heroicons-link'
  }, {
    label: 'Detach role',
    icon: 'i-heroicons-x-mark'
  }], [{
    label: 'Logout',
    icon: 'i-heroicons-arrow-left-end-on-rectangle'
  }]
]

const hasUserCreate = await useAuthorize('user:create')

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

          <UButton label="New user" trailing-icon="i-heroicons-plus" color="gray" @click="isNewUserModalOpen = true" v-if="hasUserCreate" />
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

      <UDashboardModal v-model="isNewUserModalOpen" title="New user" description="Add a new user to your database"
        :ui="{ width: 'sm:max-w-md' }">
        <!-- ~/components/users/UsersForm.vue -->
        <UsersForm @close="isNewUserModalOpen = false" />
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

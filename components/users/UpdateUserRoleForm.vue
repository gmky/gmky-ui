<script setup lang="ts">
import type { FormSubmitEvent } from '#ui/types'
import roleService from '~/services/role.service';
import userService from '~/services/user.service';
import type { Role } from '~/types';

const props = defineProps({
  userId: String
})

const emit = defineEmits(['close'])

const state = reactive({
  roles: []
})

const selected = ref([] as Role[])
const roleLoading = ref(false)
const originalRoles = ref([] as Role[])

const { data: assignedRoles } = await userService.getAssignedRoleByUserId(props.userId)
selected.value = assignedRoles.value
originalRoles.value = assignedRoles.value

async function searchRole(q: string) {
  roleLoading.value = true

  const query = { type: ['TEMPLATE', 'CUSTOM'], name: q, size: 50 }
  const { data: response } = await roleService.filterRole(query)

  roleLoading.value = false

  return response.value.data
}
const toast = useToast()
async function onSubmit(event: FormSubmitEvent<any>) {
  const originalRoleIds = originalRoles.value.map(item => item.id);
  const selectedIds = selected.value.map(item => item.id);
  const deletedIds = originalRoleIds.filter(item => !selectedIds.includes(item))
  const addedIds = selectedIds.filter(item => !originalRoleIds.includes(item))
  const data = {
    removedRoles: deletedIds,
    addedRoles: addedIds
  }
  const { error } = await userService.updateUser(props.userId, data);
  notificationUtil.toastRes(toast, error.value, 'Update user role successfully', 'Failed to update user role')
  emit('close')
}
</script>

<template>
  <UForm :state="state" class="space-y-4" @submit="onSubmit">
    <UFormGroup label="Role" name="role">
      <template #description>
        <UBadge class="mx-1 my-1" v-for="item in selected" color="white" variant="solid">{{ item.name }}</UBadge>
      </template>
      <USelectMenu v-model="selected" :loading="roleLoading" :searchable="searchRole"
        placeholder="Search for a roles..." class="space-y-2 space-x-4" option-attribute="name" multiple trailing
        by="id">
      </USelectMenu>
    </UFormGroup>

    <div class="flex justify-end gap-3">
      <UButton label="Cancel" color="gray" variant="ghost" @click="emit('close')" />
      <UButton type="submit" label="Save" color="black" />
    </div>
  </UForm>
</template>

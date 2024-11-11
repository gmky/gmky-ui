<script setup lang="ts">
import type { FormSubmitEvent } from '#ui/types'
import permissionService from '~/services/permission.service';
import psService from '~/services/ps.service';
import type { Permission } from '~/types';

const props = defineProps({
  psId: Number
})

const emit = defineEmits(['close'])

const state = reactive({
  permissions: []
})

const selected = ref([] as Permission[])
const permissionLoading = ref(false)
const originalPermissions = ref([] as Permission[])

const { data: assignedPermissions } = await psService.getAssignedPermission(props.psId)
selected.value = assignedPermissions.value
originalPermissions.value = assignedPermissions.value

async function searchPermission(q: string) {
  permissionLoading.value = true

  const query = { name: q, size: 50 }
  const { data: response } = await permissionService.filterPermission(query)

  permissionLoading.value = false

  return response.value.data
}

const toast = useToast()

async function onSubmit(event: FormSubmitEvent<any>) {
  const originalPermissionIds = originalPermissions.value.map(item => item.id);
  const selectedIds = selected.value.map(item => item.id);
  const deletedIds = originalPermissionIds.filter(item => !selectedIds.includes(item))
  const addedIds = selectedIds.filter(item => !originalPermissionIds.includes(item))
  const data = {
    removedPermission: deletedIds,
    addedPermission: addedIds
  }
  const { error } = await psService.updatePs(props.psId, data);
  notificationUtil.toastRes(toast, error.value, 'Update permission set successfully', 'Failed to update permission set')
  emit('close')
}
</script>

<template>
  <UForm :state="state" class="space-y-4" @submit="onSubmit">
    <UFormGroup label="Permission Set" name="permission-set">
      <template #description>
        <UBadge class="mx-1 my-1" v-for="item in selected" color="white" variant="solid">{{ item.resourceCode }} - {{
          item.permissionCode }}</UBadge>
      </template>
      <USelectMenu v-model="selected" :loading="permissionLoading" :searchable="searchPermission"
        placeholder="Search for a permission..." class="space-y-2 space-x-4" option-attribute="name" multiple trailing
        by="id">
        <template #option="{ option: permission }">
          <span class="truncate">{{ permission.resourceCode }} - {{ permission.permissionCode }}</span>
        </template>
      </USelectMenu>
    </UFormGroup>

    <div class="flex justify-end gap-3">
      <UButton label="Cancel" color="gray" variant="ghost" @click="emit('close')" />
      <UButton type="submit" label="Save" color="black" />
    </div>
  </UForm>
</template>

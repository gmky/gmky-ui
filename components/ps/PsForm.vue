<script setup lang="ts">
import type { FormError, FormSubmitEvent } from '#ui/types'
import permissionService from '~/services/permission.service';
import psService from '~/services/ps.service';
import type { Permission } from '~/types';

const emit = defineEmits(['close'])

const toast = useToast()

const state = reactive({
  name: 'ViewPermissionOnly',
  description: 'This permission set only contains permission to view list permissions',
  permissionIds: []
})

// https://ui.nuxt.com/components/form
const validate = (state: any): FormError[] => {
  const errors = []
  if (!state.name) errors.push({ path: 'name', message: 'Please enter permission set name.' })
  if (!state.description) errors.push({ path: 'description', message: 'Please enter permission set description' })
  return errors
}

async function onSubmit(event: FormSubmitEvent<any>) {
  state.permissionIds = selected.value.map(item => item.id)
  const { error } = await psService.createPermissionSet(state);
  notificationUtil.toastRes(toast, error.value, 'Create new permission set successfully', 'Failed to create new permission set')
  emit('close')
}

const permissionLoading = ref(false)
const selected = ref([] as Permission[])
async function searchPermission(q: string) {
  permissionLoading.value = true

  const query = { type: ['TEMPLATE', 'CUSTOM'], permissionCode: q, size: 50 }
  const { data: response } = await permissionService.filterPermission(query)

  permissionLoading.value = false

  return response.value.data
}
</script>

<template>
  <UForm
    :validate="validate"
    :validate-on="['submit', 'input']"
    :state="state"
    class="space-y-4"
    @submit="onSubmit"
  >
    <UFormGroup
      label="Name"
      name="name"
    >
      <UInput
        v-model="state.name"
        type="text"
        placeholder="Permission set name"
      />
    </UFormGroup>

    <UFormGroup
      label="Description"
      name="description"
    >
      <UInput
        v-model="state.description"
        type="text"
        placeholder="Enter permission set description"
      />
    </UFormGroup>

    <UFormGroup
      label="Permission"
      name="permission"
    >
      <template #description>
        <UBadge class="mx-1 my-1" v-for="item in selected" color="white" variant="solid">{{ item.resourceCode }} - {{ item.permissionCode }}</UBadge>
      </template>
      <USelectMenu
        v-model="selected"
        :loading="permissionLoading"
        :searchable="searchPermission"
        placeholder="Search for a privilege..."
        class="space-y-2 space-x-4"
        multiple
        trailing
        by="id"
      >
        <template #option="{ option: permission }">
          <span class="truncate">{{ permission.resourceCode }} - {{ permission.permissionCode }}</span>
        </template>
      </USelectMenu>
    </UFormGroup>

    <div class="flex justify-end gap-3">
      <UButton
        label="Cancel"
        color="gray"
        variant="ghost"
        @click="emit('close')"
      />
      <UButton
        type="submit"
        label="Save"
        color="black"
      />
    </div>
  </UForm>
</template>

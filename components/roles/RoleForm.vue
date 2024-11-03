<script setup lang="ts">
import type { FormError, FormSubmitEvent } from '#ui/types'
import psService from '~/services/ps.service';
import roleService from '~/services/role.service';

const emit = defineEmits(['close'])

const state = reactive({
  name: undefined,
  description: undefined,
  isEnable: 1,
  isDefault: 0,
  psIdList: []
})

const isEnableOpts = [{
  value: 1,
  name: 'ACTIVE'
},
{
  value: 0,
  name: 'INACTIVE'
}]

const isDefaultOpts = [
  {
    value: 1,
    name: 'YES'
  },
  {
    value: 0,
    name: 'NO'
  }
]

// https://ui.nuxt.com/components/form
const validate = (state: any): FormError[] => {
  const errors = []
  if (!state.name) errors.push({ path: 'name', message: 'Please enter your name.' })
  if (!state.description) errors.push({ path: 'description', message: 'Please enter role description' })
  if (state.isEnable == undefined) errors.push({ path: 'is-enable', message: 'Please enter if enable.' })
  if (state.isDefault == undefined) errors.push({ path: 'is-default', message: 'Please enter if default.' })
  return errors
}

// const { $toast } = useNuxtApp()
async function onSubmit(event: FormSubmitEvent<any>) {
  state.psIdList = selected.value.map(item => item.id);
  const { error } = await roleService.createRole(state);
  addToast(error.value, 'Create role successfully', 'Failed to create role')
  emit('close')
}

const psLoading = ref(false)
const selected = ref([])
async function searchPermissionSet(q: string) {
  psLoading.value = true
  const query = { type: ['TEMPLATE', 'CUSTOM'], name: q}
  const { data: response } = await psService.filterPermissionSet(query)

  psLoading.value = false

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
        placeholder="Role name"
      />
    </UFormGroup>

    <UFormGroup
      label="Description"
      name="description"
    >
      <UInput
        v-model="state.description"
        type="text"
        placeholder="Enter role description"
      />
    </UFormGroup>

    <UFormGroup
      label="Enable"
      name="is-enable"
    >
      <USelect v-model="state.isEnable" :options="isEnableOpts" option-attribute="name" />
    </UFormGroup>

    <UFormGroup
      label="Default"
      name="is-default"
    >
      <USelect v-model="state.isDefault" :options="isDefaultOpts" option-attribute="name" />
    </UFormGroup>

    <UFormGroup
      label="Permission Set"
      name="permission-set"
    >
      <USelectMenu
        v-model="selected"
        :loading="psLoading"
        :searchable="searchPermissionSet"
        :searchable-lazy="true"
        placeholder="Search for a permission set..."
        class="space-y-2 space-x-4"
        option-attribute="name"
        multiple
        trailing
      />
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

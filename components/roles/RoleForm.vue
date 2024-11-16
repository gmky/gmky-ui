<script setup lang="ts">
import type { FormError, FormSubmitEvent } from '#ui/types'
import { useI18n } from 'vue-i18n';
import psService from '~/services/ps.service';
import roleService from '~/services/role.service';
import type { PermissionSet } from '~/types';

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

const { t } = useI18n()

// https://ui.nuxt.com/components/form
const validate = (state: any): FormError[] => {
  const errors = []
  if (!state.name) errors.push({ path: 'name', message: t('role_create_form_name_validation_msg') })
  if (!state.description) errors.push({ path: 'description', message: t('role_create_form_desc_validation_msg') })
  if (state.isEnable == undefined) errors.push({ path: 'is-enable', message: t('role_create_form_status_validation_msg') })
  if (state.isDefault == undefined) errors.push({ path: 'is-default', message: t('role_create_form_default_validation_msg') })
  return errors
}

const toast = useToast()
async function onSubmit(event: FormSubmitEvent<any>) {
  state.psIdList = selected.value.map(item => item.id);
  const { error } = await roleService.createRole(state);
  notificationUtil.toastRes(toast, error.value, t('role_create_form_success'), t('role_create_form_failed'))
  emit('close')
}

const psLoading = ref(false)
const selected = ref([] as PermissionSet[])
async function searchPermissionSet(q: string) {
  psLoading.value = true
  const query = { type: ['TEMPLATE', 'CUSTOM'], name: q }
  const { data: response } = await psService.filterPermissionSet(query)

  psLoading.value = false

  return response.value.data

}
</script>

<template>
  <UForm :validate="validate" :validate-on="['submit', 'input']" :state="state" class="space-y-4" @submit="onSubmit">
    <UFormGroup :label="t('role_create_form_name_label')" name="name">
      <UInput v-model="state.name" type="text" placeholder="Role name" />
    </UFormGroup>

    <UFormGroup :label="t('role_create_form_desc_label')" name="description">
      <UInput v-model="state.description" type="text" placeholder="Enter role description" />
    </UFormGroup>

    <UFormGroup :label="t('role_create_form_status_label')" name="is-enable">
      <USelect v-model="state.isEnable" :options="isEnableOpts" option-attribute="name" />
    </UFormGroup>

    <UFormGroup :label="t('role_create_form_default_label')" name="is-default">
      <USelect v-model="state.isDefault" :options="isDefaultOpts" option-attribute="name" />
    </UFormGroup>

    <UFormGroup :label="t('role_create_form_ps_label')" name="permission-set">
      <template #description>
        <UBadge class="mx-1 my-1" v-for="item in selected" color="white" variant="solid">{{ item.name }}</UBadge>
      </template>
      <USelectMenu v-model="selected" :loading="psLoading" :searchable="searchPermissionSet" :searchable-lazy="true"
        :placeholder="$t('role_create_form_ps_search_ph')" class="space-y-2 space-x-4" option-attribute="name" multiple
        trailing by="id" />
    </UFormGroup>

    <div class="flex justify-end gap-3">
      <UButton :label="$t('common_form_cancel')" color="gray" variant="ghost" @click="emit('close')" />
      <UButton type="submit" :label="$t('common_form_save')" color="black" />
    </div>
  </UForm>
</template>

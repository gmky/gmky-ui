<script setup lang="ts">
import type { FormError, FormSubmitEvent } from '#ui/types'
import { useI18n } from 'vue-i18n';
import linkageService from '~/services/linkage.service';

const emit = defineEmits(['close'])

const toast = useToast()

const { t } = useI18n()

const state = reactive({
  domain: "http://localhost",
  username: "Hoangphuc67898888@gmail.com",
  password: "Linh1991"
})

// https://ui.nuxt.com/components/form
const validate = (state: any): FormError[] => {
  const errors = []
  if (!state.domain) errors.push({ path: 'name', message: t('linkage_create_form_domain_validation') })
  if (!state.username) errors.push({ path: 'username', message: t('linkage_create_form_username_validation') })
  if (!state.password) errors.push({ path: 'password', message: t('linkage_create_form_password_validation') })
  return errors
}

async function onSubmit(event: FormSubmitEvent<any>) {
  const { error } = await linkageService.createLinkage(state);
  notificationUtil.toastRes(toast, error.value, t('linkage_create_form_link_success'), t('linkage_create_form_link_failed'))
  emit('close')
}

</script>

<template>
  <UForm :validate="validate" :validate-on="['submit', 'input']" :state="state" class="space-y-4" @submit="onSubmit">
    <UFormGroup :label="$t('linkage_create_form_domain')" name="domain">
      <UInput v-model="state.domain" type="text" :placeholder="$t('linkage_creat_form_domain_ph')" />
    </UFormGroup>

    <UFormGroup :label="$t('linkage_create_form_username')" name="username">
      <UInput v-model="state.username" type="text" :placeholder="$t('linkage_create_form_username_ph')" />
    </UFormGroup>

    <UFormGroup :label="$t('linkage_create_form_password')" name="password">
      <UInput v-model="state.password" type="password" :placeholder="$t('linkage_create_form_password_ph')" />
    </UFormGroup>

    <div class="flex justify-end gap-3">
      <UButton :label="$t('common_form_cancel')" color="gray" variant="ghost" @click="emit('close')" />
      <UButton type="submit" :label="$t('common_form_save')" color="black" />
    </div>
  </UForm>
</template>

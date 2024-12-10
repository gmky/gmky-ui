<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import authService from '~/services/auth.service';

definePageMeta({
  layout: 'guest',
  auth: {
    unauthenticatedOnly: true,
    navigateAuthenticatedTo: '/admin'
  }
})

useSeoMeta({
  title: 'Sign up'
})

const { t } = useI18n()

const fields = [{
  name: 'firstName',
  type: 'text',
  label: t('register_form_first_name_label'),
  placeholder: t('register_form_first_name_ph')
}, {
  name: 'lastName',
  type: 'text',
  label: t('register_form_last_name_label'),
  placeholder: t('register_form_last_name_ph')
}, {
  name: 'username',
  type: 'text',
  label: t('register_form_username_label'),
  placeholder: t('register_form_username_ph')
}, {
  name: 'email',
  type: 'email',
  label: t('register_form_email_label'),
  placeholder: t('register_form_email_ph')
}, {
  name: 'password',
  label: t('register_form_password_label'),
  type: 'password',
  placeholder: t('register_form_password_ph')
}]

const validate = (state: any) => {
  const errors = []
  if (!state.email) errors.push({ path: 'email', message: 'Email is required' })
  if (!state.password) errors.push({ path: 'password', message: 'Password is required' })
  return errors
}

const router = useRouter()
const toast = useToast()

const failedToRegister = ref(false)
const loading = ref(false)

async function onSubmit(data: any) {
  failedToRegister.value = false
  loading.value = true
  const { error } = await authService.register(data);
  if (error.value) {
    failedToRegister.value = true
  } else {
    toast.add({
      color: 'green',
      title: t('register_success_msg')
    })
    router.push('/admin/login')
  }
  loading.value = false
}
</script>

<!-- eslint-disable vue/multiline-html-element-content-newline -->
<!-- eslint-disable vue/singleline-html-element-content-newline -->
<template>
  <ClientOnly>
    <UContainer class="flex items-center justify-center h-screen">
      <UCard class="max-w-sm w-full bg-white/75 dark:bg-white/5 backdrop-blur">
        <UAuthForm :fields="fields" :validate="validate" :title="$t('register_form_title')" :loading="loading"
          :ui="{ base: 'text-center', footer: 'text-center' }"
          :submit-button="{ label: $t('register_form_submit_btn') }" @submit="onSubmit">
          <template #description>
            {{ $t('register_form_msg') }} <NuxtLink to="/admin/login" class="text-primary font-medium">{{
              $t('register_form_login_link') }}</NuxtLink>.
          </template>

          <template #validation>
            <UAlert v-if="failedToRegister" color="red" icon="i-heroicons-information-circle-20-solid"
              :title="$t('register_result_error')" />
          </template>

          <template #footer>
            By signing up, you agree to our <NuxtLink to="/" class="text-primary font-medium">Terms of Service
            </NuxtLink>.
          </template>
        </UAuthForm>
      </UCard>
    </UContainer>
  </ClientOnly>
</template>
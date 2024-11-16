<script setup lang="ts">
import type { FormError, FormSubmitEvent } from '#ui/types'
import roleService from '~/services/role.service';
import userService from '~/services/user.service';
import type { Role } from '~/types';

const emit = defineEmits(['close'])

const state = reactive({
  firstName: undefined,
  lastName: undefined,
  email: undefined,
  username: undefined,
  password: undefined,
  passwordConfirmation: undefined,
  isTemporaryPassword: false,
  emailVerified: true,
  status: 'PENDING',
  roles: []
})

const statusOpts = ref(['PENDING', 'ACTIVE', 'LOCKED'])

// https://ui.nuxt.com/components/form
const validate = (state: any): FormError[] => {
  const errors = []
  if (!state.username) errors.push({ path: 'username', message: 'Please enter your username.' })
  if (!state.password) errors.push({ path: 'password', message: 'Please enter your password.' })
  if (!state.passwordConfirmation) errors.push({ path: 'password-confirmation', message: 'Please re-enter your password.' })
  if (!state.firstName) errors.push({ path: 'fist-name', message: 'Please enter first name.' })
  if (!state.lastName) errors.push({ path: 'last-name', message: 'Please enter last name.' })
  if (!state.email) errors.push({ path: 'email', message: 'Please enter an email.' })
  if (state.password && state.passwordConfirmation && state.password != state.passwordConfirmation) errors.push({ path: 'password-confirmation', message: 'Passwords do not match.' })
  return errors
}

const selected = ref([] as Role[])
const roleLoading = ref(false)
async function searchRole(q: string) {
  roleLoading.value = true

  const query = { type: ['TEMPLATE', 'CUSTOM'], name: q, size: 50 }
  const { data: response } = await roleService.filterRole(query)

  roleLoading.value = false

  return response.value.data
}

const toast = useToast()

async function onSubmit(event: FormSubmitEvent<any>) {
  state.roles = selected.value.map(item => item.id);
  const { error } = await userService.createUser(state);
  notificationUtil.toastRes(toast, error.value, 'Create new user successfully', 'Failed to create new user')
  emit('close')
}
</script>

<template>
  <UForm :validate="validate" :validate-on="['submit', 'input']" :state="state" class="space-y-4" @submit="onSubmit">
    <UFormGroup :label="$t('user_create_form_username_label')" name="username">
      <UInput v-model="state.username" type="username" placeholder="gmky" />
    </UFormGroup>

    <UFormGroup :label="$t('user_create_form_password_label')" name="password">
      <UInput v-model="state.password" type="password" placeholder="Enter your password" />
    </UFormGroup>

    <UFormGroup :label="$t('user_create_form_re_pass_label')" name="password-confirmation">
      <UInput v-model="state.passwordConfirmation" type="password" placeholder="Re-enter your password" />
    </UFormGroup>

    <UFormGroup :label="$t('user_create_form_first_name_label')" name="first-name">
      <UInput v-model="state.firstName" placeholder="John" autofocus />
    </UFormGroup>

    <UFormGroup :label="$t('user_create_form_last_name_label')" name="last-name">
      <UInput v-model="state.lastName" placeholder="Doe" autofocus />
    </UFormGroup>

    <UFormGroup label="Email" name="email">
      <UInput v-model="state.email" type="email" placeholder="john.doe@example.com" />
    </UFormGroup>

    <UFormGroup :label="$t('user_create_form_status_label')" name="status">
      <USelect v-model="state.status" :options="statusOpts" />
    </UFormGroup>

    <UFormGroup :label="$t('user_create_form_role_label')" name="role">
      <template #description>
        <UBadge class="mx-1 my-1" v-for="item in selected" color="white" variant="solid">{{ item.name }}</UBadge>
      </template>
      <USelectMenu v-model="selected" :loading="roleLoading" :searchable="searchRole"
        :placeholder="$t('user_create_form_role_search_placeholder_label')" class="space-y-2 space-x-4"
        option-attribute="name" multiple trailing by="id">
      </USelectMenu>
    </UFormGroup>

    <div class="flex justify-end gap-3">
      <UButton :label="$t('common_form_cancel')" color="gray" variant="ghost" @click="emit('close')" />
      <UButton type="submit" :label="$t('common_form_save')" color="black" />
    </div>
  </UForm>
</template>

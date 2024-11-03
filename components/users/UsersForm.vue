<script setup lang="ts">
import type { FormError, FormSubmitEvent } from '#ui/types'

const emit = defineEmits(['close'])

const state = reactive({
  name: undefined,
  email: undefined,
  username: undefined,
  password: undefined,
  passwordConfirmation: undefined
})

// https://ui.nuxt.com/components/form
const validate = (state: any): FormError[] => {
  const errors = []
  if (!state.username) errors.push({ path: 'username', message: 'Please enter your username.' })
  if (!state.password) errors.push({ path: 'password', message: 'Please enter your password.' })
  if (!state.passwordConfirmation) errors.push({ path: 'password-confirmation', message: 'Please re-enter your password.' })
  if (!state.name) errors.push({ path: 'name', message: 'Please enter a name.' })
  if (!state.email) errors.push({ path: 'email', message: 'Please enter an email.' })
  if (state.password && state.passwordConfirmation && state.password != state.passwordConfirmation) errors.push({ path: 'password-confirmation', message: 'Passwords do not match.' })
  return errors
}

async function onSubmit(event: FormSubmitEvent<any>) {
  // Do something with data
  console.log(event.data)

  emit('close')
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
      label="Username"
      name="username"
    >
      <UInput
        v-model="state.username"
        type="username"
        placeholder="gmky"
      />
    </UFormGroup>

    <UFormGroup
      label="Password"
      name="password"
    >
      <UInput
        v-model="state.password"
        type="password"
        placeholder="Enter your password"
      />
    </UFormGroup>

    <UFormGroup
      label="Password Confirmation"
      name="password-confirmation"
    >
      <UInput
        v-model="state.passwordConfirmation"
        type="password"
        placeholder="Re-enter your password"
      />
    </UFormGroup>

    <UFormGroup
      label="Name"
      name="name"
    >
      <UInput
        v-model="state.name"
        placeholder="John Doe"
        autofocus
      />
    </UFormGroup>

    <UFormGroup
      label="Email"
      name="email"
    >
      <UInput
        v-model="state.email"
        type="email"
        placeholder="john.doe@example.com"
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

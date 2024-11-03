<script setup lang="ts">
import type { FormError } from '#ui/types'
import authService from '~/services/auth.service';
import { useAuthStore } from '~/stores/auth';

definePageMeta({
    layout: 'guest',
    auth: {
        unauthenticatedOnly: true,
        navigateAuthenticatedTo: '/admin'
    }
})

const { signIn } = useAuth()

const loading = ref(false)

const failedToLogin = ref(false)

const fields = [{
    name: 'username',
    type: 'text',
    label: 'Username',
    placeholder: 'Enter your username'
}, {
    name: 'password',
    label: 'Password',
    type: 'password',
    placeholder: 'Enter your password'
}, {
    name: 'remember',
    label: 'Remember me',
    type: 'checkbox'
}]

const validate = (state: any) => {
    const errors: FormError[] = []
    if (!state.username) errors.push({ path: 'username', message: 'Username is required' })
    if (!state.password) errors.push({ path: 'password', message: 'Password is required' })
    return errors
}

async function onSubmit(data: any) {
    try {
        const authStore = useAuthStore()
        loading.value = true
        await signIn({ ...data }, { redirect: true, callbackUrl: '/admin', external: false })
        await authStore.getAuthorities()
    } catch (ex) {
        loading.value = false
        failedToLogin.value = true
    }
}
</script>

<!-- eslint-disable vue/multiline-html-element-content-newline -->
<!-- eslint-disable vue/singleline-html-element-content-newline -->
<template>
    <ClientOnly>
        <UContainer class="flex items-center justify-center h-screen">
            <UCard class="max-w-sm w-full">
                <UAuthForm :fields="fields" :validate="validate" title="Welcome back!" align="top" :loading="loading"
                    icon="i-heroicons-lock-closed" :ui="{ base: 'text-center', footer: 'text-center' }"
                    @submit="onSubmit">
                    <template #description>
                        Login with your username and password
                    </template>

                    <template #password-hint>
                        <NuxtLink to="/" class="text-primary font-medium">Forgot password?</NuxtLink>
                    </template>
                    <template #validation>
                        <UAlert v-if="failedToLogin" color="red" icon="i-heroicons-information-circle-20-solid"
                            title="Error signing in" />
                    </template>
                    <template #footer>
                        By signing in, you agree to our <NuxtLink to="/" class="text-primary font-medium">Terms of
                            Service
                        </NuxtLink>.
                    </template>
                </UAuthForm>
            </UCard>
        </UContainer>
    </ClientOnly>
</template>

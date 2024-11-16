<script setup lang="ts">
import type { FormError } from '#ui/types'
import { useI18n } from 'vue-i18n';
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

const { t } = useI18n()

const failedToLogin = ref(false)

const fields = [{
    name: 'username',
    type: 'text',
    label: t('login_form_username_label'),
    placeholder: t('login_form_username_validation_msg')
}, {
    name: 'password',
    label: t('login_form_password_label'),
    type: 'password',
    placeholder: t('login_form_password_validation_msg')
}, {
    name: 'remember',
    label: t('login_form_remember_me_label'),
    type: 'checkbox'
}]

const runtimeConfig = useRuntimeConfig()

const validate = (state: any) => {
    const errors: FormError[] = []
    if (!state.username) errors.push({ path: 'username', message: t('login_form_username_validation_msg') })
    if (!state.password) errors.push({ path: 'password', message: t('login_form_password_validation_msg') })
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
                <UAuthForm :fields="fields" :validate="validate" :title="$t('login_form_title')" align="top"
                    :loading="loading" icon="i-heroicons-lock-closed"
                    :ui="{ base: 'text-center', footer: 'text-center' }" @submit="onSubmit">
                    <template #description>
                        {{ $t('login_form_msg') }}
                    </template>

                    <template #password-hint>
                        <NuxtLink to="/" class="text-primary font-medium">{{ $t('login_forgot_password') }}</NuxtLink>
                    </template>
                    <template #validation>
                        <UAlert v-if="failedToLogin" color="red" icon="i-heroicons-information-circle-20-solid"
                            :title="$t('login_result_error')" />
                    </template>
                    <!-- <template #footer>
                        By signing in, you agree to our <NuxtLink to="/" class="text-primary font-medium">Terms of
                            Service
                        </NuxtLink>.
                    </template> -->
                </UAuthForm>
            </UCard>
        </UContainer>
    </ClientOnly>
</template>

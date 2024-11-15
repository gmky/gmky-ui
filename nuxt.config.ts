// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  extends: [process.env.NUXT_UI_PRO_PATH || '@gmky/ui-pro'],

  modules: [
    '@pinia/nuxt',
    '@nuxt/eslint',
    '@nuxt/ui',
    '@nuxt/fonts',
    '@vueuse/nuxt',
    '@sidebase/nuxt-auth'
  ],

  ssr: false,

  nitro: {
    preset: 'cloudflare-pages'
  },

  ui: {
    icons: ['heroicons', 'simple-icons'],
    safelistColors: ['primary', 'red', 'orange', 'green'],
  },

  devtools: {
    enabled: true
  },

  typescript: {
    strict: false
  },

  eslint: {
    config: {
      stylistic: {
        commaDangle: 'never',
        braceStyle: '1tbs'
      }
    }
  },

  auth: {
    isEnabled: true,
    baseURL: 'http://localhost:3000/api',
    provider: {
      type: 'local',
      endpoints: {
        signIn: { path: '/client-api/v1/auth/login', method: 'post' },
        getSession: { path: '/client-api/v1/profile', method: 'get' }
      },
      token: {
        signInResponseTokenPointer: "/accessToken",
        type: 'Bearer'
      },
      session: {
        dataResponsePointer: "/",
        dataType: { id: 'string', username: 'string', email: 'string' }
      },
      pages: {
        login: '/admin/login'
      }
    },
    globalAppMiddleware: {
      isEnabled: true
    }
  },

  runtimeConfig: {
    baseURL: 'https://extended-tallulah-gmky-2cca56a1.koyeb.app'
  },

  compatibilityDate: '2024-09-19',
})
import { useAuthStore } from '~/stores/auth';

export default defineNuxtRouteMiddleware(async (to, from) => {
  const authStore = useAuthStore()
  await authStore.getAuthorities()
  const requireAuthority = to.meta.authority as string;
  const allowed = authStore.hasAuthority(requireAuthority);
  if (!allowed) return navigateTo('/404')
})
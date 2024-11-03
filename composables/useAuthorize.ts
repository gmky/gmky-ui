import { useAuthStore } from "~/stores/auth"

const _useAuthorize = async (authority: string) => {
  const authStore = useAuthStore();
  await authStore.getAuthorities()
  return await authStore.hasAuthority(authority);
}

export const useAuthorize = createSharedComposable(_useAuthorize)
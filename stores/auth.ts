import { defineStore } from 'pinia';
import authService from '~/services/auth.service';
import type { SummaryItem } from '~/types';

export const useAuthStore = defineStore('authStore', {
  state: () => ({
    grantedAuthorities: [] as SummaryItem[],
    loaded: false
  }),
  actions: {
    async getAuthorities() {
      if (!this.loaded) {
        const { data } = await authService.getSummary();
        this.grantedAuthorities = data.value
        this.loaded = true
      }
    },
    hasAuthority(input : string) : boolean {
      const [ resource, authority] = input.split(':');
      return !!this.grantedAuthorities.find(item => item.resource == resource && item.permissions.includes(authority));
    },
    clear() {
      this.grantedAuthorities = []
      this.loaded = false
    }
  },
  getters: {
    getLoaded (state) {
      return state.loaded
    }
  }
})
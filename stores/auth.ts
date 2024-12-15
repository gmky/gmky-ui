import { defineStore } from 'pinia';
import authService from '~/services/auth.service';
import type { SummaryItem } from '~/types';

export const useAuthStore = defineStore('authStore', {
  state: () => ({
    grantedAuthorities: [] as SummaryItem[],
    loaded: false,
    linkageId: null
  }),
  actions: {
    async getAuthorities() {
      if (!this.loaded) {
        const { data } = await authService.getSummary();
        this.grantedAuthorities = data.value
        this.loaded = true
      }
    },
    hasAuthority(input: string): boolean {
      const [resource, authority] = input.split(':');
      const result = !!this.grantedAuthorities.find(item => item.resource == resource && item.permissions.includes(authority));
      return result
    },
    clear() {
      this.grantedAuthorities = []
      this.loaded = false
    },
    async setLinkageId(linkageId) {
      this.linkageId = linkageId
      localStorage.setItem("linkageId", linkageId)
    }
  },
  getters: {
    getLoaded(state) {
      return state.loaded
    },
    getLinkageId(state) {
      var data = state.linkageId;
      if (!data) {
        data = localStorage.getItem("linkageId")
        state.linkageId = data
      }
      return data;
    },
    getGrantedAuthorities(state) {
      return state.grantedAuthorities
    }
  }
})
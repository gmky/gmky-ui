import { defineStore } from 'pinia';
import authService from '~/services/auth.service';
import type { SummaryItem } from '~/types';

export const useAuthStore = defineStore('authStore', {
  state: () => ({
    grantedAuthorities: [] as SummaryItem[],
    loaded: false,
    linkageId: null,
    linkage: null,
    balance: {
      demo: 0,
      live: 0
    }
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
    },
    async setLinkage(data) {
      this.linkage = data
      localStorage.setItem("linkage", JSON.stringify(data))
    },
    async setBalance({ demo, live }) {
      this.balance.live = live
      this.balance.demo = demo
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
    getLinkage(state) {
      var data = state.linkage;
      if (!data) {
        data = JSON.parse(localStorage.getItem("linkage"))
        state.linkage = data
      }
      return data;
    },
    getGrantedAuthorities(state) {
      return state.grantedAuthorities
    },
    getBalance(state) {
      return state.balance
    }
  }
})
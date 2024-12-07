import { defineStore } from 'pinia';
import authService from '~/services/auth.service';
import type { SummaryItem } from '~/types';

export const useAuthStore = defineStore('authStore', {
  state: () => ({
    grantedAuthorities: [] as SummaryItem[],
    loaded: false,
    links: [{
      id: 'home',
      label: 'Home',
      icon: 'i-heroicons-home',
      to: '/admin',
      tooltip: {
        text: 'Home',
        shortcuts: ['G', 'H']
      },
      authority: 'user:view'
    },
    // {
    //   id: 'inbox',
    //   label: 'Inbox',
    //   icon: 'i-heroicons-inbox',
    //   to: '/admin/inbox',
    //   badge: '4',
    //   tooltip: {
    //     text: 'Inbox',
    //     shortcuts: ['G', 'I']
    //   },
    //   authority: 'profile:view'
    // },
    {
      id: 'linkages',
      label: 'Linkages',
      icon: 'i-heroicons-link',
      to: '/admin/linkages',
      tooltip: {
        text: 'Linkages',
        shortcuts: ['L', 'K']
      },
      authority: 'public'
    }, {
      id: 'investments',
      label: 'Investments',
      icon: 'i-heroicons-rectangle-stack',
      to: '/admin/investments',
      tooltip: {
        text: 'Investments',
        shortcuts: ['P', 'K']
      },
      authority: 'public'
    },
    {
      id: 'administrator',
      label: 'Administrator',
      to: '/admin/settings',
      icon: 'i-heroicons-cog-8-tooth',
      authority: 'public',
      children: [{
        label: 'Users',
        to: '/admin/users',
        exact: true
      }, {
        label: 'Roles',
        to: '/admin/roles'
      }, {
        label: 'Permission Set',
        to: '/admin/permission-set'
      }, {
        label: 'Permissions',
        to: '/admin/permissions'
      }],
      tooltip: {
        text: 'Settings',
        shortcuts: ['G', 'S']
      }
    }],
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
    getLinks(state) {
      let result = []
      state.links.filter(item => {
        if (item.authority == 'public') {
          result.push(item)
        } else {
          let [resource, authority] = item.authority.split(':');
          let tmp = !!this.grantedAuthorities.find(item => item.resource == resource && item.permissions.includes(authority))
          if (tmp) {
            result.push(item)
          }
        }
      })
      return result
    },
    getLinkageId(state) {
      var data = state.linkageId;
      if (!data) {
        data = localStorage.getItem("linkageId")
        state.linkageId = data
      }
      return data;
    }
  }
})
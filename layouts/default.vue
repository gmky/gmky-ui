<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import type { DashboardSidebarLink } from '~/libs/ui-pro/types';
import { useAuthStore } from '~/stores/auth';

const route = useRoute()
const appConfig = useAppConfig()
const { isHelpSlideoverOpen } = useDashboard()

const { t } = useI18n()

const allLinks = ref(
  [{
    id: 'home',
    label: t('links_home_label'),
    icon: 'i-heroicons-home',
    to: '/admin',
    tooltip: {
      text: 'Home',
      shortcuts: ['G', 'H']
    },
    authority: 'public'
  },
  {
    id: 'linkages',
    label: t('links_linkage_label'),
    icon: 'i-heroicons-link',
    to: '/admin/linkages',
    tooltip: {
      text: 'Linkages',
      shortcuts: ['L', 'K']
    },
    authority: 'public'
  }, {
    id: 'investments',
    label: t('links_investment_label'),
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
    label: t('links_admin_label'),
    to: '/admin/settings',
    icon: 'i-heroicons-cog-8-tooth',
    authority: 'public',
    children: [{
      label: t('links_admin_user_label'),
      to: '/admin/users',
      authority: 'user:manage'
    }, {
      label: t('links_admin_role_label'),
      to: '/admin/roles',
      authority: 'role:manage'
    }, {
      label: t('links_admin_permission_set'),
      to: '/admin/permission-set',
      authority: 'permissionset:manage'
    }, {
      label: t('links_admin_permission'),
      to: '/admin/permissions',
      authority: 'permission:manage'
    }],
    tooltip: {
      text: 'Settings',
      shortcuts: ['G', 'S']
    }
  }]
)

const authStore = useAuthStore()

function checkLinks(links: any[]) {
  var result = []
  links.forEach(item => {
    if (item.children) {
      item.children = checkLinks(item.children)
    }
    if (item.authority == 'public') {
      result.push(item)
    } else {
      let [resource, authority] = item.authority.split(':');
      const granted = !!authStore.getGrantedAuthorities.find(item => item.resource == resource && item.permissions.includes(authority))
      if (granted) {
        result.push(item)
      }
    }
  })
  return result;
}

const links = computed(() => checkLinks(allLinks.value)) as ComputedRef<DashboardSidebarLink[]>

const footerLinks = [
  //   {
  //   label: 'Invite people',
  //   icon: 'i-heroicons-plus',
  //   to: '/admin/settings/members'
  // }, {
  //   label: 'Help & Support',
  //   icon: 'i-heroicons-question-mark-circle',
  //   click: () => isHelpSlideoverOpen.value = true
  // }
]

const groups = [{
  key: 'links',
  label: 'Go to',
  commands: links.value.map(link => ({ ...link, shortcuts: link.tooltip?.shortcuts }))
}, {
  key: 'code',
  label: 'Code',
  commands: [{
    id: 'source',
    label: 'View page source',
    icon: 'i-simple-icons-github',
    click: () => {
      window.open(`https://github.com/nuxt-ui-pro/dashboard/blob/main/pages${route.path === '/' ? '/index' : route.path}.vue`, '_blank')
    }
  }]
}] as any[]

const defaultColors = ref(['green', 'teal', 'cyan', 'sky', 'blue', 'indigo', 'violet'].map(color => ({ label: color, chip: color, click: () => appConfig.ui.primary = color })))
const colors = computed(() => defaultColors.value.map(color => ({ ...color, active: appConfig.ui.primary === color.label })))
</script>

<template>
  <UDashboardLayout>
    <UDashboardPanel :width="250" :resizable="{ min: 200, max: 300 }" collapsible>
      <UDashboardNavbar class="!border-transparent" :ui="{ left: 'flex-1' }">
        <template #left>
          <TeamsDropdown />
        </template>
      </UDashboardNavbar>

      <UDashboardSidebar>
        <template #header>
          <UDashboardSearchButton />
        </template>

        <UDashboardSidebarLinks :links="links" />

        <UDivider />

        <UDashboardSidebarLinks :links="[{ label: 'Colors', draggable: true, children: colors }]"
          @update:links="colors => defaultColors = colors" />

        <div class="flex-1" />

        <UDashboardSidebarLinks :links="footerLinks" />

        <UDivider class="sticky bottom-0" />

        <template #footer>
          <!-- ~/components/UserDropdown.vue -->
          <UserDropdown />
        </template>
      </UDashboardSidebar>
    </UDashboardPanel>

    <slot />

    <!-- ~/components/HelpSlideover.vue -->
    <HelpSlideover />
    <!-- ~/components/NotificationsSlideover.vue -->
    <NotificationsSlideover />

    <ClientOnly>
      <LazyUDashboardSearch :groups="groups" />
    </ClientOnly>
  </UDashboardLayout>
</template>

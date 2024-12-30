<script setup lang="ts">

import ProBet from '~/components/professional/ProBet.vue';
import ProInfo from '~/components/professional/ProInfo.vue';


definePageMeta({
  middleware: [
    'authority'
  ],
  authority: 'public'
})

const round = ref(null)

const amount = ref(5)

const countDown = ref(null)

const sessionId = ref(null)


const authStore = useAuthStore()
const linkageId = computed(() => authStore.getLinkageId)
const linkage = authStore.getLinkage

const accountId = ref(linkage?.liveId)

const wssURL = computed(() => `wss://${linkage.domain}:2096`)

const ws = new WebSocket(wssURL.value)

ws.onopen = function (event) {
  console.log('Connected')
  sendInfo()
}

ws.onmessage = function (event) {
  let data = JSON.parse(event.data)
  let dl = data.data;
  if (data.type === 'allData') {
    countDown.value = dl.candleClose
    round.value = dl.type == 'watting' ? 'WAITING' : 'ORDER'
    sessionId.value = dl.session
  }
}

function sendInfo() {
  let data = { type: 'accountDetail', data: { uid: accountId.value, email: linkage.username } }
  ws.send(JSON.stringify(data))
}

</script>
<template>
  <UDashboardPage>
    <UDashboardPanel grow>
      <UDashboardNavbar :title="$t('professional_title')">
      </UDashboardNavbar>
      <UDashboardPanelContent>
        <div class="grid lg:grid-cols-2 lg:items-start gap-8">
          <ProBet :round="round" :account-id="accountId" :linkage="linkage" :session-id="`${sessionId}`"
            :linkage-id="Number(linkageId)" :count-down="`${countDown}`" />
          <ProInfo :linkage-id="linkageId" />
        </div>
      </UDashboardPanelContent>
    </UDashboardPanel>
  </UDashboardPage>
</template>
<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import leaderService from '~/services/leader.service';


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

const accountOpts = [{
  type: 'Live Account',
  value: linkage?.liveId
}, {
  type: 'Demo Account',
  value: linkage?.demoId
}]

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

const toast = useToast()
const { t } = useI18n()

async function betIt(betType) {
  const data = {
    amount: amount.value,
    accountId: accountId.value,
    sessionId: sessionId.value,
    action: betType,
    linkageId: linkageId.value
  }
  const { error } = await leaderService.leaderBet(data)
  notificationUtil.toastRes(toast, error.value, t('professional_bet_success_msg'), t('professional_bet_failed_msg'))
  amount.value = 5
}

function addAmount() {
  amount.value += 5
}

function minusAmount() {
  if (amount.value > 5) {
    amount.value -= 5
  }
}

function setAmount(input) {
  amount.value = Number(input)
}

const listAmount = ref([5, 10, 15, 25, 40, 65, 105])

</script>
<template>
  <UDashboardPage>
    <UDashboardPanel grow>
      <UDashboardNavbar :title="$t('professional_title')">
      </UDashboardNavbar>
      <ULandingCTA>
        <template #title>
          <UBadge :label="round" :color="round === 'ORDER' ? 'green' : 'red'" variant="subtle" class="capitalize" />
          <div class="mt-4">
            {{ countDown }}
          </div>
        </template>
        <template #description>
          <div class="mt-10 flex items-center gap-x-6 center justify-center">
            <UButton :label="$t('professional_down_btn')" trailing-icon="i-heroicons-arrow-trending-down" color="red"
              size="lg" :disabled="round == 'WAITING'" @click="betIt('SELL')" />
            <UInput v-model="amount" size="lg" :ui="{ icon: { trailing: { pointer: '' }, leading: { pointer: '' } } }">
              <template #leading>
                <UIcon name="i-heroicons-minus" class="w-5 h-5 cursor-pointer" @click="minusAmount" />
              </template>
              <template #trailing>
                <UIcon name="i-heroicons-plus" class="w-5 h-5 cursor-pointer" @click="addAmount" />
              </template>
            </UInput>
            <UButton :label="$t('professional_up_btn')" size="lg" trailing-icon="i-heroicons-arrow-trending-up"
              color="green" :disabled="round == 'WAITING'" @click="betIt('BUY')" />
          </div>
          <div class="w-100 mt-10 flex items-center gap-x-6 center justify-center">
            <UFormGroup :label="$t('investment_new_account_type_title')" name="account-id">
              <USelectMenu v-model="accountId" :options="accountOpts"
                :placeholder="$t('investment_new_account_type_ph')" class="space-y-2 space-x-4" option-attribute="type"
                value-attribute="value">
                <template #option="{ option: account }">
                  <span class="truncate">{{ account.type }} ({{ account.value }})</span>
                </template>
              </USelectMenu>
            </UFormGroup>
          </div>
          <div class="mt-10 flex items-center gap-x-6 center justify-center">
            <UButton v-for="item in listAmount" :label="`${item}`" @click="setAmount(item)" color="gray" variant="solid"
              size="lg" />
          </div>
        </template>
      </ULandingCTA>
    </UDashboardPanel>
  </UDashboardPage>
</template>
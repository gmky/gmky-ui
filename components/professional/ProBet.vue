<script setup lang="ts">
import leaderService from '~/services/leader.service';
import { useI18n } from 'vue-i18n';

const props = defineProps({
  round: String,
  accountOpts: Array,
  sessionId: String,
  linkageId: Number,
  countDown: String,
  linkage: Object,
})

const emit = defineEmits(['reloadHistory'])

const amount = ref(5)

const betRate = ref(1)

const isOtherBetRate = ref(false)

const professionalMode = ref(false)

const accountOpts = [{
  type: 'Live Account',
  value: props.linkage?.liveId
}, {
  type: 'Demo Account',
  value: props.linkage?.demoId
}]

const accountId = ref(props.linkage?.liveId)

function addAmount() {
  amount.value += 5
}

function minusAmount() {
  if (amount.value > 5) {
    amount.value -= 5
  }
}

function setBetRate(input) {
  betRate.value = Number(input)
}

const listAmount = ref([1, 2, 4])

const toast = useToast()
const { t } = useI18n()

async function betIt(betType) {
  const data = {
    amount: amount.value,
    accountId: accountId.value,
    sessionId: props.sessionId,
    action: betType,
    linkageId: props.linkageId,
    betRate: betRate.value,
    professional: professionalMode.value
  }
  const { error } = await leaderService.leaderBet(data)
  notificationUtil.toastRes(toast, error.value, t('professional_bet_success_msg'), t('professional_bet_failed_msg'))
  emit('reloadHistory')
  amount.value = 5
}

watch(() => props.round, (newVal, oldVal) => {
  if (oldVal == 'WAITING') emit('reloadHistory')
})

</script>

<template>
  <UCard>
    <template #header>
      <UForm :state="{}" class="space-y-4">
        <UFormGroup :label="$t('professional_bet_amount')" :ui="{ wrapper: 'w-full' }" class="w-full" name="bet-amount">
          <div class="flex items-center gap-x-2 left justify-left">
            <UInput class="w-2/3" placeholder="Search..." v-model="amount">
              <template #trailing>
                <span class="text-gray-500 dark:text-gray-400 text-xs">USDT</span>
              </template>
            </UInput>
            <USelectMenu v-model="accountId" :options="accountOpts" :placeholder="$t('investment_new_account_type_ph')"
              class="w-1/3 space-y-2 space-x-4" option-attribute="type" value-attribute="value">
              <template #option="{ option: account }">
                <span class="truncate">{{ account.type }} ({{ account.value }})</span>
              </template>
            </USelectMenu>
          </div>
        </UFormGroup>
        <UFormGroup :label="$t('professional_bet_rate')" class="w-full" name="bet-rate">
          <div class="flex items-center gap-x-2 left">
            <UButton v-for="item in listAmount" :label="`x${item}`" @click="setBetRate(item)"
              :color="item === betRate ? 'primary' : 'gray'" variant="solid" :disabled="!professionalMode" />
            <UButton :label="$t('professional_bet_rate_other')" color="gray" variant="solid"
              @click="isOtherBetRate = !isOtherBetRate" :disabled="!professionalMode" />
            <UInput v-model="betRate" v-if="isOtherBetRate" :placeholder="$t('professional_bet_rate')"
              :disabled="!professionalMode" />
          </div>
        </UFormGroup>
        <UFormGroup class="w-full" name="bet-amount">
          <UInput class="w-full" :disabled="true">
            <template #leading>
              <span class="text-gray-500 dark:text-gray-400 text-xs w-full">{{ props.round == 'WAITING' ?
                $t('professional_count_down_wait') : $t('professional_count_down_bet') }}</span>
            </template>
            <template #trailing>
              <span class="text-gray-500 dark:text-gray-400 text-xs w-full">{{ countDown }}</span>
            </template>
          </UInput>
        </UFormGroup>
        <UFormGroup>
          <div class="flex items-center gap-x-2 left justify-left">
            <UButton class="w-1/2 text-center" :label="$t('professional_down_btn')"
              trailing-icon="i-heroicons-arrow-trending-down" :color="round == 'WAITING' ? 'gray' : 'red'" size="lg"
              :disabled="round == 'WAITING'" @click="betIt('SELL')" />
            <UButton class="w-1/2 text-center" :label="$t('professional_up_btn')" size="lg"
              trailing-icon="i-heroicons-arrow-trending-up" :color="round == 'WAITING' ? 'gray' : 'green'"
              :disabled="round == 'WAITING'" @click="betIt('BUY')" />
          </div>
        </UFormGroup>
        <UFormGroup :label="$t('professional_toggle')">
          <UToggle v-model="professionalMode" />
        </UFormGroup>
      </UForm>
    </template>
  </UCard>
</template>

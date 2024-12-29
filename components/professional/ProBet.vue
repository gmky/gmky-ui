<script setup lang="ts">
import leaderService from '~/services/leader.service';
import { useI18n } from 'vue-i18n';

const props = defineProps({
  round: String,
  accountOpts: Array,
  sessionId: String,
  linkageId: Number,
  countDown: Number,
  linkage: Object,
})

const amount = ref(5)

const betRate = ref(1)

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
    accountId: accountId,
    sessionId: props.sessionId,
    action: betType,
    linkageId: props.linkageId,
    betRate: betRate.value
  }
  const { error } = await leaderService.leaderBet(data)
  notificationUtil.toastRes(toast, error.value, t('professional_bet_success_msg'), t('professional_bet_failed_msg'))
  amount.value = 5
}

</script>

<template>
  <UCard>
    <template #header class="w-full">
      <UForm :state="null" class="space-y-4">
        <UFormGroup :label="$t('professional_bet_amount')" :ui="{ wrapper: 'w-full' }" class="w-full" name="bet-amount">
          <UInput class="w-full" placeholder="Search..." v-model="amount">
            <template #trailing>
              <span class="text-gray-500 dark:text-gray-400 text-xs">USDT</span>
            </template>
          </UInput>
        </UFormGroup>
        <UFormGroup :label="$t('professional_bet_rate')" class="w-full" name="bet-rate">
          <div class="flex items-center gap-x-2 left">
            <UButton v-for="item in listAmount" :label="`${item}`" @click="setBetRate(item)"
              :color="item === betRate ? 'primary' : 'gray'" variant="solid" />
            <UButton :label="$t('professional_bet_rate_other')" variant="solid" />
          </div>
        </UFormGroup>
        <UFormGroup :label="$t('professional_count_down')" class="w-full" name="bet-amount">
          <UInput class="w-full" disabled="true">
            <template #leading>
              <span class="text-gray-500 dark:text-gray-400 text-xs w-full">{{ $t('professional_count_down') }}</span>
            </template>
            <template #trailing>
              <span class="text-gray-500 dark:text-gray-400 text-xs w-full">{{ countDown }}</span>
            </template>
          </UInput>
        </UFormGroup>
        <UFormGroup>
          <div class="flex items-center gap-x-2 left justify-left">
            <UButton :label="$t('professional_down_btn')" trailing-icon="i-heroicons-arrow-trending-down" color="red"
              size="lg" :disabled="round == 'WAITING'" @click="betIt('SELL')" />
            <UButton :label="$t('professional_up_btn')" size="lg" trailing-icon="i-heroicons-arrow-trending-up"
              color="green" :disabled="round == 'WAITING'" @click="betIt('BUY')" />
          </div>
        </UFormGroup>
      </UForm>
    </template>
  </UCard>
</template>

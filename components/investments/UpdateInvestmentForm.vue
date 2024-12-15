<script setup lang="ts">
import type { FormSubmitEvent } from '#ui/types'
import { useI18n } from 'vue-i18n';
import { useAuthStore } from '~/stores/auth';
import linkageService from '~/services/linkage.service';
import investmentService from '~/services/investment.service';

const props = defineProps({
  investmentId: Number
})

const authStore = useAuthStore();
const emit = defineEmits(['close', 'success'])

const { t } = useI18n()

const linkageId = computed(() => authStore.getLinkageId)

const state = reactive({
  botName: undefined,
  accountId: undefined,
  strategySignalId: undefined,
  strategyCapitalId: undefined,
  listBotAmount: '1-2-3-4-5-6-7-8-9',
  ruleCapital: undefined,
  balance: 0,
  maxWin: 0,
  maxLose: 0,
  linkageId: linkageId.value
})

async function getInvestmentDetail() {
  const { data: investInfo, status: getDetailStatus } = await investmentService.getInvestmentById(props.investmentId);
  state.botName = investInfo.value.botName
  state.accountId = investInfo.value.accountId
  state.listBotAmount = investInfo.value.listBotAmount
  state.ruleCapital = investInfo.value.ruleCapital
  state.balance = investInfo.value.balance
  state.maxWin = investInfo.value.maxWin
  state.maxLose = investInfo.value.maxLose
  state.linkageId = investInfo.value.linkageId
  state.strategySignalId = investInfo.value.strategySignalId
  state.strategyCapitalId = investInfo.value.strategyCapitalId
}

onMounted(() => {
  getInvestmentDetail()
})

const { data: getLinkageResp, status: getLinkageStatus } = await linkageService.getLinkageById(linkageId.value)
const accountOpts = [{
  type: 'Live Account',
  value: getLinkageResp.value.liveId
}, {
  type: 'Demo Account',
  value: getLinkageResp.value.demoId
}]

const { data: allBotStrategies, status: getAllBotStrategiesStatus } = await investmentService.getAllBotStrategies()
const signalOpts = allBotStrategies.value.filter(item => item.botType == 'SIGNAL');
const capitalOpts = allBotStrategies.value.filter(item => item.botType == 'CAPITAL');
const ruleCapitalOpts = ['WIN', 'LOSE']

const toast = useToast()
async function onSubmit(event: FormSubmitEvent<any>) {
  const { error } = await investmentService.updateInvestmentById(props.investmentId, state);
  notificationUtil.toastRes(toast, error.value, t('investment_update_success'), t('investment_update_failed'))
  if (!error.value) {
    emit('success')
  }
  emit('close')
}
</script>

<template>
  <UForm :state="state" class="space-y-4" @submit="onSubmit">
    <UFormGroup :label="$t('investment_new_name_title')" name="bot-name">
      <UInput v-model="state.botName" type="text" :placeholder="$t('investment_new_name_ph')" autofocus />
    </UFormGroup>

    <UFormGroup :label="$t('investment_new_account_type_title')" name="account-id">
      <USelectMenu v-model="state.accountId" :options="accountOpts" :placeholder="$t('investment_new_account_type_ph')"
        class="space-y-2 space-x-4" option-attribute="type" value-attribute="value">
        <template #option="{ option: account }">
          <span class="truncate">{{ account.type }} ({{ account.value }})</span>
        </template>
      </USelectMenu>
    </UFormGroup>

    <UFormGroup :label="$t('investment_new_signal_title')" name="signal">
      <USelectMenu v-model="state.strategySignalId" :options="signalOpts" :placeholder="$t('investment_new_signal_ph')"
        class="space-y-2 space-x-4" option-attribute="botMethod" value-attribute="id">
        <template #option="{ option: bot }">
          <span class="truncate">{{ bot.botMethod }}</span>
        </template>
      </USelectMenu>
    </UFormGroup>

    <UFormGroup :label="$t('investment_new_capital_title')" name="capital">
      <USelectMenu v-model="state.strategyCapitalId" :options="capitalOpts"
        :placeholder="$t('investment_new_capital_ph')" class="space-y-2 space-x-4" option-attribute="botNameVn"
        value-attribute="id">
      </USelectMenu>
    </UFormGroup>

    <UFormGroup :label="$t('investment_new_command_title')" name="command">
      <UInput v-model="state.listBotAmount" :placeholder="$t('investment_new_command_ph')" />
    </UFormGroup>

    <UFormGroup :label="$t('investment_new_rule_capital_title')" name="rule-capital">
      <USelectMenu v-model="state.ruleCapital" :options="ruleCapitalOpts"
        :placeholder="$t('investment_new_rule_capital_ph')" class="space-y-2 space-x-4">
      </USelectMenu>
    </UFormGroup>

    <UFormGroup :label="$t('investment_new_balance_title')" name="balance">
      <UInput v-model="state.balance" type="number" :placeholder="$t('investment_new_balance_ph')" />
    </UFormGroup>

    <UFormGroup :label="$t('investment_new_max_win_title')" name="max-win">
      <UInput v-model="state.maxWin" type="number" :placeholder="$t('investment_new_max_win_ph')" />
    </UFormGroup>

    <UFormGroup :label="$t('investment_new_max_lose_title')" name="max-lose">
      <UInput v-model="state.maxLose" type="number" :placeholder="$t('investment_new_max_lose_ph')" />
    </UFormGroup>

    <div class="flex justify-end gap-3">
      <UButton :label="$t('common_form_cancel')" color="gray" variant="ghost" @click="emit('close')" />
      <UButton type="submit" :label="$t('common_form_save')" color="black" />
    </div>
  </UForm>
</template>

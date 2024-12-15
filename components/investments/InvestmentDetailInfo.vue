<script setup lang="ts">
import type { PropType } from 'vue';
import type { Investment } from '~/types';

const props = defineProps({
  info: {
    type: Object as PropType<Investment>,
    default: () => { }
  }
})
</script>
<template>
  <div v-if="info" class="grid lg:grid-cols-4 lg:items-start gap-4 items-stretch">
    <UAlert class="h-full">
      <template #title>
        {{ $t('investment_new_balance_title') }}
        <UBadge size="xs" :label="$t('common_usdt')" color="blue" variant="subtle" class="capitalize" />
      </template>
      <template #description>
        {{ info.balance }}
      </template>
    </UAlert>

    <UAlert class="h-full" :title="$t('investment_table_strategy_capital')">
      <template #description>
        {{ info.strategyCapital.botMethod }}
      </template>
    </UAlert>

    <UAlert class="h-full" :title="$t('investment_table_strategy_signal')">
      <template #description>
        {{ info.strategySignal.botMethod }}
      </template>
    </UAlert>

    <UAlert class="h-full">
      <template #title>
        {{ $t('investment_new_max_win_title') }}
        <UBadge size="xs" :label="$t('common_usdt')" color="blue" variant="subtle" class="capitalize" />
      </template>
      <template #description>
        {{ info.maxWin }}
      </template>
    </UAlert>

    <UAlert class="h-full">
      <template #title>
        {{ $t('investment_new_max_lose_title') }}
        <UBadge size="xs" :label="$t('common_usdt')" color="blue" variant="subtle" class="capitalize" />
      </template>
      <template #description>
        {{ info.maxWin }}
      </template>
    </UAlert>

    <UAlert class="h-full" :title="$t('investment_new_rule_capital_title')">
      <template #description>
        <UBadge size="xs" :label="info.ruleCapital" :color="info.ruleCapital == 'WIN' ? 'green' : 'red'"
          variant="subtle" class="capitalize" />
      </template>
    </UAlert>

  </div>
</template>
<script setup lang="ts">
import leaderService from '~/services/leader.service';

const props = defineProps({
  linkageId: Number
})

const { data: info } = await leaderService.getLeaderStat({ linkageId: props.linkageId })
</script>

<template>
  <UCard>
    <template #header>
      <div class="grid lg:grid-cols-2 lg:items-start gap-4 items-stretch">
        <UAlert class="h-full" :title="$t('professional_info_rate_today')">
          <template #description>
            {{ info.dailyWinCount }} / {{ info.dailyLoseCount }}
          </template>
        </UAlert>

        <UAlert class="h-full" :title="$t('professional_info_profit_today')">
          <template #description>
            {{ info.dailyWinAmount }} / {{ info.dailyLoseAmount }}
          </template>
        </UAlert>

        <UAlert class="h-full" :title="$t('professional_info_rate_7day')">
          <template #description>
            {{ info.weeklyWinCount }} / {{ info.weeklyLoseCount }}
          </template>
        </UAlert>

        <UAlert class="h-full" :title="$t('professional_info_profit_7day')">
          <template #description>
            {{ info.dailyWinAmount }} / {{ info.dailyLoseAmount }}
          </template>
        </UAlert>
      </div>
    </template>
  </UCard>
</template>

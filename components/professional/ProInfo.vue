<script setup lang="ts">
import leaderService from '~/services/leader.service';

const props = defineProps({
  linkageId: Number,
  info: {
    type: Object
  }
})

</script>

<template>
  <UCard class="h-full">
    <template #header>
      <div class="grid lg:grid-cols-2 lg:items-start gap-4 items-stretch">
        <UAlert class="h-full" :title="$t('professional_info_rate_today')">
          <template #description>
            <span class="font-bold">{{ info.dailyWinCount }} / {{ info.dailyLoseCount }}</span>
          </template>
        </UAlert>

        <UAlert class="h-full" :title="$t('professional_info_profit_today')">
          <template #description>
            <span class="font-bold">{{ info.dailyWinAmount }} / {{ info.dailyLoseAmount }}</span>
          </template>
        </UAlert>

        <UAlert class="h-full" :title="$t('professional_info_rate_7day')">
          <template #description>
            <span class="font-bold">{{ info.weeklyWinCount }} / {{ info.weeklyLoseCount }}</span>
          </template>
        </UAlert>

        <UAlert class="h-full" :title="$t('professional_info_profit_7day')">
          <template #description>
            <span class="font-bold">{{ info.weeklyWinAmount }} / {{ info.weeklyLoseAmount }}</span>
          </template>
        </UAlert>
      </div>
    </template>
  </UCard>
</template>

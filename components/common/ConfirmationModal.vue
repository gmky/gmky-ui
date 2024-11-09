<script setup lang="ts">
import type { FormSubmitEvent } from '#ui/types'

const props = defineProps({
  title: String,
  message: String
})

const emit = defineEmits(['close', 'confirm'])

async function onSubmit(event: FormSubmitEvent<any>) {
  emit('confirm')
}

</script>

<template>
  <UModal>
    <UForm
      :validate-on="['submit', 'input']"
      :state="{}"
      class="space-y-4"
      @submit="onSubmit"
    >
      <UCard>
        <div class="space-y-2">
          <p>{{ title }}</p>
          <p>{{ message }}</p>
        </div>
        <div class="flex justify-end gap-3">
          <UButton
            label="No"
            color="gray"
            variant="ghost"
            @click="emit('close')"
          />
          <UButton
            type="submit"
            label="Yes"
            color="black"
          />
        </div>
      </UCard>
    </UForm>
  </UModal>
</template>

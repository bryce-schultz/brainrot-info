<template>
  <div class="rebirth-grid">
    <RebirthCard
      v-for="tier in rebirths"
      :key="tier.tier"
      :tier="tier"
      :brainrots="brainrots"
      @search-brainrot="$emit('search-brainrot', $event)"
    />
  </div>
</template>

<script setup>
import { defineAsyncComponent } from 'vue';

const RebirthCard = defineAsyncComponent(() => import('./RebirthCard.vue'));

defineProps({
  rebirths: { type: Array, default: () => [] },
  brainrots: { type: Array, default: () => [] },
});

defineEmits(['search-brainrot']);
</script>

<template>
  <button
    type="button"
    class="brainrot-card"
    :class="`rarity-${brainrot.rarity?.toLowerCase() || 'common'}`"
    @click="$emit('select', brainrot)"
    :aria-label="`View details for ${brainrot.name}`"
  >
    <div class="brainrot-content">
      <div class="brainrot-image">
        <img v-if="imgSrc" :src="imgSrc" alt="" class="brainrot-img" />
        <div v-else class="image-placeholder">?</div>
      </div>
      <div class="brainrot-info">
        <h2 class="brainrot-name">{{ brainrot.name }}</h2>
        <div class="brainrot-details">
          <div class="detail-row">
            <span class="detail-label">Rarity</span>
            <span class="detail-value rarity-badge" :class="`rarity-${brainrot.rarity?.toLowerCase() || 'common'}`">
              {{ brainrot.rarity || 'Common' }}
            </span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Cost</span>
            <span class="detail-value cost">{{ formatCash(brainrot.price) }}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Production</span>
            <span class="detail-value production">{{ formatCash(brainrot.produces) }}/s</span>
          </div>
        </div>
      </div>
    </div>
  </button>
</template>

<script setup>
import { computed } from 'vue';
import { formatCash } from '../utils/formatCash.js';
import { getBrainrotImage } from '../utils/brainrotImage.js';

const props = defineProps({
  brainrot: {
    type: Object,
    required: true
  }
});

defineEmits(['select']);

const imgSrc = computed(() => getBrainrotImage(props.brainrot.name, 'md'));

</script>

<style scoped>
/* Component-specific styles in main style.css */
</style>

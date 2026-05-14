<template>
  <div class="rebirth-card">
    <div class="rebirth-header">
      <div class="tier-badge">Rebirth {{ tier.tier }}</div>
      <div class="bonus-tag">{{ tier.bonus }}</div>
    </div>
    <div class="rebirth-body">
      <div class="requirement-section">
        <div class="requirement-label">Required Cash</div>
        <div class="requirement-value cash">{{ formatCash(tier.requiredCash) }}</div>
      </div>
      <div class="requirement-section">
        <div class="requirement-label">Required Brainrots</div>
        <div class="brainrot-list">
          <button 
            v-for="(brainrot, index) in tier.requiredBrainrots" 
            :key="index"
            class="brainrot-tag"
            :class="rarityClass(brainrot)"
            @click="$emit('search-brainrot', brainrot)"
          >
            {{ brainrot }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { formatCash } from '../utils/formatter.js';

const props = defineProps({
  tier: {
    type: Object,
    required: true
  },
  brainrots: {
    type: Array,
    default: () => []
  }
});

defineEmits(['search-brainrot']);

// Pre-build a name → rarity lookup so each tag resolves its CSS class in O(1)
// rather than scanning the full brainrots array on every render.
const rarityMap = computed(() => {
  const map = {};
  for (const rot of props.brainrots) {
    map[rot.name] = rot.rarity?.toLowerCase().replace(/\s+/g, '') || '';
  }
  return map;
});

const rarityClass = (name) => {
  const rarity = rarityMap.value[name];
  return rarity ? `rarity-${rarity}` : '';
};


</script>

<style scoped>
/* Scoped styles are in the main App styles */
</style>

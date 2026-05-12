<template>
  <button
    class="portrait-card"
    :class="brainrot ? `rarity-${brainrot.rarity?.toLowerCase()}` : 'empty'"
    @click="$emit('click')"
  >
    <div class="portrait-image">
      <span v-if="!brainrot" class="portrait-empty-icon">+</span>
      <template v-else>
        <img
          v-if="imgSrc"
          :src="imgSrc"
          alt=""
          class="portrait-img"
          loading="lazy"
          decoding="async"
          width="256"
          height="256"
        />
        <span v-else>?</span>
      </template>
    </div>
    <div class="portrait-name">
      {{ brainrot ? brainrot.name : 'Click to select a brainrot' }}
    </div>
    <div class="portrait-footer">
      <template v-if="brainrot">
        <span class="portrait-production">{{ formatCash(brainrot.produces) }}/s</span>
        <span class="portrait-rarity rarity-badge" :class="`rarity-${brainrot.rarity?.toLowerCase()}`">
          {{ brainrot.rarity }}
        </span>
      </template>
    </div>
  </button>
</template>

<script setup>
import { computed } from 'vue';
import { formatCash } from '../utils/formatCash.js';
import { getBrainrotImage } from '../utils/brainrotImage.js';

const props = defineProps({
  brainrot: { type: Object, default: null },
});

defineEmits(['click']);

const imgSrc = computed(() => getBrainrotImage(props.brainrot?.name, 'md'));
</script>

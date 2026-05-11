<template>
  <Teleport to="body">
    <div class="brainrot-detail-overlay" @click.self="$emit('close')">
      <article class="brainrot-detail-modal" :class="`rarity-${brainrot.rarity?.toLowerCase() || 'common'}`">
        <button type="button" class="brainrot-detail-close" aria-label="Close brainrot details" @click="$emit('close')">
          &times;
        </button>

        <div class="brainrot-detail-layout">
          <div class="brainrot-detail-image-wrap">
            <img v-if="imgSrc" :src="imgSrc" alt="" class="brainrot-detail-image" />
            <div v-else class="brainrot-detail-placeholder">?</div>
          </div>

          <div class="brainrot-detail-content">
            <h2 class="brainrot-detail-title">{{ brainrot.name }}</h2>

            <div class="brainrot-detail-meta">
              <span class="detail-label">Rarity</span>
              <span class="detail-value rarity-badge" :class="`rarity-${brainrot.rarity?.toLowerCase() || 'common'}`">
                {{ brainrot.rarity || 'Common' }}
              </span>
            </div>

            <div class="brainrot-detail-stats">
              <template v-if="hasEconomyStats">
                <div class="brainrot-detail-stat">
                  <span class="detail-label">Cost</span>
                  <span class="detail-value cost">{{ formatCash(brainrot.price) }}</span>
                </div>
                <div class="brainrot-detail-stat">
                  <span class="detail-label">Production</span>
                  <span class="detail-value production">{{ formatCash(brainrot.produces) }}/s</span>
                </div>
              </template>
              <div class="brainrot-detail-stat" v-if="brainrot.id">
                <span class="detail-label">Search Tag</span>
                <span class="detail-value">#{{ brainrot.id }}</span>
              </div>
            </div>
          </div>
        </div>
      </article>
    </div>
  </Teleport>
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

defineEmits(['close']);

const imgSrc = computed(() => getBrainrotImage(props.brainrot?.name, 'full'));
const hasEconomyStats = computed(() => !(Number(props.brainrot.price) === 0 && Number(props.brainrot.produces) === 0));
</script>

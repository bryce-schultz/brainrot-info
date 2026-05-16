<template>
  <div class="calculator">

    <!-- Brainrot Selection -->
    <section class="calc-section">
      <h2 class="calc-section-title">Brainrot</h2>
      <div class="portrait-card-center">
        <BrainrotPortraitCard :brainrot="selectedBrainrot" @click="pickerOpen = true" />
      </div>
      <BrainrotPickerModal
        v-if="pickerOpen"
        :brainrots="brainrots"
        :selected="selectedBrainrot"
        @select="onSelectBrainrot"
        @close="pickerOpen = false"
      />
    </section>

    <!-- Type Selection -->
    <section class="calc-section">
      <h2 class="calc-section-title">Mutation</h2>
      <div class="selector-grid">
        <button
          v-for="type in types"
          :key="type.name"
          class="selector-tile"
          :class="{ active: selectedType?.name === type.name }"
          :style="{ '--tile-color': type.color }"
          @click="selectedType = type"
        >
          <div class="tile-image">
            <span class="tile-mult">×{{ type.multiplier }}</span>
          </div>
          <span class="tile-name">{{ type.name }}</span>
        </button>
      </div>
    </section>

    <!-- Traits Selection -->
    <section class="calc-section">
      <h2 class="calc-section-title">Traits</h2>
      <div class="selector-grid">
        <button
          v-for="trait in traits"
          :key="trait.name"
          class="selector-tile"
          :class="{ active: selectedTraits.has(trait.name) }"
          :style="{ '--tile-color': trait.color }"
          @click="toggleTrait(trait)"
        >
          <div class="tile-image">
            <img v-if="getTraitImage(trait.name)" :src="getTraitImage(trait.name)" :alt="trait.name" class="tile-img" />
            <span v-else class="tile-mult">+{{ trait.multiplier }}</span>
          </div>
          <span class="tile-mult">+{{ trait.multiplier }}</span>
          <span class="tile-name">{{ trait.name }}</span>
        </button>
      </div>
    </section>

    <!-- Result -->
    <section class="calc-result-section">
      <div v-if="selectedBrainrot && selectedType" class="calc-result-card">
        <div class="calc-result-label">Income per Second</div>
        <div class="calc-result-value">{{ formatCash(income) }}/s</div>
        <div class="calc-result-formula">
          {{ formatCash(selectedBrainrot.produces) }} × ({{ selectedType.multiplier }} + {{ traitMultSum }}) = {{ formatCash(income) }}/s
        </div>
      </div>
      <div v-else class="calc-result-placeholder">
        Select a brainrot and type to see your income
      </div>
    </section>

  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { formatCash } from '../utils/formatter.js';
import { getTraitImage } from '../utils/brainrotImage.js';
import BrainrotPortraitCard from './BrainrotPortraitCard.vue';
import BrainrotPickerModal from './BrainrotPickerModal.vue';

const props = defineProps({
  brainrots: { type: Array, default: () => [] },
  types:     { type: Array, default: () => [] },
  traits:    { type: Array, default: () => [] },
});

const pickerOpen       = ref(false);
const selectedBrainrot = ref(null);
const selectedType     = ref(null);
const selectedTraits   = ref(new Set());

// Pre-select "Default" once types load (they arrive async from the fetch).
// The !selectedType.value guard prevents overwriting a user's choice on
// subsequent reactive updates.
watch(() => props.types, (types) => {
  if (types.length && !selectedType.value) {
    selectedType.value = types.find(t => t.name === 'Default') ?? types[0];
  }
}, { immediate: true });

const onSelectBrainrot = (rot) => {
  selectedBrainrot.value = rot;
  pickerOpen.value = false;
};

// Sum the additive multipliers for all currently selected traits.
const traitMultSum = computed(() =>
  [...selectedTraits.value].reduce((sum, name) => {
    const t = props.traits.find(t => t.name === name);
    return sum + (t?.multiplier ?? 0);
  }, 0)
);

// income = base production × (type multiplier + sum of trait multipliers)
const income = computed(() => {
  if (!selectedBrainrot.value || !selectedType.value) return 0;
  return selectedBrainrot.value.produces * (selectedType.value.multiplier + traitMultSum.value);
});

const toggleTrait = (trait) => {
  const s = new Set(selectedTraits.value);
  if (s.has(trait.name)) s.delete(trait.name);
  else s.add(trait.name);
  selectedTraits.value = s;
};
</script>

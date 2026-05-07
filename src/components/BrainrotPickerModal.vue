<template>
  <!-- Teleport to <body> so the overlay renders above all parent stacking contexts -->
  <Teleport to="body">
    <div class="picker-overlay" @click.self="$emit('close')">
      <div class="picker-modal">
        <div class="picker-header">
          <h2 class="picker-title">Select Brainrot</h2>
          <button class="picker-close" @click="$emit('close')">&times;</button>
        </div>
        <div class="picker-search">
          <input
            ref="searchInput"
            v-model="search"
            type="text"
            placeholder="Search brainrots..."
            class="search-input"
          />
        </div>
        <div ref="pickerGrid" class="picker-grid">
          <button
            v-for="rot in filtered"
            :key="rot.name"
            class="selector-tile brainrot-tile"
            :class="[`rarity-${rot.rarity?.toLowerCase()}`, { active: selected?.name === rot.name }]"
            @click="$emit('select', rot)"
          >
            <div class="tile-image">
              <img v-if="getImage(rot.name)" :src="getImage(rot.name)" alt="" class="tile-img" />
              <span v-else>?</span>
            </div>
            <span class="tile-name">{{ rot.name }}</span>
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue';
import { getBrainrotImage } from '../utils/brainrotImage.js';

const getImage = (name) => getBrainrotImage(name, 'sm');

const props = defineProps({
  brainrots: { type: Array, required: true },
  selected:  { type: Object, default: null },
});

defineEmits(['select', 'close']);

const search = ref('');
const searchInput = ref(null);
const pickerGrid = ref(null);

const filtered = computed(() => {
  const q = search.value.toLowerCase();
  return props.brainrots.filter(r =>
    r.name !== '???' &&
    (!q || r.name.toLowerCase().includes(q) || r.rarity?.toLowerCase().includes(q))
  );
});

onMounted(async () => {
  searchInput.value?.focus();
  // nextTick ensures the grid has rendered before we try to scroll.
  // behavior: 'instant' skips animation so the position snaps without a distracting
  // scroll effect every time the modal reopens.
  await nextTick();
  const active = pickerGrid.value?.querySelector('.active');
  active?.scrollIntoView({ block: 'center', behavior: 'instant' });
});
</script>

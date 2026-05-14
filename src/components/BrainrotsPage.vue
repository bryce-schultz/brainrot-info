<template>
  <div>
    <div class="search-container">
      <div class="search-input-wrap">
        <input
          type="text"
          :value="searchTerm"
          placeholder="Search"
          class="search-input"
          @input="$emit('update:searchTerm', $event.target.value)"
        />
        <button
          v-if="searchTerm"
          type="button"
          class="search-clear-btn"
          aria-label="Clear search"
          @click="$emit('update:searchTerm', '')"
        >
          &times;
        </button>
      </div>
    </div>
    <div class="brainrots-grid">
      <BrainrotCard
        v-for="brainrot in filteredBrainrots"
        :key="brainrot.name"
        :brainrot="brainrot"
        @select="openDetails"
      />
    </div>
    <BrainrotDetailModal
      v-if="selectedBrainrot"
      :brainrot="selectedBrainrot"
      @close="closeDetails"
    />
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted, defineAsyncComponent } from 'vue';
import BrainrotCard from './BrainrotCard.vue';
import { lockBodyScroll, unlockBodyScroll } from '../utils/scrollLock.js';

const BrainrotDetailModal = defineAsyncComponent(() => import('./BrainrotDetailModal.vue'));

const props = defineProps({
  brainrots: { type: Array, default: () => [] },
  searchTerm: { type: String, default: '' },
});

const emit = defineEmits(['update:searchTerm', 'search-brainrot']);

const selectedBrainrot = ref(null);

const filteredBrainrots = computed(() => {
  const all = props.brainrots.filter(b => b.name !== '???');
  const q = props.searchTerm.trim();
  if (!q) return all;

  if (q.startsWith('#')) {
    const id = parseInt(q.slice(1), 10);
    if (!isNaN(id)) return all.filter(b => b.id === id);
  }

  const lower = q.toLowerCase();
  return all.filter(b =>
    b.name.toLowerCase().includes(lower) ||
    b.rarity?.toLowerCase().includes(lower)
  );
});

const openDetails = (brainrot) => {
  selectedBrainrot.value = brainrot;
};

const closeDetails = () => {
  selectedBrainrot.value = null;
};

watch(filteredBrainrots, (brainrots) => {
  if (!selectedBrainrot.value) return;
  const stillVisible = brainrots.some(b => b.name === selectedBrainrot.value.name);
  if (!stillVisible) closeDetails();
});

watch(selectedBrainrot, (brainrot) => {
  if (brainrot) lockBodyScroll();
  else unlockBodyScroll();
});

const handleKeydown = (e) => {
  if (e.key === 'Escape' && selectedBrainrot.value) closeDetails();
};

onMounted(() => window.addEventListener('keydown', handleKeydown));

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown);
  unlockBodyScroll();
});
</script>

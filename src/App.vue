<template>
  <div class="app">
    <Sidebar :currentPage="currentPage" @navigate="handleNavigate" />
    
    <!-- Main Content -->
    <main class="main-content">
      <div class="page-header">
        <h1 class="page-title">{{ pageTitle }}</h1>
        <p class="page-subtitle">{{ pageSubtitle }}</p>
      </div>

      <!-- Rebirth Guide Page -->
      <div v-if="currentPage === 'rebirth'" class="rebirth-grid">
        <RebirthCard 
          v-for="tier in rebirthData" 
          :key="tier.tier" 
          :tier="tier"
          :brainrots="brainrotsData"
          @search-brainrot="handleBrainrotSearch"
        />
      </div>

      <!-- Calculator Page -->
      <div v-else-if="currentPage === 'calculator'">
        <Calculator
          :brainrots="brainrotsData"
          :types="typesData"
          :traits="traitsData"
        />
      </div>

      <!-- Brainrots Page -->
      <div v-else-if="currentPage === 'brainrots'">
        <div class="search-container">
          <input 
            type="text" 
            v-model="searchTerm" 
            placeholder="Search"
            class="search-input"
          />
        </div>
        <div class="brainrots-grid">
          <BrainrotCard 
            v-for="brainrot in filteredBrainrots" 
            :key="brainrot.name" 
            :brainrot="brainrot" 
          />
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import Sidebar from './components/Sidebar.vue';
import RebirthCard from './components/RebirthCard.vue';
import BrainrotCard from './components/BrainrotCard.vue';
import Calculator from './components/Calculator.vue';

const currentPage = ref('rebirth');
const rebirthData = ref([]);
const brainrotsData = ref([]);
const typesData = ref([]);
const traitsData = ref([]);
const searchTerm = ref('');

// Whitelist of valid page IDs — any unrecognised hash falls back to 'rebirth'.
const VALID_PAGES = new Set(['rebirth', 'calculator', 'brainrots']);

const parseHash = () => {
  const hash = window.location.hash.slice(1);
  // Manual indexOf instead of URLSearchParams so we only extract the one
  // param we expect and ignore anything else the URL might contain.
  const qIndex = hash.indexOf('?q=');
  const rawPage = qIndex === -1 ? hash : hash.slice(0, qIndex);
  const rawQuery = qIndex === -1 ? '' : hash.slice(qIndex + 3);

  const page = VALID_PAGES.has(rawPage) ? rawPage : 'rebirth';

  let search = '';
  if (rawQuery) {
    try {
      search = decodeURIComponent(rawQuery);
    } catch {
      search = '';
    }
  }

  return { page, search };
};

const applyHash = () => {
  const { page, search } = parseHash();
  currentPage.value = page;
  searchTerm.value = search;
};

const pageTitle = computed(() => {
  const titles = {
    rebirth: 'Rebirth Guide',
    calculator: 'Calculator',
    brainrots: 'Brainrots'
  };
  return titles[currentPage.value] || 'Rebirth Guide';
});

const pageSubtitle = computed(() => {
  const subtitles = {
    rebirth: 'Plan your rebirth strategy with tier requirements and bonuses',
    calculator: 'Calculate your earnings and progress',
    brainrots: 'View all available brainrots and their stats'
  };
  return subtitles[currentPage.value] || '';
});

const filteredBrainrots = computed(() => {
  // Exclude placeholder entries used for unreleased brainrots.
  const visibleBrainrots = brainrotsData.value.filter(brainrot =>
    brainrot.name !== '???'
  );
  
  if (!searchTerm.value) {
    return visibleBrainrots;
  }
  
  const search = searchTerm.value.toLowerCase();
  return visibleBrainrots.filter(brainrot => 
    brainrot.name.toLowerCase().includes(search) ||
    brainrot.rarity?.toLowerCase().includes(search)
  );
});

const navigate = (pageId, search = '') => {
  const query = search ? `?q=${encodeURIComponent(search)}` : '';
  const hash = `#${pageId}${query}`;
  if (window.location.hash !== hash) {
    history.pushState(null, '', hash);
  }
  currentPage.value = pageId;
  searchTerm.value = search;
};

const handleNavigate = (pageId) => {
  navigate(pageId, pageId === currentPage.value ? searchTerm.value : '');
};

const handleBrainrotSearch = (name) => {
  navigate('brainrots', name);
};

onMounted(async () => {
  applyHash();
  window.addEventListener('popstate', applyHash);

  // Helper — fetch JSON and surface non-2xx as a rejection so allSettled catches it.
  const fetchJson = async (url) => {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return response.json();
  };

  // All four data files are independent — fetch in parallel to cut total load time
  // from ~4× round-trips down to ~1× on slow connections (e.g. 4G).
  const [rebirth, brainrots, types, traits] = await Promise.allSettled([
    fetchJson('/rebirth.json'),
    fetchJson('/brainrots.json'),
    fetchJson('/types.json'),
    fetchJson('/traits.json'),
  ]);

  if (rebirth.status   === 'fulfilled') rebirthData.value   = rebirth.value.rebirth_tiers;
  else console.error('Error loading rebirth data:', rebirth.reason);

  if (brainrots.status === 'fulfilled') brainrotsData.value = brainrots.value.brainrots;
  else console.error('Error loading brainrots data:', brainrots.reason);

  if (types.status     === 'fulfilled') typesData.value     = types.value.types;
  else console.error('Error loading types data:', types.reason);

  if (traits.status    === 'fulfilled') traitsData.value    = traits.value.traits;
  else console.error('Error loading traits data:', traits.reason);
});
</script>

<style>
/* Import global styles */
@import './style.css';
</style>

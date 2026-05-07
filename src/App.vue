<template>
  <div class="app">
    <Sidebar :currentPage="currentPage" @navigate="handleNavigate" />
    
    <!-- Main Content -->
    <main class="main-content">
      <div class="page-header">
        <h1 class="page-title">{{ pageTitle }}</h1>
        <p class="page-subtitle">{{ pageSubtitle }}</p>
      </div>

      <!-- Brainrots Page -->
      <div v-if="currentPage === 'brainrots'">
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

      <!-- Rebirth Guide Page -->
      <div v-else-if="currentPage === 'rebirth'" class="rebirth-grid">
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

      <!-- Machine Page -->
      <div v-else-if="currentPage === 'machine'">
        <Machine
          :brainrots="brainrotsData"
          :machine="machineData"
        />
      </div>

      <!-- About Page -->
      <div v-else-if="currentPage === 'about'" class="about-page">
        <section class="about-section">
          <h2 class="about-heading">What is Brainrot Info?</h2>
          <p>Brainrot Info is an unofficial, fan-made reference site built to help players navigate <strong>Steal the Brainrot</strong>, the Fortnite minigame. It covers rebirth tiers, brainrot stats, and provides a calculator so you can plan your runs without having to look everything up in-game.</p>
          <p>The site started as a personal project because there was no single place to find this information in one spot. If it helps other players, that's the whole point.</p>
        </section>

        <section class="about-section">
          <h2 class="about-heading">Copyright & Disclaimer</h2>
          <p>This website is <strong>not affiliated with, endorsed by, or in any way connected to Epic Games</strong> or any of its subsidiaries. Fortnite and all related names, characters, and game content are the intellectual property of Epic Games, Inc.</p>
          <p>No copyrighted assets (images, audio, or game text) are reproduced here. All data displayed on this site is community-sourced and independently maintained. This site exists purely as a fan resource with no commercial intent.</p>
          <p>If you are a rights holder and have a concern about any content on this site, please reach out and it will be addressed promptly.</p>
        </section>

        <section class="about-section">
          <h2 class="about-heading">Data & Accuracy</h2>
          <p>Stats and rebirth requirements are maintained by community contributors and may not always reflect the latest game patch. If you spot something out of date, the project is open to corrections.</p>
        </section>

        <section class="about-section">
          <h2 class="about-heading">Eternal Machine Disclaimer</h2>
          <p>The Eternal Machine simulator is <strong>not representative of what you will receive in-game</strong>. It is a simulation built on the same probability logic the machine uses, intended to give you a sense of output frequency and relative rarity — nothing more. Results in the actual game are determined by the game's own systems and will vary. <strong>No particular outcome is guaranteed.</strong></p>
        </section>

        <p class="about-copy">&copy; {{ new Date().getFullYear() }} Brainrot Info &mdash; Unofficial fan site.</p>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import Sidebar from './components/Sidebar.vue';
import RebirthCard from './components/RebirthCard.vue';
import BrainrotCard from './components/BrainrotCard.vue';
import Calculator from './components/Calculator.vue';
import Machine from './components/Machine.vue';

const currentPage = ref('brainrots');
const rebirthData = ref([]);
const brainrotsData = ref([]);
const typesData = ref([]);
const traitsData = ref([]);
const machineData = ref(null);
const searchTerm = ref('');

// Whitelist of valid page IDs — any unrecognised hash falls back to 'rebirth'.
const VALID_PAGES = new Set(['rebirth', 'calculator', 'brainrots', 'machine', 'about']);

const parseHash = () => {
  const hash = window.location.hash.slice(1);
  // Manual indexOf instead of URLSearchParams so we only extract the one
  // param we expect and ignore anything else the URL might contain.
  const qIndex = hash.indexOf('?q=');
  const rawPage = qIndex === -1 ? hash : hash.slice(0, qIndex);
  const rawQuery = qIndex === -1 ? '' : hash.slice(qIndex + 3);

  const page = VALID_PAGES.has(rawPage) ? rawPage : 'brainrots';

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
    brainrots: 'Brainrots',
    machine: 'Eternal Machine',
    about: 'About'
  };
  return titles[currentPage.value] || 'Rebirth Guide';
});

const pageSubtitle = computed(() => {
  const subtitles = {
    rebirth: 'Plan your rebirth path with tier requirements, costs, and bonuses.',
    calculator: 'Estimate production and compare options with the unofficial calculator.',
    brainrots: 'Browse the current brainrot list with rarity, cost, and production details.',
    machine: 'Simulate the Eternal Machine — pick 5 Mythic+ brainrots and see what you could get.',
    about: ''
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

  // #<id> prefix: exact match by numeric ID
  if (searchTerm.value.startsWith('#')) {
    const id = parseInt(searchTerm.value.slice(1), 10);
    if (!isNaN(id)) {
      return visibleBrainrots.filter(brainrot => brainrot.id === id);
    }
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
  const brainrot = brainrotsData.value.find(b => b.name === name);
  const query = brainrot ? `#${brainrot.id}` : name;
  navigate('brainrots', query);
};

watch(currentPage, () => {
  window.scrollTo(0, 0);
});

onMounted(async () => {
  applyHash();
  window.addEventListener('popstate', applyHash);

  // Helper — fetch JSON and surface non-2xx as a rejection so allSettled catches it.
  const fetchJson = async (url) => {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return response.json();
  };

  try {
    const data = await fetchJson('/data.json');
    rebirthData.value = Array.isArray(data.rebirths) ? data.rebirths : [];
    brainrotsData.value = Array.isArray(data.brainrots)
      ? data.brainrots.map((b, i) => ({ ...b, id: i + 1 }))
      : [];
    typesData.value = Array.isArray(data.types) ? data.types : [];
    traitsData.value = Array.isArray(data.traits) ? data.traits : [];
    machineData.value = data.machine ?? null;
  } catch (error) {
    console.error('Error loading site data:', error);
  }
});
</script>

<style>
/* Import global styles */
@import './style.css';
</style>

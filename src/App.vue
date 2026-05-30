<template>
  <div class="app">
    <Sidebar :currentPage="currentPage" @navigate="handleNavigate" />

    <!-- Main Content -->
    <main class="main-content">
      <div class="page-header">
        <h1 class="page-title">{{ pageTitle }}</h1>
        <p class="page-subtitle">{{ pageSubtitle }}</p>
      </div>

      <BrainrotsPage
        v-if="currentPage === 'brainrots'"
        :brainrots="brainrotsData"
        v-model:searchTerm="searchTerm"
        @search-brainrot="handleBrainrotSearch"
      />
      <RebirthPage
        v-else-if="currentPage === 'rebirth'"
        :rebirths="rebirthData"
        :brainrots="brainrotsData"
        @search-brainrot="handleBrainrotSearch"
      />
      <Calculator
        v-else-if="currentPage === 'calculator'"
        :brainrots="brainrotsData"
        :types="typesData"
        :traits="traitsData"
      />
      <Machine
        v-else-if="currentPage === 'machine'"
        :brainrots="brainrotsData"
        :machine="machineData"
      />
      <EventsPage
        v-else-if="currentPage === 'events'"
        :events="eventsData"
      />
      <CodesPage
        v-else-if="currentPage === 'codes'"
        :codes="codesData"
      />
      <AboutPage v-else-if="currentPage === 'about'" @navigate="handleNavigate" />
      <PrivacyPage v-else-if="currentPage === 'privacy'" />

      <div class="content-spacer"></div>
      <footer class="site-footer">
        <a href="#privacy" class="site-footer-link" @click.prevent="handleNavigate('privacy')">Privacy Policy</a>
      </footer>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed, watch, defineAsyncComponent } from 'vue';
import Sidebar from './components/Sidebar.vue';
import { trackAdsConversion, primeAdsTracking } from './utils/adsTracking.js';

const BrainrotsPage = defineAsyncComponent(() => import('./components/BrainrotsPage.vue'));
const RebirthPage   = defineAsyncComponent(() => import('./components/RebirthPage.vue'));
const Calculator    = defineAsyncComponent(() => import('./components/Calculator.vue'));
const Machine       = defineAsyncComponent(() => import('./components/Machine.vue'));
const EventsPage    = defineAsyncComponent(() => import('./components/EventsPage.vue'));
const CodesPage     = defineAsyncComponent(() => import('./components/CodesPage.vue'));
const AboutPage     = defineAsyncComponent(() => import('./components/AboutPage.vue'));
const PrivacyPage   = defineAsyncComponent(() => import('./components/PrivacyPage.vue'));

const currentPage = ref('brainrots');
const rebirthData = ref([]);
const brainrotsData = ref([]);
const typesData = ref([]);
const traitsData = ref([]);
const machineData = ref(null);
const eventsData = ref([]);
const codesData = ref([]);
const searchTerm = ref('');
const lastTrackedSearch = ref('');
let searchConversionTimer = null;

// Whitelist of valid page IDs — any unrecognised hash falls back to 'brainrots'.
const VALID_PAGES = new Set(['rebirth', 'calculator', 'brainrots', 'machine', 'events', 'codes', 'about', 'privacy']);

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
    events: 'Events',
    codes: 'Codes',
    about: 'About',
    privacy: 'Privacy Policy'
  };
  return titles[currentPage.value] || 'Rebirth Guide';
});

const pageSubtitle = computed(() => {
  const subtitles = {
    rebirth: 'Plan your rebirth path with tier requirements, costs, and bonuses.',
    calculator: 'Estimate production and compare options with the unofficial calculator.',
    brainrots: 'Browse the current brainrot list with rarity, cost, and production details.',
    machine: 'Simulate the Eternal Machine — pick 5 Mythic+ brainrots and see what you could get.',
    events: 'Track active and upcoming in-game events in your local timezone.',
    codes: 'Redeem these codes in-game for free rewards.',
    about: '',
    privacy: ''
  };
  return subtitles[currentPage.value] || '';
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
  navigate('brainrots', brainrot ? `#${brainrot.id}` : name);
};

const trackPageConversions = (pageId) => {
  if (pageId === 'brainrots') {
    trackAdsConversion({
      label: '6teECKG71fQBEJPNn-IB',
      value: 0.0
    });
  }
};

const trackSearchConversion = (rawSearch) => {
  if (currentPage.value !== 'brainrots') return;

  const normalizedSearch = rawSearch.trim().toLowerCase();
  if (!normalizedSearch || normalizedSearch === lastTrackedSearch.value) return;

  trackAdsConversion({
    label: 'Y__tCKq71fQBEJPNn-IB',
    value: 0.0
  });

  lastTrackedSearch.value = normalizedSearch;
};

watch(currentPage, (pageId) => {
  window.scrollTo(0, 0);
  trackPageConversions(pageId);
});

watch(searchTerm, (value) => {
  if (searchConversionTimer) {
    clearTimeout(searchConversionTimer);
  }

  searchConversionTimer = setTimeout(() => {
    trackSearchConversion(value);
  }, 400);
});

onMounted(async () => {
  primeAdsTracking();
  applyHash();
  trackPageConversions(currentPage.value);
  window.addEventListener('popstate', applyHash);

  // Helper — fetch JSON and surface non-2xx as a rejection so the catch handles it.
  const fetchJson = async (url) => {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return response.json();
  };

  try {
    const data = await fetchJson(`/data.json?v=${__BUILD_TIMESTAMP__}`);
    rebirthData.value = Array.isArray(data.rebirths) ? data.rebirths : [];
    brainrotsData.value = Array.isArray(data.brainrots)
      ? data.brainrots.map((b, i) => ({ ...b, id: i + 1 }))
      : [];
    typesData.value = Array.isArray(data.types) ? data.types : [];
    traitsData.value = Array.isArray(data.traits) ? data.traits : [];
    machineData.value = data.machine ?? null;
    eventsData.value = Array.isArray(data.events) ? data.events : [];
    codesData.value = Array.isArray(data.codes) ? data.codes : [];
  } catch (error) {
    console.error('Error loading site data:', error);
  }
});

onUnmounted(() => {
  window.removeEventListener('popstate', applyHash);
  if (searchConversionTimer) {
    clearTimeout(searchConversionTimer);
  }
});
</script>

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
          <div class="search-input-wrap">
            <input 
              type="text" 
              v-model="searchTerm" 
              placeholder="Search"
              class="search-input"
            />
            <button
              v-if="searchTerm"
              type="button"
              class="search-clear-btn"
              aria-label="Clear search"
              @click="searchTerm = ''"
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
            @select="openBrainrotDetails"
          />
        </div>
        <BrainrotDetailModal
          v-if="selectedBrainrot"
          :brainrot="selectedBrainrot"
          @close="closeBrainrotDetails"
        />
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

      <!-- Events Page -->
      <div v-else-if="currentPage === 'events'" class="events-page">
        <div v-if="currentEvents.length === 0" class="content-placeholder">
          There are currently no events in Steal the Brainrot. Check back on Fridays for weekend Admin Abuse event info.
        </div>
        <div v-else class="events-grid">
          <article
            v-for="event in currentEvents"
            :key="event.id"
            class="event-card"
          >
            <h2 class="event-title">{{ event.title }}</h2>

            <div class="event-detail-row">
              <span class="event-detail-label">Reward</span>
              <span class="event-detail-value event-reward">{{ event.reward }}</span>
            </div>

            <div class="event-timer-block">
              <p class="event-timer-label">{{ getEventTimerLabel(event) }}</p>
              <p class="event-timer" :class="{ starting: isEventStarting(event) }">{{ getEventTimerValue(event) }}</p>
            </div>
          </article>
        </div>
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

        <section class="about-section">
          <h2 class="about-heading">Bugs & Contributions</h2>
          <p>Found a bug or have a suggestion? The project is open source — you can report issues or submit contributions on <a href="https://github.com/bryce-schultz/brainrot-info" target="_blank" rel="noopener noreferrer" @click="handleGithubClick">GitHub</a>.</p>
        </section>

        <p class="about-copy">&copy; {{ new Date().getFullYear() }} Brainrot Info &mdash; Unofficial fan site.</p>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed, watch, defineAsyncComponent } from 'vue';
import Sidebar from './components/Sidebar.vue';
import BrainrotCard from './components/BrainrotCard.vue';
import { trackAdsEvent, trackAdsConversion, primeAdsTracking } from './utils/adsTracking.js';

const RebirthCard = defineAsyncComponent(() => import('./components/RebirthCard.vue'));
const BrainrotDetailModal = defineAsyncComponent(() => import('./components/BrainrotDetailModal.vue'));
const Calculator = defineAsyncComponent(() => import('./components/Calculator.vue'));
const Machine = defineAsyncComponent(() => import('./components/Machine.vue'));

const currentPage = ref('brainrots');
const rebirthData = ref([]);
const brainrotsData = ref([]);
const typesData = ref([]);
const traitsData = ref([]);
const machineData = ref(null);
const eventsData = ref([]);
const searchTerm = ref('');
const lastTrackedSearch = ref('');
const nowTimestamp = ref(Date.now());
const selectedBrainrot = ref(null);
let searchConversionTimer = null;
let eventTimerInterval = null;
let lockedScrollY = 0;

// Whitelist of valid page IDs — any unrecognised hash falls back to 'rebirth'.
const VALID_PAGES = new Set(['rebirth', 'calculator', 'brainrots', 'machine', 'events', 'about']);

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
    events: 'Track active and upcoming in-game events in your local timezone.',
    about: ''
  };
  return subtitles[currentPage.value] || '';
});

const filteredBrainrots = computed(() => {
  const all = brainrotsData.value.filter(b => b.name !== '???');
  const q = searchTerm.value.trim();
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


const parseEventDate = (value) => {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

const formatCountdown = (msRemaining) => {
  const safeMs = Math.max(0, msRemaining);
  const totalSeconds = Math.floor(safeMs / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const hh = String(hours).padStart(2, '0');
  const mm = String(minutes).padStart(2, '0');
  const ss = String(seconds).padStart(2, '0');

  if (days > 0) {
    return `${days}d ${hh}:${mm}:${ss}`;
  }

  return `${hh}:${mm}:${ss}`;
};

const currentEvents = computed(() => {
  const now = nowTimestamp.value;

  return eventsData.value
    .map((event, index) => {
      const title = (event.title || event.name || '').trim() || 'Untitled Event';
      const reward = (event.reward || '').trim() || 'TBA';
      const startAt = parseEventDate(event.start);
      const endAt = parseEventDate(event.end);

      return {
        id: `${title}-${event.start || index}`,
        title,
        reward,
        startAt,
        endAt
      };
    })
    .filter((event) => !event.endAt || event.endAt.getTime() > now);
});

const isEventStarting = (event) => (
  Boolean(event.startAt) && nowTimestamp.value < event.startAt.getTime()
);

const getEventTimerLabel = (event) => (
  isEventStarting(event) ? 'Event starting in' : 'Event ends in'
);

const getEventTimerValue = (event) => {
  const now = nowTimestamp.value;

  if (isEventStarting(event)) {
    return formatCountdown(event.startAt.getTime() - now);
  }

  if (event.endAt) {
    return formatCountdown(event.endAt.getTime() - now);
  }

  return 'TBA';
};

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

const openBrainrotDetails = (brainrot) => {
  selectedBrainrot.value = brainrot;
};

const closeBrainrotDetails = () => {
  selectedBrainrot.value = null;
};

const lockBodyScroll = () => {
  if (document.body.style.position === 'fixed') return;
  lockedScrollY = window.scrollY || window.pageYOffset || 0;
  document.body.style.position = 'fixed';
  document.body.style.top = `-${lockedScrollY}px`;
  document.body.style.left = '0';
  document.body.style.right = '0';
  document.body.style.width = '100%';
};

const unlockBodyScroll = () => {
  if (document.body.style.position !== 'fixed') return;
  document.body.style.position = '';
  document.body.style.top = '';
  document.body.style.left = '';
  document.body.style.right = '';
  document.body.style.width = '';
  window.scrollTo(0, lockedScrollY);
};

const handleKeydown = (event) => {
  if (event.key === 'Escape' && selectedBrainrot.value) {
    closeBrainrotDetails();
  }
};

const handleGithubClick = () => {
  trackAdsEvent('click_github_link', {
    event_category: 'engagement',
    event_label: 'about_page'
  });
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
  if (pageId !== 'brainrots') {
    closeBrainrotDetails();
  }
  trackPageConversions(pageId);
});

watch(filteredBrainrots, (brainrots) => {
  if (!selectedBrainrot.value) return;
  const stillVisible = brainrots.some((brainrot) => brainrot.name === selectedBrainrot.value.name);
  if (!stillVisible) {
    closeBrainrotDetails();
  }
});

watch(selectedBrainrot, (brainrot) => {
  if (brainrot) {
    lockBodyScroll();
  } else {
    unlockBodyScroll();
  }
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
  window.addEventListener('keydown', handleKeydown);
  eventTimerInterval = window.setInterval(() => {
    nowTimestamp.value = Date.now();
  }, 1000);

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
    eventsData.value = Array.isArray(data.events) ? data.events : [];
  } catch (error) {
    console.error('Error loading site data:', error);
  }
});

onUnmounted(() => {
  window.removeEventListener('popstate', applyHash);
  window.removeEventListener('keydown', handleKeydown);
  unlockBodyScroll();
  if (searchConversionTimer) {
    clearTimeout(searchConversionTimer);
  }
  if (eventTimerInterval) {
    clearInterval(eventTimerInterval);
  }
});
</script>

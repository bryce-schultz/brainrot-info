<template>
  <div class="events-page">
    <div v-if="currentEvents.length === 0" class="content-placeholder">
      There are currently no events in Steal the Brainrot. Check back on Fridays for weekend Admin Abuse event info.
    </div>
    <div v-else class="events-grid">
      <button
        v-for="event in currentEvents"
        :key="event.id"
        type="button"
        class="event-card"
        :aria-label="`View details for ${event.title}`"
        @click="openDetails(event)"
      >
        <h2 class="event-title">{{ event.title }}</h2>

        <div class="event-detail-row">
          <span class="event-detail-label">Reward</span>
          <span class="event-detail-value event-reward">{{ event.reward }}</span>
        </div>

        <div class="event-timer-block">
          <p class="event-timer-label">{{ getTimerLabel(event) }}</p>
          <p class="event-timer" :class="{ starting: isStarting(event) }">{{ getTimerValue(event) }}</p>
        </div>
      </button>
    </div>
    <EventDetailModal
      v-if="selectedEvent"
      :event="selectedEvent"
      :nowTimestamp="now"
      @close="closeDetails"
    />
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted, defineAsyncComponent } from 'vue';
import { lockBodyScroll, unlockBodyScroll } from '../utils/scrollLock.js';

const EventDetailModal = defineAsyncComponent(() => import('./EventDetailModal.vue'));

const props = defineProps({
  events: { type: Array, default: () => [] },
});

const now = ref(Date.now());
let timerInterval = null;
const selectedEvent = ref(null);

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

  const parts = [];
  if (days > 0) parts.push(`${days}d`);
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0 || parts.length === 0) parts.push(`${minutes}m`);

  return parts.join(' ');
};

const currentEvents = computed(() => {
  const nowMs = now.value;
  return props.events
    .map((event, index) => {
      const title = (event.title || event.name || '').trim() || 'Untitled Event';
      const reward = (event.reward || '').trim() || 'TBA';
      const startAt = parseEventDate(event.start);
      const endAt = parseEventDate(event.end);
      return { id: `${title}-${event.start || index}`, title, reward, startAt, endAt };
    })
    .filter((event) => !event.endAt || event.endAt.getTime() > nowMs);
});

const isStarting = (event) => Boolean(event.startAt) && now.value < event.startAt.getTime();

const getTimerLabel = (event) => isStarting(event) ? 'Event starting in' : 'Event ends in';

const getTimerValue = (event) => {
  const nowMs = now.value;
  if (isStarting(event)) return formatCountdown(event.startAt.getTime() - nowMs);
  if (event.endAt) return formatCountdown(event.endAt.getTime() - nowMs);
  return 'TBA';
};

const openDetails = (event) => {
  selectedEvent.value = event;
};

const closeDetails = () => {
  selectedEvent.value = null;
};

watch(selectedEvent, (event) => {
  if (event) lockBodyScroll();
  else unlockBodyScroll();
});

const handleKeydown = (e) => {
  if (e.key === 'Escape' && selectedEvent.value) closeDetails();
};

onMounted(() => {
  timerInterval = setInterval(() => { now.value = Date.now(); }, 1000);
  window.addEventListener('keydown', handleKeydown);
});

onUnmounted(() => {
  clearInterval(timerInterval);
  window.removeEventListener('keydown', handleKeydown);
  unlockBodyScroll();
});
</script>

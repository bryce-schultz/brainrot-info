<template>
  <Teleport to="body">
    <div class="event-detail-overlay" @click.self="$emit('close')">
      <article class="event-detail-modal">
        <button type="button" class="event-detail-close" aria-label="Close event details" @click="$emit('close')">
          &times;
        </button>

        <h2 class="event-detail-title">{{ event.title }}</h2>

        <div class="event-detail-stats">
          <div class="event-detail-stat">
            <span class="detail-label">Reward</span>
            <span class="detail-value event-reward">{{ event.reward }}</span>
          </div>
          <div v-if="event.startAt" class="event-detail-stat">
            <span class="detail-label">Start</span>
            <span class="detail-value">{{ formatTime(event.startAt) }}</span>
          </div>
          <div v-if="event.endAt" class="event-detail-stat">
            <span class="detail-label">End</span>
            <span class="detail-value">{{ formatTime(event.endAt) }}</span>
          </div>
          <div v-if="duration" class="event-detail-stat">
            <span class="detail-label">Duration</span>
            <span class="detail-value">{{ duration }}</span>
          </div>
        </div>

        <div class="event-detail-timer-block">
          <p class="event-timer-label">{{ timerLabel }}</p>
          <p class="event-timer" :class="{ starting: isStarting }">{{ timerValue }}</p>
        </div>
      </article>
    </div>
  </Teleport>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  event: { type: Object, required: true },
  nowTimestamp: { type: Number, required: true },
});

defineEmits(['close']);

const isStarting = computed(() =>
  Boolean(props.event.startAt) && props.nowTimestamp < props.event.startAt.getTime()
);

const timerLabel = computed(() =>
  isStarting.value ? 'Event starting in' : 'Event ends in'
);

const formatCountdown = (msRemaining) => {
  const safeMs = Math.max(0, msRemaining);
  const totalSeconds = Math.floor(safeMs / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const parts = [];
  if (days > 0) parts.push(`${days}d`);
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0 || parts.length === 0) parts.push(`${minutes}m`);
  parts.push(`${seconds}s`);

  return parts.join(' ');
};

const timerValue = computed(() => {
  const now = props.nowTimestamp;
  if (isStarting.value) {
    return formatCountdown(props.event.startAt.getTime() - now);
  }
  if (props.event.endAt) {
    return formatCountdown(props.event.endAt.getTime() - now);
  }
  return 'TBA';
});

const formatTime = (date) => {
  if (!date) return 'TBA';
  return date.toLocaleString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
};

const duration = computed(() => {
  if (!props.event.startAt || !props.event.endAt) return null;
  const ms = props.event.endAt.getTime() - props.event.startAt.getTime();
  if (ms <= 0) return null;
  const totalMinutes = Math.round(ms / 60000);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  if (hours === 0) return `${minutes}m`;
  if (minutes === 0) return `${hours}h`;
  return `${hours}h ${minutes}m`;
});
</script>

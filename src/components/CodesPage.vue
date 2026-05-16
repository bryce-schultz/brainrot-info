<template>
  <div class="codes-page">
    <div v-if="!codes.length" class="content-placeholder">
      No active codes right now. Check back soon!
    </div>
    <div v-else class="codes-grid">
      <button
        v-for="(item, idx) in codes"
        :key="idx"
        class="code-card"
        :class="{ 'code-card--copied': copiedIndex === idx }"
        :aria-label="`Copy code ${item.code}`"
        @click="copyCode(item.code, idx)"
      >
        <div class="code-card-content">
          <div class="code-reward-label">Reward</div>
          <div class="code-reward-name">{{ item.reward }}</div>
          <div class="code-row">
            <span class="code-value">{{ item.code }}</span>
          </div>
        </div>
        <div class="code-card-copied">Copied!</div>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

defineProps({
  codes: { type: Array, default: () => [] },
});

const copiedIndex = ref(-1);
let resetTimer = null;

const copyCode = async (code, idx) => {
  try {
    await navigator.clipboard.writeText(String(code));
    copiedIndex.value = idx;
    if (resetTimer) clearTimeout(resetTimer);
    resetTimer = setTimeout(() => { copiedIndex.value = -1; }, 1500);
  } catch {
    // clipboard unavailable — silently ignore
  }
};
</script>

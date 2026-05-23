<template>
  <div class="machine">

    <!-- Input Slots -->
    <section class="machine-section">
      <h2 class="machine-section-title">
        Input Brainrots
      </h2>
      <div class="machine-slots">
        <BrainrotPortraitCard
          v-for="i in 5"
          :key="i"
          :brainrot="slots[i - 1]"
          @click="openPicker(i - 1)"
        />
      </div>
    </section>

    <!-- Production & Threshold Bar -->
    <div class="machine-production-bar">
      <div class="machine-production-item">
        <span class="machine-production-label">Total Production</span>
        <span class="machine-production-value">{{ formatCash(totalProduction) }}/s</span>
      </div>
      <div class="machine-production-divider"></div>
      <div class="machine-production-item">
        <span class="machine-production-label">Active Threshold</span>
        <span class="machine-production-value threshold-val">
          {{ formatCash(activeThreshold?.amount ?? 0) }}+
        </span>
      </div>
      <div class="machine-production-divider"></div>
      <label class="machine-luck-toggle" for="machine-luck-toggle">
        <span class="machine-production-label">Use Luck</span>
        <input
          id="machine-luck-toggle"
          v-model="luckEnabled"
          type="checkbox"
        />
      </label>
    </div>

    <!-- Possible Results -->
    <section class="machine-section" v-if="hasAnySelectedBrainrot && displayOptions.length">
      <h2 class="machine-section-title">Possible Results</h2>
      <div class="machine-odds-row">
        <template v-for="(opt, idx) in displayOptions" :key="idx">
          <!-- Single brainrot -->
          <div v-if="opt.type === 'single'" class="machine-odds-item">
            <div
              class="machine-odds-portrait"
              :class="`rarity-${getBrainrot(opt.name)?.rarity?.toLowerCase() ?? 'secret'}`"
            >
              <img
                v-if="getImage(opt.name)"
                :src="getImage(opt.name)"
                :alt="`Image of ${opt.name}`"
                class="machine-odds-img"
              />
              <span v-else class="machine-odds-unknown">?</span>
            </div>
            <div class="machine-odds-name">{{ opt.name }}</div>
            <div class="machine-odds-chance">{{ formatPercent(opt.effectiveChance) }}</div>
          </div>
          <!-- Group box -->
          <div v-else-if="opt.type === 'group'" class="machine-odds-group">
            <div class="machine-odds-group-members">
              <div
                v-for="name in opt.members"
                :key="name"
                class="machine-odds-item"
              >
                <div
                  class="machine-odds-portrait"
                  :class="`rarity-${getBrainrot(name)?.rarity?.toLowerCase() ?? 'secret'}`"
                >
                  <img
                    v-if="getImage(name)"
                    :src="getImage(name)"
                    :alt="`Image of ${name}`"
                    class="machine-odds-img"
                  />
                  <span v-else class="machine-odds-unknown">?</span>
                </div>
                <div class="machine-odds-name">{{ name }}</div>
              </div>
            </div>
            <div class="machine-odds-group-chance">{{ formatPercent(opt.chance) }}</div>
          </div>
        </template>
      </div>
    </section>

    <!-- Merge Button -->
    <div class="machine-merge-section">
      <button
        class="machine-merge-btn"
        :disabled="!canMerge"
        @click="doMerge"
      >
        Simulate Merge
      </button>
      <p v-if="!canMerge" class="machine-merge-hint">Select all 5 brainrots to simulate</p>
    </div>

    <!-- Picker Modal -->
    <BrainrotPickerModal
      v-if="activePickerSlot >= 0"
      :brainrots="eligibleBrainrots"
      :selected="slots[activePickerSlot]"
      @select="onSelect"
      @close="activePickerSlot = -1"
    />

    <!-- Merge Result Modal -->
    <Teleport to="body">
      <div
        v-if="mergeResult"
        class="picker-overlay"
        @click.self="mergeResult = null"
      >
        <div class="merge-result-modal">
          <div class="merge-result-header">You got...</div>
          <div
            class="merge-result-portrait"
            :class="`rarity-${mergeResult.rarity?.toLowerCase()}`"
          >
            <img
              v-if="getImage(mergeResult.name, 'md')"
              :src="getImage(mergeResult.name, 'md')"
              :alt="`Image of ${mergeResult.name}`"
              class="merge-result-img"
            />
            <span v-else class="merge-result-unknown">?</span>
          </div>
          <div class="merge-result-name">{{ mergeResult.name }}</div>
          <div class="merge-result-sub">
            <span
              class="rarity-badge"
              :class="`rarity-${mergeResult.rarity?.toLowerCase()}`"
            >{{ mergeResult.rarity }}</span>
            <span v-if="mergeResult.produces" class="merge-result-produces">
              {{ formatCash(mergeResult.produces) }}/s
            </span>
          </div>
          <button class="merge-dismiss-btn" @click="mergeResult = null">Dismiss</button>
        </div>
      </div>
    </Teleport>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { formatCash } from '../utils/formatter.js';
import { getBrainrotImage } from '../utils/brainrotImage.js';
import BrainrotPortraitCard from './BrainrotPortraitCard.vue';
import BrainrotPickerModal from './BrainrotPickerModal.vue';

const props = defineProps({
  brainrots: { type: Array, default: () => [] },
  machine:   { type: Object, default: null },
});

const MYTHIC_AND_ABOVE = new Set(['mythic', 'brainrotgod', 'secret', 'eternal']);

const slots = ref([null, null, null, null, null]);
const activePickerSlot = ref(-1);
const mergeResult = ref(null);
const luckEnabled = ref(false);

const getImage = (name, size = 'sm') => getBrainrotImage(name, size);

const eligibleBrainrots = computed(() =>
  props.brainrots.filter(b => MYTHIC_AND_ABOVE.has(b.rarity?.toLowerCase()))
);

const totalProduction = computed(() =>
  slots.value.reduce((sum, b) => sum + (b?.produces ?? 0), 0)
);

const activeThreshold = computed(() => {
  const thresholds = props.machine?.thresholds;
  if (!thresholds?.length) return null;
  // Highest threshold whose amount does not exceed total production.
  return [...thresholds]
    .sort((a, b) => b.amount - a.amount)
    .find(t => totalProduction.value >= t.amount) ?? null;
});

const machineGroupsByKey = computed(() => {
  const groups = props.machine?.groups;
  if (!groups) return new Map();

  // New format: groups is an object map, e.g. { "1": ["A", "B"] }
  if (!Array.isArray(groups) && typeof groups === 'object') {
    return new Map(
      Object.entries(groups).map(([key, rots]) => [
        String(key),
        Array.isArray(rots) ? rots : [],
      ])
    );
  }

  // Legacy format: groups is an array of { key, rots }
  if (Array.isArray(groups)) {
    return new Map(
      groups
        .filter(g => g && g.key != null)
        .map(g => [String(g.key), Array.isArray(g.rots) ? g.rots : []])
    );
  }

  return new Map();
});

const resolveGroupMembers = (groupRef) => {
  // Backward compatibility: allow inline arrays in thresholds.
  if (Array.isArray(groupRef)) return groupRef;
  if (groupRef == null) return [];
  return machineGroupsByKey.value.get(String(groupRef)) ?? [];
};

const getOptionChance = (opt) => {
  const luckyChance = Number(opt?.luckyChance);
  if (luckEnabled.value && Number.isFinite(luckyChance)) {
    return luckyChance;
  }
  const baseChance = Number(opt?.chance);
  return Number.isFinite(baseChance) ? baseChance : 0;
};

// Special replacement rules: active when the required brainrots are in the slots.
const machineReplacements = computed(() => props.machine?.replacements ?? []);

const activeReplacements = computed(() => {
  const slotCounts = {};
  for (const b of slots.value) {
    if (b) slotCounts[b.name] = (slotCounts[b.name] ?? 0) + 1;
  }
  return machineReplacements.value.filter(rule => {
    const reqCounts = {};
    for (const name of rule.requirement) {
      reqCounts[name] = (reqCounts[name] ?? 0) + 1;
    }
    return Object.entries(reqCounts).every(([name, count]) => (slotCounts[name] ?? 0) >= count);
  });
});

// Apply active replacements to a threshold's options list.
const applyReplacements = (options) => {
  if (!activeReplacements.value.length) return options;
  return options.map(opt => {
    for (const rule of activeReplacements.value) {
      const { replaces, replacement } = rule;
      const matchesBrainrot = replaces.brainrot != null && opt.brainrot === replaces.brainrot;
      const matchesGroup = replaces.group != null && String(opt.group) === String(replaces.group);
      if (!matchesBrainrot && !matchesGroup) continue;
      // Single replacement item → brainrot; multiple → inline group.
      if (replacement.length === 1) {
        const { group: _g, ...rest } = opt;
        return { ...rest, brainrot: replacement[0] };
      } else {
        const { brainrot: _b, ...rest } = opt;
        return { ...rest, group: replacement };
      }
    }
    return opt;
  });
};

// Active threshold options with replacement rules applied.
const effectiveOptions = computed(() => {
  if (!activeThreshold.value) return [];
  return applyReplacements(activeThreshold.value.options);
});

// Build display entries, preserving group structure.
const displayOptions = computed(() => {
  if (!activeThreshold.value) return [];
  const result = [];
  for (const opt of effectiveOptions.value) {
    const effectiveChance = getOptionChance(opt);
    if (opt.brainrot) {
      result.push({ type: 'single', name: opt.brainrot, effectiveChance });
    } else if (opt.group) {
      const members = resolveGroupMembers(opt.group);
      if (members.length) {
        result.push({ type: 'group', members, chance: effectiveChance });
      }
    }
  }
  return result;
});

const canMerge = computed(() => slots.value.every(s => s !== null));
const hasAnySelectedBrainrot = computed(() => slots.value.some(s => s !== null));

// Look up brainrot by name — try exact, then case-insensitive.
const getBrainrot = (name) =>
  props.brainrots.find(b => b.name === name) ??
  props.brainrots.find(b => b.name.toLowerCase() === name.toLowerCase()) ??
  null;

const formatPercent = (chance) => {
  const pct = chance * 100;
  // Avoid ".0" for whole numbers but keep decimals when meaningful.
  return pct % 1 === 0 ? `${pct}%` : `${parseFloat(pct.toFixed(2))}%`;
};

const openPicker = (index) => {
  activePickerSlot.value = index;
};

const onSelect = (rot) => {
  const s = [...slots.value];
  s[activePickerSlot.value] = rot;
  slots.value = s;
  activePickerSlot.value = -1;
};

const doMerge = () => {
  if (!activeThreshold.value) return;
  const roll = Math.random();
  let cumulative = 0;
  for (const opt of effectiveOptions.value) {
    cumulative += getOptionChance(opt);
    if (roll < cumulative) {
      let name;
      if (opt.brainrot) {
        name = opt.brainrot;
      } else {
        const members = resolveGroupMembers(opt.group);
        if (!members.length) continue;
        name = members[Math.floor(Math.random() * members.length)];
      }
      const found = getBrainrot(name);
      mergeResult.value = found ?? { name, produces: 0, rarity: 'Secret', asset: name.toLowerCase().replace(/\s+/g, '-') };
      return;
    }
  }
  // Floating-point rounding fallback: pick last option's last entry.
  const last = effectiveOptions.value[effectiveOptions.value.length - 1];
  const lastMembers = resolveGroupMembers(last.group);
  const lastName = last.brainrot ?? lastMembers[lastMembers.length - 1];
  if (!lastName) return;
  const found = getBrainrot(lastName);
  mergeResult.value = found ?? { name: lastName, produces: 0, rarity: 'Secret', asset: lastName.toLowerCase().replace(/\s+/g, '-') };
};
</script>

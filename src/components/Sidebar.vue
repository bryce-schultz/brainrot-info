<template>
  <div>
    <!-- Checkbox for sidebar toggle (CSS only) -->
    <input type="checkbox" id="sidebar-toggle" v-model="isExpanded">
    
    <!-- Sidebar Navigation -->
    <nav class="sidebar">
      <div class="sidebar-header">
        <label for="sidebar-toggle" class="toggle-btn">
          <img :src="arrowIcon" alt="" class="toggle-arrow" />
        </label>
        <div class="site-title">Brainrot Info</div>
      </div>
      <ul class="nav-menu">
        <li class="nav-item" v-for="item in navItems" :key="item.id">
          <a 
            :href="item.href" 
            class="nav-link" 
            :class="{ active: currentPage === item.id }"
            @click.prevent="$emit('navigate', item.id)"
          >
            <img :src="item.icon" alt="" class="nav-icon" />
            <span class="nav-text">{{ item.text }}</span>
          </a>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import brainrotIcon from '../assets/brainrot-icon.svg';
import rebirthIcon from '../assets/rebirth-icon.svg';
import calculatorIcon from '../assets/calculator-icon.svg';
import machineIcon from '../assets/machine-icon.svg';
import eventsIcon from '../assets/events-icon.svg';
import codesIcon from '../assets/codes-icon.svg';
import infoIcon from '../assets/info-icon.svg';
import arrowIcon from '../assets/arrow-icon.svg';

defineProps({
  currentPage: {
    type: String,
    default: 'rebirth'
  }
});

defineEmits(['navigate']);

const isExpanded = ref(false);

const navItems = [
  { id: 'brainrots', href: '#brainrots', text: 'Brainrots', icon: brainrotIcon },
  { id: 'rebirth', href: '#rebirth', text: 'Rebirth Guide', icon: rebirthIcon },
  { id: 'calculator', href: '#calculator', text: 'Calculator', icon: calculatorIcon },
  { id: 'machine', href: '#machine', text: 'Eternal Machine', icon: machineIcon },
  { id: 'events', href: '#events', text: 'Events', icon: eventsIcon },
  { id: 'codes', href: '#codes', text: 'Codes', icon: codesIcon },
  { id: 'about', href: '#about', text: 'About', icon: infoIcon }
];

function handleOutsideClick(e) {
  if (!isExpanded.value) return;
  const sidebar = document.querySelector('.sidebar');
  if (sidebar && !sidebar.contains(e.target)) {
    isExpanded.value = false;
  }
}

onMounted(() => document.addEventListener('click', handleOutsideClick, true));
onUnmounted(() => document.removeEventListener('click', handleOutsideClick, true));
</script>

<style scoped>
/* Scoped styles are in the main App styles */
</style>

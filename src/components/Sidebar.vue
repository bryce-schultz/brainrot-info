<template>
  <div>
    <!-- Checkbox for sidebar toggle (CSS only) -->
    <input type="checkbox" id="sidebar-toggle" v-model="isExpanded">
    
    <!-- Sidebar Navigation -->
    <nav class="sidebar">
      <div class="sidebar-header">
        <label for="sidebar-toggle" class="toggle-btn">
          <span class="toggle-arrow"></span>
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
            <span class="nav-icon" :class="item.iconClass"></span>
            <span class="nav-text">{{ item.text }}</span>
          </a>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script setup>
import { ref } from 'vue';

defineProps({
  currentPage: {
    type: String,
    default: 'rebirth'
  }
});

defineEmits(['navigate']);

const isExpanded = ref(false);

const navItems = [
  { id: 'rebirth', href: '#rebirth', text: 'Rebirth Guide', iconClass: 'icon-upgrade' },
  { id: 'calculator', href: '#calculator', text: 'Calculator', iconClass: 'icon-calculator' },
  { id: 'brainrots', href: '#brainrots', text: 'Brainrots', iconClass: 'icon-brainrot' }
];
</script>

<style scoped>
/* Scoped styles are in the main App styles */
</style>

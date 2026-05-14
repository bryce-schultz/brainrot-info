<template>
  <div class="about-page">
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
</template>

<script setup>
import { trackAdsEvent } from '../utils/adsTracking.js';

const handleGithubClick = () => {
  trackAdsEvent('click_github_link', {
    event_category: 'engagement',
    event_label: 'about_page'
  });
};
</script>

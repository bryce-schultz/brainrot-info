<template>
  <div class="info-page">
    <section class="info-section">
      <p class="privacy-updated">Last updated: May 30, 2026</p>
      <p>This page explains what information Brainrot Info (<strong>brainrot-info.com</strong>) collects when you visit, how it is used, and your choices. This is an unofficial, non-commercial fan site with no user accounts or forms — we do not collect any personal information directly.</p>
    </section>

    <section class="info-section">
      <h2 class="info-heading">Analytics & Advertising (Google)</h2>
      <p>This site uses <strong>Google Ads conversion tracking</strong> via Google Tag Manager (tag ID <code>AW-474474131</code>). This service is provided by Google LLC and is governed by <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">Google's Privacy Policy</a>.</p>
      <p>Google's scripts are loaded lazily — they are only fetched after your first intentional interaction with the page (a click, key press, or scroll). No tracking request is sent to Google before that point.</p>
      <p>Once loaded, Google may collect the following through its cookies and scripts:</p>
      <ul class="info-list">
        <li>The pages you visit on this site (page-view conversions)</li>
        <li>Whether you used the brainrot search feature (search conversions)</li>
        <li>Whether you clicked the GitHub link on the About page</li>
        <li>Your approximate geographic location (country/region, derived from IP address)</li>
        <li>Browser type, device type, and operating system</li>
        <li>Referrer URL (the page that linked you here)</li>
      </ul>
      <p>This data is used solely to understand how people find and use the site. No data is sold or shared with any party other than Google as the analytics processor.</p>
    </section>

    <section class="info-section">
      <h2 class="info-heading">Cookies</h2>
      <p>This site does not set any first-party cookies. Google's tracking scripts may set third-party cookies (such as <code>_gcl_au</code>) for the purpose of conversion measurement. These cookies are governed by <a href="https://policies.google.com/technologies/cookies" target="_blank" rel="noopener noreferrer">Google's Cookie Policy</a>.</p>
      <p>You can opt out of Google's advertising cookies at any time via <a href="https://adssettings.google.com/" target="_blank" rel="noopener noreferrer">Google Ad Settings</a> or by installing the <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer">Google Analytics Opt-out Browser Add-on</a>.</p>
    </section>

    <section class="info-section">
      <h2 class="info-heading">Data We Do Not Collect</h2>
      <ul class="info-list">
        <li>Names, email addresses, or any contact information</li>
        <li>Passwords or account credentials (there are no accounts on this site)</li>
        <li>Payment information</li>
        <li>The specific brainrot names you search for (only the fact that a search occurred is tracked, not its content)</li>
      </ul>
    </section>

    <section class="info-section">
      <h2 class="info-heading">Third-Party Services</h2>
      <p>Besides Google, the site links externally to <strong>GitHub</strong> (github.com). Following that link is subject to GitHub's own privacy policy. No data is shared with GitHub by this site.</p>
    </section>

    <section class="info-section">
      <h2 class="info-heading">Children's Privacy</h2>
      <p>This site is a fan resource for a Fortnite minigame and may be used by players of all ages, including minors. We do not collect any personal information directly. The only data processing that occurs is through Google's analytics scripts, which are subject to <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">Google's Privacy Policy</a>. Parents or guardians with concerns about Google's data practices can review Google's <a href="https://families.google.com/familylink/privacy/child-policy/" target="_blank" rel="noopener noreferrer">children's privacy disclosures</a> and opt out via <a href="https://adssettings.google.com/" target="_blank" rel="noopener noreferrer">Google Ad Settings</a>.</p>
    </section>

    <section class="info-section">
      <h2 class="info-heading">Changes to This Policy</h2>
      <p>If this policy changes materially, the "Last updated" date at the top of this page will be revised. Continued use of the site after an update constitutes acceptance of the revised policy.</p>
    </section>

    <section class="info-section">
      <h2 class="info-heading">Contact</h2>
      <p>Questions about this policy? Open an issue on the project's <a href="https://github.com/bryce-schultz/brainrot-info" target="_blank" rel="noopener noreferrer">GitHub repository</a>.</p>
    </section>

    <p class="info-copy">&copy; {{ new Date().getFullYear() }} Brainrot Info &mdash; Unofficial fan site.</p>
  </div>
</template>

<style scoped>
.privacy-updated {
  font-size: 13px;
  color: var(--text-secondary);
  opacity: 0.7;
}
</style>

<template>
  <div class="used-by">
    <p>
      <span class="label">Trusted by teams at</span>
      {{ companies.join(', ') }}, and <a href="/sponsor">more</a>.
    </p>
  </div>
</template>

<script setup lang="ts">
const companies = [
  'Google',
  'Microsoft',
  'Atlassian',
  'Spotify',
  'MongoDB',
  'Vercel',
  'Adobe',
  'Signal',
  'HashiCorp',
  'SAP',
  'IBM',
  'Nvidia',
  'Grafana',
  'Elastic',
  'Datadog',
  'PostHog',
  'Mapbox',
]
</script>

<style scoped lang="css">
.used-by {
  padding: 16px 0;
}

.used-by p {
  font-size: 14px;
  color: var(--c-text-lighter);
  line-height: 1.6;
}

.used-by .label {
  font-weight: 600;
}

.used-by a {
  color: var(--c-text-lighter);
}
</style>

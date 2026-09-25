<script setup lang="ts">
defineProps<{ kind: 'yes' | 'no' | 'part', text?: string }>()

const paths = {
  yes: 'M5 12.5l4.5 4.5L19 7.5',
  no: 'M7 7l10 10M17 7L7 17',
  part: 'M6 12h12',
}
</script>

<template>
  <span class="inline-flex items-center gap-2">
    <span class="mark" :class="kind">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path :d="paths[kind]" /></svg>
    </span>
    <span v-if="text" class="text-[12px]" :class="kind === 'yes' ? 'text-ink' : 'text-muted'">{{ text }}</span>
  </span>
</template>

<style scoped>
.mark {
  display: grid;
  place-items: center;
  width: 20px;
  height: 20px;
  border-radius: 999px;
  flex: none;
}

.mark svg {
  width: 11px;
  height: 11px;
}

.yes {
  color: var(--emerald);
  background: color-mix(in srgb, var(--emerald) 16%, transparent);
}

.no {
  color: var(--rose);
  background: color-mix(in srgb, var(--rose) 14%, transparent);
}

.part {
  color: var(--amber);
  background: color-mix(in srgb, var(--amber) 16%, transparent);
}
</style>

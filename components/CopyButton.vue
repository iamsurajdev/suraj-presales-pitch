<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{ text: string }>()
const copied = ref(false)

async function copy() {
  try {
    await navigator.clipboard.writeText(props.text)
    copied.value = true
    setTimeout(() => (copied.value = false), 1800)
  }
  catch {
    // Clipboard can be blocked (e.g. insecure context); the mailto link still works.
  }
}
</script>

<template>
  <button class="btn btn-ghost !px-3.5" :aria-label="`Copy ${text}`" @mousedown.prevent @click="copy">
    <svg v-if="!copied" class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="11" height="11" rx="2" /><path d="M5 15V5a2 2 0 0 1 2-2h10" /></svg>
    <svg v-else class="h-4 w-4 text-emerald" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>
    <span class="text-[12.5px]">{{ copied ? 'Copied' : 'Copy' }}</span>
  </button>
</template>

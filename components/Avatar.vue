<script setup lang="ts">
import { ref } from 'vue'

// Drop a portrait at public/suraj.jpg to replace the monogram.
withDefaults(defineProps<{ src?: string, size?: number, alt?: string }>(), {
  src: '/suraj.jpg',
  size: 44,
  alt: 'Suraj Biswas',
})

const failed = ref(false)
</script>

<template>
  <div
    class="relative shrink-0 overflow-hidden rounded-full"
    :style="{ width: `${size}px`, height: `${size}px` }"
  >
    <img
      v-if="!failed"
      :src="src"
      :alt="alt"
      class="h-full w-full object-cover"
      @error="failed = true"
    >
    <div
      v-else
      class="grid h-full w-full place-items-center font-display font-600 text-white"
      :style="{
        fontSize: `${size * 0.36}px`,
        background: 'linear-gradient(135deg, var(--accent), var(--accent-2) 55%, var(--cyan))',
      }"
    >
      SB
    </div>
    <div class="pointer-events-none absolute inset-0 rounded-full ring-1 ring-inset ring-white/15" />
  </div>
</template>

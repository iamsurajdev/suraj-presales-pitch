<script setup lang="ts">
// 150 cells: one per permission. The fill pattern is deterministic so
// the grid looks the same on every render and in exports.
const cols = 25
const cells = Array.from({ length: 150 }, (_, i) => {
  const h = Math.sin(i * 12.9898) * 43758.5453
  const r = h - Math.floor(h)
  return r > 0.72 ? 3 : r > 0.42 ? 2 : r > 0.18 ? 1 : 0
})
</script>

<template>
  <div>
    <div class="grid gap-[3px]" :style="{ gridTemplateColumns: `repeat(${cols}, 1fr)` }">
      <span
        v-for="(level, i) in cells"
        :key="i"
        class="cell"
        :class="`l${level}`"
        :style="{ animationDelay: `${400 + (i % cols) * 22 + Math.floor(i / cols) * 40}ms` }"
      />
    </div>
    <div class="mt-2 flex justify-between font-mono text-[9px] tracking-wider text-subtle">
      <span>role × resource × action</span>
      <span>150 cells</span>
    </div>
  </div>
</template>

<style scoped>
.cell {
  aspect-ratio: 1;
  border-radius: 2px;
  background: color-mix(in srgb, var(--fg) 7%, transparent);
  animation: pop 0.5s var(--ease-out) both;
}

.l1 { background: color-mix(in srgb, var(--a) 28%, transparent); }
.l2 { background: color-mix(in srgb, var(--a) 58%, transparent); }
.l3 { background: var(--a); box-shadow: 0 0 6px color-mix(in srgb, var(--a) 60%, transparent); }

@keyframes pop {
  from {
    opacity: 0;
    transform: scale(0.3);
  }
}
</style>

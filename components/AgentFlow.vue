<script setup lang="ts">
const steps = [
  { label: 'Retrieve', icon: 'M4 6h16M4 12h10M4 18h7' },
  { label: 'Reason', icon: 'M12 3a6 6 0 0 0-3.5 10.9V17h7v-3.1A6 6 0 0 0 12 3ZM9.5 21h5' },
  { label: 'Guardrails', icon: 'M12 3l7 3v5c0 4.5-3 8.3-7 10-4-1.7-7-5.5-7-10V6l7-3Z' },
  { label: 'Audit log', icon: 'M8 4h8l4 4v12H4V4h4M8 12h8M8 16h5' },
]
</script>

<template>
  <div>
    <div class="relative flex items-start justify-between">
      <svg class="absolute left-[18px] right-[18px] top-[17px] h-[2px] w-[calc(100%-36px)]" viewBox="0 0 100 2" preserveAspectRatio="none" aria-hidden="true">
        <line x1="0" y1="1" x2="100" y2="1" stroke="var(--line-strong)" stroke-width="2" />
        <line class="flow" x1="0" y1="1" x2="100" y2="1" stroke="var(--a)" stroke-width="2" stroke-dasharray="6 10" />
      </svg>
      <div v-for="(s, i) in steps" :key="s.label" class="relative flex flex-col items-center gap-1.5 rise" :style="{ '--d': 5 + i }">
        <div class="step" :class="{ last: i === steps.length - 1 }">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path :d="s.icon" /></svg>
        </div>
        <span class="font-mono text-[9px] tracking-wide text-subtle">{{ s.label }}</span>
      </div>
    </div>
    <div class="mt-2.5 flex justify-center gap-1.5">
      <span class="chip !h-5 !text-[9.5px]">LangChain</span>
      <span class="chip !h-5 !text-[9.5px]">Azure</span>
      <span class="chip !h-5 !text-[9.5px]">Regulated data</span>
    </div>
  </div>
</template>

<style scoped>
.step {
  display: grid;
  place-items: center;
  width: 36px;
  height: 36px;
  border-radius: 11px;
  background: var(--glass-strong);
  border: 1px solid var(--line-strong);
  color: var(--a);
}

.step.last {
  background: color-mix(in srgb, var(--a) 16%, var(--glass-strong));
  border-color: color-mix(in srgb, var(--a) 50%, transparent);
}

.step svg {
  width: 16px;
  height: 16px;
}

.flow {
  animation: flow 1.2s linear infinite;
}

@keyframes flow {
  to {
    stroke-dashoffset: -16;
  }
}
</style>

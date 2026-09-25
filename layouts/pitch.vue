<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  /** Section label shown above the headline, e.g. "The bottleneck". */
  kicker?: string
  /** Section number, e.g. "01". */
  index?: string
  /** Per-slide tint for glows, kicker and focus rings. */
  accent?: 'indigo' | 'violet' | 'rose' | 'cyan' | 'emerald' | 'amber'
  /** Vertically centre the content (cover / closing slides). */
  center?: boolean
  /** Background orb arrangement. */
  orbs?: 'corners' | 'top' | 'center' | 'none'
}>(), {
  accent: 'indigo',
  center: false,
  orbs: 'corners',
})

const tint = computed(() => ({
  indigo: 'var(--accent)',
  violet: 'var(--accent-2)',
  rose: 'var(--rose)',
  cyan: 'var(--cyan)',
  emerald: 'var(--emerald)',
  amber: 'var(--amber)',
})[props.accent])
</script>

<template>
  <div class="pitch" :style="{ '--a': tint }">
    <!-- Background system -->
    <div class="pitch-bg" aria-hidden="true">
      <div class="pitch-grid" />
      <template v-if="orbs === 'corners'">
        <div class="orb fade-in" style="width: 460px; height: 460px; top: -300px; right: -200px; background: var(--a)" />
        <div class="orb fade-in" style="--d: 3; width: 420px; height: 420px; bottom: -280px; left: -160px; background: var(--accent-2); opacity: calc(var(--orb-opacity) * 0.6)" />
      </template>
      <template v-else-if="orbs === 'top'">
        <div class="orb fade-in" style="width: 760px; height: 300px; top: -220px; left: 50%; translate: -50% 0; background: var(--a)" />
      </template>
      <template v-else-if="orbs === 'center'">
        <div class="orb fade-in" style="width: 560px; height: 560px; top: 50%; left: 50%; translate: -50% -50%; background: var(--a); opacity: calc(var(--orb-opacity) * 0.45)" />
      </template>
      <div class="pitch-vignette" />
    </div>

    <div class="pitch-body" :class="{ 'justify-center items-center text-center': center }">
      <div v-if="kicker" class="pitch-kicker rise">
        <span class="pitch-kicker-dot" />
        <span v-if="index" class="text-ink">{{ index }}</span>
        <span v-if="index" class="opacity-40">/</span>
        <span>{{ kicker }}</span>
      </div>
      <slot />
    </div>
  </div>
</template>

<style scoped>
.pitch {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: var(--bg);
  color: var(--fg);
  font-size: 15px;
}

.pitch-bg {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.pitch-grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(var(--grid-line) 1px, transparent 1px),
    linear-gradient(90deg, var(--grid-line) 1px, transparent 1px);
  background-size: 44px 44px;
  background-position: -1px -1px;
  mask-image: radial-gradient(ellipse 70% 60% at 50% 35%, #000 20%, transparent 75%);
  -webkit-mask-image: radial-gradient(ellipse 70% 60% at 50% 35%, #000 20%, transparent 75%);
}

.orb {
  position: absolute;
  border-radius: 999px;
  filter: blur(90px);
  opacity: var(--orb-opacity);
}

.pitch-vignette {
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse 120% 90% at 50% 40%, transparent 55%, var(--bg) 100%);
}

.pitch-body {
  position: relative;
  z-index: 1;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 40px 56px 56px;
}

.pitch-kicker {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 14px;
  font-family: var(--slidev-code-font-family, ui-monospace, monospace);
  font-size: 10.5px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--a);
}

.pitch-kicker-dot {
  width: 6px;
  height: 6px;
  border-radius: 2px;
  background: var(--a);
  box-shadow: 0 0 12px var(--a);
}
</style>

<script setup lang="ts">
import { useDarkMode, useNav } from '@slidev/client'
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

const { isDark, toggleDark } = useDarkMode()
const { currentPage, total, next, prev, hasNext, hasPrev, isPrintMode, isPresenter } = useNav()

const progress = computed(() => total.value > 1 ? (currentPage.value - 1) / (total.value - 1) : 1)
const pad = (n: number) => String(n).padStart(2, '0')
const onFirst = computed(() => currentPage.value === 1)

// Touch visitors get "swipe" wording instead of keycaps.
const isTouch = ref(false)

// ---- Wheel / trackpad navigation --------------------------------------
// Visitors arriving from a link instinctively scroll. Treat one scroll
// gesture (including trackpad inertia) as exactly one slide step.
// A module-level flag keeps a single listener when Slidev mounts this
// layer more than once (e.g. presenter previews).
let owner = false
let locked = false
let lockedAt = 0
let quietTimer: ReturnType<typeof setTimeout> | undefined

function release() {
  // Hold for at least 650ms and until the gesture has gone quiet.
  const wait = 650 - (performance.now() - lockedAt)
  if (wait > 0)
    quietTimer = setTimeout(release, wait)
  else
    locked = false
}

function onWheel(e: WheelEvent) {
  if (e.ctrlKey || isPresenter.value || isPrintMode.value)
    return
  const delta = Math.abs(e.deltaY) >= Math.abs(e.deltaX) ? e.deltaY : e.deltaX
  clearTimeout(quietTimer)
  quietTimer = setTimeout(release, 180)
  if (locked || Math.abs(delta) < 14)
    return
  locked = true
  lockedAt = performance.now()
  delta > 0 ? next() : prev()
}

onMounted(() => {
  isTouch.value = window.matchMedia('(pointer: coarse)').matches
  if (!(window as any).__pitchWheel) {
    (window as any).__pitchWheel = true
    owner = true
    window.addEventListener('wheel', onWheel, { passive: true })
  }
})

onBeforeUnmount(() => {
  if (owner) {
    window.removeEventListener('wheel', onWheel)
    ;(window as any).__pitchWheel = false
  }
})
</script>

<template>
  <div v-if="!isPrintMode" class="chrome">
    <!-- Theme toggle -->
    <button
      class="theme-toggle glass"
      :aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
      :title="isDark ? 'Light mode' : 'Dark mode'"
      @mousedown.prevent
      @click="toggleDark()"
    >
      <span class="theme-track">
        <span class="theme-thumb" :class="{ on: isDark }">
          <!-- sun -->
          <svg v-if="!isDark" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></svg>
          <!-- moon -->
          <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.5 14.5A8.5 8.5 0 0 1 9.5 3.5a8.5 8.5 0 1 0 11 11Z" /></svg>
        </span>
      </span>
      <span class="theme-label">{{ isDark ? 'Dark' : 'Light' }}</span>
    </button>

    <!-- Navigation dock -->
    <div class="dock glass glass-strong" :class="{ intro: onFirst }">
      <span v-if="onFirst" class="dock-hint">
        <template v-if="isTouch">Swipe to navigate</template>
        <template v-else>Use arrow keys or scroll</template>
      </span>
      <span v-else class="dock-count tabular">
        <span class="text-ink">{{ pad(currentPage) }}</span>
        <span class="opacity-40"> / {{ pad(total) }}</span>
      </span>
      <button class="dock-key" :disabled="!hasPrev" aria-label="Previous slide" @mousedown.prevent @click="prev()">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
      </button>
      <button class="dock-key" :class="{ pulse: onFirst }" :disabled="!hasNext" aria-label="Next slide" @mousedown.prevent @click="next()">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18l6-6-6-6" /></svg>
      </button>
    </div>

    <!-- Progress -->
    <div class="progress" aria-hidden="true">
      <div class="progress-fill" :style="{ transform: `scaleX(${progress})` }" />
    </div>
  </div>
</template>

<style scoped>
.chrome {
  position: absolute;
  inset: 0;
  z-index: 40;
  pointer-events: none;
}

.chrome > * {
  pointer-events: auto;
}

/* ---- Theme toggle ---- */
.theme-toggle {
  position: absolute;
  top: 16px;
  right: 18px;
  display: flex;
  align-items: center;
  gap: 8px;
  height: 30px;
  padding: 0 11px 0 4px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 500;
  color: var(--fg-muted);
  cursor: pointer;
  transition: color 0.2s;
}

.theme-toggle:hover {
  color: var(--fg);
}

.theme-track {
  position: relative;
  width: 40px;
  height: 22px;
  border-radius: 999px;
  background: color-mix(in srgb, var(--fg) 8%, transparent);
}

.theme-thumb {
  position: absolute;
  top: 2px;
  left: 2px;
  display: grid;
  place-items: center;
  width: 18px;
  height: 18px;
  border-radius: 999px;
  background: #fff;
  color: #d97706;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
  transition: transform 0.35s var(--ease-out), background 0.35s;
}

.theme-thumb.on {
  transform: translateX(18px);
  background: #1e1b4b;
  color: #c7d2fe;
}

.theme-thumb svg {
  width: 11px;
  height: 11px;
}

/* ---- Dock ---- */
.dock {
  position: absolute;
  right: 18px;
  bottom: 16px;
  display: flex;
  align-items: center;
  gap: 6px;
  height: 36px;
  padding: 0 4px 0 14px;
  border-radius: 999px;
  font-size: 11px;
  color: var(--fg-muted);
}

.dock-count {
  margin-right: 6px;
  font-family: var(--slidev-code-font-family, ui-monospace, monospace);
  letter-spacing: 0.04em;
}

.dock-hint {
  margin-right: 6px;
  font-weight: 500;
  color: var(--fg);
  animation: hint-in 0.8s var(--ease-out) 1.2s both;
}

@keyframes hint-in {
  from {
    opacity: 0;
    transform: translateX(6px);
  }
}

.dock-key {
  display: grid;
  place-items: center;
  width: 28px;
  height: 28px;
  border-radius: 9px;
  border: 1px solid var(--line-strong);
  border-bottom-width: 2px;
  background: var(--glass-strong);
  color: var(--fg);
  cursor: pointer;
  transition: transform 0.15s, border-color 0.2s, opacity 0.2s;
}

.dock-key svg {
  width: 13px;
  height: 13px;
}

.dock-key:hover:not(:disabled) {
  border-color: var(--a, var(--accent));
}

.dock-key:active:not(:disabled) {
  transform: translateY(1px);
  border-bottom-width: 1px;
}

.dock-key:disabled {
  opacity: 0.3;
  cursor: default;
}

.dock-key.pulse {
  position: relative;
  border-color: var(--accent);
  color: var(--accent);
}

.dock-key.pulse::after {
  content: '';
  position: absolute;
  inset: -4px;
  border-radius: 12px;
  border: 1.5px solid var(--accent);
  animation: key-ping 1.8s var(--ease-out) 1.6s infinite;
  opacity: 0;
}

@keyframes key-ping {
  0% {
    opacity: 0.8;
    transform: scale(0.9);
  }
  100% {
    opacity: 0;
    transform: scale(1.35);
  }
}

/* ---- Progress ---- */
.progress {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 2px;
  background: var(--line);
}

.progress-fill {
  height: 100%;
  transform-origin: left;
  background: linear-gradient(90deg, var(--accent), var(--accent-2), var(--cyan));
  transition: transform 0.6s var(--ease-out);
}
</style>

<script setup lang="ts">
import type { Accent, Orbs } from './utils/accent'
import { useDarkMode, useNav } from '@slidev/client'
import { computed, onBeforeUnmount, onMounted, ref, watchEffect } from 'vue'
import { accentVar } from './utils/accent'

const { isDark, toggleDark } = useDarkMode()
const { currentPage, currentSlideRoute, total, next, prev, hasNext, hasPrev, isPrintMode, isPresenter } = useNav()

// Everything here is teleported to <body> and pinned to the window, so the
// backdrop fills any screen shape and the controls sit in the real corners
// instead of the letterboxed 16:9 canvas. Exports and presenter view keep
// the in-canvas backdrop from layouts/pitch.vue.
const live = computed(() => !isPrintMode.value && !isPresenter.value)

const progress = computed(() => total.value > 1 ? (currentPage.value - 1) / (total.value - 1) : 1)
const pad = (n: number) => String(n).padStart(2, '0')
const onFirst = computed(() => currentPage.value === 1)

const frontmatter = computed(() => (currentSlideRoute.value?.meta?.slide?.frontmatter ?? {}) as Record<string, any>)
const tint = computed(() => accentVar[(frontmatter.value.accent as Accent) ?? 'indigo'] ?? accentVar.indigo)
const orbs = computed(() => (frontmatter.value.orbs as Orbs) ?? 'corners')

// Tells style.css to make Slidev's canvas wrappers transparent.
watchEffect(() => {
  if (typeof document !== 'undefined')
    document.documentElement.classList.toggle('ambient-on', live.value)
})

// Touch visitors get "swipe" wording instead of keycaps.
const isTouch = ref(false)

// ---- Wheel / trackpad navigation --------------------------------------
// Visitors arriving from a link instinctively scroll. Treat one scroll
// gesture (including trackpad inertia) as exactly one slide step.
// A window-level flag keeps a single listener if Slidev mounts this
// layer more than once.
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
  if (e.ctrlKey || !live.value)
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
  document.documentElement.classList.remove('ambient-on')
})
</script>

<template>
  <Teleport to="body">
    <template v-if="live">
      <!-- Full-window backdrop -->
      <div class="ambient" :class="`orbs-${orbs}`" :style="{ '--a': tint }" aria-hidden="true">
        <div class="ambient-grid" />
        <div class="ambient-orb orb-1" />
        <div class="ambient-orb orb-2" />
      </div>

      <div class="chrome">
        <!-- Theme toggle -->
        <button
          class="theme-toggle glass glass-strong"
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
        <div class="dock glass glass-strong">
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
  </Teleport>
</template>

<style scoped>
/* ---- Full-window backdrop ---- */
.ambient {
  position: fixed;
  inset: 0;
  z-index: -1;
  overflow: hidden;
  pointer-events: none;
}

.ambient-grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(var(--grid-line) 1px, transparent 1px),
    linear-gradient(90deg, var(--grid-line) 1px, transparent 1px);
  background-size: 8vh 8vh;
  background-position: center top;
  mask-image: radial-gradient(ellipse 60% 60% at 50% 35%, #000 15%, transparent 75%);
  -webkit-mask-image: radial-gradient(ellipse 60% 60% at 50% 35%, #000 15%, transparent 75%);
}

/* Orbs morph between slides: position, size, colour and opacity all ease. */
.ambient-orb {
  position: absolute;
  border-radius: 999px;
  filter: blur(110px);
  transition:
    left 1.2s var(--ease-out),
    top 1.2s var(--ease-out),
    width 1.2s var(--ease-out),
    height 1.2s var(--ease-out),
    opacity 1.2s var(--ease-out),
    background-color 1.2s ease;
}

.orb-1 {
  background-color: var(--a);
}

.orb-2 {
  background-color: var(--accent-2);
}

/* Sizes use vh so the composition matches the height-bound 16:9 canvas. */
.orbs-corners .orb-1 {
  width: 85vh;
  height: 85vh;
  left: calc(100vw - 55vh);
  top: -55vh;
  opacity: var(--orb-opacity);
}

.orbs-corners .orb-2 {
  width: 76vh;
  height: 76vh;
  left: -30vh;
  top: calc(100vh - 26vh);
  opacity: calc(var(--orb-opacity) * 0.6);
}

.orbs-top .orb-1 {
  width: 140vh;
  height: 55vh;
  left: calc(50vw - 70vh);
  top: -40vh;
  opacity: var(--orb-opacity);
}

.orbs-center .orb-1 {
  width: 100vh;
  height: 100vh;
  left: calc(50vw - 50vh);
  top: 0;
  opacity: calc(var(--orb-opacity) * 0.45);
}

.orbs-top .orb-2,
.orbs-center .orb-2,
.orbs-none .orb-1,
.orbs-none .orb-2 {
  width: 76vh;
  height: 76vh;
  left: -30vh;
  top: calc(100vh - 26vh);
  opacity: 0;
}

/* ---- Window chrome ---- */
.chrome > * {
  position: fixed;
  z-index: 60;
}

.theme-toggle {
  top: calc(18px + env(safe-area-inset-top, 0px));
  right: 20px;
  display: flex;
  align-items: center;
  gap: 9px;
  height: 36px;
  padding: 0 14px 0 5px;
  border-radius: 999px;
  font-size: 12.5px;
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
  width: 46px;
  height: 26px;
  border-radius: 999px;
  background: color-mix(in srgb, var(--fg) 8%, transparent);
}

.theme-thumb {
  position: absolute;
  top: 3px;
  left: 3px;
  display: grid;
  place-items: center;
  width: 20px;
  height: 20px;
  border-radius: 999px;
  background: #fff;
  color: #d97706;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
  transition: transform 0.35s var(--ease-out), background 0.35s;
}

.theme-thumb.on {
  transform: translateX(20px);
  background: #1e1b4b;
  color: #c7d2fe;
}

.theme-thumb svg {
  width: 12px;
  height: 12px;
}

.dock {
  right: 20px;
  bottom: calc(18px + env(safe-area-inset-bottom, 0px));
  display: flex;
  align-items: center;
  gap: 7px;
  height: 44px;
  padding: 0 5px 0 16px;
  border-radius: 999px;
  font-size: 13px;
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
  width: 34px;
  height: 34px;
  border-radius: 11px;
  border: 1px solid var(--line-strong);
  border-bottom-width: 2px;
  background: var(--glass-strong);
  color: var(--fg);
  cursor: pointer;
  transition: transform 0.15s, border-color 0.2s, opacity 0.2s;
}

.dock-key svg {
  width: 15px;
  height: 15px;
}

.dock-key:hover:not(:disabled) {
  border-color: var(--accent);
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
  inset: -5px;
  border-radius: 14px;
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

.progress {
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

/* Phones: tuck the label away, keep the keys. */
@media (max-width: 640px) {
  .theme-label,
  .dock-hint {
    display: none;
  }
  .theme-toggle {
    padding-right: 5px;
  }
}
</style>

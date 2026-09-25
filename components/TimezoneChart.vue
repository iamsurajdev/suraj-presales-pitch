<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'

// Business hours 09:00–18:00 local, plotted on a UTC day.
// Shown for UK winter (GMT, UTC+0) and Sydney summer (AEDT, UTC+11),
// which is what applies for most of Q4.
interface Row { city: string, zone: string, segments: [number, number][], label: string, focus?: boolean }

const rows: Row[] = [
  { city: 'Sydney', zone: 'AEDT · UTC+11', segments: [[22, 24], [0, 7]], label: '09:00 – 18:00' },
  { city: 'India', zone: 'IST · UTC+5:30', segments: [[3.5, 12.5]], label: '09:00 – 18:00', focus: true },
  { city: 'London', zone: 'GMT · UTC+0', segments: [[9, 18]], label: '09:00 – 18:00' },
]

const bands = [
  { from: 3.5, to: 7, color: 'var(--cyan)', title: 'Live with Sydney', ist: '09:00 – 12:30 IST' },
  { from: 9, to: 12.5, color: 'var(--accent-2)', title: 'Live with London', ist: '14:30 – 18:00 IST' },
]

const ticks = [0, 3, 6, 9, 12, 15, 18, 21, 24]
const pct = (h: number) => `${(h / 24) * 100}%`

const now = ref(0)
let timer: ReturnType<typeof setInterval> | undefined
function tick() {
  const d = new Date()
  now.value = d.getUTCHours() + d.getUTCMinutes() / 60
}
onMounted(() => {
  tick()
  timer = setInterval(tick, 30_000)
})
onBeforeUnmount(() => clearInterval(timer))
</script>

<template>
  <div class="tz">
    <!-- Overlap bands behind the tracks -->
    <div class="tz-bands" aria-hidden="true">
      <div
        v-for="(b, i) in bands"
        :key="b.title"
        class="tz-band fade-in"
        :style="{ left: pct(b.from), width: pct(b.to - b.from), '--c': b.color, '--d': 6 + i * 2 }"
      />
      <div class="tz-now fade-in" :style="{ left: pct(now), '--d': 10 }">
        <span class="tz-now-label">Now</span>
      </div>
    </div>

    <template v-for="(r, i) in rows" :key="r.city">
      <div class="tz-label rise" :style="{ gridRow: i + 1, '--d': 3 + i }">
        <div class="text-[13px] font-600" :class="r.focus ? 'text-ink' : 'text-muted'">
          {{ r.city }}
        </div>
        <div class="font-mono text-[9.5px] tracking-wider text-subtle">
          {{ r.zone }}
        </div>
      </div>
      <div class="tz-track" :style="{ gridRow: i + 1 }">
        <div
          v-for="(s, j) in r.segments"
          :key="j"
          class="tz-seg grow-x"
          :class="{ focus: r.focus }"
          :style="{ left: pct(s[0]), width: pct(s[1] - s[0]), '--d': 4 + i }"
        >
          <span v-if="s[1] - s[0] > 3">{{ r.label }}</span>
        </div>
      </div>
    </template>

    <!-- Axis -->
    <div class="tz-axis" :style="{ gridRow: rows.length + 1 }">
      <span v-for="t in ticks" :key="t" :style="{ left: pct(t) }">{{ String(t).padStart(2, '0') }}</span>
      <em>UTC</em>
    </div>

    <!-- Band captions -->
    <div class="tz-captions" :style="{ gridRow: rows.length + 2 }">
      <div
        v-for="(b, i) in bands"
        :key="b.title"
        class="tz-caption rise"
        :style="{ left: pct(b.from), '--c': b.color, '--d': 8 + i }"
      >
        <span class="font-600 text-ink">{{ b.title }}</span>
        <span class="font-mono text-[10px] text-subtle">{{ b.ist }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.tz {
  position: relative;
  display: grid;
  grid-template-columns: 118px 1fr;
  grid-auto-rows: 36px;
  row-gap: 10px;
  align-items: center;
}

.tz-bands {
  grid-column: 2;
  grid-row: 1 / span 3;
  position: relative;
  align-self: stretch;
  margin: -8px 0;
}

.tz-band {
  position: absolute;
  top: 0;
  bottom: 0;
  border-radius: 10px;
  background: color-mix(in srgb, var(--c) 13%, transparent);
  border: 1px dashed color-mix(in srgb, var(--c) 55%, transparent);
}

.tz-now {
  position: absolute;
  top: -14px;
  bottom: -4px;
  width: 0;
  border-left: 1px solid var(--rose);
  z-index: 2;
}

.tz-now::before {
  content: '';
  position: absolute;
  top: 12px;
  left: -4px;
  width: 7px;
  height: 7px;
  border-radius: 999px;
  background: var(--rose);
  box-shadow: 0 0 10px var(--rose);
}

.tz-now-label {
  position: absolute;
  top: -4px;
  left: 6px;
  font-family: var(--slidev-code-font-family, ui-monospace, monospace);
  font-size: 9px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--rose);
}

.tz-label {
  grid-column: 1;
}

.tz-track {
  grid-column: 2;
  position: relative;
  height: 100%;
  border-radius: 10px;
  background: color-mix(in srgb, var(--fg) 4%, transparent);
  border: 1px solid var(--line);
  z-index: 1;
}

.tz-seg {
  position: absolute;
  top: 4px;
  bottom: 4px;
  display: grid;
  place-items: center;
  border-radius: 7px;
  background: color-mix(in srgb, var(--fg) 10%, transparent);
  border: 1px solid var(--line-strong);
  font-family: var(--slidev-code-font-family, ui-monospace, monospace);
  font-size: 10px;
  color: var(--fg-muted);
  overflow: hidden;
}

.tz-seg.focus {
  background: linear-gradient(90deg, var(--accent), var(--accent-2));
  border-color: transparent;
  color: #fff;
  box-shadow: 0 8px 24px -8px color-mix(in srgb, var(--accent) 80%, transparent);
}

.tz-axis,
.tz-captions {
  grid-column: 2;
  position: relative;
  height: 100%;
}

.tz-axis span {
  position: absolute;
  top: 2px;
  translate: -50% 0;
  font-family: var(--slidev-code-font-family, ui-monospace, monospace);
  font-size: 9.5px;
  color: var(--fg-subtle);
}

.tz-axis em {
  position: absolute;
  right: 0;
  top: 18px;
  font-style: normal;
  font-family: var(--slidev-code-font-family, ui-monospace, monospace);
  font-size: 9px;
  letter-spacing: 0.14em;
  color: var(--fg-subtle);
}

.tz-captions {
  margin-top: -18px;
}

.tz-caption {
  position: absolute;
  top: 0;
  display: flex;
  flex-direction: column;
  gap: 1px;
  padding-left: 9px;
  border-left: 2px solid var(--c);
  font-size: 11.5px;
  white-space: nowrap;
}
</style>

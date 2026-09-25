<script setup lang="ts">
const stages = [
  { title: 'Discovery calls', desc: 'Pain, stakeholders, budget' },
  { title: 'BRDs', desc: 'Needs turned into signed-off scope' },
  { title: 'Solution decks', desc: 'Architecture a CTO can audit' },
  { title: 'Live demos', desc: 'Run by the person who built it' },
  { title: 'RFP / RFQ', desc: 'Security and technical responses' },
  { title: 'Proposals', desc: 'Scope, timeline, outcomes' },
  { title: 'Commercials', desc: 'Pricing and negotiation' },
  { title: 'Closed & paid', desc: 'Signed, invoiced, settled' },
]
const technical = 5
</script>

<template>
  <div class="tl">
    <!-- Phase brackets -->
    <div class="tl-phases">
      <div class="tl-phase rise" :style="{ gridColumn: `1 / span ${technical}`, '--c': 'var(--accent)', '--d': 2 }">
        <span>Technical credibility</span>
      </div>
      <div class="tl-phase rise" :style="{ gridColumn: `${technical + 1} / span ${stages.length - technical}`, '--c': 'var(--emerald)', '--d': 3 }">
        <span>Commercial close</span>
      </div>
    </div>

    <div class="tl-rail">
      <div class="tl-line" />
      <div class="tl-line tl-line-fill grow-x" style="--d: 4" />
    </div>

    <ol class="tl-stages">
      <li
        v-for="(s, i) in stages"
        :key="s.title"
        class="tl-stage rise"
        :class="{ last: i === stages.length - 1 }"
        :style="{ '--d': 4 + i * 1.6 }"
      >
        <div class="tl-node">
          <svg v-if="i === stages.length - 1" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>
          <span v-else>{{ String(i + 1).padStart(2, '0') }}</span>
        </div>
        <div class="tl-title">
          {{ s.title }}
        </div>
        <div class="tl-desc">
          {{ s.desc }}
        </div>
      </li>
    </ol>
  </div>
</template>

<style scoped>
.tl {
  --cols: 8;
  position: relative;
}

.tl-phases,
.tl-stages {
  display: grid;
  grid-template-columns: repeat(var(--cols), 1fr);
}

.tl-phases {
  margin-bottom: 14px;
  column-gap: 10px;
}

.tl-phase {
  position: relative;
  height: 20px;
  border: 1px solid color-mix(in srgb, var(--c) 45%, transparent);
  border-bottom: none;
  border-radius: 8px 8px 0 0;
  text-align: center;
}

.tl-phase span {
  position: relative;
  top: -8px;
  padding: 0 8px;
  border-radius: 999px;
  background: color-mix(in srgb, var(--c) 14%, var(--glass-strong));
  backdrop-filter: blur(8px);
  font-family: var(--slidev-code-font-family, ui-monospace, monospace);
  font-size: 9.5px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--c);
}

.tl-rail {
  position: absolute;
  left: calc(100% / var(--cols) / 2);
  right: calc(100% / var(--cols) / 2);
  /* phase bracket (20px) + gap (14px) + half a node (17px) */
  top: 51px;
  height: 2px;
}

.tl-line {
  position: absolute;
  inset: 0;
  border-radius: 2px;
  background: var(--line-strong);
}

.tl-line-fill {
  background: linear-gradient(90deg, var(--accent), var(--accent-2) 60%, var(--emerald));
  box-shadow: 0 0 14px color-mix(in srgb, var(--accent) 60%, transparent);
  animation-duration: 2.4s;
}

.tl-stages {
  list-style: none;
  margin: 0;
  padding: 0;
}

.tl-stage {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 0 4px;
}

.tl-node {
  position: relative;
  z-index: 1;
  display: grid;
  place-items: center;
  width: 34px;
  height: 34px;
  margin-bottom: 12px;
  border-radius: 11px;
  background: var(--glass-strong);
  border: 1px solid var(--line-strong);
  box-shadow: var(--shadow);
  backdrop-filter: blur(12px);
  font-family: var(--slidev-code-font-family, ui-monospace, monospace);
  font-size: 10.5px;
  color: var(--fg);
}

.last .tl-node {
  background: var(--emerald);
  border-color: transparent;
  color: #fff;
  box-shadow: 0 0 0 5px color-mix(in srgb, var(--emerald) 18%, transparent), 0 10px 26px -6px var(--emerald);
}

.tl-node svg {
  width: 15px;
  height: 15px;
}

.tl-title {
  font-size: 12.5px;
  font-weight: 600;
  color: var(--fg);
  line-height: 1.25;
}

.tl-desc {
  margin-top: 4px;
  font-size: 10.5px;
  line-height: 1.4;
  color: var(--fg-subtle);
}
</style>

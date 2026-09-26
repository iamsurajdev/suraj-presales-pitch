<script setup lang="ts">
import { ref } from 'vue'

// Drop a photo at public/singapore.jpg to replace the illustrated skyline.
const photo = ref(true)
const photoSrc = '/singapore.jpg'
</script>

<template>
  <div class="sg glass overflow-hidden !rounded-[22px]">
    <!-- Illustrated fallback: Marina Bay at dusk -->
    <div class="sg-sky" aria-hidden="true">
      <div class="sg-sun" />
      <svg class="sg-skyline" viewBox="0 0 400 160" preserveAspectRatio="xMidYMax slice" fill="currentColor">
        <!-- background towers -->
        <g opacity="0.45">
          <rect x="10" y="70" width="26" height="90" /><rect x="40" y="50" width="20" height="110" />
          <rect x="64" y="84" width="30" height="76" /><rect x="300" y="60" width="22" height="100" />
          <rect x="326" y="40" width="26" height="120" /><rect x="356" y="76" width="34" height="84" />
        </g>
        <!-- Marina Bay Sands: three towers and the skypark -->
        <path d="M150 58 l6 102 h22 l2 -102 z" />
        <path d="M188 58 l4 102 h22 l2 -102 z" />
        <path d="M226 58 l2 102 h22 l6 -102 z" />
        <path d="M138 50 h128 q6 0 4 5 l-2 3 h-132 l-2 -3 q-2 -5 4 -5 z" />
        <!-- water line -->
        <rect x="0" y="152" width="400" height="8" opacity="0.6" />
      </svg>
      <div class="sg-lights" />
    </div>

    <img v-if="photo" :src="photoSrc" alt="Suraj on-site at Marina Bay, Singapore" class="sg-photo absolute inset-0 h-full w-full object-cover" @error="photo = false">
    <div class="sg-scrim" />

    <div class="relative flex h-full flex-col justify-between p-4">
      <span class="chip self-start !border-white/15 !bg-black/30 !text-white/90 backdrop-blur-md">
        <span class="live-dot" />
        Recent · On-site
      </span>
      <div>
        <div class="font-mono text-[10px] uppercase tracking-[0.18em] text-white/60">
          Singapore · Marina Bay
        </div>
        <div class="mt-1.5 font-display text-[18px] font-600 leading-[1.2] tracking-[-0.02em] text-white">
          Technical closures,<br>delivered in person.
        </div>
        <div class="mt-2 font-mono text-[9px] tracking-wider text-white/50">
          1.2834° N · 103.8607° E
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.sg {
  position: relative;
  height: 100%;
  color: #fff;
}

.sg-sky {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse 80% 60% at 70% 20%, rgba(167, 139, 250, 0.55), transparent 60%),
    linear-gradient(180deg, #0b1030 0%, #2b1d5c 45%, #6d3a7a 72%, #c56a6a 100%);
}

.sg-sun {
  position: absolute;
  left: 58%;
  bottom: 30%;
  width: 90px;
  height: 90px;
  border-radius: 999px;
  background: radial-gradient(circle, rgba(255, 190, 140, 0.9), rgba(255, 140, 120, 0) 70%);
  filter: blur(4px);
}

.sg-skyline {
  position: absolute;
  inset: auto 0 0 0;
  width: 100%;
  height: 62%;
  color: #0a0b1a;
}

.sg-lights {
  position: absolute;
  inset: auto 0 0 0;
  height: 20%;
  background: repeating-linear-gradient(90deg, rgba(255, 214, 150, 0.18) 0 2px, transparent 2px 9px);
  mask-image: linear-gradient(0deg, #000, transparent);
  -webkit-mask-image: linear-gradient(0deg, #000, transparent);
}

.sg-photo {
  object-position: 50% 30%;
  animation: sg-settle 6s var(--ease-out) both;
}

/* Slow settle-in, replays each time the slide is shown. */
@keyframes sg-settle {
  from {
    transform: scale(1.08);
  }
}

.sg-scrim {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(180deg, rgba(4, 5, 12, 0.35) 0%, transparent 18%),
    linear-gradient(180deg, transparent 55%, rgba(4, 5, 12, 0.88) 100%);
}
</style>

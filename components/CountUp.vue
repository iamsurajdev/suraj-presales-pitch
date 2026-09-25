<script setup lang="ts">
import { useIsSlideActive, useNav } from '@slidev/client'
import { onBeforeUnmount, ref, watch } from 'vue'

const props = withDefaults(defineProps<{
  to: number
  duration?: number
  delay?: number
  prefix?: string
  suffix?: string
}>(), {
  duration: 1400,
  delay: 250,
  prefix: '',
  suffix: '',
})

const isActive = useIsSlideActive()
const { isPrintMode } = useNav()
const value = ref(isPrintMode.value ? props.to : 0)
let frame = 0
let timer: ReturnType<typeof setTimeout> | undefined

function run() {
  cancelAnimationFrame(frame)
  clearTimeout(timer)
  value.value = 0
  timer = setTimeout(() => {
    const start = performance.now()
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / props.duration)
      const eased = 1 - (1 - t) ** 4
      value.value = Math.round(props.to * eased)
      if (t < 1)
        frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
  }, props.delay)
}

watch(isActive, (active) => {
  if (isPrintMode.value)
    value.value = props.to
  else if (active)
    run()
}, { immediate: true })

onBeforeUnmount(() => {
  cancelAnimationFrame(frame)
  clearTimeout(timer)
})
</script>

<template>
  <span class="tabular">{{ prefix }}{{ value.toLocaleString('en-GB') }}{{ suffix }}</span>
</template>

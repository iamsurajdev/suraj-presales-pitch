<script setup lang="ts">
const tenants = ['tenant_a', 'tenant_b', 'tenant_c']
</script>

<template>
  <div class="relative flex flex-col items-center gap-2.5">
    <div class="node rise" style="--d: 5">
      <span class="h-1.5 w-1.5 rounded-full bg-cyan" />
      API · tenant resolver
    </div>
    <svg class="h-4 w-[180px] text-subtle" viewBox="0 0 180 16" fill="none" aria-hidden="true">
      <path class="draw" pathLength="1" style="--d: 6" d="M90 0v6M90 6H30v10M90 6h60v10M90 6v10" stroke="currentColor" stroke-width="1" />
    </svg>
    <div class="db rise" style="--d: 7">
      <div class="flex gap-1.5">
        <span v-for="(t, i) in tenants" :key="t" class="schema" :style="{ '--d': 8 + i }">{{ t }}</span>
      </div>
      <div class="mt-1.5 text-center font-mono text-[9px] tracking-wider text-subtle">
        postgres · schema per tenant
      </div>
    </div>
  </div>
</template>

<style scoped>
.node {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 22px;
  padding: 0 9px;
  border-radius: 7px;
  border: 1px solid var(--line-strong);
  background: var(--surface);
  font-family: var(--slidev-code-font-family, ui-monospace, monospace);
  font-size: 9.5px;
  color: var(--fg-muted);
}

.db {
  padding: 7px 7px 5px;
  border-radius: 10px;
  border: 1px dashed color-mix(in srgb, var(--a) 50%, transparent);
  background: color-mix(in srgb, var(--a) 6%, transparent);
}

.schema {
  padding: 3px 7px;
  border-radius: 6px;
  background: var(--glass-strong);
  border: 1px solid var(--line-strong);
  font-family: var(--slidev-code-font-family, ui-monospace, monospace);
  font-size: 9px;
  color: var(--fg);
}
</style>

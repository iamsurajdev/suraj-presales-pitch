import { defineConfig } from 'unocss'

// Merged by Slidev on top of its built-in config.
// Every colour points at a CSS variable in style.css, so each utility
// follows the light / dark theme toggle automatically.
export default defineConfig({
  theme: {
    colors: {
      ink: 'var(--fg)',
      muted: 'var(--fg-muted)',
      subtle: 'var(--fg-subtle)',
      line: 'var(--line)',
      surface: 'var(--surface)',
      canvas: 'var(--bg)',
      accent: 'var(--accent)',
      accent2: 'var(--accent-2)',
      rose: 'var(--rose)',
      amber: 'var(--amber)',
      cyan: 'var(--cyan)',
      emerald: 'var(--emerald)',
    },
    fontFamily: {
      display: '"Geist", "Inter", ui-sans-serif, system-ui, sans-serif',
    },
  },
  shortcuts: {
    'display': 'font-display font-600 tracking-[-0.035em] leading-[1.02] text-ink',
    'eyebrow': 'font-mono text-[10.5px] uppercase tracking-[0.18em] text-subtle',
    'lede': 'text-[15px] leading-[1.6] text-muted',
    'hairline': 'h-px w-full bg-line',
  },
})

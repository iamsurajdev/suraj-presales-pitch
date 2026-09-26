export type Accent = 'indigo' | 'violet' | 'rose' | 'cyan' | 'emerald' | 'amber'
export type Orbs = 'corners' | 'top' | 'center' | 'none'

export const accentVar: Record<Accent, string> = {
  indigo: 'var(--accent)',
  violet: 'var(--accent-2)',
  rose: 'var(--rose)',
  cyan: 'var(--cyan)',
  emerald: 'var(--emerald)',
  amber: 'var(--amber)',
}

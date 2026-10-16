export type Handoff = {
  /** Kiedy kliknięto Handoff (ms od epoki). */
  requestedAt: number
  /** Ścieżka kartki (`handoff/…md` w projekcie albo `~/.claude/handoff/…md`), gdy już powstała. */
  file: string | null
}

declare module 'claude-code' {
  interface PluginState {
    'straznik-cache': {
      /** Koniec ostatniej tury głównej rozmowy (ms od epoki); null przed pierwszą. */
      lastActivity: number | null
      /** Licznik minut, żeby pasek przerysował odliczanie. */
      tick: number
      /** Czy ostrzeżenie „cache wygasa” już poszło dla tej przerwy. */
      isWarned: boolean
      isHidden: boolean
      handoff: Handoff | null
    }
  }
}

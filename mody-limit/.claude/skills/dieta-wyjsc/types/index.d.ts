/** Liczba znaków, które dieta wycięła z wyników narzędzi. */
export type SavedChars = number

declare module 'claude-code' {
  interface PluginState {
    'dieta-wyjsc': {
      /** Ile znaków dieta wycięła w tej sesji (do licznika na pasku statusu). */
      savedChars: SavedChars
    }
  }
}

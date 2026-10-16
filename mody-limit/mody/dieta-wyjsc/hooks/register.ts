import { atom, update } from 'claude-code'
import type { EngineInterface, Register, ToolCallResult } from 'claude-code'

// Poniżej tego rozmiaru wynik idzie do Claude'a w całości.
const MIN_CHARS = 8000
// Co zostaje z dużego wyniku: początek, koniec i linijki z błędami ze środka.
const HEAD_LINES = 40
const HEAD_CHARS = 3000
const TAIL_LINES = 60
const TAIL_CHARS = 4000
const MATCH_LINES = 30
const MATCH_LINE_CHARS = 300
const IMPORTANT = /error|warn|fail|fatal|exception|traceback|błąd|blad/i
// Pełne wyniki krążą po 50 plikach, żeby folder nie puchł.
const SLOTS = 50

// Komendy, którymi Claude celowo czyta treść (plik, diff) — tych nie tniemy.
const READS_CONTENT = /^\s*(cat|head|tail|sed|less|more|type|gc|get-content|jq|git\s+(diff|show))\b/i

const savedChars = atom({ plugin: 'dieta-wyjsc', key: 'savedChars' } as const, 0)

export const register: Register = on => {
  on('session.start', async ($, e, next) => {
    await $.command.register({
      name: 'dieta',
      description: 'Włącz albo wyłącz przycinanie dużych wyników narzędzi',
    })

    return next(e)
  })

  on('command.run', { command: 'dieta' }, async $ => {
    const isOff = !((await $.store.get('isOff')) === true)
    await $.store.set('isOff', isOff)
    $.ui.status(isOff ? 'dieta: wyłączona' : undefined)

    return { text: isOff ? 'Dieta wyłączona: wyniki narzędzi idą w całości.' : 'Dieta włączona.' }
  })

  on('tool.call', async ($, e, next) => {
    const isShell = e.tool === 'Bash' || e.tool === 'PowerShell'
    if (!isShell && !e.tool.startsWith('mcp__')) {
      return next(e)
    }
    if (isShell && READS_CONTENT.test(String(e.command ?? ''))) {
      return next(e)
    }

    const ran = await next(e)
    if (ran.deny !== undefined || ran.isError === true || (await $.store.get('isOff')) === true) {
      return ran
    }

    return isShell ? dietShell($, e.tool, ran) : dietMcp($, e.tool, ran)
  })
}

type Shell = { stdout: string; stderr: string; isImage?: boolean; backgroundTaskId?: string; persistedOutputPath?: string }

async function dietShell($: EngineInterface, tool: string, ran: ToolCallResult): Promise<ToolCallResult> {
  const result = ran.result as Shell
  // Obraz, zadanie w tle albo wynik, który Claude Code sam już odłożył do pliku.
  if (typeof result?.stdout !== 'string' || result.isImage || result.backgroundTaskId || result.persistedOutputPath) {
    return ran
  }

  const full = result.stderr ? `${result.stdout}\n--- stderr ---\n${result.stderr}` : result.stdout
  const cut = await cutAndSave($, tool, full)

  return cut === null ? ran : { result: { ...result, stdout: cut, stderr: '' } }
}

async function dietMcp($: EngineInterface, tool: string, ran: ToolCallResult): Promise<ToolCallResult> {
  const cut = await cutAndSave($, tool, ran.text ?? '')

  return cut === null ? ran : { result: cut }
}

// Przycięty tekst albo null, gdy nie ma czego ciąć lub nie udało się zapisać całości.
async function cutAndSave($: EngineInterface, tool: string, full: string): Promise<string | null> {
  if (full.length < MIN_CHARS) {
    return null
  }

  const path = await saveFull($, tool, full)
  if (path === null) {
    return null
  }

  const cut = trim(full, path)
  const saved = full.length - cut.length
  if (saved <= 0) {
    return null
  }

  const total = await update($, savedChars, n => n + saved)
  $.ui.status(`dieta: −${Math.round(total / 4000)}k tokenów`)

  return cut
}

async function saveFull($: EngineInterface, tool: string, full: string): Promise<string | null> {
  try {
    const home = (await $.env.get('USERPROFILE')) ?? (await $.env.get('HOME'))
    if (home === undefined) {
      return null
    }
    const slot = Number((await $.store.get('slot')) ?? 0)
    await $.store.set('slot', (slot + 1) % SLOTS)
    const path = `${home.replace(/\\/g, '/')}/.claude/dieta/wynik-${String(slot).padStart(2, '0')}.log`
    const stamp = new Date(await $.clock.now()).toISOString()
    await $.fs.write(path, `# ${tool} · ${stamp}\n${full}`)
    return path
  } catch {
    return null
  }
}

export function trim(full: string, path: string): string {
  const lines = full.split('\n')

  // Dużo linii (log): tniemy po liniach. Mało, a długich (JSON w jednej linii): po znakach.
  let head: string
  let tail: string
  let middle: string[]
  if (lines.length > HEAD_LINES + TAIL_LINES) {
    head = lines.slice(0, HEAD_LINES).join('\n').slice(0, HEAD_CHARS)
    tail = lines.slice(-TAIL_LINES).join('\n').slice(-TAIL_CHARS)
    middle = lines.slice(HEAD_LINES, -TAIL_LINES)
  } else {
    head = full.slice(0, HEAD_CHARS)
    tail = full.slice(-TAIL_CHARS)
    middle = full.slice(HEAD_CHARS, -TAIL_CHARS).split('\n')
  }

  const important = middle.filter(line => IMPORTANT.test(line))
  const shown = important.slice(0, MATCH_LINES).map(line => line.slice(0, MATCH_LINE_CHARS))
  const cutK = Math.round((full.length - head.length - tail.length) / 1000)

  return [
    head,
    shown.length > 0
      ? `… [dieta: wycięłam ~${cutK}k znaków ze środka; ${shown.length} z ${important.length} linijek z error/warn/fail poniżej]`
      : `… [dieta: wycięłam ~${cutK}k znaków ze środka; nie było w nich error/warn/fail]`,
    ...shown,
    ...(shown.length > 0 ? ['… [dieta: dalej koniec wyniku]'] : []),
    tail,
    `[dieta: pełny wynik (${full.length} znaków) jest w ${path} — przeczytaj go Read albo grep, jeśli czegoś tu brakuje]`,
  ].join('\n')
}

import { atom, read, update } from 'claude-code'
import type { EngineInterface, FsEntry, Register, RenderSurface } from 'claude-code'

import type { Handoff } from '../types'

// Cache promptu w tej sesji żyje 60 min od ostatniego zapytania.
// Po wygaśnięciu następna wiadomość płaci za cały kontekst od nowa.
const CACHE_TTL_MS = 60 * 60 * 1000
const WARN_BEFORE_MS = 5 * 60 * 1000
const MINUTE_MS = 60 * 1000

const lastActivity = atom({ plugin: 'straznik-cache', key: 'lastActivity' } as const, null)
const tick = atom({ plugin: 'straznik-cache', key: 'tick' } as const, 0)
const isWarned = atom({ plugin: 'straznik-cache', key: 'isWarned' } as const, false)
const isHidden = atom({ plugin: 'straznik-cache', key: 'isHidden' } as const, false)
const handoff = atom({ plugin: 'straznik-cache', key: 'handoff' } as const, null)

// Progi kolorów: zielony → pomarańczowy → czerwony.
const CONTEXT_ORANGE_PERCENT = 50
const CONTEXT_RED_PERCENT = 75
const CACHE_ORANGE_MS = 15 * 60 * 1000
const LIMIT_ORANGE_PERCENT = 60
const LIMIT_RED_PERCENT = 85

// Klucze motywu: same dopasowują się do jasnego i ciemnego trybu.
type Level = 'success' | 'warning' | 'error'
const byPercent = (percent: number, orange: number, red: number): Level =>
  percent >= red ? 'error' : percent >= orange ? 'warning' : 'success'
const byTimeLeft = (left: number): Level =>
  left <= WARN_BEFORE_MS ? 'error' : left <= CACHE_ORANGE_MS ? 'warning' : 'success'

const thousands = (tokens: number) => `${Math.round(tokens / 1000)}k`

export const register: Register = on => {
  on('session.start', async ($, e, next) => {
    // Nowy proces wznowionej sesji: $.state jest pusty, ale cache na serwerze żyje dalej.
    if ((await read($, lastActivity)) === null) {
      const saved = await recallLastAnswer($)
      if (saved !== null) {
        await update($, lastActivity, () => saved)
      }
    }

    await $.command.register({
      name: 'straznik',
      description: 'Pokaż albo schowaj pasek Strażnika cache',
    })

    $.clock.every(MINUTE_MS, async () => {
      await update($, tick, n => n + 1)

      const last = await read($, lastActivity)
      if (last === null || (await read($, isWarned))) {
        return
      }

      const left = last + CACHE_TTL_MS - (await $.clock.now())
      if (left > 0 && left <= WARN_BEFORE_MS) {
        await update($, isWarned, () => true)
        const { context } = await $.session.usage()
        const size = context.tokens ? ` (${thousands(context.tokens)} tokenów)` : ''
        const text = `Cache tej sesji${size} wygasa za ${Math.ceil(left / MINUTE_MS)} min. Napisz coś albo zrób handoff.`
        $.ui.toast(text, { timeoutMs: 15000 })
        // Powiadomienie systemowe bywa niedostępne (np. bez terminala) — toast wystarczy.
        try {
          await $.ui.notify(text, { title: 'Strażnik cache' })
        } catch {}
      }
    })

    return next(e)
  })

  on('command.run', { command: 'straznik' }, async $ => {
    const hidden = await update($, isHidden, was => !was)

    return { text: hidden ? 'Pasek Strażnika schowany.' : 'Pasek Strażnika widoczny.' }
  })

  on('session.end', async ($, e, next) => {
    if (e.reason === 'clear') {
      isCleared = true
    }

    return next(e)
  })

  on('turn.complete', async ($, e, next) => {
    if (e.agentId !== undefined) {
      return next(e)
    }

    const now = await $.clock.now()
    await update($, lastActivity, () => now)
    await update($, isWarned, () => false)
    await rememberLastAnswer($, now)

    const pending = await read($, handoff)
    if (pending !== null && pending.file === null) {
      const file = await newestHandoff($, pending.requestedAt)
      if (file !== null) {
        await update($, handoff, () => ({ ...pending, file }))
      }
    }

    return next(e)
  })

  on('ui.render', { component: 'AbovePrompt' }, async ($, e, next) => {
    if (e.props.hasSurvey || (await read($, isHidden))) {
      return next(e)
    }

    await read($, tick)
    // last === null: sesja jeszcze bez odpowiedzi — pasek już jest, ale cache nie liczy.
    const last = await read($, lastActivity)

    const { Box, Button, Text } = $.ui.resolve(e)
    const { context, cost, rateLimits } = await $.session.usage()
    const left = last === null ? 0 : last + CACHE_TTL_MS - (await $.clock.now())
    const pending = await read($, handoff)

    // level === undefined: kawałek bez koloru (koszt sesji), przygaszony.
    const parts: { text: string; level?: Level }[] = []
    if (context.percent !== undefined && context.tokens !== undefined) {
      parts.push({
        text: `kontekst ${context.percent}% (${thousands(context.tokens)})`,
        level: byPercent(context.percent, CONTEXT_ORANGE_PERCENT, CONTEXT_RED_PERCENT),
      })
    }
    parts.push(
      last === null
        ? { text: 'cache ruszy po pierwszej odpowiedzi' }
        : {
            text:
              left > 0
                ? `cache ${Math.ceil(left / MINUTE_MS)} min`
                : 'cache wygasł — następna wiadomość czyta wszystko od nowa',
            level: byTimeLeft(left),
          },
    )
    if (cost !== undefined) {
      parts.push({ text: `sesja $${cost.usd.toFixed(2)}` })
    }
    const fiveHour = rateLimits.find(limit => limit.kind === 'five_hour')
    if (fiveHour !== undefined) {
      parts.push({
        text: `limit 5h ${fiveHour.percentUsed}%`,
        level: byPercent(fiveHour.percentUsed, LIMIT_ORANGE_PERCENT, LIMIT_RED_PERCENT),
      })
    }

    return (
      <Box>
        <Text>
          {parts.flatMap((part, i) => [
            ...(i > 0 ? [<Text dimColor>{' · '}</Text>] : []),
            part.level === undefined
              ? <Text dimColor>{part.text}</Text>
              : <Text color={part.level}>{part.text}</Text>,
          ])}{' '}
        </Text>
        {!e.props.isWorking && last !== null && pending?.file == null && (
          <Button
            key="handoff"
            label="Handoff"
            onPress={() => startHandoff($)}
          />
        )}
        {!e.props.isWorking && pending?.file != null && (
          <Button
            key="clear"
            label="Wyczyść i kontynuuj"
            onPress={() => clearAndContinue($, e.surface, pending.file ?? '')}
          />
        )}
      </Box>
    )
  })
}

// $.state ginie razem z procesem, a aplikacja usypia nieużywane sesje i budzi je
// nowym procesem. Dlatego czas ostatniej odpowiedzi każdej sesji trzymamy też
// w $.store; wpisy starsze niż cache i tak nic już nie mówią, więc je sprzątamy.
const LAST_ANSWERS_KEY = 'ostatniaOdpowiedz'

// Zapis to dodatek: gdy store albo id sesji zawiodą, pasek działa dalej jak dotąd.
async function savedAnswers($: EngineInterface): Promise<Record<string, number>> {
  const saved = await $.store.get(LAST_ANSWERS_KEY)
  return typeof saved === 'object' && saved !== null ? (saved as Record<string, number>) : {}
}

async function rememberLastAnswer($: EngineInterface, now: number) {
  try {
    const id = await $.session.id()
    const fresh = Object.entries(await savedAnswers($)).filter(([, at]) => now - at < CACHE_TTL_MS)
    await $.store.set(LAST_ANSWERS_KEY, { ...Object.fromEntries(fresh), [id]: now })
  } catch {}
}

async function recallLastAnswer($: EngineInterface): Promise<number | null> {
  try {
    const id = await $.session.id()
    return (await savedAnswers($))[id] ?? null
  } catch {
    return null
  }
}

// Ustawiane przez session.end, gdy /clear naprawdę wyczyścił rozmowę.
let isCleared = false

// prompt.submit nie przyjmuje tekstu zaczynającego się od „/”, więc skill
// odpalamy jako komendę; gdyby nie przeszła, wysyłamy zwykłe zdanie.
async function startHandoff($: EngineInterface) {
  const now = await $.clock.now()
  const pending = await read($, handoff)
  if (pending !== null && pending.file === null && now - pending.requestedAt < 2 * MINUTE_MS) {
    $.ui.toast('Handoff już się robi — poczekaj na kartkę.')
    return
  }

  await update($, handoff, (): Handoff => ({ requestedAt: now, file: null }))
  $.ui.toast('Robię handoff…')

  const ran = await $.command.run({ command: 'handoff' }).catch(err => ({ error: String(err) }))
  if (!('error' in ran)) {
    return
  }

  const sent = await $.prompt
    .submit({ text: 'Zrób handoff tej sesji (skill handoff).', asUser: true })
    .catch(err => ({ error: String(err) }))
  if ('error' in sent || sent.drop !== undefined) {
    await update($, handoff, () => null)
    $.ui.toast('Nie udało się uruchomić handoffu z paska — wpisz /handoff ręcznie.', { timeoutMs: 15000 })
  }
}

async function clearAndContinue($: EngineInterface, surface: RenderSurface, file: string) {
  const line = `Przeczytaj \`${file}\` i wracamy do roboty.`

  // Schowek najpierw: to jest wyjście awaryjne, gdyby /clear z moda nie przeszedł.
  await $.ui.copy({ text: line, surface }).catch(() => undefined)

  isCleared = false
  await $.command.run({ command: 'clear' }).catch(() => undefined)

  if (!isCleared) {
    $.ui.toast('Mod nie zdołał wyczyścić rozmowy. Linijka jest w schowku: wpisz /clear, potem wklej (Ctrl+V).', { timeoutMs: 20000 })
    return
  }

  await update($, handoff, () => null)
  await update($, lastActivity, () => null)
  const sent = await $.prompt.submit({ text: line, asUser: true }).catch(err => ({ error: String(err) }))
  if ('error' in sent || sent.drop !== undefined) {
    await $.prompt.fill({ text: line }).catch(() => undefined)
  }
}

// Najnowsza kartka zapisana po kliknięciu Handoff. Skill handoff zapisuje ją
// w folderze projektu (`handoff\`) albo w `~/.claude/handoff` — szukamy w obu.
async function newestHandoff($: EngineInterface, since: number): Promise<string | null> {
  const home = (await $.env.get('USERPROFILE')) ?? (await $.env.get('HOME'))
  const places = [
    { dir: 'handoff', shown: 'handoff/' },
    ...(home === undefined ? [] : [{ dir: `${home}/.claude/handoff`, shown: '~/.claude/handoff/' }]),
  ]

  const found: { path: string; mtimeMs: number }[] = []
  for (const place of places) {
    const entries: FsEntry[] = await $.fs.list(place.dir).catch(() => [])
    for (const entry of entries) {
      if (entry.kind === 'file' && entry.name.endsWith('.md') && entry.mtimeMs >= since) {
        found.push({ path: `${place.shown}${entry.name}`, mtimeMs: entry.mtimeMs })
      }
    }
  }

  return found.sort((a, b) => b.mtimeMs - a.mtimeMs)[0]?.path ?? null
}

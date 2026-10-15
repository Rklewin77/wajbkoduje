import { expect, mock, test } from 'claude-code/testing'

const MINUTE = 60 * 1000
const beneath = (on: Parameters<Parameters<typeof test>[1] & ((...a: any[]) => any)>[1]) => {
  on('session.start', ($, e) => ({ cwd: e.cwd }))
  on('command.register', ($, e) => ({ value: { command: e.name } }))
  on('turn.complete', ($, e) => ({ text: e.answer }))
  on('ui.render', ($, e) => $.ui.resolve(e).Box({}))
}

const BAND = { plugin: 'straznik-cache', component: 'AbovePrompt', props: { hasSurvey: false, isWorking: false, maxRows: 10 } } as const

test('pasek odlicza cache po turze i ostrzega 5 min przed końcem', async ($, on) => {
  const clock = mock.clock(on, { now: 1_000_000 })
  beneath(on)
  const toasts: string[] = []
  on('ui.toast', ($, e) => (toasts.push(e.text), { value: undefined }))
  on('session.usage', () => ({
    value: {
      startedAt: 0,
      context: { tokens: 90_000, window: 200_000, percent: 45 },
      rateLimits: [{ kind: 'five_hour', percentUsed: 30 }],
      cost: { usd: 3.21 },
    },
  }))

  await $.session.start({ cwd: '.', surface: 'desktop', isInteractive: true })

  for (const surface of ['terminal', 'desktop'] as const) {
    const ui = await $.ui.mount({ ...BAND, surface })
    expect(await ui.find({ type: 'Text', text: /cache/ })).toBeUndefined()
    await ui.unmount()
  }

  await $.turn.complete({ answer: 'ok', reason: 'answer', durationMs: 1, isAborted: false, turnId: 't1' })

  for (const surface of ['terminal', 'desktop'] as const) {
    const ui = await $.ui.mount({ ...BAND, surface })
    const line = await ui.find({ type: 'Text', text: /cache 60 min/ })
    expect(line?.text).toContain('kontekst 45% (90k)')
    expect(line?.text).toContain('sesja $3.21')
    expect(line?.text).toContain('limit 5h 30%')
    expect(await ui.find({ key: 'handoff' })).toBeDefined()
    await ui.unmount()
  }

  await clock.advance(54 * MINUTE)
  expect(toasts.length).toBe(0)

  await clock.advance(1 * MINUTE)
  expect(toasts.length).toBe(1)
  expect(toasts[0]).toContain('wygasa za 5 min')

  await clock.advance(11 * MINUTE)
  expect(toasts.length).toBe(1)

  const ui = await $.ui.mount({ ...BAND, surface: 'desktop' })
  expect(await ui.find({ type: 'Text', text: /cache wygasł/ })).toBeDefined()
  await ui.unmount()
})

// Najgłębszy Text z danym napisem (zewnętrzny trzyma całą linijkę).
const colorOf = async (ui: { findAll: (q: { type: string; text: RegExp }) => Promise<{ props: Record<string, unknown> }[]> }, text: RegExp) =>
  (await ui.findAll({ type: 'Text', text })).at(-1)?.props.color

test('kolory: zielony → pomarańczowy → czerwony', async ($, on) => {
  const clock = mock.clock(on, { now: 1_000_000 })
  beneath(on)
  on('ui.toast', () => ({ value: undefined }))
  let percent = 45
  let limit = 30
  on('session.usage', () => ({
    value: {
      startedAt: 0,
      context: { tokens: percent * 2000, window: 200_000, percent },
      rateLimits: [{ kind: 'five_hour', percentUsed: limit }],
    },
  }))

  await $.session.start({ cwd: '.', surface: 'desktop', isInteractive: true })
  await $.turn.complete({ answer: 'ok', reason: 'answer', durationMs: 1, isAborted: false, turnId: 't1' })

  const check = async (expected: [string, string, string]) => {
    const ui = await $.ui.mount({ ...BAND, surface: 'desktop' })
    expect([await colorOf(ui, /^kontekst/), await colorOf(ui, /^cache/), await colorOf(ui, /^limit 5h/)]).toEqual(expected)
    await ui.unmount()
  }

  await check(['success', 'success', 'success'])

  percent = 50
  limit = 60
  await clock.advance(45 * MINUTE)
  await check(['warning', 'warning', 'warning'])

  percent = 75
  limit = 85
  await clock.advance(10 * MINUTE)
  await check(['error', 'error', 'error'])
})

test('Handoff: kartka w folderze projektu → „Wyczyść i kontynuuj” kopiuje linijkę z jej ścieżką', async ($, on) => {
  mock.clock(on, { now: 1_000_000 })
  mock.env(on, { HOME: '/Users/ania' })
  beneath(on)
  on('session.usage', () => ({ value: { startedAt: 0, context: { window: 200_000 }, rateLimits: [] } }))
  on('ui.toast', () => ({ value: undefined }))
  const commands: string[] = []
  on('command.run', ($, e) => (commands.push(e.command), { text: '' }))
  const copies: string[] = []
  on('ui.copy', ($, e) => (copies.push(e.text), { value: { isCopied: true } }))
  // Kartka powstaje w `handoff/` projektu (tak zapisuje publiczny skill), a nie w ~/.claude/handoff.
  // Silnik podaje ścieżki już rozwinięte, np. C:\…\projekt\handoff.
  on('fs.list', ($, e) => ({
    value:
      /[\\/]handoff$/.test(e.path) && !/\.claude[\\/]handoff$/.test(e.path)
        ? [{ name: '2026-10-15-mody.md', kind: 'file', size: 100, mtimeMs: 2_000_000, isLink: false }]
        : [],
  }))

  await $.session.start({ cwd: '.', surface: 'desktop', isInteractive: true })
  await $.turn.complete({ answer: 'ok', reason: 'answer', durationMs: 1, isAborted: false, turnId: 't1' })

  const ui = await $.ui.mount({ ...BAND, surface: 'desktop' })
  await ui.press({ key: 'handoff' })
  expect(commands).toContain('handoff')
  await ui.unmount()

  await $.turn.complete({ answer: 'kartka gotowa', reason: 'answer', durationMs: 1, isAborted: false, turnId: 't2' })

  const after = await $.ui.mount({ ...BAND, surface: 'desktop' })
  expect(await after.find({ key: 'clear' })).toBeDefined()
  await after.press({ key: 'clear' })
  expect(copies[0]).toBe('Przeczytaj `handoff/2026-10-15-mody.md` i wracamy do roboty.')
  await after.unmount()
})

test('/straznik chowa i pokazuje pasek', async ($, on) => {
  mock.clock(on, { now: 1_000_000 })
  beneath(on)
  on('session.usage', () => ({ value: { startedAt: 0, context: { window: 200_000 }, rateLimits: [] } }))

  await $.session.start({ cwd: '.', surface: 'desktop', isInteractive: true })
  await $.turn.complete({ answer: 'ok', reason: 'answer', durationMs: 1, isAborted: false, turnId: 't1' })

  const hidden = await $.command.run({ command: 'straznik' })
  expect(hidden.text).toBe('Pasek Strażnika schowany.')
  const ui = await $.ui.mount({ ...BAND, surface: 'desktop' })
  expect(await ui.find({ type: 'Text', text: /cache/ })).toBeUndefined()
  await ui.unmount()

  const shown = await $.command.run({ command: 'straznik' })
  expect(shown.text).toBe('Pasek Strażnika widoczny.')
})

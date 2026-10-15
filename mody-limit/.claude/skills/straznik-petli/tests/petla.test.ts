import { expect, mock, test } from 'claude-code/testing'

// Pod pluginem: Bash zawsze pada z tym samym błędem (inny czas w treści),
// Read się udaje, a okienko pytania odpowiada tym, co ustawi test.
const setup = (on: Parameters<Parameters<typeof test>[1]>[1]) => {
  const asked: string[] = []
  const state = { answer: 'Stop, niech wyjaśni', bashCalls: 0 }
  mock.clock(on, { now: 1_000_000 })
  on('ui.log', () => ({ value: undefined }))
  on('session.start', ($, e) => ({ cwd: e.cwd }))
  on('prompt.submit', ($, e) => ({ text: e.text }))
  on('tool.call', ($, e) => {
    if (e.tool === 'AskUserQuestion') {
      const question = String((e as { questions?: { question: string }[] }).questions?.[0]?.question ?? '')
      asked.push(question)
      return { result: { questions: [], answers: { [question]: state.answer } }, text: state.answer }
    }
    if (e.tool === 'Read') {
      return { result: { type: 'text', file: { content: 'ok' } }, text: 'ok' }
    }
    state.bashCalls += 1
    return { isError: true, result: undefined, text: `Error: ENOENT ffmpeg nie znaleziony (${state.bashCalls * 17} ms)` }
  })
  return { asked, state }
}

const bash = { tool: 'Bash', command: 'ffmpeg -i a.mp4 b.mp4' } as const

test('3. taki sam błąd z rzędu: pyta użytkownika, „Stop” każe Claude’owi przestać', async ($, on) => {
  const { asked } = setup(on)
  await $.session.start({ cwd: '.', surface: 'desktop', isInteractive: true })

  const first = await $.tool.call(bash)
  const second = await $.tool.call(bash)
  expect(asked.length).toBe(0)
  expect(first.context ?? []).toEqual([])
  expect(second.context ?? []).toEqual([])

  const third = await $.tool.call(bash)
  expect(asked.length).toBe(1)
  expect(asked[0]).toContain('3 razy z rzędu')
  expect(asked[0]).toContain('ENOENT')
  expect(third.isError).toBe(true)
  expect(third.context?.join(' ')).toContain('użytkownik kazał przestać')

  // Kolejna próba tego samego: bez nowego pytania, znów „przestań”.
  const fourth = await $.tool.call(bash)
  expect(asked.length).toBe(1)
  expect(fourth.context?.join(' ')).toContain('już kazał przestać')
})

test('„Próbuj dalej” wycisza ten błąd do następnej wiadomości', async ($, on) => {
  const { asked, state } = setup(on)
  state.answer = 'Niech próbuje dalej'
  await $.session.start({ cwd: '.', surface: 'desktop', isInteractive: true })

  for (let i = 0; i < 3; i++) await $.tool.call(bash)
  expect(asked.length).toBe(1)
  for (let i = 0; i < 5; i++) await $.tool.call(bash)
  expect(asked.length).toBe(1)

  // Nowa wiadomość użytkownika: liczymy od zera.
  await $.prompt.submit({ text: 'spróbuj inaczej' })
  for (let i = 0; i < 3; i++) await $.tool.call(bash)
  expect(asked.length).toBe(2)
})

test('udane wywołanie narzędzia przerywa serię; inne narzędzie nie', async ($, on) => {
  const { asked } = setup(on)
  await $.session.start({ cwd: '.', surface: 'desktop', isInteractive: true })

  await $.tool.call(bash)
  await $.tool.call(bash)
  await $.tool.call({ tool: 'Read', file_path: 'C:/a.txt' })
  await $.tool.call(bash)
  expect(asked.length).toBe(1)
})

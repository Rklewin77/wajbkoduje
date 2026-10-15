import { expect, mock, test } from 'claude-code/testing'

// Log jak z ffmpeg: 2000 nudnych linijek, w środku jeden błąd, na końcu wynik.
const LOG = [
  ...Array.from({ length: 1000 }, (_, i) => `frame=${i} fps=30 q=28.0 size=${i}kB`),
  '[aac @ 0x1] Error: Too many bits per frame requested',
  ...Array.from({ length: 1000 }, (_, i) => `frame=${1000 + i} fps=30 q=28.0`),
  'video:5120kB audio:320kB muxing overhead: 0.1% — GOTOWE',
].join('\n')

const setup = (on: Parameters<Parameters<typeof test>[1]>[1], stdout: string) => {
  mock.clock(on, { now: 1_000_000 })
  mock.env(on, { USERPROFILE: 'C:\\Users\\ania' })
  mock.store(on)
  on('session.start', ($, e) => ({ cwd: e.cwd }))
  on('command.register', ($, e) => ({ value: { command: e.name } }))
  const writes: { path: string; text: string }[] = []
  on('fs.write', ($, e) => (writes.push({ path: e.path, text: e.text }), { value: undefined }))
  const statuses: (string | undefined)[] = []
  on('ui.status', ($, e) => (statuses.push(e.text), { value: undefined }))
  // Pod pluginem udajemy narzędzie: Bash i MCP oddają ten sam duży tekst, Read też.
  on('tool.call', ($, e) =>
    e.tool === 'Read'
      ? { result: { type: 'text', file: { content: stdout } }, text: stdout }
      : e.tool.startsWith('mcp__')
        ? { result: [{ type: 'text', text: stdout }], text: stdout }
        : { result: { stdout, stderr: '', interrupted: false }, text: stdout },
  )
  return { writes, statuses }
}

test('duży wynik Basha: początek, błąd ze środka, koniec i ścieżka do całości', async ($, on) => {
  const { writes, statuses } = setup(on, LOG)
  await $.session.start({ cwd: '.', surface: 'desktop', isInteractive: true })

  const ran = await $.tool.call({ tool: 'Bash', command: 'ffmpeg -i a.mp4 b.mp4' })
  const out = (ran.result as { stdout: string }).stdout

  expect(out.length).toBeLessThan(LOG.length / 5)
  expect(out).toContain('frame=0 fps=30')
  expect(out).toContain('Error: Too many bits')
  expect(out).toContain('GOTOWE')
  expect(out).not.toContain('frame=500 ')
  expect(out).toContain('C:/Users/ania/.claude/dieta/wynik-00.log')

  expect(writes.length).toBe(1)
  expect(writes[0]?.path).toMatch(/\.claude[\\/]dieta[\\/]wynik-00\.log$/)
  expect(writes[0]?.text).toContain(LOG)
  expect(statuses.at(-1)).toMatch(/^dieta: −\d+k tokenów$/)

  // Następny duży wynik idzie do kolejnego pliku.
  await $.tool.call({ tool: 'Bash', command: 'ffmpeg -i c.mp4 d.mp4' })
  expect(writes[1]?.path).toContain('wynik-01.log')
})

test('JSON w jednej linii z MCP: przycięty po znakach', async ($, on) => {
  const json = JSON.stringify({ nodes: Array.from({ length: 400 }, (_, i) => ({ id: `n${i}`, name: `Węzeł ${i}` })) })
  setup(on, json)
  await $.session.start({ cwd: '.', surface: 'desktop', isInteractive: true })

  const ran = await $.tool.call({ tool: 'mcp__n8n-mcp__n8n_get_workflow', id: 'abc' })
  const out = ran.result as string

  expect(out.startsWith(json.slice(0, 100))).toBe(true)
  expect(out).toContain(json.slice(-100))
  expect(out).toContain('wycięłam')
  expect(out.length).toBeLessThan(json.length - 5000)
})

test('nie tnie: Read, cat, mały wynik, wyłączona /dieta', async ($, on) => {
  const { writes } = setup(on, LOG)
  await $.session.start({ cwd: '.', surface: 'desktop', isInteractive: true })

  const read = await $.tool.call({ tool: 'Read', file_path: 'C:/a.txt' })
  expect(read.text).toBe(LOG)

  const cat = await $.tool.call({ tool: 'Bash', command: 'cat src/app.ts' })
  expect((cat.result as { stdout: string }).stdout).toBe(LOG)

  const off = await $.command.run({ command: 'dieta' })
  expect(off.text).toContain('wyłączona')
  const ffmpeg = await $.tool.call({ tool: 'Bash', command: 'ffmpeg -i a.mp4 b.mp4' })
  expect((ffmpeg.result as { stdout: string }).stdout).toBe(LOG)

  const on2 = await $.command.run({ command: 'dieta' })
  expect(on2.text).toBe('Dieta włączona.')
  expect(writes.length).toBe(0)
})

test('mały wynik zostaje w całości', async ($, on) => {
  const { writes } = setup(on, 'ok\n'.repeat(100))
  await $.session.start({ cwd: '.', surface: 'desktop', isInteractive: true })

  const ran = await $.tool.call({ tool: 'Bash', command: 'npm test' })
  expect((ran.result as { stdout: string }).stdout).toBe('ok\n'.repeat(100))
  expect(writes.length).toBe(0)
})

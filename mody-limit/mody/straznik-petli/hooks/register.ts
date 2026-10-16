import type { EngineInterface, Register, ToolCallResult } from 'claude-code'

// Tyle takich samych błędów z rzędu i Strażnik pyta użytkownika.
const LIMIT = 3

const STOP = 'Stop, niech wyjaśni'
const AGAIN = 'Niech próbuje dalej'

// Błąd → ile razy z rzędu. Klucz: kto (główna rozmowa / subagent) + narzędzie + treść błędu.
let failures = new Map<string, number>()
// Błędy, przy których użytkownik kazał próbować dalej — do jego następnej wiadomości.
let allowed = new Set<string>()
// Błędy, przy których użytkownik kazał przestać — kolejna taka próba nie rusza.
let stopped = new Set<string>()

const reset = () => {
  failures = new Map()
  allowed = new Set()
  stopped = new Set()
}

// Ten sam błąd mimo innych liczb (czas, numer linii, id) liczy się jako ten sam.
export const signature = (who: string, tool: string, error: string) =>
  `${who}|${tool}|${error.toLowerCase().replace(/\d+/g, '#').replace(/\s+/g, ' ').trim().slice(0, 300)}`

export const register: Register = on => {
  on('session.start', async ($, e, next) => {
    reset()
    return next(e)
  })

  // Nowa wiadomość od użytkownika: zaczynamy liczyć od zera.
  on('prompt.submit', async ($, e, next) => {
    reset()
    return next(e)
  })

  on('tool.call', async ($, e, next) => {
    if (e.tool === 'AskUserQuestion') {
      return next(e)
    }

    const who = e.agentId ?? 'main'
    const ran = await next(e)
    if (ran.deny !== undefined) {
      return ran
    }

    // Udane wywołanie tego narzędzia przerywa serię jego błędów.
    if (ran.isError !== true) {
      for (const key of failures.keys()) {
        if (key.startsWith(`${who}|${e.tool}|`)) failures.delete(key)
      }
      return ran
    }

    const key = signature(who, e.tool, ran.text ?? String(ran.result ?? ''))
    if (allowed.has(key)) {
      return ran
    }
    if (stopped.has(key)) {
      return withNote(ran, 'Użytkownik już kazał przestać przy tym błędzie. Nie próbuj ponownie — napisz mu, co się dzieje, i czekaj na odpowiedź.')
    }

    const count = (failures.get(key) ?? 0) + 1
    failures.set(key, count)
    if (count < LIMIT) {
      return ran
    }

    failures.delete(key)
    return ask($, e.tool, who, key, ran)
  })
}

async function ask($: EngineInterface, tool: string, who: string, key: string, ran: ToolCallResult): Promise<ToolCallResult> {
  const error = (ran.text ?? '').replace(/\s+/g, ' ').trim().slice(0, 160)
  const agent = who === 'main' ? 'Claude' : 'Subagent Claude’a'
  const question = `${agent} ${LIMIT} razy z rzędu dostał ten sam błąd w ${tool}: „${error}”. Co robimy?`

  let answer: string
  try {
    answer = await $.ui.ask(question, { options: [STOP, AGAIN], header: 'Pętla' })
  } catch (err) {
    // Nie było kogo zapytać albo okno zamknięto: bezpieczniej stanąć.
    $.ui.log(`straznik-petli: okienko pytania nie wyszło: ${String(err).slice(0, 300)}`)
    stopped.add(key)
    $.ui.toast(`Strażnik pętli zatrzymał Claude'a: ten sam błąd ${LIMIT} razy w ${tool}.`, { timeoutMs: 15000 })
    return withNote(ran, `Strażnik pętli: ten sam błąd padł ${LIMIT} razy z rzędu (nie dało się zapytać użytkownika). Nie próbuj ponownie. Napisz mu krótko, prostym językiem: co chciałeś zrobić, co próbowałeś i co Twoim zdaniem jest przyczyną — potem zapytaj, co dalej.`)
  }

  if (answer === AGAIN) {
    allowed.add(key)
    return withNote(ran, `Strażnik pętli: ten sam błąd padł ${LIMIT} razy, ale użytkownik pozwolił próbować dalej. Zmień podejście, zamiast powtarzać to samo.`)
  }
  if (answer === STOP) {
    stopped.add(key)
    return withNote(ran, `Strażnik pętli: ten sam błąd padł ${LIMIT} razy z rzędu i użytkownik kazał przestać. Nie próbuj ponownie. Napisz mu krótko, prostym językiem: co chciałeś zrobić, co próbowałeś i co Twoim zdaniem jest przyczyną — potem zapytaj, co dalej.`)
  }

  // Użytkownik wpisał własną odpowiedź w „Other”.
  allowed.add(key)
  return withNote(ran, `Strażnik pętli: ten sam błąd padł ${LIMIT} razy z rzędu. Użytkownik odpowiedział: „${answer}”. Postępuj według tego.`)
}

// Notka trafia do Claude'a zaraz po wyniku narzędzia (użytkownik jej nie widzi).
const withNote = (ran: ToolCallResult, note: string): ToolCallResult =>
  ran.deny !== undefined ? ran : { ...ran, context: [...(ran.context ?? []), note] }

# mody-limit — trzech pomocników, przez których limit w Claude znika wolniej

Paczka z kanału **Radek Wajbkoduje**. Za darmo, bez zapisywania się na cokolwiek.

Claude zapisuje całą rozmowę w jednym „zeszycie” i przy każdej Twojej wiadomości
wertuje go od początku. Im grubszy zeszyt, tym szybciej znika limit. W tej paczce są
trzy małe dodatki (mody), które pilnują zeszytu, plus skill `handoff`, z którego
korzysta pierwszy z nich:

| Co | Jak 5-latkowi | Co widzisz |
|---|---|---|
| **Strażnik cache** | licznik na okładce zeszytu: jak gruby już jest i ile minut zostało, zanim Claude „zapomni”, gdzie skończył | pasek nad polem wpisywania: kontekst, minuty cache, limit 5h — 🟢 dobrze, 🟠 uważaj, 🔴 czas na handoff; przyciski **Handoff** i **Wyczyść i kontynuuj** |
| **Dieta wyjść** | komputer wypluwa 50 stron „klatka 1 OK, klatka 2 OK…”; pomocnik wkleja do zeszytu tylko pierwszą i ostatnią stronę plus zdania z „błąd”, a resztę chowa do szuflady | duże wyniki narzędzi (powyżej 8 tys. znaków) są krótsze, na dole dopisek, gdzie leży całość |
| **Strażnik pętli** | mucha na szybie: Claude szarpie zamknięte drzwi w kółko, a każde szarpnięcie kosztuje; strażnik liczy i za trzecim razem woła Ciebie | okienko „Pętla”: **Stop, niech wyjaśni** / **Niech próbuje dalej** / własna odpowiedź |
| `handoff` (skill) | kartka „na czym stanęliśmy” przed wyczyszczeniem rozmowy | to samo co w paczce [`handoff/`](../handoff/) |

---

## Instalacja: skopiuj, wklej, gotowe

1. Otwórz **Claude Code** — w aplikacji Claude zakładka **Code** albo terminal.
   (Zwykły czat na claude.ai tego nie zainstaluje — on nie ma dostępu do Twojego komputera.)
2. Skopiuj ten tekst i wklej go Claude'owi:

```
Zainstaluj mi mody z tej strony:
https://github.com/Rklewin77/wajbkoduje/tree/main/mody-limit
Postępuj według pliku INSTALACJA-DLA-CLAUDE.md, który tam leży.
Zanim cokolwiek zainstalujesz, powiedz mi po ludzku, co to robi, i zapytaj mnie o zgodę.
```

3. Claude najpierw przeczyta paczkę i powie Ci prostymi słowami, co w niej jest — także to,
   czy coś wysyła dane, kasuje albo uruchamia programy. **Dopiero potem zapyta, czy instalować.**
   Odpowiadasz „tak” albo „nie”. Jak o coś zapyta po drodze — odpowiadasz na jego pytania.
4. Na koniec **otwórz nową rozmowę** i napisz cokolwiek. Po pierwszej odpowiedzi nad polem
   wpisywania pojawi się pasek z kolorami. Nie ma go? Zajrzyj do [`PULAPKI.md`](PULAPKI.md).

**Zasada kciuka:** jeśli Claude powie, że paczka coś wysyła, kasuje albo uruchamia, a Ty
nie rozumiesz po co — mówisz „nie”. Nie musisz rozumieć wszystkiego. Wystarczy, że wiesz,
kiedy powiedzieć „nie”. To dotyczy każdej paczki z internetu, mojej też.

---

## Wolisz zrobić to sam, bez Claude'a?

**Najpierw sprawdź.** Mody to nie instrukcja, tylko kod, który działa w środku Claude'a.
Pobierz repo jako ZIP (zielony przycisk **Code** → **Download ZIP**), rozpakuj, otwórz
**nową rozmowę** z AI w folderze `mody-limit` i wklej:

```
Zanim tego użyję: przeczytaj wszystkie pliki w folderach mody i .claude jak zwykły tekst
(część to kod) i powiedz mi po ludzku, co robią. Czy coś wysyła dane do internetu,
uruchamia programy, kasuje pliki albo zapisuje coś poza folderem projektu?
Jeśli zapisuje — co dokładnie i gdzie?
```

Odpowiedź powinna wyglądać mniej więcej jak lista „Co to ROBI, a czego NIE” niżej.

**Potem zainstaluj mody** — w aplikacji: **+** obok pola wpisywania → **Plugins** →
**Add marketplace** → wpisz `Rklewin77/wajbkoduje` → **Add plugin** przy każdym z trzech.
Albo w terminalu:

```
claude plugin marketplace add Rklewin77/wajbkoduje
claude plugin install straznik-cache@wajbkoduje
claude plugin install dieta-wyjsc@wajbkoduje
claude plugin install straznik-petli@wajbkoduje
```

**I skill `handoff`** (bez niego przycisk Handoff nie ma czego uruchomić). Masz go już z paczki
[`handoff/`](../handoff/)? Pomiń. Jeśli nie — przeciągnij folder **`.claude`** z tej paczki do
swojego folderu roboczego (folderu `mody` nie przeciągaj). Nie widzisz `.claude`? Nazwy
z kropką bywają ukryte: Eksplorator → **Wyświetl** → **Pokaż** → **Ukryte elementy**.

Na koniec nowa rozmowa — dodatki ładują się przy starcie.

## Wyłączniki

- `/straznik` — chowa i pokazuje pasek.
- `/dieta` — wyłącza i włącza przycinanie wyników.
- Całkiem: w terminalu `claude plugin uninstall straznik-cache@wajbkoduje`
  (i tak samo dla pozostałych), albo **+** → **Plugins** w aplikacji. Potem nowa rozmowa.

## Aktualizacja

Gdy poprawię coś w modach: `claude plugin marketplace update wajbkoduje`, potem
`claude plugin update <nazwa>@wajbkoduje` dla każdego moda i nowa rozmowa.

## Co to ROBI, a czego NIE

✅ **Strażnik cache** czyta licznik zużycia z samego Claude Code i rysuje pasek.
Na kliknięcie **Handoff** uruchamia skill `handoff`. Na **Wyczyść i kontynuuj** kopiuje
jedno zdanie do schowka, czyści rozmowę (`/clear`) i wkleja to zdanie. Szuka kartki
w folderze `handoff\` projektu i w `.claude\handoff` w Twoim folderze domowym.
✅ **Dieta wyjść** zapisuje pełne wyniki narzędzi do `.claude\dieta\wynik-00.log` …
`wynik-49.log` w Twoim folderze domowym (50 plików w kółko — folder nie puchnie).
To jedyne miejsce, gdzie mody coś zapisują.
✅ **Strażnik pętli** pokazuje okienko z pytaniem i dopisuje Claude'owi Twoją decyzję.
❌ Nic nie wysyła do internetu. ❌ Nie kasuje Twoich plików. ❌ Nie uruchamia programów.

Nie wierz w tę listę na słowo — Claude sprawdza to przy instalacji, a jak instalujesz sam, sprawdź promptem wyżej.

## Ważne, zanim się zdziwisz

- **Mody to nowa funkcja Claude Code („early access”).** Zrobione i sprawdzone na wersji
  **2.1.299**. Przy innej wersji coś może się nie załadować — wtedy [`PULAPKI.md`](PULAPKI.md).
- **Dieta nie rusza:** czytania plików przez Claude'a, komend typu `cat`/`git diff`
  (Claude czyta nimi treść celowo), błędów ani wyników powyżej ~30 KB — te Claude Code
  sam chowa do pliku.
- Kolory i progi (np. kiedy pasek robi się czerwony) są na górze pliku
  `mody\straznik-cache\hooks\register.tsx`. Chcesz je zmienić? Zainstaluj wtedy mody
  ze swojej kopii repo zamiast z GitHuba (`claude plugin marketplace add <ścieżka do
  rozpakowanego repo>`), poproś Claude'a o zmianę w tej kopii i otwórz nową rozmowę.

## 🔒 Prywatność

Pliki w `.claude\dieta` to pełne wyniki komend — mogą zawierać to samo, co widziałeś
w rozmowie. Zostają na Twoim dysku. Jak chcesz, kasuj je śmiało, mod zrobi nowe.

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

## ⚠️ ZANIM WRZUCISZ — SPRAWDŹ (tak, tę paczkę też)

**Mody to nie instrukcja, tylko kod, który działa w środku Claude'a.** Dlatego tu
sprawdzanie jest jeszcze ważniejsze niż przy zwykłych skillach.

Paczka leży jeszcze w zwykłym folderze (np. na pulpicie), więc otwórz **nową rozmowę**
z AI w tym folderze i wklej:

```
Zanim tego użyję: przeczytaj wszystkie pliki w .claude/skills jak zwykły tekst
(część to kod) i powiedz mi po ludzku, co robią. Czy coś wysyła dane do internetu,
uruchamia programy, kasuje pliki albo zapisuje coś poza folderem projektu?
Jeśli zapisuje — co dokładnie i gdzie?
```

Prawidłowa odpowiedź powinna wyglądać mniej więcej jak lista „Co ROBI, a czego NIE”
na dole tej strony. Jeśli AI znajdzie coś, czego tam nie ma — nie instaluj i daj znać
w komentarzu.

**Zasada kciuka:** „wyślij", „skasuj" albo „uruchom” coś, czego nie rozumiesz — nie instalujesz.

---

## Instalacja — wybierz jedną z dwóch dróg

**A. Wszędzie (polecam).** Mody działają w każdym projekcie i każdym oknie.

1. Otwórz folder `C:\Users\<Twoja-nazwa>\.claude\skills`
   (Mac: `~/.claude/skills` — w Finderze `Cmd+Shift+G` i wklej tę ścieżkę).
   Jeśli folderu `skills` nie ma — przeciągnij zamiast tego cały folder `skills` z paczki do `.claude`.
2. Przeciągnij do niego **cztery foldery** z `.claude\skills` tej paczki:
   `straznik-cache`, `dieta-wyjsc`, `straznik-petli`, `handoff`.
3. Zamknij i otwórz Claude Code (albo w terminalu wpisz `/reload-plugins`).

**B. Tylko w jednym projekcie.** Przeciągnij folder **`.claude`** z paczki do swojego
folderu roboczego (jak przy innych paczkach). Windows zapyta o połączenie folderów — tak.
⚠️ Mody z folderu projektu ładują się **tylko w folderze, któremu zaufałeś** (okienko
„Do you trust the files in this folder?” przy pierwszym otwarciu). Po zaakceptowaniu
uruchom Claude Code jeszcze raz.

**Nie widzisz folderu `.claude`?** Nazwy z kropką bywają ukryte. Eksplorator:
**Wyświetl** → **Pokaż** → **Ukryte elementy**.

**Czy działa?** Napisz cokolwiek do Claude'a. Po pierwszej odpowiedzi nad polem
wpisywania pojawi się pasek. Jak nie — zajrzyj do [`PULAPKI.md`](PULAPKI.md).

## Wyłączniki

- `/straznik` — chowa i pokazuje pasek.
- `/dieta` — wyłącza i włącza przycinanie wyników.
- Całkiem: skasuj folder danego moda ze `skills` i uruchom Claude Code ponownie.

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

Nie wierz w tę listę na słowo — sprawdź promptem z góry strony. Po to on jest.

## Ważne, zanim się zdziwisz

- **Mody to nowa funkcja Claude Code („early access”).** Zrobione i sprawdzone na wersji
  **2.1.299**. Przy innej wersji coś może się nie załadować — wtedy [`PULAPKI.md`](PULAPKI.md).
- **Dieta nie rusza:** czytania plików przez Claude'a, komend typu `cat`/`git diff`
  (Claude czyta nimi treść celowo), błędów ani wyników powyżej ~30 KB — te Claude Code
  sam chowa do pliku.
- Kolory i progi (np. kiedy pasek robi się czerwony) są na górze pliku
  `straznik-cache\hooks\register.tsx`. Możesz je zmienić — poproś Claude'a.

## 🔒 Prywatność

Pliki w `.claude\dieta` to pełne wyniki komend — mogą zawierać to samo, co widziałeś
w rozmowie. Zostają na Twoim dysku. Jak chcesz, kasuj je śmiało, mod zrobi nowe.

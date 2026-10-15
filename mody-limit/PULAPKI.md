# Pułapki — na co wpadłem przy budowie, żebyś Ty nie musiał

Zebrane 15.10.2026 przy budowaniu tych modów na Claude Code 2.1.299 (Windows, aplikacja
desktopowa). Jeśli coś nie działa, przejdź listę od góry.

## Nie widzę paska

1. **Pasek pojawia się dopiero po pierwszej odpowiedzi Claude'a.** Mod musi zobaczyć
   jedną skończoną turę, żeby wiedzieć, od kiedy liczyć cache. Napisz „cześć” i poczekaj.
2. **Pasek chowa się, gdy aplikacja pokazuje ankietę „How is Claude doing”** — to samo
   miejsce. Odpowiedz albo zamknij ankietę.
3. **Schowałeś go komendą `/straznik`?** Wpisz ją jeszcze raz.
4. **Mod nie załadował się w ogóle.** W terminalu w folderze projektu wpisz
   `claude plugin list` i poszukaj `straznik-cache@skills-dir` ze statusem `loaded`.
   - Widzisz „skipped because this workspace was not trusted” → instalowałeś drogą B
     (do projektu), a folder nie jest zaufany. Otwórz w nim Claude Code, zaakceptuj
     okienko zaufania i uruchom jeszcze raz. Albo zainstaluj drogą A (do folderu domowego).
   - Nie ma go na liście → folder moda leży w złym miejscu. Musi być dokładnie
     `...\.claude\skills\straznik-cache\` (a w nim `.claude-plugin`, `hooks`, `types`),
     nie `...\skills\mody-limit\.claude\skills\...`.
5. **Inna wersja Claude Code.** Mody są „early access” — mogą się zmienić bez ostrzeżenia.
   Zaktualizuj Claude Code; jeśli to nie pomaga, napisz w komentarzu, jaką masz wersję
   (`claude --version`).

## Przycisk Handoff nic nie robi / nie zmienia się na „Wyczyść i kontynuuj”

- **Potrzebny jest skill `handoff`** — jest w tej paczce. Bez niego przycisk nie ma czego
  uruchomić (pojawi się dymek „wpisz /handoff ręcznie”).
- Przycisk zmienia się dopiero, gdy **kartka faktycznie powstanie** i Claude skończy
  odpowiedź. Mod szuka nowego pliku `.md` w `handoff\` projektu i w `.claude\handoff`
  w folderze domowym. Jeśli Twój handoff zapisuje gdzie indziej — przycisk się nie zmieni.
- Dla ciekawych: mod nie może „wpisać” komendy zaczynającej się od `/` (Claude Code
  odrzuca taki tekst), więc uruchamia ją inną drogą. Jeśli kiedyś przestanie — to tu.

## „Wyczyść i kontynuuj” nie wyczyściło rozmowy

Mod najpierw kopiuje zdanie do schowka, dopiero potem czyści. Jeśli czyszczenie nie
przeszło, zobaczysz dymek — wpisz `/clear` i wklej (`Ctrl+V`). Nic nie przepada.

## Kolory paska się nie zmieniają

Progi: kontekst 🟠 od 50%, 🔴 od 75% · cache 🟠 poniżej 15 min, 🔴 poniżej 5 min ·
limit 5h 🟠 od 60%, 🔴 od 85%. Przez większość krótkiej rozmowy wszystko jest zielone —
tak ma być. Limit 5h widać tylko, gdy Claude Code go podaje (konta z subskrypcją).

## Dieta nic nie przycina

- Przycina tylko wyniki **powyżej 8 tys. znaków**. Typowa komenda jest mniejsza.
- **Bardzo duże wyniki (powyżej ~30 KB) Claude Code chowa do pliku sam**, zanim mod je
  zobaczy — wtedy dieta celowo nie wchodzi w drogę.
- Celowo NIE tnie: czytania plików (`Read`), `cat`, `head`, `tail`, `sed`, `git diff`,
  `git show`, `jq` — tym Claude czyta treść, której potrzebuje w całości. I nie tnie błędów.
- Wyłączyłeś ją komendą `/dieta`? Wpisz jeszcze raz.

## Dieta wycięła coś, czego Claude potrzebował

Na dole każdego przyciętego wyniku jest ścieżka do pełnej wersji. Napisz Claude'owi
„przeczytaj pełny wynik z tego pliku”. Jeśli to się powtarza przy jednej komendzie —
wyłącz dietę na czas tej roboty (`/dieta`).

## Okienko „Pętla” — przeoczyłem je

Wyskakuje w trakcie pracy Claude'a, łatwo je przegapić (autorowi też się zdarzyło).
Claude czeka, aż odpowiesz — nic się nie dzieje w tym czasie. Jeśli okienka nie da się
pokazać, Strażnik i tak zatrzymuje Claude'a, pokazuje dymek i każe mu wyjaśnić problem.

Strażnik liczy **ten sam błąd** (liczby w treści błędu, np. czas, nie mają znaczenia).
Licznik zeruje się, gdy napiszesz nową wiadomość albo gdy to samo narzędzie się uda.

## Mac i Linux

Mody szukają folderu domowego najpierw po zmiennej Windows (`USERPROFILE`), potem po
`HOME`. Testowane na Windows; na Macu powinny działać, ale nikt tego jeszcze nie
sprawdził na żywo — jeśli coś nie gra, daj znać w komentarzu.

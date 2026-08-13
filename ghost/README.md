# ghost — skill, dzięki któremu AI pisze jak Ty, a nie jak robot

Paczka z odcinka kanału **Radek Wajbkoduje**. Za darmo, bez zapisywania się na cokolwiek.

Ghost to instrukcja (skill) dla AI: zanim napisze za Ciebie maila czy wiadomość,
czyta Twój profil stylu i pisze tak, jak Ty piszesz. Profil buduje sam — z maili,
które mu pokażesz.

---

## ⚠️ ZANIM WRZUCISZ — SPRAWDŹ (tak, tę paczkę też)

Skill to instrukcja, którą AI wykona. W instrukcji ściągniętej z internetu może być
wszystko — dlatego **każdą paczkę sprawdzasz, zanim ją zainstalujesz. Tę też.**

Jak? Nie musisz nic czytać sam. Paczka leży jeszcze w zwykłym folderze (np. na pulpicie),
więc otwórz **nową rozmowę** z AI w tym folderze i wklej to:

```
Zanim tego użyję: przeczytaj te pliki jak zwykły tekst i powiedz mi po ludzku,
co ta instrukcja każe robić. Czy każe coś kasować, wysyłać gdzieś dane,
uruchamiać komendy albo grzebać poza swoim folderem?
```

**Zasada kciuka:** jeśli w instrukcji jest „wyślij", „skasuj" albo „uruchom" coś,
czego nie rozumiesz — nie instalujesz. Nie musisz rozumieć wszystkiego. Wystarczy,
że wiesz, kiedy powiedzieć „nie".

*(To nie jest kontrola pancerna, ale wyłapuje zdecydowaną większość śmieci.
Różnica jak między wzięciem cukierka od obcego a przeczytaniem składu.)*

---

## Instalacja (30 sekund, jedno przeciągnięcie)

1. Otwórz swój folder roboczy — ten, w którym rozmawiasz z AI.
2. Przeciągnij do niego folder **`.claude`** z tej paczki. To wszystko.

Powinno wyjść tak:

```
Twój-folder\
  CLAUDE.md          ← to, co już masz
  .claude\           ← to przeciągnąłeś
    skills\
      ghost\
        SKILL.md
        profil-komunikacji.md
```

**Masz już folder `.claude`?** Windows zapyta, czy połączyć foldery — kliknij tak.
Nic Ci nie skasuje, ghost po prostu dołączy do reszty.

**Nie widzisz folderu `.claude` w paczce?** Jest tam na pewno — po prostu nazwy
zaczynające się od kropki bywają ukryte. W Eksploratorze: zakładka **Wyświetl** →
**Pokaż** → **Ukryte elementy**.

> ⚠️ Nie próbuj tworzyć folderu `.claude` ręcznie w Eksploratorze Windows — nie pozwoli
> Ci zapisać nazwy zaczynającej się od kropki. Dlatego dostajesz go gotowego.

## Pierwsze uruchomienie — nakarm ducha

Ghost na start jest pusty: zna przepis na pisanie, ale nie zna Ciebie.

1. Znajdź w swojej skrzynce **3-5 maili, które sam wysłałeś** (zwykłych, codziennych).
2. W rozmowie z AI napisz: **„Użyj skilla ghost. Mój profil jest pusty — zbuduj go."**
   i wklej te maile.
3. AI przeanalizuje, jak piszesz, może o coś dopytać, i zapisze Twój profil stylu.
4. Otwórz `profil-komunikacji.md` i przeczytaj. Coś nie pasuje? Popraw ręcznie —
   to zwykły plik tekstowy. Im częściej poprawiasz, tym bardziej jest Twój.

Chcesz najpierw potestować bez własnych maili? W folderze `przyklady\` są cztery
przykładowe (fikcyjne) — te same, których używam w odcinku. Trzy do obcych firm
i jedna luźna do znajomego, bo dopiero z takiej mieszanki widać, że piszesz
inaczej do urzędu, a inaczej do kumpla.

## Jak używać na co dzień

Po prostu poproś: „napisz maila do…", „odpisz na to: [wklej wiadomość]".
AI samo sięgnie po ghosta. Draft zawsze dostajesz do akceptacji — nic nie wysyła się samo.

## 🔒 Prywatność — dwie rzeczy z odcinka 1, które obowiązują i tu

- To, co wklejasz, leci na serwer firmy AI — jak każda rozmowa. **Nie wklejaj haseł,
  numerów kart ani cudzych danych.** Karm ducha swoimi mailami, nie cudzymi.
- Profil stylu zostaje u Ciebie, w Twoim folderze. Nigdzie go nie wysyłasz.

## Co ten skill ROBI, a czego NIE robi

✅ Czyta swój folder (`profil-komunikacji.md`) i pisze drafty w Twoim stylu.
✅ Na Twoją prośbę aktualizuje Twój profil stylu.
❌ Nie wysyła niczego nigdzie. ❌ Nie kasuje plików. ❌ Nie uruchamia komend.
❌ Nie wychodzi poza swój folder.

Nie wierz w tę listę na słowo — sprawdź promptem z góry tej strony. Po to on jest.

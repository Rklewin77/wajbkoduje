# krotko — jedno słowo i z długiej odpowiedzi zostaje kilka zdań

Paczka z odcinka kanału **Radek Wajbkoduje**. Za darmo, bez zapisywania się na cokolwiek.

AI gada za dużo. Zadajesz proste pytanie, dostajesz ścianę tekstu pełną słów, których
nikt normalny nie używa — i to nie Twoja wina, ono jest za to nagradzane. Krotko to
instrukcja (skill), która na Twoje jedno słowo **przepisuje ostatnią odpowiedź krótko
i po ludzku**: wniosek w pierwszym zdaniu, zero żargonu, maksymalnie pięć zdań.

Odpowiedź przychodzi normalna. Jak jest za długa albo za mądra — piszesz `krótko`.
Nic nie ustawiasz na stałe, więc nic nie tracisz.

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
      krotko\
        SKILL.md
```

**Masz już folder `.claude`?** Windows zapyta, czy połączyć foldery — kliknij tak.
Nic Ci nie skasuje, krotko po prostu dołączy do reszty.

**Nie widzisz folderu `.claude` w paczce?** Jest tam na pewno — po prostu nazwy
zaczynające się od kropki bywają ukryte. W Eksploratorze: zakładka **Wyświetl** →
**Pokaż** → **Ukryte elementy**.

> ⚠️ Nie próbuj tworzyć folderu `.claude` ręcznie w Eksploratorze Windows — nie pozwoli
> Ci zapisać nazwy zaczynającej się od kropki. Dlatego dostajesz go gotowego.

## Jak używać

Dostałeś ścianę tekstu? Napisz jedno z tych:

| Piszesz | Dostajesz |
|---|---|
| `krótko` (albo `/krotko`) | tę samą odpowiedź w max 5 zdaniach |
| `krótko 3` | 3 punkty, od najważniejszego |
| `krótko, czy to bezpieczne?` | krótką odpowiedź na nowe pytanie, bez przepisywania |

Działa też na „skróć to", „za długo", „po ludzku", „nie rozumiem" — AI samo sięgnie
po skill, jak zobaczy, że się gubisz.

## Czego skill NIE wytnie — celowo

Każde skracanie coś ukrywa. Dlatego w środku jest reguła: **kwota, ryzyko i rzecz,
której się nie cofnie** (skasowanie, wysyłka, publikacja) zostają zawsze, choćby
odpowiedź miała być przez to dłuższa. A jak coś istotnego jednak wyleci, AI dopisze
na końcu jedną linię: `wycięte: …` — żebyś wiedział, że coś zostało za burtą, zamiast
się domyślać.

## Dodatek: masz tylko czat w przeglądarce?

Ten skill działa w Claude Code (AI podpięte do Twoich plików — jak to ustawić, pokazuję
w pierwszym odcinku kanału). Jak korzystasz ze zwykłego czatu w przeglądarce, skilla
nie zainstalujesz, ale możesz wkleić to zdanie po każdej za długiej odpowiedzi:

```
Przepisz swoją ostatnią odpowiedź krótko: wniosek w pierwszym zdaniu, max 5 zdań,
prosty polski, zero branżowych słów. Nie wycinaj kwot, ryzyka ani rzeczy,
których nie da się cofnąć — a jak coś wytniesz, dopisz na końcu, co.
```

To ta sama reguła, tylko wklejana ręcznie. Plik `prompt-do-czatu.txt` obok ma ją
gotową do skopiowania.

## Co ten skill ROBI, a czego NIE robi

✅ Czyta swoją własną poprzednią odpowiedź i przepisuje ją krócej.
✅ Odpowiada krótko na nowe pytanie, jak je dopiszesz po słowie „krótko".
❌ Nie wysyła niczego nigdzie. ❌ Nie kasuje plików. ❌ Nie uruchamia komend.
❌ Nie zmienia żadnych ustawień na stałe. ❌ Nie czyta Twoich plików.

Nie wierz w tę listę na słowo — sprawdź promptem z góry tej strony. Po to on jest.

# handoff — kończysz rozmowę z AI tak, żeby nowa wiedziała, na czym stanęliście

Paczka z odcinka kanału **Radek Wajbkoduje**. Za darmo, bez zapisywania się na cokolwiek.

Im dłużej rozmawiasz z AI, tym grubsza robi się kartka, którą wysyła do siebie przy
każdej Twojej wiadomości — i tym szybciej dojeżdżasz do limitu. Handoff to instrukcja
(skill), która na Twoje jedno słowo pisze **krótkie przekazanie**: nad czym pracujecie,
w których plikach, co już ustalone, co następne. Kasujesz rozmowę, wklejasz jedno zdanie
i lecisz dalej — z cienką kartką zamiast grubej.

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
      handoff\
        SKILL.md
```

**Masz już folder `.claude`?** Windows zapyta, czy połączyć foldery — kliknij tak.
Nic Ci nie skasuje, handoff po prostu dołączy do reszty.

**Nie widzisz folderu `.claude` w paczce?** Jest tam na pewno — po prostu nazwy
zaczynające się od kropki bywają ukryte. W Eksploratorze: zakładka **Wyświetl** →
**Pokaż** → **Ukryte elementy**.

> ⚠️ Nie próbuj tworzyć folderu `.claude` ręcznie w Eksploratorze Windows — nie pozwoli
> Ci zapisać nazwy zaczynającej się od kropki. Dlatego dostajesz go gotowego.

## Jak używać — cztery ruchy

1. **Sprawdź, ile już zużyłeś.** W rozmowie wpisz `/context`. Jak liczba zaczyna
   dobijać do jakichś 250 tysięcy, czas na przekazanie. (Ja robię to właśnie w tym miejscu.)
2. **Powiedz: „handoff"** — albo „podsumuj i czyścimy". AI napisze kartkę i zapisze ją
   do folderu `handoff\` u Ciebie w projekcie.
3. **Wyczyść rozmowę** komendą `/clear`.
4. **Wklej jedno zdanie**, które AI Ci poda — coś w stylu
   *„Przeczytaj `handoff\2026-08-27-oferta.md` i wracamy do roboty"*.
   Nowa rozmowa startuje z cienką kartką i wie wszystko, co trzeba.

Kartka to zwykły plik tekstowy. Możesz ją otworzyć, poprawić, dopisać coś od siebie —
albo skasować, jak temat jest zamknięty.

## Kiedy tego NIE potrzebujesz

Jak zaczynasz nowy temat, nie rób przekazania — po prostu otwórz nowe okno. Handoff jest
do **kontynuowania tej samej roboty**, nie do przeskakiwania między różnymi.

## Co ten skill ROBI, a czego NIE robi

✅ Pisze krótkie podsumowanie tego, na czym stanęliście.
✅ Zapisuje je jako plik tekstowy w folderze `handoff\` **w Twoim folderze roboczym**.
❌ Nie wysyła niczego nigdzie. ❌ Nie kasuje Twoich plików. ❌ Nie uruchamia komend.
❌ Nie wychodzi poza folder, w którym pracujesz.

Nie wierz w tę listę na słowo — sprawdź promptem z góry tej strony. Po to on jest.

## 🔒 Prywatność

Kartka bywa streszczeniem Twojej roboty, więc traktuj ją jak notatkę służbową:
zostaje na Twoim dysku, nigdzie jej nie wysyłasz. Skill ma wpisane wprost, żeby nie
wciągać do niej haseł, kluczy ani cudzych danych osobowych — ale jak zobaczysz tam coś,
czego nie chcesz mieć w pliku, po prostu to wykasuj. To zwykły tekst.

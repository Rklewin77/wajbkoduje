---
name: handoff
description: Zamyka rozmowę przed wyczyszczeniem — pisze zwięzłe przekazanie (stan pracy, ścieżki plików, rozstrzygnięcia, następny ruch) do wklejenia w nowej rozmowie. Uruchamiaj ZAWSZE, gdy użytkownik mówi "handoff", "/handoff", "podsumuj i czyścimy", "czyszczę", "robię clear", "zaczynam nową sesję", "przekaż to dalej", "kończymy na dziś" — albo gdy sam widzisz, że rozmowa jest długa i za chwilę trzeba ją uciąć. NIE używaj do zwykłych podsumowań w trakcie pracy ani do notatek długoterminowych.
---

# /handoff

## Po co to jest

`/clear` kasuje wszystko, co wiesz o tej rozmowie. Ten skill produkuje **jedną kartkę**,
po której nowa rozmowa wraca dokładnie tam, gdzie skończyliście — bez ciągnięcia za sobą
całego kontekstu.

Zamiennik `/compact`: `/compact` streszcza rozmowę i ciągnie ją dalej w tym samym oknie
(wolno, i tak zostaje śmieć). Handoff daje **czyste okno** i ręcznie wybrany stan.

## Co robisz

1. **Napisz kartkę** według szablonu niżej.
2. **Zapisz ją** do `handoff\RRRR-MM-DD-<temat>.md` w folderze, w którym pracujecie
   (zwykłym zapisem pliku; jeśli folderu `handoff` nie ma — utwórz go).
3. **Wypisz w rozmowie** gotową linijkę do wklejenia w nowej rozmowie.

Potem użytkownik robi `/clear` i wkleja tę linijkę.

## Szablon kartki

```
# Handoff — <temat> (<data>)

**Nad czym pracujemy:** <1-2 zdania. Stan, nie historia.>

**Router:** <ścieżka do pliku, od którego nowa rozmowa ma zacząć — np. CLAUDE.md projektu>

**Pliki, które powstały lub się zmieniły w tej rozmowie:**
- `<ścieżka>` — <co to jest, pół zdania>

**Ustalone — nie otwierać ponownie:**
- <decyzja + data>

**Czeka na użytkownika:**
- <pytanie, na które nie ma jeszcze odpowiedzi>

**Następny ruch:** <jedna konkretna rzecz, od której zacząć>
```

## Zasady twarde

1. **Ścieżki, nie opisy.** „`notatki\oferta.md`, sekcja 3", nie „ten plik z ofertą".
   Nowa rozmowa ma umieć otworzyć plik bez zgadywania.
2. **Zero wklejania treści plików.** To jest cały sens — nowa rozmowa przeczyta plik,
   jeśli będzie go potrzebować. Kartka ma być wskaźnikiem, nie kopią.
3. **Stan, nie przebieg.** Nie „najpierw zrobiliśmy X, potem Y, potem okazało się Z".
   Tylko to, co obowiązuje na koniec.
4. **Max ~40 linii.** Jak nie mieści się w 40 linijkach, to znaczy, że robiliście dwie
   różne rzeczy — napisz dwie kartki albo wytnij tę, której nie kontynuujecie.
5. **Liczby i kwoty przepisuj dosłownie.** Pomiar, cena, termin, wersja — te giną
   najłatwiej i najdrożej.
6. **Otwarte pytania zawsze zostają**, nawet kosztem długości. Rzecz, o którą nie zdążyliście
   zapytać, po `/clear` znika bezpowrotnie.
7. **Nie zmyślaj domknięcia.** Jak coś jest niedokończone albo niepewne — napisz to wprost.

## Czego NIE wpisywać

- Streszczenia rozmowy, dygresji, rzeczy porzuconych w trakcie.
- Treści plików, transkrypcji, długich cytatów.
- Danych wrażliwych: kluczy, haseł, cudzych danych osobowych.
  Kartka leży w folderze projektu jako zwykły plik tekstowy.

## Linijka do wklejenia

Na koniec wypisz dokładnie to (z podstawioną ścieżką):

> Przeczytaj `handoff\<plik>.md` i wracamy do roboty.

Jedno zdanie zamiast wklejania całej kartki — mniej klikania i nic się nie urwie
przy kopiowaniu. Jeśli w nowym oknie AI nie widzi tego folderu, po prostu wklej
treść kartki — jest krótka.

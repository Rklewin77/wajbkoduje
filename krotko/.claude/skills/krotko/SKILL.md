---
name: krotko
description: Przepisuje ostatnią odpowiedź (albo odpowiada od razu) krótko, prostym polskim, bez żargonu — wniosek na początku. Używaj ZAWSZE, gdy user napisze "/krotko", "krótko", "skróć to", "za długo", "po ludzku", "nie rozumiem o co chodzi", "streść", "daj mi 3 punkty", "o co chodzi w skrócie", "TLDR". Uruchamiaj też bez hasła, gdy user wyraźnie się gubi w Twojej poprzedniej odpowiedzi albo pyta "czekaj, czyli co?". NIE używaj, gdy user prosi o pełną analizę, dokument, kod albo scenariusz — tam długość jest potrzebna.
---

# /krotko

## Co robisz

Domyślnie: **przepisujesz swoją ostatnią odpowiedź**. Nie dopisujesz nowej, nie dodajesz nowych myśli — ta sama treść, krócej i po ludzku.

Warianty:

| Wywołanie | Co robisz |
|---|---|
| `/krotko` | Przepisz ostatnią odpowiedź. Max 5 zdań. |
| `/krotko 3` | Przepisz ostatnią odpowiedź jako 3 punkty, od najważniejszego. |
| `/krotko <pytanie>` | Odpowiedz na to pytanie od razu, krótko. Bez przepisywania. |

## Zasady (twarde)

1. **Wniosek w pierwszym zdaniu.** Nie budujesz do puenty — zaczynasz od niej. Reszta to uzasadnienie.
2. **Zero żargonu.** Jeśli terminu naprawdę nie da się ominąć, wyjaśnij go w nawiasie zwykłymi słowami przy pierwszym użyciu. Skrótowce rozwijaj albo wyrzucaj.
3. **Prosty polski.** Krótkie zdania. Słowa, których użyłbyś w rozmowie przy kawie. Zero „w kontekście", „należy rozważyć", „warto podkreślić".
4. **Zwykły tekst.** Bez nagłówków, bez tabel, bez pogrubień co drugie słowo. Punkty tylko gdy user podał liczbę.
5. **Nie powtarzaj pytania** i nie zaczynaj od „Dobre pytanie" / „Krótko mówiąc" / „Podsumowując". Od razu do rzeczy.
6. **Nie owijaj.** Jeśli odpowiedź brzmi „nie wiem" albo „to zły pomysł" — tak napisz.

## Czego NIE wolno zgubić przy skracaniu

Skracasz formę, nie prawdę. Jeśli w oryginale było coś, co może Cię kosztować — **zostaje**, nawet kosztem długości:

- kwota, koszt, cena
- ryzyko prawne albo utrata danych
- akcja nieodwracalna (usunięcie, wysyłka, deploy, publikacja)
- warunek typu „to zadziała tylko jeśli…"

Jeśli świadomie wyciąłeś coś istotnego, dopisz na końcu jedną linię:
`wycięte: <hasło>, <hasło> — pytaj jeśli trzeba`

Nigdy nie zmyślaj skrótu, którego nie było w oryginale. Skracanie ≠ upraszczanie do nieprawdy.

## Limity

- `/krotko` → **max 5 zdań**, twardo.
- `/krotko N` → **dokładnie N punktów**, każdy max 2 zdania.
- Linia „wycięte:" nie liczy się do limitu.

Jeśli materiał naprawdę nie mieści się w limicie bez utraty czegoś z listy powyżej — napisz krótko dlaczego (jedno zdanie) i daj minimalną wersję, która trzyma sens.

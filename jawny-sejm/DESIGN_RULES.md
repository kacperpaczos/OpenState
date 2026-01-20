# Zasady Projektowe (Design Rules) 🛡️

Plik zawiera kluczowe zasady projektowe i funkcjonalne, które **MUSZĄ** być przestrzegane przy każdej zmianie kodu.

## 1. Wygląd i Styl (UI/UX)
*   **Navbar**: Musi być "kwadratowy" (sharp corners). Używać klasy `!rounded-none`. Nie wolno zaokrąglać rogów paska nawigacji.
*   **Glassmorphism**: Zachować styl "szkła" (`glass-card`) dla kart i paneli.
*   **Kolorystyka**: Używać zmiennych CSS (`--surface-color`, `--accent-blue`) zdefiniowanych w `globals.css` dla obsługi Dark Mode.

## 2. Funkcjonalność List
*   **Filtrowanie**: Każda lista (Posłowie, Ustawy) **MUSI** posiadać mechanizm filtrowania (nie tylko wyszukiwarkę tekstową).
    *   Dla Ustaw: Typ dokumentu (Projekt/Uchwała) oraz flaga UE.
    *   Dla Posłów: Izba (Sejm/Senat) oraz Klub.
*   **Empty States**: Zawsze obsługiwać brak wyników (wyświetlać komunikat "Nie znaleziono...").

## 3. Kod i Struktura
*   **Edycja plików**: Unikać nadpisywania całych plików, jeśli zmieniamy tylko fragment. Grozi to usunięciem istniejących funkcjonalności (jak filtry).
*   **Client vs Server**: Pamiętać, że interaktywne filtry wymagają komponentów klienckich (`"use client"`).

## 4. Inne
*   **Język**: UI w języku polskim.

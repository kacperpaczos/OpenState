# Reguły Gry dla AI (AGENT.md)

Instrukcja twardego rygoru operacyjnego dla asystentów AI (w tym dla samego mnie i mnie podobnych), pracujących w ramach OpenOurGov / OpenState. Ignorowanie tych reguł to kardynalne złamanie umowy projektowej.

## 1. Wymuszony Format Commitów (Conventional Commits)
Swoje zmiany kodu oraz ewentualne komunikaty o modyfikacjach opisuj kategorycznie na zasadzie:
* `feat:` - Nowa funkcjonalność.
* `fix:` - Łata do bugów (np. łatanie null referencji przy braku pola `url_pdf`).
* `chore:` - Zmiany czysto utrzymaniowe, w tooling'u (np. paczki pip/npm).
* `refactor:` - Restrukturyzacja kodu nie dodająca funkcjonalności.
* `docs:` - Zmiana lub tworzenie dokumentacji (np. README.md).

## 2. Kwarantanna AI (Scraper i Mock Tests)
**Bezwzględny zakaz:** Generowanie lub modyfikacja nowych logik "scrapujących" (soup, lxml) i operacji w pythonowskich `extract` LUB `transform` bez równoczesnego zaprezentowania asymetrycznego testu jednostkowego wykorzystującego mechanizm MOCK!
* Jeśli ulepszasz zapytanie XPath, musisz napisać pytest z surowym, hardcodowanym HTML jako wejście (`<table id='glosowania'>...`). Nie wypuszczaj scrapującej magii wierząc, że po prosu 'zadziała' na środowisku produkcyjnym rządu. Oczekuj, że rząd zepsuje HTML.

## 3. Epistemiczne Typowanie Graniczne
Kod działający na krawędzi wejścia zewnętrznego (API rządu), musi być twardo bity systemem sprawdzającym w dół stosu. 
* **Python Backend:** Dane podlegające wejściu do DB *muszą* posiadać rygor struktury. Odszyfrowywanie niestabilnego JSON/HTML wymusza przepuszczenie surowego słownika przez **Pydantic** z góry przygotowanymi walidatorami (np. daty na datetime, zły typ na fallback - ew. zrzut exception bez puszczania danych). Pydantic jest obowiązkowe tam, gdzie API zwraca nieznane dane a lxml rozbija nieprzewidywalny HTML.
* **Next.js Frontend:** Elementy zaciągające dane z PostgreSQL (Drizzle) wysyłają do Client Comopnents informacje tylko przepuszczone przez ścisłe definicje i typy TS narzucone przy pobieraniu, bez ukrytych elementów np. "any". Bądź świadom i narzucaj struktury Type (schema zod w paradygmacie np. t3).

## 4. Zasada Czystości Dyskursu Architektonicznego
Nie "lej wody" w commitach, w code review i odpowiedziach do użytkownika. Udzielaj lakonicznych, precyzyjnych i inżynieryjnych wniosków. Twoim celem nie jest 'być miłym', tylko być skutecznym. Oszczędzaj miejsce na dysku, w sieci i procesorze. Analizuj kod First Principles, patrz do czego służy, nie co powierzchownie robi.

# Wektory Rozwoju (ROADMAP.md)

Niniejszy dokument dzieli cykl życia produktu na rygorystyczne fazy. Ocena stanu obecnego jest surowa i operuje wyłącznie faktami znajdującymi się w kodzie.

## V0 (Stan Obecny - Audyt)
**Funkcjonuje:**
* Next.js App Router z bazową strukturą podstron, Drizzle ORM, zestawem testów e2e (Playwright). Baza została zmigrowana na PostgreSQL.  
* Backend w Pythonie ładujący bazowe informacje z endpointów: Sejm API (JSON) oraz Senat (Soup/HTML).
* Konfiguracja Dockera pod bazę.
  
**Braki Inżynieryjne (Wykryty Brud Oraz Deficyty Długu Technicznego):**
* Brak spójnego wzorca `try/except` oraz zaawansowanej logiki wznawiania żądań. W Pythonie braki asynchroniczności, a brakujące obsługi błędów sieci (np. timeouts) prowadzą do kaskadowych wyjątków modułu ETL (Requests/Fetch).
* Brak jasnego kontraktu wprowadzanych błędów w fetch na Frontendzie - rzucanie ogólnym stanem błędu bez zróżnicowania (404, 500, network error) – ukrywanie symptomów z ułomnego systemu scrapującego.
* Migracja nie osiągnęła jeszcze dojrzałego mechanizmu CI/CD, konteneryzacja frontendu i backendu jest w fazie eksperymentalnej. Brak zaawansowanych migratorów Drizzle w cyklu automatycznym.

---

## V1 (MVP - Gotowość Produkcyjna)
*Elementy bezwzględnie konieczne przed publikacją stabilną:*
1. **Error Handling i Retry Policies:** Całkowite przebudowanie warstwy transportowej (backend) do odpornej iteracji z `retry-backoff` (np. biblioteka `tenacity` dla zapytań HTTP na API rządowe). Frontend musi po cichu łapać zrzuty bazy i generować graceful degradację.
2. **Pełne Mapowanie ETL z Typowaniem:** Implementacja ściśle określonych schematów (np. `Pydantic` w formacie wyciągniętym z parserów Pythona), tak, by baza PostgreSQL nie zjadała przypadkowego null/brakujących rzędów z urwanych tabel Senackich.
3. **Idempotentne Upserty:** Mechanizm bazy obsługujący czyste inserty (Drizzle `onConflictDoUpdate`) likwidujący ryzyko zduplikowanych rekordów przy wielokrotnym przerwaniu pipeline'u Pythona.
4. **Wizualny Diff Ustaw:** Dopracowanie implementacji `DiffViewer`, bezwzględny komponent dla użyteczności platformy. Brak side-by-side niszczy wizję użyteczności dla prawników i aktywistów.

---

## V2 (Skalowanie i Wydajność Architektury)
*Optymalizacje:*
1. **Asynchroniczny Scraping (Backend):** Migracja pobierania w Pythonie synchronicznego z `requests` do asynchronicznego pobierania i przetwarzania z wykorzystaniem bibliotek typu `aiohttp` oraz `asyncio`. Drastyczne zmniejszenie okna czasowego (Time-to-update) po nocnej sesji sejmu z O(n) pobierania paczek na odwołania równoległe O(n/wątki).
2. **Kolejkowanie Zadań ETL (Celery/Redis):** Odseparowanie surowego crawlu od ciężkich transformacji (Extract-T-Load do asynchronicznych jobów w backgroundzie trzymanych niezależnie).
3. **Cache'owanie i Redis w Next.js:** Wykorzystanie stabilnej warstwy cacheującej i rewalidacyjnej Node.js, aby ochronić PostgreSQL przed ciężkim ruchem w momencie zapytania do konkretnych, niszowych ustaw.
4. **Moduły Sztucznej Inteligencji:** pgvector pod zapytania NLP w ustawach (Semantic Search).

# Epistemiczna Bezwzględność (TESTING.md)

System musi zachować odporność na fałszowanie zapytań, upadłe struktury zwrotne, braki danych oraz chaotyczne zmiany wizualne na rządowych portalach internetowych. Strategia operuje na polityce "Zero-Trust".

## Strategia

Błędy w danych nie mogą przeciekać do bazy publicznej. Nie ma wyjątków dla pustych lub zniekształconych formatów. Albo rygor zostanie zachowany, albo pipeline ETL zwraca kontrolowany punkt błędu a stara wartość pozostaje aktywna (fail-safe).

## Mitygacja Zmian API i HTML (Backend/Python)

API Sejmu modyfikuje się powoli, lecz strona Senatu potrafi zmieć strukturę tabel HTML bez najmniejszej zapowiedzi. Należy to ukrócić.
1. **System Zmockowanych Przebiegów (Snapshot Testing):**
   * Żaden scraper Senatu (lxml/BeautifulSoup) nie może być oznaczony jako sprawny bez unit testu bazującego na *lokalnie* zapisanej kopii pliku HTML, a nie w zapytaniu o URL.
   * Katalog testów w backendzie wymaga mocków (np. `senat_sitting_3.html`, `sejm_api_responses_voting_page34.json`). 
   * Jeżeli modyfikowany jest kod `extract/`, test przeciw statycznemu HTML weryfikuje czy parser pękł ze względu na zły kod, czy zmianę struktury u rządu.

2. **Działanie Testów:**
   * Uciąć mockowanie metody GET (`requests.get`) i zamrozić surową pobraną zawartość do celów reprodukowalnych na przestrzeni czasu.

## Reguły dla Next.js (Frontend)

Komponenty odpowiadają za renderowanie krytycznych treści (Ustawy, Głosowania Puste/Za/Przeciw, Wskazania Budżetowe). Defekt na tych komponentach to potencjalne rozprzestrzenianie niesprawdzonych informacji politycznych.
1. **Kontrola Null/Undefined na Propach z Bazy:** 
   Testy na elementach Next.js muszą wykorzystywać sztucznie zmodyfikowane, na wpół puste sety zwracane przez Drizzle. Front musi radzić sobie z utratą opisu zdjęcia posła i zamiast błędow JavaScript, ukazywać szare avatary (Fallback Components) co trzeba wykazać w teście Jest.
2. **E2E Critical Paths (`Playwright`):**
   * Pełny flow ścieżki "Obywatela i Ustawy" od kliknięcia ustawy do ekranu dywergencji diffu.
   * Potwierdzona obecność Mega Menu, które nie może zepsuć wyświetlania w wersjach responsywnych.
   * Render komponentów *Hemicycle* (Rozkład Sił) sprawdzony przeciw różnej długości liczb mandatów.

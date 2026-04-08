# Raport Audytowy Projektu - OpenOurGov

Niniejszy raport zawiera spostrzeżenia dotyczące obecnego stanu platformy **OpenOurGov**, obszarów, w których system wymaga udoskonalenia od strony interfejsu (UI/UX) i technologii, a także nowych funkcji, które można wdrożyć w oparciu na aktualnie zgromadzone zbiory danych, minimalizując koszty pozyskiwania dodatkowych informacji.

---

## 1. Architektura i Możliwości Rozwoju Technologii

Poniżej zebrano pomysły i obszary, w których projekt ma spore rezerwy techniczne, których rozwinięcie wyniesie aplikację na wyższy poziom komercyjny / obywatelski.

- **Migracja zasobów danych (JSON → Baza Danych):**
  Zastosowanie plików JSON sprawdziło się jako model początkowy, lecz pliki takie jak `interpellations_list.json` osiągają rozmiar 27 MB. To znacząco wpływa na obciążenie pamięci. Wskazane przejście na lekką, otwartą bazę danych typu *PostgreSQL / Supabase / Neon* dla lepszej skalowalności i bezproblemowego paginowania.
- **Automatyzacja Zasilania Danych:**
  Obecny model ETL (skrypty Pythona) wymaga ręcznego wywołania (lub lokalnego triggera roboczego). Rekomenduje się stworzenie workflow na platformie Github Actions lub Vercel Cron, który co wieczór będzie włączał pipeline pobierający nowe ustawy, generujący commit i robiący re-deploy z nowymi informacjami do Next.js w przypadku braku zewnętrznej bazy.
- **W pełni zautomatyzowane "Git for Law":**
  Działanie porównywarki (DiffViewer) jest na razie eksperymentalne ("sparsed data"). Generowanie plików tekstowych i wyciąganie diffów przez narządzia typu `pdfplumber` i `difflib` powinno być połączone w masowy job asynchroniczny przetwarzający nową ustawę tuż po pojawieniu się na serwerach Sejmu.
- **System Powiadomień i Subskrypcje:**
  Z uwagi na edukacyjno-obywatelski cel platformy użytkownicy muszą mieć powód do powrotu. Implementacja modułu subskrypcji konkretnego projektu ustawy lub interpelacji poprzez email czy Web Push Notifications zagwarantuje gigantyczny spadek *bounce-rate'u*.
- **Wyszukiwarka Oparta Na Pełnym Tekście (Full-Text Search):**
  Zamiast wewnętrznych filtrów tekstowych, można zaimplementować rozwiązanie typu Algolia lub Meilisearch, które indeksowałyby całą zawartość treściową aktów ISAP, druków oraz interpelacji, tworząc błyskawiczną, globalną wyszukiwarkę na stronie głównej (w stylu Spotlight na macOS).

---

## 2. Braki w Interfejsie (UI) i Użyteczności (UX)

Stylistyka *"GovApple"* nadaje projektowi bardzo prestiżowego i nowoczesnego wyglądu. Można jednak zidentyfikować fragmenty, na których te zasady uproszono na rzecz szybszego MVP.

- **Brak natywnego czytnika interpelacji (`/interpelacje`):** 
  Zakładka pozwala wyłącznie obejrzeć tytuł interpelacji i uciętą listę autorów. Posiada twarde ucinanie wyników do 50 elementów i brakuje pełnej paginacji, co ukrywa tysiące dokumentów. Większym problemem jest kliknięcie "Zobacz na stronie Sejmu", które wyrzuca użytkownika poza aplikację GovApple, gubiąc immersję systemu.
- **Widok Listy Posłów (`/poslowie`):** 
  Baza dysponuje 460 pozycjami, ale oferuje tylko podstawowe sortowanie (aktywność / alfabet). Znacznie usprawniłoby UI dodanie filtrów według opcji politycznej/klubu, przynależności okręgowej, stażu, a także sortowanie po **frekwencji na głosowaniach**.
- **Karty Ustaw i Projekty RCL:**
  Dla projektów uwięzionych w konsultacjach rządowych (`/rcl`) widok to prosta lista wyliczająca zgłoszenia. Moduł projektów Rządowego Centrum Legislacji można by przebudować, wykorzystując dobrze przyjęty układ kart Kanban - tzw. "*Poczekalnia Sejmowa*".
- **Problemy Z Ekosystemem Mobilnym:**
  Kanban procedowania ustaw (`/harmonogram`) oraz tabela statystyk głosowań i różnic w kodzie źródłowym ustaw ("Git for Law") mogą być zbyt opresyjne na ekranach mobilnych (Responsive, ale nie optimized - jak wskazano). Warto zapewnić np. swipe gestures (przesunięcia w kanbanie) oraz dedykowany widok kolumnowy dla kart.
- **Accessibility (A11y):**
  Z uwagi na grupę docelową - wszystkich obywateli, brakuje standardów zwiększonej widoczności, powiększania tekstu czy widoku o wysokim kontraście.

---

## 3. Co ukryte jest w zmagazynowanych Danych (Niewykorzystane Funkcje)

Z istniejących danych, które struktura już ściąga, da się zbudować niesamowite funkcjonalności analityczne bez konieczności angażowania nowych zewnętrznych API.

- **"Indeks Lojalności" wobec partii / Współczynnik Buntu:**
  Platforma posiada pliki z odpowiedziami w głosowaniach dla poszczególnych posłów (`votes_by_mp`) powiązane z sittings (posiedzenia). Mając informację o tym, z którego klubu jest poseł, system może na żywo wskazywać, na ile niezależnie dany poseł głosuje - tzn. ilokrotnie wyłamuje się z rekomendacji wewnątrz swojego stanowiska politycznego. Pozwalałoby to na "Rating Prawomyślności Osobistej Posła".
- **Frekwencja i Statystyki Obecności:**
  Również na podstawie `votings` / `votes_by_mp` możemy precyzyjnie oszacować ranking obecności danego polityka w parlamencie. Dane liczbowe mogłyby stanowić "dashboard" merytoryczny na pofilu wybranego Reprezentanta.
- **Natywne Treści Interpelacji i Odpowiedzi:**
  W ponad dwudziestomegabajtowym zbiorze powiązanym z interpelacjami kryją się powiązania pism - nie tylko ich statusy, ale całe drzewa dialogu np. między posłem a Ministrem infrastruktury. Stworzenie odrębnego *Detail View* dla interpelacji wyeksploatowałoby ten atut do granic – od wpłynięcia listu, po tekst odpowiedzi i czas rozpatrywania. To buduje wiarygodność platformy jako cyfrowego biura podawczego obywateli.
- **Świeżo Zdefiniowane Akty Prawne (Timeline ISAP):**
  Skoro dysponujemy już bazą opublikowanych ustaw `acts_2024.json`, świetnym feature'em mogłoby stanowić kalendarium nowo weszłego prawa w Polsce. Zakładka np. **"Od Dziś Obowiązujące Prawo"** - która pozwalałaby łatwo zrozumieć co od 1-go stycznia / danego kwartału uległo faktycznemu przetasowaniu na rynku.
- **Znacznie Szersze Analizy Senatorów:**
  Plik `senators.json` funkcjonuje poprawnie, lecz Senat traktowany jest ogółem. Dodanie widoku historii powiązanej dla ich uwag i wetów do dokumentów ukazałoby w pełni istotną wagę wyższej Izby Parlamentarnej - powiązanie druków z poprawkami senackimi w systemie wizualno-punktowym.

# OpenState: Wizja Strategiczna i Mapa Drogowa 🚀

Niniejszy dokument stanowi skonsolidowaną wizję projektu **OpenState**, definiującą jego misję, architekturę oraz podział prac na etapy zrealizowane i planowane.

---

## 1. Misja i Design (Filozofia Projektu)

*   **Misja**: Pełna transparentność polskiego procesu legislacyjnego podana w przystępny, nowoczesny sposób. Chcemy uczynić państwo zrozumiałem „w Twoich rękach”.
*   **Design (GovApple)**: Estetyka inspirowana *Apple Human Interface Guidelines*. Czystość, minimalizm, „szklane” karty (*glassmorphism*), wysoka kontrastowość i czytelność. Każdy element musi sprawiać wrażenie produktu *premium*.
*   **Zasada Okna (UX Principle)**: Dążymy do maksymalnej jakości UX poprzez zatrzymanie użytkownika wewnątrz ekosystemu OpenState. **Koniec z linkami zewnętrznymi!** Każda informacja (RCL, Komisje, Majątki) musi posiadać u nas swój natywny widok, by oszczędzić użytkownikowi kontaktu z przestarzałymi serwisami rządowymi.
*   **Język Ludzki (Human-Centric Content)**: Inspirując się platformami aktywistycznymi (np. *House of the People*), odchodzimy od żargonu prawniczego. Każda ustawa musi mieć sekcję „Co to oznacza dla Ciebie?”, tłumaczącą suchy tekst na realny wpływ na życie obywatela.
*   **Wizualny Diff (Side-by-Side)**: Naszym największym atutem technicznym będzie automatyczne generowanie porównania tekstów ustaw. Zamiast czytać „w art. 2 zmienia się pkt 3...”, użytkownik zobaczy gotowy tekst z zaznaczonymi zmianami (zielony/czerwony).

---

## 2. Podział Prac (Status Projektu)

### 🏗️ Fundament i Infrastruktura
| Status | Zadanie | Opis |
| :--- | :--- | :--- |
| ✅ | **Migracja PostgreSQL** | Przejście z ciężkich plików JSON na relacyjną bazę danych (Drizzle ORM). |
| ✅ | **Tech Stack Next.js 16** | Wykorzystanie najnowszych wersji React 19 i Next.js dla maksymalnej wydajności. |
| 🔄 | **Konteneryzacja (Docker)** | Przygotowanie pod system VPS (Postgres + App + Workers). |
| 📅 | **Deployment VPS** | Uruchomienie produkcyjnej wersji na zewnętrznym serwerze. |

### ⚙️ Backend & ETL (Dane)
| Status | Zadanie | Opis |
| :--- | :--- | :--- |
| ✅ | **Integracja Sejm API** | Pełna synchronizacja Posłów, Głosowań i Ustaw (procesów). |
| ✅ | **Scraper Senatu** | Mechanizm pobierania danych o Senatorach mimo braku oficjalnego API. |
| 🔄 | **DbManager** | System inteligentnego upsertowania danych bez duplikatów. |
| 🔄 | **RCL Metadata** | Pełne mapowanie projektów rządowych (etapy przed-sejmowe). |
| 📅 | **Video Cutter (Sejmometr)**| Automatyczne wycinanie przemówień z Sejm API (HLS stream + Timestamps). |
| 📅 | **Komisje i Zespoły** | Automatyczne pobieranie składów i harmonogramów prac merytorycznych. |
| 📅 | **Oświadczenia Majątkowe** | Ekstrakcja danych z PDF do bazy relacyjnej. |

### 🎨 Frontend (Interfejs i UX)
| Status | Zadanie | Opis |
| :--- | :--- | :--- |
| ✅ | **Mega Menu (Apple-style)** | Wysokowydajna nawigacja Hubowa ułatwiająca dostęp do sekcji. |
| ✅ | **Pulpit Budżetu** | Dashboard wizualizujący wydatki państwa (Recharts). |
| ✅ | **Karty Posłów/Senatorów** | Pełne profile z historią głosowań i wysokiej jakości zdjęciami. |
| 🔄 | **Metro Map (Law 2.0)** | Nieliniowa oś czasu: połączenie etapu rządu, Sejmu, Senatu i Prezydenta. |
| 🔄 | **Visual Diff Engine** | Mechanizm Side-by-Side pokazujący realne zmiany w tekście jednolitym. |
| 📅 | **OpenState Multimedia** | Odtwarzacz wideo zintegrowany ze stenogramami (przeskok do konkretnego przemówienia). |
| 📅 | **Native Previews** | Własny podgląd dokumentów (PDF/Text) bez wychodzenia z aplikacji. |
| 📅 | **Tryb Porównywania** | Zaawansowane narzędzie do zestawiania aktywności dwóch polityków. |
| 📅 | **Głosowanie Społeczności** | „Jak Ty byś zagłosował?” – zestawienie woli ludu z decyzją parlamentu. |

### 🧠 AI i Analiza (Inteligencja)
| Status | Zadanie | Opis |
| :--- | :--- | :--- |
| 🔄 | **Semantyka (pgvector)** | Przygotowanie bazy do wyszukiwania po „znaczeniu” ustaw. |
| 📅 | **Law Explainer (AI)** | Automatyczne streszczanie ustaw na „język ludzki” z wykorzystaniem LLM. |
| 📅 | **Ideology/Leadership Score** | Wykresy powiązań i wpływów posłów na podstawie współpodpisanych ustaw. |
| 📅 | **Local AI (Ollama)** | Integracja lokalnych modeli LLM do streszczania ustaw. |
| 📅 | **Rebel Score** | Algorytm badający niezależność parlamentarzystów (głosowanie przeciw partii). |
| 📅 | **Representativeness** | Analiza podobieństwa posła do profilu społecznego jego okręgu. |
| 📅 | **Predykcja Legislacyjna** | Szacowanie czasu trwania procesu na podstawie danych historycznych. |

*Legenda: ✅ - Zakończone, 🔄 - W toku, 📅 - Przyszłe pomysły / Backlog*

---

## 3. Strategia Bazy Danych (Data Strategy)

OpenState nie jest prostym wyświetlaczem danych – to relacyjna mapa państwa.

### A. Architektura Relacyjna
Nasza baza (Drizzle) mapuje rzeczywiste zależności:
- **Poseł/Senator ↔ Głosowanie**: Śledzenie historii decyzji.
- **Druk/Ustawa ↔ Etap Legislacyjny**: Wizualizacja „Metro Map”.
- **Interpelacja ↔ Odpowiedź**: Indeksowanie tysięcy dokumentów (rozwiązanie problemu ciężkich plików JSON).

### B. Wyszukiwanie Semantyczne i AI (pgvector)
Planujemy wykorzystanie `pgvector` w PostgreSQL do przechowywania embeddingów treści ustaw i interpelacji. 
- **Zysk**: Umożliwi to wyszukiwanie „sensu”, a nie tylko słów kluczowych.

---

## 4. Wymagania Infrastrukturalne (VPS)

Zalecana konfiguracja dla stabilnego działania bazy, Next.js oraz lokalnego AI:
*   **Procesor**: Min. 2–4 vCPU.
*   **RAM**: **Min. 8 GB** (pod Ollama + PostgreSQL).
*   **Orkiestracja**: **Docker + Docker Compose**.

---

## 5. OpenState Multimedia (Sejmometr 2.0) 📺

Wskrzeszamy ideę „Sejmometru”, ale w nowoczesnym wydaniu, w pełni zintegrowanym z danymi legislacyjnymi.

*   **Integracja Wideo-Stenogram**: Dzięki API Sejmu, które dostarcza czas rozpoczęcia i zakończenia każdego przemówienia, możemy automatycznie wycinać fragmenty wideo dla każdego posła.
*   **Hosting Hybrydowy**: Wykorzystujemy oficjalne strumienie HLS Sejmu (zerowe koszty hostingu wideo) oraz własny kanał YouTube dla najciekawszych fragmentów (zasięgi).
*   **Video-Search**: Możliwość przeszukiwania przemówień nie po tytułach, ale po słowach kluczowych wypowiedzianych na mównicy.

---

## 6. Przyszłe pomysły: OpenState Samorząd (White label)
W odleglejszej przyszłości silnik OpenState może zostać zaadaptowany dla miast i gmin, pozwalając na śledzenie uchwał rad miejskich i budżetów obywatelskich w tym samym standardzie wizualnym.

---
*Dokument zaktualizowany na podstawie audytu Antigravity (AI Assistant) – 2026-04-10.*

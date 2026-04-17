# OpenOurGov (OpenState) - Fundament Operacyjny

Platforma integracji i normalizacji polskiego procesu legislacyjnego (Sejm, Senat, RCL).

## Architektura Systemu

System opiera się na separacji ekstrakcji danych (Python) od ich prezentacji (Next.js), łącząc je pojedynczym źródłem prawdy (znormalizowana relacyjna baza PostgreSQL).

```mermaid
graph TD
    subgraph Źródła Danych
        S[API Sejmu / term10]
        R[RCL Legislacja - XML/API]
        Sen[Senat.gov.pl - HTML/Scraping]
    end

    subgraph Backend - Ingestia Danych Python
        P[Parsery i Scrapery - BeautifulSoup/lxml]
        V[Walidacja & Normalizacja - Python Core]
        P --> V
    end

    subgraph Relacyjna Baza Danych
        DB[(PostgreSQL)]
    end

    subgraph Frontend - Interfejs Obywatelski Next.js
        API[Next.js API Routes / Server Actions]
        UI[Wizualizacja React / Drizzle ORM]
        API --> UI
    end

    S --> P
    R --> P
    Sen --> P
    V -->|Zapis/Upsert| DB
    DB -->|Odczyt bezpośrendi Drizzle| API
```

## Setup Lokalny

Projekt składa się z bazy danych (Docker), skryptów uruchamianych manualnie/okresowo (Python backend) i aplikacji frontendowej (Next.js Node).

### 1. Zmienne środowiskowe (.env)
Utwórz plik `.env` w głównym katalogu na wzór (lub przenieś istniejące dane uwierzytelniające):
```env
POSTGRES_DB=openstate
POSTGRES_USER=openstate
POSTGRES_PASSWORD=openstate_dev
POSTGRES_PORT=5432
DATABASE_URL=postgresql://openstate:openstate_dev@localhost:5432/openstate
```

### 2. Baza Danych (Docker)
Uruchom kontener PostgreSQL zdefiniowany w `docker-compose.yml`:
```bash
docker-compose up -d
```

### 3. Backend (Python)
Przygotuj środowisko wirtualne do uruchamiania pipeline'u danych:
```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python verify_db.py
python pipeline.py # Inicjacja pobrania i transformacji (ETL)
```

### 4. Frontend (Next.js)
Zbuduj schemat bazy i uruchom aplikację webową:
```bash
cd frontend
npm install
npm run db:generate
npm run db:migrate
npm run dev
```
Aplikacja będzie dostępna pod [http://localhost:3000](http://localhost:3000).

## Stos Technologiczny

Absolutny fundament technologiczny, odstępstwa od poniższego bez dyskusji są zabronione:

**Baza Danych:**
* **PostgreSQL 16**: Relacyjne, ustrukturyzowane źródło prawdy (pgvector pod przyszłe moduły AI).

**Backend (ETL & Scraper):**
* **Python 3.x**: Główne środowisko ekstrakcji.
* **BeautifulSoup4 / lxml**: Podstawowe narzędzia bitowe do rozkładania niestrukturyzowanego kodu HTML Senatu.
* **requests / psycopg2**: Protokoły wejścia/wyjścia (sieć i baza).

**Frontend:**
* **Next.js 16 (App Router)**: Główne środowisko renderowania i routingu.
* **React 19**: Architektura komponentowa.
* **Drizzle ORM**: Lekki i wysoce typowany ORM do komunikacji z bazą.
* **Tailwind CSS**: Narzucający rygor w standaryzacji (design "GovApple"), bez zewnętrznych preprocesorów.
* **Playwright i Jest**: Narzędzia testowania interfejsu (E2E i jednostkowe).

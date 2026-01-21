# Tech Stack - OpenOurGov (JasnaSprawa.pl)

## Frontend

### Core Framework
- **Next.js**: `16.1.3` (App Router, Turbopack, Server Components)
- **React**: `19.2.3`
- **React DOM**: `19.2.3`
- **TypeScript**: `5.9.3`

### Styling & UI
- **TailwindCSS**: `3.4.1`
  - Design System: **GovApple** (Apple-inspired palette)
  - Dark Mode: `class` strategy
  - Custom tokens: apple-blue, apple-gray, stage-* colors
- **Autoprefixer**: `10.4.23`
- **PostCSS**: `8.5.6`

### UI Components & Icons
- **Lucide React**: `0.562.0` (Icon library)
- **clsx**: `2.1.1` (Class name utilities)
- **tailwind-merge**: `3.4.0` (Class composition)

### Data Visualization
- **Recharts**: `3.6.0`

### Testing
- **Jest**: `30.2.0`
- **@testing-library/react**: `16.3.2`
- **@testing-library/jest-dom**: `6.9.1`
- **jest-environment-jsdom**: `30.2.0`
- **@playwright/test**: `1.57.0` (E2E)
- **ts-jest**: `29.4.6`

### Build Tools
- **ESLint**: `9` + `eslint-config-next 16.1.3`
- **babel-plugin-react-compiler**: `1.0.0` (React Compiler enabled)
- **ts-node**: `10.9.2`

---

## Backend

### Runtime & Language
- **Python**: `3.x` (SSL verification disabled for Sejm API)
- **Node.js**: For build scripts

### Data Ingestion
- **urllib**: Native Python HTTP client
- **json**: Native JSON parsing
- **ssl**: Custom SSL context (CERT_NONE for Sejm API)

### PDF Processing (Phase 2 - Git for Law)
- **pdfplumber**: PDF text extraction
- **difflib**: Python native diff engine

### Data Sources (External APIs)
1. **Sejm API**: `https://api.sejm.gov.pl/sejm/term10/*`
   - `/processes` - Legislative processes
   - `/MP` - Members of Parliament
   - `/votings` - Voting records
   - `/interpellations` - Interpellations
2. **RCL API**: `https://legislacja.rcl.gov.pl/*`
   - Government legislative projects
3. **ISAP API**: `http://isap.sejm.gov.pl/*`
   - Published acts (Dziennik Ustaw)
4. **Senate Data**: Extracted from Sejm API (no public Senate API)

---

## Data Storage

### File-Based Database
- **Location**: `frontend/public/data/`
- **Format**: JSON files
- **Key Files**:
  - `processes.json` - 696 legislative processes with Kanban stages
  - `bills.json` - Same as processes (legacy naming)
  - `mps.json` - 460 MPs
  - `senators.json` - 100 Senators
  - `votings/sittings.json` - 49 parliamentary sittings
  - `votings/{sitting}/{voting}.json` - Individual voting records
  - `bills_text/*/diff_*.json` - Bill version diffs (sparse)
  - `rcl/projects.json` - RCL government projects
  - `isap/acts_2024.json` - Published acts
  - `interpellations_list.json` - Interpellations

### Caching Strategy
- PDF extractions cached in `backend/parsers/`
- Bill details cached in `frontend/public/data/bills/{id}.json`

---

## Architecture Patterns

### Frontend Architecture
- **App Router** (Next.js 16)
- **Server Components** (default)
- **Client Components** (`"use client"`) for:
  - Interactive UI (BillsList, DiffViewer, ProcessTimeline)
  - State management (useState, useEffect)
- **File-based Routing**:
  - `/ustawy` → `app/ustawy/page.tsx`
  - `/ustawy/[id]` → `app/ustawy/[id]/page.tsx`
  - `/harmonogram` → 4 views (vertical, horizontal, stats, timeline)

### Backend Architecture
- **Script-based ETL** (No persistent server)
- **On-demand data refresh** via `fetch_*.py` scripts
- **Kanban Stage Mapping**: `determine_stage()` in `fetch_bills.py`
  - Maps legislative stages to UI-friendly Kanban columns

### Design System
- **GovApple**: Custom design language
  - Apple-inspired colors (`#007AFF`, `#34C759`, etc.)
  - Card-based layouts (`card-apple` utility class)
  - Glass-morphism effects (`glass-card`)
  - Semantic stage colors (`stage-sejm`, `stage-senat`, etc.)

---

## Deployment & DevOps

### Development
```bash
npm run dev          # Next.js dev server
npm run build        # Production build
npm run test         # Jest unit tests
npm run lint         # ESLint
```

### Data Refresh
```bash
cd backend
python3 fetch_bills.py          # Legislative processes
python3 fetch_mps.py            # MPs
python3 fetch_senators.py       # Senators
python3 fetch_votings.py        # Voting records
python3 fetch_interpellations.py # Interpellations
python3 fetch_rcl.py            # RCL projects
```

### Testing
```bash
python3 backend/test_authenticity.py  # Data authenticity tests
npm run test                           # Frontend unit tests
```

---

## Key Dependencies by Feature

| Feature | Dependencies |
|---------|-------------|
| Legislative Processes | Next.js, TailwindCSS, lucide-react |
| Kanban Views | Recharts (stats), custom CSS Grid |
| Bill Diffs | pdfplumber, difflib, React state |
| Voting Records | Sejm API, JSON storage |
| Search | (Planned - not yet implemented) |
| Dark Mode | Tailwind `class` strategy, CSS variables |

---

## Version Lock Considerations

### Critical Versions
- **Next.js 16.1.3**: Uses Turbopack (beta), App Router stable
- **React 19.2.3**: Latest major version (new hooks, compiler)
- **TypeScript 5.9.3**: Latest stable

### Incompatibilities Noted
- Sejm API SSL certificate issues → SSL verification disabled
- PDF data sparse → DiffViewer error handling required
- HMR aggressive on `public/data/` changes → cleanup patterns needed

---

## Future Tech Stack Considerations

### Potential Additions
- **Database**: PostgreSQL/Supabase for persistent storage
- **Search**: Algolia/MeiliSearch
- **Real-time**: WebSockets for live voting updates
- **Auth**: NextAuth.js (if user accounts needed)
- **Analytics**: Vercel Analytics / Google Analytics

### Current Gaps
- No persistent backend server
- No real-time data updates
- No user authentication
- Search is client-side only (via /api/search)

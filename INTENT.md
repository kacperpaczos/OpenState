# Project Intent - OpenOurGov (JasnaSprawa.pl)

## Mission Statement
**OpenOurGov (JasnaSprawa.pl)** is a **non-profit civic transparency platform** that provides comprehensive, real-time insights into the Polish parliamentary legislative process. The goal is to create **the definitive portal for Polish parliamentary activity** by aggregating all available data sources into one accessible, modern interface.

### Business Model
- **Non-profit**: No ads, no paywalls, free for all citizens
- **Funding**: TBD (grants, donations, sponsorships)
- **Hosting**: Vercel (frontend) + self-hosted backend (MacBook)
- **Philosophy**: Transparency as a public service

---

## Core Objectives

### 1. **Legislative Transparency**
Make the Polish legislative process understandable to everyday citizens by:
- Visualizing bill progress through Kanban-style boards
- Showing detailed timelines of legislative stages
- Tracking votes and decisions in real-time

### 2. **Data Aggregation**
Consolidate fragmented data sources into a single interface:
- **Sejm API**: Bills, MPs, voting records, interpellations
- **RCL API**: Government draft legislation
- **ISAP API**: Published acts (Dziennik Ustaw)
- **Senate Data**: Extracted from Sejm API (no direct Senate API)

### 3. **"Git for Law" - Version Control for Legislation**
Enable citizens to see how laws evolve:
- Track

 bill text changes across legislative stages
- Generate diffs between draft versions (RCL → Sejm → enacted)
- Visualize amendments and modifications

### 4. **User Experience Excellence**
Provide a modern, Apple-quality interface:
- **GovApple Design System**: Clean, minimalist aesthetics
- Multiple view modes (cards, compact, table, Kanban, timeline)
- Dark/light mode support
- Responsive design

---

## Target Users

### Primary Audience
- **Engaged Citizens**: People who want to follow specific bills or topics
- **Journalists**: Reporters covering parliamentary activities
- **NGOs/Activists**: Organizations tracking legislation
- **Researchers**: Academic study of legislative processes

### Secondary Audience
- **Students**: Civics education
- **Developers**: API consumers, open data enthusiasts
- **Local Government Officials**: Once samorządy integration is ready (planned)

---

## Deployment Architecture

### Production Environment
- **Frontend**: Vercel hosting with custom domain integration
- **CDN**: Vercel's built-in global CDN (automatic)
- **Backend**: Python scripts running on developer's MacBook
- **Data Refresh**: Manual execution + git push → auto-deploy
- **Future**: GitHub Actions or Vercel Cron for automated daily refreshes

---

## Key Features (Current Implementation)

### 📊 Legislative Dashboard
- **Homepage (Bento Layout)**: AI-first search + quick access tiles
- **Real-time stats**: 696 bills, 460 MPs, 100 Senators, 49 sittings

### 📋 Bill Tracking
- **Kanban Board** (`/harmonogram`): Visual project management for laws
  - 10 stages: Inicjatywa → Sejm (4 stages) → Senat (2 stages) → Prezydent → Publikacja → Wejście w życie
- **Alternative Views**:
  - Horizontal Kanban (narrow columns, smooth scroll)
  - Stats Dashboard (KPIs, bar charts, top projects)
  - Timeline (Metro Map visualization)

### 🗂️ Bill Lists & Details
- **List Views** (`/ustawy`):
  - Cards (default): Modern card layout with stage badges
  - Compact: Dense 3-column grid
  - Table: Sortable columns
- **Detail Page** (`/ustawy/[id]`):
  - Legislative timeline with nested stages
  - Version comparison (diff viewer)
  - Links to official sources (Sejm, ISAP)

### 🗳️ Voting Records
- **Sitting Browser** (`/glosowania`): Browse 49 parliamentary sittings
- **Voting Details**: Individual vote breakdowns (for/against/abstain)

### 👥 Parliamentarians
- **MP List** (`/poslowie`): 460 MPs with search/filter
- **Senator List** (`/senatorowie`): 100 Senators (purple theme for distinction)
- **Detail Pages**: Bio, voting history, contact info

### 🔍 Search
- Basic search API (`/api/search`) - searches bills, MPs, senators

---

## Data Flow Architecture

```
┌─────────────────┐
│  External APIs  │
│  - Sejm         │
│  - RCL          │
│  - ISAP         │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Python Scripts  │ ← Manual Execution (fetch_*.py)
│ - ETL Pipeline  │
│ - Stage Mapping │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  JSON Storage   │ ← frontend/public/data/*.json
│  (File-based)   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   Next.js App   │ ← Server Components read JSON
│  (Frontend)     │
└─────────────────┘
```

### Critical Flow: Bill → Kanban Stage
1. **Fetch**: `fetch_bills.py` calls Sejm API `/processes`
2. **Details**: For each bill, fetch `/processes/{id}` for full stage data
3. **Map**: `determine_stage(details)` analyzes stage names
   - Example: "Sejm - II Czytanie" if last stage contains "ii czytanie"
4. **Enrich**: Add `kanbanStage` property to each bill
5. **Save**: Write to `processes.json`
6. **Render**: Frontend groups bills by `kanbanStage` for Kanban views

---

## Design Philosophy

### GovApple Aesthetic
- **Inspiration**: Apple's Human Interface Guidelines + Google Material Design 3
- **Principles**:
  - **Clarity**: Information hierarchy, generous whitespace
  - **Deference**: Content over chrome, subtle animations
  - **Depth**: Layers, shadows, glassmorphism
- **Colors**: 
  - Apple system colors (`#007AFF`, `#34C759`, etc.)
  - Semantic stage colors (blue for Sejm, purple for Senat)
- **Typography**: Inter font family
- **Components**: 
  - `card-apple`: Standard card with shadow-apple-xl
  - `glass-card`: Semi-transparent glassmorphism
  - `rounded-card`: 16px border radius
  - `rounded-button`: 12px border radius

### UI Patterns
- **Auto-hiding headers**: Scroll down = hide, scroll up = show
- **View switchers**: Pills with active state highlighting
- **Stage badges**: Color-coded pills showing current Kanban stage
- **Micro-animations**: Hover effects, transitions

---

## Technical Decisions & Rationale

### Why Next.js App Router?
- Server Components for free data fetching
- File-based routing = clean URLs
- Built-in image optimization
- React 19 + React Compiler for performance

### Why File-Based JSON Storage?
- **No database needed**: Simple deployment
- **Git-friendly**: Version control on data
- **Fast reads**: Static JSON served by Next.js
- **Drawback**: Manual refresh required

### Why Python Backend?
- **Rapid scripting**: ETL pipelines in ~100 lines
- **Rich stdlib**: urllib, json, ssl built-in
- **PDF processing**: pdfplumber for text extraction
- **Drawback**: No real-time sync

### Why Multiple Kanban Stages?
- **User research**: Citizens confused by generic "Sejm" label
- **Granularity**: "I Czytanie" vs "II Czytanie" shows progress
- **Educational**: Teaches civic process stages

---

## Current Limitations & Known Issues

### Data Freshness
- **Manual refresh**: Must run `fetch_*.py` to update
- **No auto-sync**: Data can be hours/days old
- **Mitigation**: Timestamps on data files

### Incomplete Features
- **Search**: Basic keyword match, no full-text search
- **User Accounts**: No login, no saved searches
- **Notifications**: No alerts for bill updates
- **Mobile**: Responsive but not optimized

### Technical Debt

- **SSL workaround**: Disabled cert verification for Sejm API

### Edge Cases
- **Diff data sparse**: Only ~1 bill has diff files
- **Senate data indirect**: Extracted from Sejm API, not official
- **404 handling**: DiffViewer cleanup pattern for missing files

---

## Future Roadmap (Inferred from Code)

### Phase 1 (Completed)
- [x] Data ingestion pipeline
- [x] Kanban visualization
- [x] Bill detail pages
- [x] GovApple design system

### Phase 2 (In Progress)
- [x] PDF text extraction
- [x] Version diff engine
- [x] DiffViewer component
- [ ] Integrate diffs for all bills

### Phase 3 (Planned - Not Implemented)
- [ ] Real-time WebSocket updates
- [ ] User authentication
- [ ] Saved searches / watchlists
- [ ] Email notifications
- [ ] Full-text search
- [ ] Mobile app (React Native?)

### Phase 4 (Speculative)
- [ ] AI-powered bill summarization
- [ ] Recommendation engine
- [ ] Local government integration
- [ ] Crowdsourced annotations

---

## Success Metrics (Implied)

### User Engagement
- Time on site
- Pages per session
- Return visitors

### Transparency Impact
- Bills tracked
- Diffs viewed
- Shares on social media

### Data Quality
- API uptime
- Data freshness (< 24h old)
- Coverage (% of bills with full data)

---

## Alignment with Civic Tech Best Practices

### Open Data Principles
✅ **Machine-readable**: JSON APIs
✅ **Accessible**: Public URLs
✅ **Documented**: TECH_STACK.md, README
✅ **Timely**: Daily refresh possible
⚠️ **Non-proprietary**: Depends on Sejm API uptime
⚠️ **Non-discriminatory**: No auth, but no accessibility audit

### Transparency Commitments
- All data sourced from official government APIs
- Authenticity tests (`test_authenticity.py`)
- Public GitHub repo (assumed)

---

## Questions for Clarification

*These are NOT answered by the code and require user input:*

1. **Production Deployment**: Where is this hosted? (Vercel? Self-hosted?)
2. **User Accounts**: Are user accounts planned? Why/why not?
3. **Monetization**: Is this a nonprofit? Government-funded? Ads?
4. **Local Government**: Serious about adapting to samorządy? Priority?
5. **Real-time Updates**: When is Phase 3 (WebSockets) targeted?

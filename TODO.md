# OpenOurGov Project Roadmap & TODOs

## 🚀 Current Sprint (In Progress)
- [x] **UI Redesign Concepts**
    - [x] Create Spatial/Glassmorphism Prototype (`/concepts/spatial`)
    - [x] Create Bento Grid Prototype (`/concepts/bento`)
- [x] **Backend**: Standardize Python Scraping Pipeline
    - [x] Convert `fetch_senators.js` to `fetch_senators.py`
    - [x] Update `run_pipeline.py`
- [x] **Frontend**: Integrate Real Data
    - [x] Connect `lib/senators.ts` to `senators.json`
    - [x] Connect `lib/votings.ts` to `votings/` data
    - [/] Ensure Interpellations are using real data (Partially Verified)

## ✅ Completed (Recently)
- [x] Analyze project structure (React/Next.js migration assessment)
- [x] Populate initial MP/Senator data from Sejm API
- [x] Implement initial Air Mouse support (referenced in history)

## 🔮 Backlog / Future Ideas
- [ ] **Sejm Seat Map Visualization**
    - *Goal*: Visualize MP faces on a hemicycle map.
    - *Blocker*: Lack of "seat number" in Sejm API. Requires external dataset or complex scraping of voting result pages HTML.
- [ ] **Air Mouse Refinement**
    - Improve gesture recognition if needed.
- [ ] **Frontend Polish**
    - Check "DESIGN_RULES.md" compliance (Square Navbar, Glassmorphism).
    - Ensure all lists have active filtering (EU flags for bills, Clubs for MPs).
- [ ] **Live Streaming Widgets (Bento)**
    - *Goal*: Show live video/status of Sejm/Senate/Committees on the main dashboard if active.
- [ ] **Historical Session Archive**
    - *Goal*: New subpage for browsing past sessions.
    - *Features*: Youtube embeds, transcripts (stenograms), list of voted bills, and voting results for that day.

## 📝 Notes
- **Data Source**: `backend/` scripts populate `frontend/public/data/`.
- **Look & Feel**: Adhere to `DESIGN_RULES.md` (or new concept if approved).

# OpenState Backend

## Uruchomienie pipeline'u danych

```bash
cd backend
python sync.py
```

Pipeline pobiera i przetwarza dane z:
- **Sejm API** — posłowie, głosowania, ustawy (procesy legislacyjne)
- **Senat** — senatorowie (scraping Playwright)
- ~~**RCL**~~ — wyłączone (WAF blokuje automatyczne IP)

Dane trafiają do `frontend/public/data/`.

## Struktura

```
sync.py          ← entry point
pipeline.py      ← generyczny ETL framework (ETLJob, PipelineOrchestrator)
extract/         ← pobieranie surowych danych z API / scrapery
transform/       ← transformacje do docelowych modeli
load/            ← zapis JSON do frontend/public/data/
core/            ← logger, config, exceptions
constants.py     ← stałe KanbanStages (muszą być zsynchronizowane z frontend/lib/constants.ts)
```

## Wymagania

```bash
pip install -r requirements.txt
# Dla senatorów (Playwright):
playwright install chromium
```

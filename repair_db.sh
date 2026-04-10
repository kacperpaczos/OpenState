#!/bin/bash
export PATH="$PATH:/Applications/Docker.app/Contents/Resources/bin"

echo "🧹 1. Czyszczenie bazy (Hard Reset)..."
docker exec openstate_db psql -U openstate -d openstate -c "DROP SCHEMA public CASCADE; CREATE SCHEMA public; GRANT ALL ON SCHEMA public TO openstate; GRANT ALL ON SCHEMA public TO public; DROP SCHEMA IF EXISTS drizzle CASCADE;"

echo "🚀 2. Ręczne aplikowanie migracji SQL (z GIN Simple Filter)..."
SQL_FILE=$(ls frontend/src/db/migrations/*.sql | head -1)
echo "Używam pliku: $SQL_FILE"
cat "$SQL_FILE" | docker exec -i openstate_db psql -U openstate -d openstate

echo "🔎 3. Weryfikacja tabel..."
TABLES=$(docker exec openstate_db psql -U openstate -d openstate -t -c "SELECT count(*) FROM information_schema.tables WHERE table_schema = 'public';")
echo "Liczba tabel w schemacie public: $TABLES"

if [ "$TABLES" -gt 0 ]; then
    echo "✅ Tabele utworzone pomyślnie."
    echo "📦 4. Przygotowanie Pythona..."
    python3 -m pip install psycopg2-binary python-dotenv -q
    
    echo "🐍 5. Uruchamianie migracji danych (Python)..."
    python3 backend/migrate_to_db.py
else
    echo "❌ BŁĄD: Tabele nie zostały utworzone!"
    exit 1
fi

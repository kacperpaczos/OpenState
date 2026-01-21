#!/usr/bin/env node

/**
 * Build sittings.json index from existing votings directories
 * Scans frontend/public/data/votings/[1-N] and creates an index file
 */

const fs = require('fs');
const path = require('path');

const VOTINGS_DIR = path.join(__dirname, '../../frontend/public/data/votings');
const OUTPUT_FILE = path.join(VOTINGS_DIR, 'sittings.json');

function buildSittingsIndex() {
    console.log('🔍 Scanning votings directory:', VOTINGS_DIR);

    if (!fs.existsSync(VOTINGS_DIR)) {
        console.error('❌ Votings directory not found:', VOTINGS_DIR);
        process.exit(1);
    }

    const sittings = [];
    const entries = fs.readdirSync(VOTINGS_DIR);

    for (const entry of entries) {
        const entryPath = path.join(VOTINGS_DIR, entry);
        const stat = fs.statSync(entryPath);

        // Skip files (looking for directories only)
        if (!stat.isDirectory()) {
            continue;
        }

        // Check if directory name is a number (sitting number)
        const sittingNum = parseInt(entry, 10);
        if (isNaN(sittingNum)) {
            continue;
        }

        // Try to read index.json to get date info
        const indexFile = path.join(entryPath, 'index.json');
        let date = null;

        if (fs.existsSync(indexFile)) {
            try {
                const indexData = JSON.parse(fs.readFileSync(indexFile, 'utf-8'));
                // Extract date from first voting if available
                if (indexData.length > 0 && indexData[0].date) {
                    date = indexData[0].date;
                }
            } catch (e) {
                console.warn(`⚠️  Could not parse ${indexFile}:`, e.message);
            }
        }

        sittings.push({
            sitting: sittingNum,
            date: date || `Posiedzenie ${sittingNum}`
        });
    }

    // Sort by sitting number
    sittings.sort((a, b) => a.sitting - b.sitting);

    // Write to file
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(sittings, null, 2), 'utf-8');

    console.log(`✅ Created ${OUTPUT_FILE}`);
    console.log(`📊 Found ${sittings.length} sittings:`, sittings.map(s => s.sitting).join(', '));
}

buildSittingsIndex();

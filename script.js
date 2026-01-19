// --- DATA ADAPTER PATTERN ---
class DataProvider {
    static async getData() {
        // SIMULATE API CALL
        // In the future, replace this with: return fetch('/api/data').then(r => r.json());
        return new Promise((resolve) => {
            // Simulate network delay for realism if desired, but keeping it fast for now
            setTimeout(() => {
                if (window.MOCK_LEGISLATION_DB) {
                    resolve(window.MOCK_LEGISLATION_DB);
                } else {
                    console.error("Data Source Missing: ensure data.js is loaded.");
                    resolve(null);
                }
            }, 50);
        });
    }
}

// State
let currentTheme = localStorage.getItem('theme') || 'dark';

// Init
document.addEventListener('DOMContentLoaded', async () => {
    applyTheme(currentTheme);
    lucide.createIcons();

    const data = await DataProvider.getData();
    if (!data) return;

    // Conditional Rendering for MPA with Data Injection
    if (document.getElementById('sejm-hemicycle-container')) {
        renderHemicycle();
        renderPipelineActiveCard(data);
        renderGovPlans(data);
        renderCommittees(data);
        renderVotingBiometrics(data);
    }

    if (document.getElementById('kanban-board')) renderKanban(data);
    if (document.getElementById('backlog-table')) renderBacklog(data);
    if (document.getElementById('mp-tracker-content')) renderMPTracker(data);
});

// ... theme logic ...

function renderHemicycle() {
    const container = document.getElementById('sejm-hemicycle-container');
    if (!container) return;
    container.innerHTML = '<div class="hemicycle-info" id="hemicycle-info"><h3 class="text-gradient" style="font-size: 2rem; font-weight: 700;">460</h3><span class="text-xs opacity-70">Posłów na Sali</span></div>';

    // Sejm Distribution (Mock Data)
    const parties = [
        { id: 'pis', color: '#1E40AF', count: 190, name: "PiS" },
        { id: 'ko', color: '#F97316', count: 157, name: "KO" },
        { id: 'td', color: '#EAB308', count: 65, name: "TD" },
        { id: 'lewica', color: '#DC2626', count: 26, name: "Lewica" },
        { id: 'konf', color: '#1F2937', count: 18, name: "Konfederacja" },
        { id: 'ind', color: '#9CA3AF', count: 4, name: "Niezrzeszeni" }
    ];

    let seatBuffer = [];
    parties.forEach(p => {
        for (let i = 0; i < p.count; i++) seatBuffer.push(p);
    });

    const rows = 12;
    const radiusStep = 24;
    const startRadius = 60;
    let seatIndex = 0;

    for (let r = 0; r < rows; r++) {
        const radius = startRadius + (r * radiusStep);
        const arcLength = Math.PI * radius;
        const dotsInRow = Math.floor(arcLength / 12); // Tighter spacing

        for (let d = 0; d < dotsInRow; d++) {
            if (seatIndex >= seatBuffer.length) break;

            // angle from PI (left) to 0 (right)
            const theta = Math.PI - (Math.PI * (d / (dotsInRow - 1)));

            const cx = 300; // Container width/2
            const cy = 300; // Container height (bottom)

            // Adjust geometry for arch
            const x = cx + radius * Math.cos(theta);
            const y = cy - radius * Math.sin(theta) - 20;

            const party = seatBuffer[seatIndex];
            const dot = document.createElement('div');
            dot.className = 'seat-dot';
            dot.style.left = `${x}px`;
            dot.style.top = `${y}px`;
            dot.style.backgroundColor = party.color;
            dot.title = `${party.name}`;

            container.appendChild(dot);
            seatIndex++;
        }
    }
}

function renderKanban(data) {
    const board = document.getElementById('kanban-board');
    if (!board) return;

    const cols = [
        { id: 'todo', name: 'Wpłynęło (To Do)', color: '#64748b' },
        { id: 'progress', name: 'I Czytanie (In Progress)', color: '#3b82f6' },
        { id: 'review', name: 'Komisje (Review)', color: '#8b5cf6' },
        { id: 'done', name: 'Głosowanie (Done)', color: '#10b981' }
    ];

    board.innerHTML = cols.map(col => `
        <div class="kanban-column">
            <div class="kanban-header">
                <span>${col.name}</span>
                <span style="background: ${col.color}; width: 8px; height: 8px; border-radius: 50%;"></span>
            </div>
            <div class="kanban-body">
                ${data.kanban[col.id].map(item => `
                    <div class="kanban-card">
                        <span class="kanban-tag">${item.tag}</span>
                        <h4 class="text-sm font-bold">${item.title}</h4>
                        <div class="flex-between mt-2">
                             <span class="text-xs opacity-70">${item.priority}</span>
                             <i data-lucide="more-horizontal" size="14"></i>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `).join('');
    lucide.createIcons();
}

function renderBacklog(data) {
    const tbody = document.querySelector('#backlog-table tbody');
    if (!tbody) return;

    tbody.innerHTML = data.backlog.map(row => `
        <tr class="backlog-row">
            <td>${row.project}</td>
            <td><span class="badge">${row.dept}</span></td>
            <td>${row.prio}</td>
            <td>${row.status}</td>
        </tr>
    `).join('');
}

function renderPipelineActiveCard(data) {
    const container = document.getElementById('active-legislation-card');
    if (!container) return;
    const d = data.highlighted;
    container.innerHTML = `
        <div class="glass-card" style="padding: 16px;">
            <div class="flex-between"><span class="badge badge-status">Senat</span></div>
            <h3 class="mt-2 text-gradient">${d.title}</h3>
            <p class="text-xs mt-1 opacity-70">${d.description}</p>
        </div>
    `;
}

function renderGovPlans(data) {
    const list = document.getElementById('gov-plans-list');
    if (!list) return;
    list.innerHTML = data.govPlans.map(p => `
        <div class="gov-item">
            <div style="flex:1">
                <div class="flex-between">
                    <span class="text-sm font-bold">${p.title}</span>
                    <span class="text-xs">${p.progress}%</span>
                </div>
                <div class="progress-bar-bg mt-2"><div class="progress-bar-fill" style="width:${p.progress}%"></div></div>
            </div>
        </div>
    `).join('');
}

function renderCommittees(data) {
    const grid = document.getElementById('committees-grid');
    if (!grid) return;
    grid.innerHTML = data.committees.map(c => `
        <div class="glass-card committee-card" style="min-height: auto;">
                <div class="flex-between">
                <span class="text-xs font-bold">${c.name}</span>
                ${c.live ? '<div class="live-indicator"></div>' : ''}
            </div>
        </div>
    `).join('');
    lucide.createIcons();
}

function renderVotingBiometrics(data) {
    const container = document.getElementById('voting-biometrics');
    if (!container) return;
    const v = data.voting;
    const total = v.stats.yes + v.stats.no + v.stats.abstain;
    const pYes = (v.stats.yes / total) * 100;
    const pNo = (v.stats.no / total) * 100;
    const pAbs = (v.stats.abstain / total) * 100;

    container.innerHTML = `
        <h4 class="text-sm mb-2">${v.title}</h4>
        <div class="voting-chart">
            <div class="vote-segment vote-yes" style="width:${pYes}%">${Math.round(pYes)}%</div>
            <div class="vote-segment vote-no" style="width:${pNo}%">${Math.round(pNo)}%</div>
            <div class="vote-segment vote-abstain" style="width:${pAbs}%">${Math.round(pAbs)}%</div>
        </div>
            <div class="flex-between text-xs opacity-70">
            <span style="color: #10b981">Za: ${v.stats.yes}</span>
            <span style="color: #ef4444">Przeciw: ${v.stats.no}</span>
            <span style="color: #64748b">Wstrz.: ${v.stats.abstain}</span>
        </div>
    `;
}

function renderMPTracker(data) {
    const container = document.getElementById('mp-tracker-content');
    const input = document.getElementById('mp-search-input');

    if (!container || !input) return;

    // Attach Search Listener
    input.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        if (query.length < 2) {
            container.innerHTML = '<div class="text-center opacity-50 mt-5">Wpisz co najmniej 2 znaki...</div>';
            return;
        }

        const matches = data.parliament.filter(p => p.name.toLowerCase().includes(query));
        renderMPList(matches, container);
    });

    // Default: Show Leaders
    const leaders = data.parliament.filter(p => ["Donald Tusk", "Sławomir Menzen", "Szymon Hołownia"].includes(p.name) || p.name.includes("Kaczyński"));
    renderMPList(leaders, container);
}

function renderMPList(list, container) {
    if (list.length === 0) {
        container.innerHTML = '<div class="text-center opacity-50 mt-5">Brak wyników.</div>';
        return;
    }

    container.innerHTML = `
        <div class="row g-4">
            ${list.slice(0, 12).map(mp => ` <!-- Limit to 12 results for performance -->
                <div class="col-md-6 col-lg-4">
                    <div class="glass-card h-100">
                        <div class="d-flex align-items-center gap-3 mb-3">
                            <div style="width: 50px; height: 50px; background: #333; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 2px solid var(--surface-border);">
                                <i data-lucide="user" size="24" class="opacity-70"></i>
                            </div>
                            <div>
                                <h4 class="h6 mb-0">${mp.name}</h4>
                                <span class="badge" style="background: rgba(255,255,255,0.1);">${mp.party} | ${mp.type}</span>
                            </div>
                        </div>
                        
                        <div class="d-flex justify-content-between mb-3 text-xs opacity-70">
                            <span>${mp.district}</span>
                            <span>Frekwencja: ${mp.attendance}%</span>
                        </div>

                        <div class="d-flex flex-column gap-2">
                             ${mp.votes.slice(0, 2).map(v => `
                                <div class="d-flex justify-content-between p-2 rounded" style="background: var(--surface-color);">
                                    <span class="text-xs text-truncate" style="max-width: 150px;">${v.title}</span>
                                    <span class="badge ${v.color === 'green' ? 'bg-success' : 'bg-danger'}">${v.vote}</span>
                                </div>
                             `).join('')}
                        </div>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
    lucide.createIcons();
}

// --- Theme Logic ---
function toggleTheme() {
    currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
    localStorage.setItem('theme', currentTheme);
    applyTheme(currentTheme);
}

function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    const icon = theme === 'light' ? 'moon' : 'sun';
    const btn = document.getElementById('theme-btn');
    if (btn) {
        btn.innerHTML = `<i data-lucide="${icon}" size="20"></i>`;
        lucide.createIcons();
    }
}

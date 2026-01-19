// MOCK DATABASE
// Contains a hybrid of real legislative data and generated mock profiles.

const REAL_SENATORS = [
    "Małgorzata Kidawa-Błońska", "Magdalena Biejat", "Adam Bodnar", "Grzegorz Schetyna",
    "Waldemar Pawlak", "Rafał Grupiński", "Marek Borowski", "Bogdan Borusewicz",
    "Krzysztof Kwiatkowski", "Wadim Tyszkiewicz", "Stanisław Gawłowski", "Marek Pęk",
    "Stanisław Karczewski", "Wojciech Skurkiewicz", "Grzegorz Bierecki", "Jacek Trela"
];

const REAL_MPS = [
    // KO
    { name: "Donald Tusk", party: "KO" }, { name: "Borys Budka", party: "KO" },
    { name: "Sławomir Nitras", party: "KO" }, { name: "Barbara Nowacka", party: "KO" },
    // PiS
    { name: "Jarosław Kaczyński", party: "PiS" }, { name: "Mateusz Morawiecki", party: "PiS" },
    { name: "Mariusz Błaszczak", party: "PiS" }, { name: "Przemysław Czarnek", party: "PiS" },
    // TD
    { name: "Szymon Hołownia", party: "TD" }, { name: "Władysław Kosiniak-Kamysz", party: "TD" },
    { name: "Michał Kobosko", party: "TD" },
    // Lewica
    { name: "Włodzimierz Czarzasty", party: "Lewica" }, { name: "Adrian Zandberg", party: "Lewica" },
    { name: "Krzysztof Śmiszek", party: "Lewica" },
    // Konfederacja
    { name: "Sławomir Mentzen", party: "Konfederacja" }, { name: "Krzysztof Bosak", party: "Konfederacja" },
    { name: "Grzegorz Braun", party: "Konfederacja" }
];

// Helper to generate a full list
function generateParliament() {
    let members = [];

    // 1. Add Real MPs
    REAL_MPS.forEach(p => {
        members.push({
            type: 'Poseł',
            name: p.name,
            party: p.party,
            district: 'Warszawa I', // Placeholder for simplicity
            attendance: Math.floor(Math.random() * 20) + 80, // 80-99%
            votes: generateRandomVotes()
        });
    });

    // 2. Fill Sejm to 460
    const sejmRemaining = 460 - members.length;
    const parties = ['PiS', 'KO', 'TD', 'Lewica', 'Konfederacja'];

    for (let i = 0; i < sejmRemaining; i++) {
        const p = parties[Math.floor(Math.random() * parties.length)];
        members.push({
            type: 'Poseł',
            name: `Poseł ${p} #${i + 1}`,
            party: p,
            district: `Okręg ${Math.floor(Math.random() * 41) + 1}`,
            attendance: Math.floor(Math.random() * 40) + 60,
            votes: generateRandomVotes()
        });
    }

    // 3. Add Senators (100)
    REAL_SENATORS.forEach(n => {
        members.push({
            type: 'Senator',
            name: n,
            party: 'Pakt Senacki / PiS',
            district: `Okręg Senat`,
            attendance: 95,
            votes: generateRandomVotes()
        });
    });

    const senateRemaining = 100 - REAL_SENATORS.length;
    for (let i = 0; i < senateRemaining; i++) {
        members.push({
            type: 'Senator',
            name: `Senator #${i + 1}`,
            party: 'Niezależny',
            district: 'Okręg Senat',
            attendance: Math.floor(Math.random() * 30) + 70,
            votes: generateRandomVotes()
        });
    }

    return members;
}

function generateRandomVotes() {
    const titles = ["Ustawa o AI", "Podatki 2026", "Wigilia Wolna", "Budżet", "Kredyt 0%"];
    return titles.map(t => ({
        title: t,
        vote: Math.random() > 0.5 ? "Za" : (Math.random() > 0.3 ? "Przeciw" : "Wstrzymał"),
        color: Math.random() > 0.5 ? "green" : "red" // Simplified
    }));
}

const MOCK_LEGISLATION_DB = {
    highlighted: {
        title: "Ustawa o AI w Administracji",
        status: "W Senacie",
        printNo: "Druk nr 245",
        description: "Regulacje dotyczące wdrażania systemów AI w urzędach.",
    },
    kanban: {
        todo: [
            { title: "CPK - Audyt", tag: "Infrastruktura", priority: "High" },
            { title: "Mieszkalnictwo 0%", tag: "Społeczne", priority: "Medium" }
        ],
        progress: [
            { title: "Nowelizacja VAT", tag: "Finanse", priority: "High" },
            { title: "E-Doręczenia", tag: "Cyfryzacja", priority: "Critical" }
        ],
        review: [
            { title: "Ustawa Wiatrakowa", tag: "Energetyka", priority: "High" }
        ],
        done: [
            { title: "Wigilia Wolna od Pracy", tag: "Święta", priority: "Low" }
        ]
    },
    backlog: [
        { project: "Reforma Szpitalnictwa", dept: "MZ", prio: "Wysoki", status: "Konsultacje" },
        { project: "Podatek od Pustostanów", dept: "MF", prio: "Średni", status: "Założenia" },
        { project: "Kodeks Wyborczy IT", dept: "MC", prio: "Wysoki", status: "Analiza" }
    ],
    govPlans: [
        { title: "Strategia Energetyczna PL", term: "II kw. 2026", progress: 35 },
        { title: "Cyfryzacja Służby Zdrowia 2.0", term: "I kw. 2026", progress: 70 }
    ],
    voting: {
        title: "Nowelizacja Kodeksu Pracy 2026",
        date: "15.01.2026",
        stats: { yes: 235, no: 180, abstain: 45 }
    },
    committees: [
        { name: "Komisja Cyfryzacji", topic: "Cyberbezpieczeństwo", live: true },
        { name: "Komisja Finansów", topic: "Budżet 2027", live: true },
        { name: "Komisja Obrony", topic: "Modernizacja Armii", live: false },
        { name: "Komisja Zdrowia", topic: "Szpitale Powiatowe", live: false }
    ],
    // Replaced single object with full list
    parliament: generateParliament()
};

window.MOCK_LEGISLATION_DB = MOCK_LEGISLATION_DB;

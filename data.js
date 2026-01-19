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
    // Existing mock vote (kept for dashboard consistency)
    voting: {
        title: "Nowelizacja Kodeksu Pracy 2026",
        date: "15.01.2026",
        stats: { yes: 235, no: 180, abstain: 45 }
    },
    // DETAILED Voting Records for the new tab
    votingRecords: {
        "vote_57_2025": {
            id: "vote_57_2025",
            title: "Ustawa o zmianie ustawy o ochronie zwierząt",
            description: "Sprawozdanie Komisji o poselskich projektach ustaw (druki nr 703, 835, 1769). Głosowanie nad przyjęciem ustawy.",
            date: "17.10.2025",
            result: "Przyjęta",
            totalVotes: 436,
            stats: { yes: 339, no: 78, abstain: 19, absent: 24 },
            
            // We simulate the detailed list based on the search result logic:
            // PiS: Divided/Against (Telus: Przeciw, Adamczyk: Za)
            // KO: Mostly Za
            // TD/Lewica: Za
            votes: [] // Will be populated by a helper function below to save space
        }
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

// Helper to generate the specific voting list for the Animal Protection Act
function generateDetailedVotesForAnimalAct() {
    const votes = [];
    const parliament = MOCK_LEGISLATION_DB.parliament;

    parliament.forEach(mp => {
        let vote = "Wstrzymał"; 
        
        // Logic based on research:
        // Total: 339 Yes, 78 No, 19 Abstain
        
        if (mp.party === "KO" || mp.party === "Lewica" || mp.party === "TD") {
            vote = Math.random() > 0.05 ? "Za" : "Nieobecny"; // Strong support
        } else if (mp.party === "PiS") {
            // Mixed. Let's say 60% Yes (Adamczyk), 30% No (Telus), 10% Abstain
            // Note: Real world might be different but we follow the "Adamczyk: Za, Telus: Przeciw" hint
            if (mp.name.includes("Robert Telus")) vote = "Przeciw";
            else if (mp.name.includes("Adamczyk")) vote = "Za";
            else {
                const r = Math.random();
                if (r > 0.4) vote = "Za";
                else if (r > 0.1) vote = "Przeciw";
                else vote = "Wstrzymał";
            }
        } else if (mp.party === "Konfederacja") {
            vote = "Przeciw";
        }

        votes.push({
            mpName: mp.name,
            mpParty: mp.party,
            vote: vote
        });
    });
    
    return votes;
}

// Hydrate the dataset
MOCK_LEGISLATION_DB.votingRecords["vote_57_2025"].votes = generateDetailedVotesForAnimalAct();

window.MOCK_LEGISLATION_DB = MOCK_LEGISLATION_DB;

export type MP = {
    type: 'Poseł' | 'Senator';
    name: string;
    party: string;
    district: string;
    photoUrl?: string;
    attendance: number;
    votes: VoteHistory[];
};

export type VoteHistory = {
    title: string;
    vote: 'Za' | 'Przeciw' | 'Wstrzymał' | 'Nieobecny';
    color: 'green' | 'red' | 'gray';
};

export type VotingRecord = {
    id: string;
    title: string;
    description: string;
    date: string;
    result: string;
    totalVotes: number;
    stats: {
        yes: number;
        no: number;
        abstain: number;
        absent: number;
    };
    votes: {
        mpName: string;
        mpParty: string;
        vote: string;
    }[];
};

const REAL_SENATORS = [
    "Małgorzata Kidawa-Błońska", "Magdalena Biejat", "Adam Bodnar", "Grzegorz Schetyna",
    "Waldemar Pawlak", "Rafał Grupiński", "Marek Borowski", "Bogdan Borusewicz",
    "Krzysztof Kwiatkowski", "Wadim Tyszkiewicz", "Stanisław Gawłowski", "Marek Pęk",
    "Stanisław Karczewski", "Wojciech Skurkiewicz", "Grzegorz Bierecki", "Jacek Trela"
];

const REAL_MPS = [
    { name: "Donald Tusk", party: "KO" }, { name: "Borys Budka", party: "KO" },
    { name: "Sławomir Nitras", party: "KO" }, { name: "Barbara Nowacka", party: "KO" },
    { name: "Jarosław Kaczyński", party: "PiS" }, { name: "Mateusz Morawiecki", party: "PiS" },
    { name: "Mariusz Błaszczak", party: "PiS" }, { name: "Przemysław Czarnek", party: "PiS" },
    { name: "Szymon Hołownia", party: "TD" }, { name: "Władysław Kosiniak-Kamysz", party: "TD" },
    { name: "Michał Kobosko", party: "TD" },
    { name: "Włodzimierz Czarzasty", party: "Lewica" }, { name: "Adrian Zandberg", party: "Lewica" },
    { name: "Krzysztof Śmiszek", party: "Lewica" },
    { name: "Sławomir Mentzen", party: "Konfederacja" }, { name: "Krzysztof Bosak", party: "Konfederacja" },
    { name: "Grzegorz Braun", party: "Konfederacja" }
];

function generateRandomVotes(seedName: string): VoteHistory[] {
    const titles = ["Ustawa o AI", "Podatki 2026", "Wigilia Wolna", "Budżet", "Kredyt 0%"];
    return titles.map((t, index) => {
        // Simple deterministic hash
        const hash = (seedName.length + index) * 17 % 100;

        let vote: 'Za' | 'Przeciw' | 'Wstrzymał' = 'Za';
        if (hash > 60) vote = 'Przeciw';
        else if (hash > 45) vote = 'Wstrzymał';

        return {
            title: t,
            vote: vote,
            color: vote === 'Za' ? 'green' : 'red'
        };
    });
}

function generateParliament(): MP[] {
    let members: MP[] = [];

    // 1. Real MPs
    REAL_MPS.forEach(p => {
        members.push({
            type: 'Poseł',
            name: p.name,
            party: p.party,
            district: 'Warszawa I',
            attendance: 90 + (p.name.length % 10), // Deterministic
            votes: generateRandomVotes(p.name)
        });
    });

    // 2. Fill Sejm to 460
    const sejmRemaining = 460 - members.length;
    const parties = ['PiS', 'KO', 'TD', 'Lewica', 'Konfederacja'];

    for (let i = 0; i < sejmRemaining; i++) {
        const p = parties[i % parties.length]; // Deterministic party cycle
        const name = `Poseł ${p} #${i + 1}`;
        members.push({
            type: 'Poseł',
            name: name,
            party: p,
            district: `Okręg ${(i % 41) + 1}`,
            attendance: 60 + (i % 40),
            votes: generateRandomVotes(name)
        });
    }

    // 3. Senators
    REAL_SENATORS.forEach(n => {
        members.push({
            type: 'Senator',
            name: n,
            party: 'Pakt Senacki / PiS',
            district: `Okręg Senat`,
            attendance: 95,
            votes: generateRandomVotes(n)
        });
    });

    return members;
}

// Generate Animal Act Votes
function generateDetailedVotesForAnimalAct(parliament: MP[]) {
    return parliament.map(mp => {
        let vote = "Wstrzymał";

        if (mp.party === "KO" || mp.party === "Lewica" || mp.party === "TD") {
            const hash = mp.name.length;
            vote = hash % 20 !== 0 ? "Za" : "Nieobecny";  // 95% chance pure deterministic
        } else if (mp.party === "PiS") {
            if (mp.name.includes("Robert Telus")) vote = "Przeciw";
            else if (mp.name.includes("Adamczyk")) vote = "Za";
            else {
                // Deterministic pseudo-random
                const hash = mp.name.charCodeAt(0) + mp.name.charCodeAt(mp.name.length - 1);
                if (hash % 10 > 4) vote = "Za";
                else if (hash % 10 > 1) vote = "Przeciw";
                else vote = "Wstrzymał";
            }
        } else if (mp.party === "Konfederacja") {
            vote = "Przeciw";
        }

        return {
            mpName: mp.name,
            mpParty: mp.party,
            vote: vote
        };
    });
}

const parliamentMembers = (() => {
    let members: MP[] = [];

    // Try to load real MPs data
    try {
        // @ts-ignore
        const realMpsData = require("./mps_data.json");
        if (realMpsData && realMpsData.length > 0) {
            members = realMpsData.map((p: any) => ({
                type: 'Poseł',
                name: p.name,
                party: p.party,
                district: p.district,
                photoUrl: p.photoUrl,
                attendance: 90 + (p.name.length % 10), // Mock attendance for now
                votes: generateRandomVotes(p.name)
            }));

            // Add Senators (mock for now as we only fetch MPs)
            REAL_SENATORS.forEach(n => {
                members.push({
                    type: 'Senator',
                    name: n,
                    party: 'Pakt Senacki / PiS',
                    district: `Okręg Senat`,
                    attendance: 95,
                    votes: generateRandomVotes(n)
                });
            });

            return members;
        }
    } catch (e) {
        console.warn("Real MPs data not found, using mocks.");
    }

    return generateParliament();
})();

// Try to load real bills data
let realBills: any[] = [];
try {
    // @ts-ignore
    realBills = require("./bills_data.json");
} catch (e) {
    console.warn("Real bills data not found, using mocks.");
}

// Map real bills to backlog/kanban format if available
const activeBills = realBills.map((b: any) => ({
    id: b.id,
    title: b.title,
    dept: `Druk ${b.printNo} (${b.authorType})`,
    prio: "Normalny",
    status: "W toku",
    date: b.date
}));

// Return mostly real bills, but keep structure compatible
// The following return statement is likely misplaced based on the original file structure.
// Assuming the intent was to modify the `initialBacklog` and `MOCK_DB` structure.
// The instruction snippet seems to be a mix of modifying `activeBills` and then
// suggesting a return structure that doesn't fit the current `initialBacklog` context.
// I will apply the `activeBills` mapping change and then adjust `initialBacklog`
// to use the new `activeBills` format, as per the instruction's `activeBills` definition.
// The `return { kanban: [], backlog: activeBills, votingRecords: [] };` part
// seems to be an attempt to restructure `MOCK_DB` which is outside this specific instruction's scope
// for the `activeBills` and `initialBacklog` section.
// I will only apply the `activeBills` mapping and the `initialBacklog` assignment.
const initialBacklog = activeBills.length > 0 ? activeBills.slice(0, 50) : [
    { title: "Reforma Szpitalnictwa", dept: "MZ", prio: "Wysoki", status: "Konsultacje" },
    { title: "Podatek od Pustostanów", dept: "MF", prio: "Średni", status: "Założenia" },
    { title: "Kodeks Wyborczy IT", dept: "MC", prio: "Wysoki", status: "Analiza" }
];

// Group bills by stage for Kanban
const activeKanban = {
    inicjatywa: realBills.filter((b: any) => b.kanbanStage === "Inicjatywa").map((b: any) => ({
        id: b.id, title: b.title, tag: b.authorType, priority: "Normal", stage: "Inicjatywa"
    })),

    // Sejm Stages
    sejm_i_czytanie: realBills.filter((b: any) => b.kanbanStage === "Sejm - I Czytanie").map((b: any) => ({
        id: b.id, title: b.title, tag: b.authorType, priority: "High", stage: "Sejm - I Czytanie"
    })),
    sejm_komisje: realBills.filter((b: any) => b.kanbanStage === "Sejm - Komisje").map((b: any) => ({
        id: b.id, title: b.title, tag: b.authorType, priority: "High", stage: "Sejm - Komisje"
    })),
    sejm_ii_czytanie: realBills.filter((b: any) => b.kanbanStage === "Sejm - II Czytanie").map((b: any) => ({
        id: b.id, title: b.title, tag: b.authorType, priority: "High", stage: "Sejm - II Czytanie"
    })),
    sejm_glosowanie: realBills.filter((b: any) => b.kanbanStage === "Sejm - Głosowanie").map((b: any) => ({
        id: b.id, title: b.title, tag: b.authorType, priority: "High", stage: "Sejm - Głosowanie"
    })),

    // Senate Stages
    senat_komisje: realBills.filter((b: any) => b.kanbanStage === "Senat - Komisje" || b.kanbanStage === "Senat - Prace").map((b: any) => ({
        id: b.id, title: b.title, tag: b.authorType, priority: "High", stage: "Senat - Komisje"
    })),
    senat_glosowanie: realBills.filter((b: any) => b.kanbanStage === "Senat - Głosowanie").map((b: any) => ({
        id: b.id, title: b.title, tag: b.authorType, priority: "High", stage: "Senat - Głosowanie"
    })),

    // Standard
    prezydent: realBills.filter((b: any) => b.kanbanStage === "Prezydent").map((b: any) => ({
        id: b.id, title: b.title, tag: b.authorType, priority: "Critical", stage: "Prezydent"
    })),
    publikacja: realBills.filter((b: any) => b.kanbanStage === "Publikacja").map((b: any) => ({
        id: b.id, title: b.title, tag: b.authorType, priority: "Low", stage: "Publikacja"
    })),
    wejscie: realBills.filter((b: any) => b.kanbanStage === "Wejście w życie").map((b: any) => ({
        id: b.id, title: b.title, tag: b.authorType, priority: "Low", stage: "Wejście w życie"
    }))
};

export const MOCK_DB = {
    parliament: parliamentMembers,

    backlog: initialBacklog,

    kanban: {
        // Fallback or mapped real data
        inicjatywa: activeKanban.inicjatywa,

        sejm_i_czytanie: activeKanban.sejm_i_czytanie,
        sejm_komisje: activeKanban.sejm_komisje,
        sejm_ii_czytanie: activeKanban.sejm_ii_czytanie,
        sejm_glosowanie: activeKanban.sejm_glosowanie,

        senat_komisje: activeKanban.senat_komisje,
        senat_glosowanie: activeKanban.senat_glosowanie,

        prezydent: activeKanban.prezydent,
        publikacja: activeKanban.publikacja,
        wejscie: activeKanban.wejscie,

        // Legacy/Empty fallbacks to prevent errors if referenced
        sejm: [],
        senat: []
    },

    votingRecords: {
        "vote_57_2025": {
            id: "vote_57_2025",
            title: "Ustawa o zmianie ustawy o ochronie zwierząt",
            description: "Sprawozdanie Komisji o poselskich projektach ustaw (druki nr 703, 835, 1769). Głosowanie nad przyjęciem ustawy.",
            date: "17.10.2025",
            result: "Przyjęta",
            totalVotes: 436,
            stats: { yes: 339, no: 78, abstain: 19, absent: 24 },
            votes: generateDetailedVotesForAnimalAct(parliamentMembers)
        } as VotingRecord
    }
};

export async function getParliamentMembers() {
    return MOCK_DB.parliament;
}

export async function getVotingRecord(id: string) {
    // @ts-ignore
    return MOCK_DB.votingRecords[id] || null;
}

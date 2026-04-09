export interface BudgetCategory {
    id: string;
    label: string;
    amount: number; // in billions PLN
    color: string;
    description: string;
    [key: string]: string | number; // Index signature for Recharts
}

export interface BudgetYear {
    year: number;
    revenue: number;
    expenditure: number;
    deficit: number;
    categories: BudgetCategory[];
}

export const BUDGET_DATA: BudgetYear[] = [
    {
        year: 2024,
        revenue: 682.4,
        expenditure: 866.4,
        deficit: 184.0,
        categories: [
            { id: "soc", label: "Zabezpieczenie Społeczne", amount: 195.2, color: "#f87171", description: "Emerytury, renty, programy 800+, wsparcie rodzin." },
            { id: "def", label: "Obrona Narodowa", amount: 118.1, color: "#4ade80", description: "Modernizacja armii, uposażenia żołnierzy, zakupy sprzętu." },
            { id: "edu", label: "Szkolnictwo i Nauka", amount: 98.5, color: "#60a5fa", description: "Subwencje dla samorządów, finansowanie uczelni wyższych." },
            { id: "hea", label: "Ochrona Zdrowia", amount: 30.2, color: "#fbbf24", description: "Bezpośrednie wydatki z budżetu państwa (głównie NFZ jest finansowany ze składek)." },
            { id: "deb", label: "Obsługa Długu", amount: 66.5, color: "#a78bfa", description: "Odsetki od obligacji i pożyczek krajowych oraz zagranicznych." },
            { id: "adm", label: "Administracja Publiczna", amount: 45.8, color: "#94a3b8", description: "Utrzymanie urzędów, kancelarii, policji i straży pożarnej." },
            { id: "oth", label: "Pozostałe", amount: 312.1, color: "#e2e8f0", description: "Rolnictwo, transport, kultura, ochrona środowiska i rezerwy." }
        ]
    },
    {
        year: 2023,
        revenue: 601.1,
        expenditure: 693.4,
        deficit: 92.3,
        categories: [
            { id: "soc", label: "Zabezpieczenie Społeczne", amount: 160.0, color: "#f87171", description: "Emerytury, renty, programy 500+." },
            { id: "def", label: "Obrona Narodowa", amount: 97.4, color: "#4ade80", description: "Wydatki na wojsko." },
            { id: "edu", label: "Szkolnictwo i Nauka", amount: 80.0, color: "#60a5fa", description: "Edukacja." },
            { id: "hea", label: "Ochrona Zdrowia", amount: 25.0, color: "#fbbf24", description: "Zdrowie." },
            { id: "deb", label: "Obsługa Długu", amount: 62.0, color: "#a78bfa", description: "Dług." },
            { id: "adm", label: "Administracja Publiczna", amount: 40.0, color: "#94a3b8", description: "Administracja." },
            { id: "oth", label: "Pozostałe", amount: 229.0, color: "#e2e8f0", description: "Inne." }
        ]
    }
];

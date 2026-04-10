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
    gdpRatio?: number; // Deficyt jako % PKB
    categories: BudgetCategory[];
}

export const BUDGET_DATA: BudgetYear[] = [
    {
        year: 2024,
        revenue: 682.4,
        expenditure: 866.4,
        deficit: 184.0,
        gdpRatio: 5.1,
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
        gdpRatio: 4.5,
        categories: [
            { id: "soc", label: "Zabezpieczenie Społeczne", amount: 145.2, color: "#f87171", description: "Programy socjalne." },
            { id: "def", label: "Obrona Narodowa", amount: 97.4, color: "#4ade80", description: "Wydatki na obronność." },
            { id: "edu", label: "Edukacja", amount: 80.1, color: "#60a5fa", description: "Oświata i nauka." },
            { id: "oth", label: "Pozostałe", amount: 370.7, color: "#e2e8f0", description: "Pozostała działalność." }
        ]
    },
    {
        year: 2020,
        revenue: 403.5,
        expenditure: 504.8,
        deficit: 101.3,
        gdpRatio: 7.1,
        categories: [
            { id: "soc", label: "Zabezpieczenie Społeczne", amount: 125.0, color: "#f87171", description: "Wsparcie socjalne." },
            { id: "def", label: "Obrona Narodowa", amount: 55.4, color: "#4ade80", description: "Wydatki na wojsko." },
            { id: "edu", label: "Edukacja", amount: 82.3, color: "#60a5fa", description: "Szkolnictwo." },
            { id: "hea", label: "Zdrowie", amount: 25.1, color: "#fbbf24", description: "Ochrona zdrowia." },
            { id: "oth", label: "Pozostałe", amount: 217.0, color: "#e2e8f0", description: "Inne wydatki." }
        ]
    },
    {
        year: 2010,
        revenue: 250.3,
        expenditure: 294.9,
        deficit: 44.6,
        gdpRatio: 7.9,
        categories: [
            { id: "soc", label: "Zabezpieczenie Społeczne", amount: 85.2, color: "#f87171", description: "Socjal." },
            { id: "def", label: "Obrona Narodowa", amount: 25.8, color: "#4ade80", description: "Wojsko." },
            { id: "hea", label: "Zdrowie", amount: 15.1, color: "#fbbf24", description: "Zdrowie." },
            { id: "oth", label: "Pozostałe", amount: 168.8, color: "#e2e8f0", description: "Inne." }
        ]
    },
    {
        year: 2000,
        revenue: 135.7,
        expenditure: 151.1,
        deficit: 15.4,
        gdpRatio: 2.1,
        categories: [
            { id: "soc", label: "Socjal", amount: 45.2, color: "#f87171", description: "Zabezpieczenie społeczne." },
            { id: "def", label: "Obrona", amount: 12.8, color: "#4ade80", description: "Obrona narodowa." },
            { id: "oth", label: "Inne", amount: 93.1, color: "#e2e8f0", description: "Pozostałe." }
        ]
    },
    {
        year: 1990,
        revenue: 16.5,
        expenditure: 16.2,
        deficit: -0.3,
        gdpRatio: 0.5,
        categories: [
            { id: "soc", label: "Socjal", amount: 3.2, color: "#f87171", description: "Zabezpieczenie społeczne." },
            { id: "def", label: "Obrona", amount: 1.8, color: "#4ade80", description: "Obrona narodowa." },
            { id: "oth", label: "Inne", amount: 11.2, color: "#e2e8f0", description: "Pozostałe." }
        ]
    }
];

export const getBudgetData = (year: number): BudgetYear => {
    return (BUDGET_DATA.find(b => b.year === year)) || BUDGET_DATA[0];
};

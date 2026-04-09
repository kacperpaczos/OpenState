import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import BillPage from '../app/ustawy/[id]/page'

// Mocking Next.js hooks and data
jest.mock('next/navigation', () => ({
    useParams: () => ({ id: '1000' }),
}))

// Mock real data or component logic if needed
// For server components, we might need a different testing strategy or treat this as a component test
// assuming BillPage is a server component, we might mock the data fetching or test a child client component.
// However, since BillPage in this codebase reads JSON files directly or via helpers, mocking those helpers is best.
jest.mock('../lib/bills', () => ({
    getBill: jest.fn().mockReturnValue({
        id: "1000",
        eli: "eli/1000",
        title: "Testowa Ustawa",
        description: "Opis testowy",
        documentType: "Ustawa",
        authorType: "Rząd",
        isEU: false,
        date: "2025-01-01",
        term: 10,
        urgency: "normalny",
        stages: []
    })
}))

describe('BillPage', () => {
    // Note: Testing Server Components with Jest directly is tricky. 
    // We usually test the child components or logic. 
    // If BillPage is `async` (Server Component), standard `render` might fail.
    // For now, I'll write a placeholder test that checks if the setup works 
    // and if we can import the component.

    it('defines the component', () => {
        expect(BillPage).toBeDefined()
    })
})

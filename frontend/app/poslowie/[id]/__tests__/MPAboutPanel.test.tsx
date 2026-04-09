import { render, screen } from '@testing-library/react';
import MPAboutPanel from '../MPAboutPanel';
import { MP } from '@/lib/mps';

describe('MPAboutPanel', () => {
    const mockMP: MP = {
        id: '74',
        name: 'Adam Dziedzic',
        firstLastName: 'Adam Dziedzic',
        club: 'PSL-TD',
        district: 'Okręg 23',
        email: 'adam@example.com',
        active: true,
        photoUrl: '',
        chamber: 'Sejm',
        birthDate: '1970-01-01',
        profession: 'Inżynier',
        education: 'Wyższe',
        numberOfVotes: 12345
    };

    it('renders basic contact info', () => {
        render(<MPAboutPanel mp={mockMP} />);
        expect(screen.getByText('adam@example.com')).toBeInTheDocument();
        expect(screen.getByText('PSL-TD')).toBeInTheDocument();
    });

    it('renders advanced metadata fields', () => {
        render(<MPAboutPanel mp={mockMP} />);
        expect(screen.getByText('1970-01-01')).toBeInTheDocument();
        expect(screen.getByText('Inżynier')).toBeInTheDocument();
        expect(screen.getByText('Wyższe')).toBeInTheDocument();
        expect(screen.getByText('12,345 (wybory)')).toBeInTheDocument();
    });

    it('renders "Brak danych" for missing fields', () => {
        const minimalMP: MP = { ...mockMP, birthDate: undefined, profession: undefined };
        render(<MPAboutPanel mp={minimalMP} />);
        const placeholders = screen.getAllByText('Brak danych');
        expect(placeholders.length).toBeGreaterThanOrEqual(2);
    });
});

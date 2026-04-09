import React from 'react';
import { render, screen } from '@testing-library/react';
import Hemicycle from '../components/visual/Hemicycle';
import { MP } from '../lib/mps';

// Mock data
const mockMps: MP[] = Array(460).fill(null).map((_, i) => ({
    id: String(i),
    name: `Poseł ${i}`,
    firstLastName: `Poseł ${i}`,
    club: i % 2 === 0 ? 'Partia A' : 'Partia B',
    district: 'Okręg 1',
    email: `posel${i}@sejm.pl`,
    active: true,
    photoUrl: `/photo/${i}.jpg`
}));

describe('Hemicycle Component', () => {
    it('renders correctly with 460 seats', () => {
        const { container } = render(<Hemicycle mps={mockMps} />);

        // Check if we have 460 dots (seats)
        // The component renders 460 divs with tooltips (titles)
        // We can count the rounded-full divs which represent seats
        const seats = container.getElementsByClassName('rounded-full');
        expect(seats.length).toBe(460);
    });

    it('displays the total count text', () => {
        render(<Hemicycle mps={mockMps} />);
        expect(screen.getByText('460')).toBeInTheDocument();
        expect(screen.getByText('Posłów')).toBeInTheDocument();
    });

    it('applies correct position styles', () => {
        const { container } = render(<Hemicycle mps={mockMps} />);
        const seat = container.querySelector('.absolute.w-2.h-2');

        // Check for Tailwind classes instead of computed styles (JSDOM doesn't process CSS)
        expect(seat).toHaveClass('absolute', 'w-2', 'h-2');

        // Check if inline styles for coords are applied (these are real inline styles)
        expect(seat?.getAttribute('style')).toContain('left:');
        expect(seat?.getAttribute('style')).toContain('top:');
    });
});

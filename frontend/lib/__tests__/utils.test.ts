import { cn } from '@/lib/utils';

describe('cn() utility', () => {
    // 19. Joins classes
    it('joins multiple class names', () => {
        expect(cn('foo', 'bar')).toBe('foo bar');
    });

    // 20. Tailwind merge deduplication
    it('deduplicates conflicting Tailwind classes (last wins)', () => {
        expect(cn('p-2', 'p-4')).toBe('p-4');
    });

    it('handles conditional classes', () => {
        expect(cn('base', false && 'hidden', 'visible')).toBe('base visible');
    });

    it('handles empty inputs', () => {
        expect(cn()).toBe('');
    });

    it('handles undefined and null', () => {
        expect(cn('a', undefined, null, 'b')).toBe('a b');
    });
});

import { KANBAN_STAGES, KANBAN_STAGES_ORDER, KANBAN_STAGE_COLORS, KanbanStage } from '@/lib/constants';

describe('constants', () => {
    // 15. KANBAN_STAGES_ORDER has 10 elements
    it('KANBAN_STAGES_ORDER contains exactly 10 stages', () => {
        expect(KANBAN_STAGES_ORDER).toHaveLength(10);
    });

    // 16. Correct first and last
    it('first stage is Inicjatywa, last is Wejście w życie', () => {
        expect(KANBAN_STAGES_ORDER[0]).toBe(KANBAN_STAGES.INICJATYWA);
        expect(KANBAN_STAGES_ORDER[9]).toBe(KANBAN_STAGES.WEJSCIE_W_ZYCIE);
    });

    // 17. All values are unique
    it('all KANBAN_STAGES values are unique', () => {
        const values = Object.values(KANBAN_STAGES);
        const unique = new Set(values);
        expect(unique.size).toBe(values.length);
    });

    // 18. KANBAN_STAGE_COLORS has a color for every stage
    it('KANBAN_STAGE_COLORS has an entry for every stage in KANBAN_STAGES_ORDER', () => {
        for (const stage of KANBAN_STAGES_ORDER) {
            expect(KANBAN_STAGE_COLORS[stage]).toBeDefined();
            expect(KANBAN_STAGE_COLORS[stage]).toContain('text-');
        }
    });
});

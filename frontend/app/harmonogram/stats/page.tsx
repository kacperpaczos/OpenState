import { getBills } from "@/lib/bills";
import { KANBAN_STAGES } from "@/lib/constants";
import StatsView from "./StatsView";

export default async function StatsPage() {
    const processes = await getBills();

    const kanban = {
        inicjatywa: processes.filter(p => p.kanbanStage === KANBAN_STAGES.INICJATYWA),
        sejm_i_czytanie: processes.filter(p => p.kanbanStage === KANBAN_STAGES.SEJM_I_CZYTANIE),
        sejm_komisje: processes.filter(p => p.kanbanStage === KANBAN_STAGES.SEJM_KOMISJE),
        sejm_ii_czytanie: processes.filter(p => p.kanbanStage === KANBAN_STAGES.SEJM_II_CZYTANIE),
        sejm_glosowanie: processes.filter(p => p.kanbanStage === KANBAN_STAGES.SEJM_GLOSOWANIE),
        senat_komisje: processes.filter(p => p.kanbanStage === KANBAN_STAGES.SENAT_KOMISJE),
        senat_glosowanie: processes.filter(p => p.kanbanStage === KANBAN_STAGES.SENAT_GLOSOWANIE),
        prezydent: processes.filter(p => p.kanbanStage === KANBAN_STAGES.PREZYDENT),
        publikacja: processes.filter(p => p.kanbanStage === KANBAN_STAGES.PUBLIKACJA),
        wejscie: processes.filter(p => p.kanbanStage === KANBAN_STAGES.WEJSCIE_W_ZYCIE),
    };

    return <StatsView kanban={kanban} />;
}

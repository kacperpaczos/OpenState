import { getBills } from "@/lib/bills";
import { KANBAN_STAGES } from "@/lib/constants";
import HorizontalKanban from "../HorizontalKanban";

export default async function HorizontalPage() {
    const processes = await getBills();

    // Build kanban structure from processes
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

    return <HorizontalKanban kanban={kanban} />;
}

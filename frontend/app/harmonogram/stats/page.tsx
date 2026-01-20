import { MOCK_DB } from "@/lib/data";
import StatsView from "./StatsView";

export default function StatsPage() {
    return <StatsView kanban={MOCK_DB.kanban} />;
}

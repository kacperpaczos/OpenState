import { MOCK_DB } from "@/lib/data";
import TimelineView from "./TimelineView";

export default function TimelinePage() {
    return <TimelineView kanban={MOCK_DB.kanban} />;
}

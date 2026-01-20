import { MOCK_DB } from "@/lib/data";
import Link from "next/link";
import HorizontalKanban from "./HorizontalKanban";

export default function HarmonogramPage() {
    return <HorizontalKanban kanban={MOCK_DB.kanban} />;
}

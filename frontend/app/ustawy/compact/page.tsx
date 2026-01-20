import { getProcesses } from "@/lib/processes";
import CompactBillsList from "./CompactBillsList";

export default async function CompactBillsPage() {
    const processes = await getProcesses();

    return <CompactBillsList initialProcesses={processes} />;
}

import { getProcesses } from "@/lib/processes";
import BillsList from "./BillsList";

export default async function BillsPage() {
    const processes = await getProcesses();

    return (
        <BillsList initialProcesses={processes} />
    );
}

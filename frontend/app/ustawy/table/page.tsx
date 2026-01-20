import { getProcesses } from "@/lib/processes";
import TableBillsList from "./TableBillsList";

export default async function TableBillsPage() {
    const processes = await getProcesses();

    return <TableBillsList initialProcesses={processes} />;
}

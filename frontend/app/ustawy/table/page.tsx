import { getBills } from "@/lib/bills";
import TableBillsList from "./TableBillsList";

export default async function TableBillsPage() {
    const processes = await getBills();

    return <TableBillsList initialProcesses={processes} />;
}

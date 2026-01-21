import { getBills } from "@/lib/bills";
import BillsList from "./BillsList";

export default async function BillsPage() {
    const processes = await getBills();

    return (
        <BillsList initialProcesses={processes} />
    );
}

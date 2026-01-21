import { getBills } from "@/lib/bills";
import CompactBillsList from "./CompactBillsList";

export default async function CompactBillsPage() {
    const processes = await getBills();

    return <CompactBillsList initialProcesses={processes} />;
}

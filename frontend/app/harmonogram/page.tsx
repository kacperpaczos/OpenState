
import { getBills } from "@/lib/bills";
import ScheduleBoard from "./ScheduleBoard";

export default async function SchedulePage() {
    const processes = await getBills();

    return (
        <ScheduleBoard initialProcesses={processes} />
    );
}

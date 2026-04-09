import { getSenators } from "@/lib/mps";
import SenatorsList from "./SenatorsList";

export default async function SenatorsPage() {
    const senators = await getSenators();

    return (
        <SenatorsList initialSenators={senators} />
    );
}

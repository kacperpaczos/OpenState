import { getSenators } from "@/lib/senators";
import SenatorsList from "./SenatorsList";

export default async function SenatorsPage() {
    const senators = await getSenators();

    return (
        <SenatorsList initialSenators={senators} />
    );
}

import { getMPs } from "@/lib/mps";
import MPsList from "./MPsList";

export default async function MPsPage() {
    const mps = await getMPs();
    return <MPsList initialMPs={mps} />;
}


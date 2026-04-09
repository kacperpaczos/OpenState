import { getMPs } from "@/lib/mps";
import MPsList from "./MPsList";

import { Suspense } from "react";

export default async function MPsPage() {
    const mps = await getMPs();
    return (
        <Suspense fallback={<div className="p-8 text-center">Ładowanie listy posłów...</div>}>
            <MPsList initialMPs={mps} />
        </Suspense>
    );
}


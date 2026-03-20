import { Header } from "@/components/layout/Header";
import { getProcessos } from "@/lib/actions";
import { ProcessosClient } from "./ProcessosClient";

export default async function ProcessosPage() {
    const processos = await getProcessos();

    return (
        <>
            <Header title="Processos" />
            <div className="p-6">
                <ProcessosClient initialProcessos={JSON.parse(JSON.stringify(processos))} />
            </div>
        </>
    );
}

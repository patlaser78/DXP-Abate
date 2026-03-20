import { Header } from "@/components/layout/Header";
import { ScannerTestClient } from "./ScannerTestClient";

export default function ScannerPage() {
    return (
        <>
            <Header title="Scanner de Documentos" />
            <div className="p-6 max-w-2xl mx-auto">
                <ScannerTestClient />
            </div>
        </>
    );
}

import { Sidebar } from "@/components/layout/Sidebar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen">
            <Sidebar />
            <main className="pl-64">
                {children}
            </main>
        </div>
    );
}

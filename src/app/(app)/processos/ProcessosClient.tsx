"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { StatusBadge } from "@/components/StatusBadge";
import { ESTADOS_LISTA } from "@/lib/constants";
import { updateProcessoEstado } from "@/lib/actions";
import {
    Kanban,
    List,
    Plus,
    Search,
    Car,
    User,
    MapPin,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type Processo = {
    id: string;
    numero: string;
    estado: string;
    cotacao: number | null;
    localRecolha: string | null;
    notas: string | null;
    dataAgendamento: string | null;
    horaAgendamento: string | null;
    createdAt: string;
    cliente: { id: string; nome: string; telefone: string; nif: string };
    veiculo: { id: string; matricula: string; marca: string; modelo: string; ano: number | null; cor: string | null };
    responsavel: { id: string; name: string } | null;
};

export function ProcessosClient({ initialProcessos }: { initialProcessos: Processo[] }) {
    const [view, setView] = useState<"kanban" | "list">("kanban");
    const [search, setSearch] = useState("");
    const [processos, setProcessos] = useState(initialProcessos);
    const router = useRouter();

    const filtered = processos.filter((p) => {
        const q = search.toLowerCase();
        return (
            p.numero.toLowerCase().includes(q) ||
            p.cliente.nome.toLowerCase().includes(q) ||
            p.veiculo.matricula.toLowerCase().includes(q) ||
            p.veiculo.marca.toLowerCase().includes(q)
        );
    });

    const handleDrop = async (processoId: string, newEstado: string) => {
        setProcessos((prev) =>
            prev.map((p) => (p.id === processoId ? { ...p, estado: newEstado } : p))
        );
        await updateProcessoEstado(processoId, newEstado);
        router.refresh();
    };

    return (
        <div className="space-y-4">
            {/* Toolbar */}
            <div className="flex items-center gap-3">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                    <Input
                        placeholder="Pesquisar por número, cliente, matrícula..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-9 bg-zinc-900 border-zinc-700 text-white placeholder:text-zinc-500"
                    />
                </div>

                <div className="flex items-center gap-1 bg-zinc-900 rounded-lg p-1 border border-zinc-800">
                    <Button
                        variant={view === "kanban" ? "secondary" : "ghost"}
                        size="sm"
                        onClick={() => setView("kanban")}
                        className="h-8"
                    >
                        <Kanban className="h-4 w-4 mr-1" />
                        Kanban
                    </Button>
                    <Button
                        variant={view === "list" ? "secondary" : "ghost"}
                        size="sm"
                        onClick={() => setView("list")}
                        className="h-8"
                    >
                        <List className="h-4 w-4 mr-1" />
                        Lista
                    </Button>
                </div>

                <Link href="/processos/novo">
                    <Button className="bg-lime-500 hover:bg-lime-600 text-black font-medium">
                        <Plus className="h-4 w-4 mr-1" />
                        Novo Processo
                    </Button>
                </Link>
            </div>

            {/* Content */}
            {view === "kanban" ? (
                <KanbanView processos={filtered} onDrop={handleDrop} />
            ) : (
                <ListView processos={filtered} />
            )}
        </div>
    );
}

function KanbanView({
    processos,
    onDrop,
}: {
    processos: Processo[];
    onDrop: (id: string, estado: string) => void;
}) {
    const [draggedId, setDraggedId] = useState<string | null>(null);

    return (
        <div className="flex gap-3 overflow-x-auto pb-4">
            {ESTADOS_LISTA.map((estado) => {
                const items = processos.filter((p) => p.estado === estado.key);
                return (
                    <div
                        key={estado.key}
                        className="flex-shrink-0 w-72"
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={(e) => {
                            e.preventDefault();
                            if (draggedId) {
                                onDrop(draggedId, estado.key);
                                setDraggedId(null);
                            }
                        }}
                    >
                        {/* Column Header */}
                        <div className="flex items-center gap-2 mb-3 px-1">
                            <span className="text-lg">{estado.icon}</span>
                            <span className="text-sm font-medium text-zinc-300">
                                {estado.label}
                            </span>
                            <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-zinc-800 text-xs text-zinc-400">
                                {items.length}
                            </span>
                        </div>

                        {/* Cards */}
                        <div className="space-y-2 min-h-[200px] rounded-xl bg-zinc-900/30 p-2 border border-zinc-800/50">
                            {items.map((p) => (
                                <Link
                                    key={p.id}
                                    href={`/processos/${p.id}`}
                                    draggable
                                    onDragStart={() => setDraggedId(p.id)}
                                    onDragEnd={() => setDraggedId(null)}
                                >
                                    <Card className="p-3 bg-zinc-900 border-zinc-800 hover:border-lime-500/30 hover:bg-zinc-800/80 transition-all cursor-grab active:cursor-grabbing group">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-xs font-mono text-lime-400">
                                                {p.numero}
                                            </span>
                                            {p.cotacao && (
                                                <span className="text-xs font-medium text-emerald-400">
                                                    {p.cotacao}€
                                                </span>
                                            )}
                                        </div>

                                        <div className="space-y-1.5">
                                            <div className="flex items-center gap-1.5 text-sm">
                                                <Car className="h-3.5 w-3.5 text-zinc-500" />
                                                <span className="text-white font-medium">
                                                    {p.veiculo.marca} {p.veiculo.modelo}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-1.5 text-xs text-zinc-400">
                                                <span className="font-mono bg-zinc-800 px-1.5 py-0.5 rounded text-[11px]">
                                                    {p.veiculo.matricula}
                                                </span>
                                                {p.veiculo.ano && (
                                                    <span>• {p.veiculo.ano}</span>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-1.5 text-xs text-zinc-500">
                                                <User className="h-3 w-3" />
                                                <span>{p.cliente.nome}</span>
                                            </div>
                                            {p.localRecolha && (
                                                <div className="flex items-center gap-1.5 text-xs text-zinc-600">
                                                    <MapPin className="h-3 w-3" />
                                                    <span className="truncate">{p.localRecolha}</span>
                                                </div>
                                            )}
                                        </div>

                                        {p.dataAgendamento && (
                                            <div className="mt-2 pt-2 border-t border-zinc-800 text-xs text-orange-400">
                                                📅 {new Date(p.dataAgendamento).toLocaleDateString("pt-PT")}
                                                {p.horaAgendamento && ` às ${p.horaAgendamento}`}
                                            </div>
                                        )}
                                    </Card>
                                </Link>
                            ))}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

function ListView({ processos }: { processos: Processo[] }) {
    return (
        <div className="rounded-xl border border-zinc-800 overflow-hidden">
            <table className="w-full">
                <thead>
                    <tr className="bg-zinc-900/80 border-b border-zinc-800">
                        <th className="text-left text-xs font-medium text-zinc-400 uppercase tracking-wide px-4 py-3">
                            Processo
                        </th>
                        <th className="text-left text-xs font-medium text-zinc-400 uppercase tracking-wide px-4 py-3">
                            Cliente
                        </th>
                        <th className="text-left text-xs font-medium text-zinc-400 uppercase tracking-wide px-4 py-3">
                            Veículo
                        </th>
                        <th className="text-left text-xs font-medium text-zinc-400 uppercase tracking-wide px-4 py-3">
                            Matrícula
                        </th>
                        <th className="text-left text-xs font-medium text-zinc-400 uppercase tracking-wide px-4 py-3">
                            Estado
                        </th>
                        <th className="text-right text-xs font-medium text-zinc-400 uppercase tracking-wide px-4 py-3">
                            Cotação
                        </th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/50">
                    {processos.map((p) => (
                        <tr
                            key={p.id}
                            className="hover:bg-zinc-900/50 transition-colors group"
                        >
                            <td className="px-4 py-3">
                                <Link
                                    href={`/processos/${p.id}`}
                                    className="text-sm font-mono text-lime-400 hover:text-lime-300"
                                >
                                    {p.numero}
                                </Link>
                            </td>
                            <td className="px-4 py-3 text-sm text-white">{p.cliente.nome}</td>
                            <td className="px-4 py-3 text-sm text-zinc-300">
                                {p.veiculo.marca} {p.veiculo.modelo}
                            </td>
                            <td className="px-4 py-3">
                                <span className="font-mono text-xs bg-zinc-800 px-2 py-1 rounded text-zinc-300">
                                    {p.veiculo.matricula}
                                </span>
                            </td>
                            <td className="px-4 py-3">
                                <StatusBadge estado={p.estado} />
                            </td>
                            <td className="px-4 py-3 text-right text-sm text-emerald-400 font-medium">
                                {p.cotacao ? `${p.cotacao}€` : "—"}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

import { Header } from "@/components/layout/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import { ESTADOS_PROCESSO, type EstadoProcesso } from "@/lib/constants";
import { CalendarDays, MapPin, Clock, Car, User } from "lucide-react";
import Link from "next/link";

export default async function AgendaPage() {
    const processos = await prisma.processo.findMany({
        where: {
            estado: { in: ["AGENDADO", "LEAD", "COTACAO"] },
        },
        include: { cliente: true, veiculo: true },
        orderBy: { dataAgendamento: "asc" },
    });

    const agendados = processos.filter((p) => p.dataAgendamento);
    const semData = processos.filter((p) => !p.dataAgendamento);

    // Group by date
    const byDate = agendados.reduce<Record<string, typeof agendados>>((acc, p) => {
        const key = new Date(p.dataAgendamento!).toLocaleDateString("pt-PT");
        if (!acc[key]) acc[key] = [];
        acc[key].push(p);
        return acc;
    }, {});

    return (
        <>
            <Header title="Agenda" />
            <div className="p-6 space-y-6">
                {/* Agendados */}
                <div className="space-y-4">
                    <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wide flex items-center gap-2">
                        <CalendarDays className="h-4 w-4 text-lime-400" />
                        Recolhas Agendadas
                    </h3>

                    {Object.keys(byDate).length === 0 ? (
                        <Card className="bg-zinc-900/50 border-zinc-800">
                            <CardContent className="py-8 text-center">
                                <CalendarDays className="h-8 w-8 text-zinc-600 mx-auto mb-2" />
                                <p className="text-sm text-zinc-500">Sem recolhas agendadas</p>
                            </CardContent>
                        </Card>
                    ) : (
                        Object.entries(byDate).map(([date, items]) => (
                            <div key={date}>
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="h-px flex-1 bg-zinc-800" />
                                    <span className="text-xs font-medium text-lime-400 bg-zinc-900 px-3 py-1 rounded-full border border-zinc-800">
                                        📅 {date}
                                    </span>
                                    <div className="h-px flex-1 bg-zinc-800" />
                                </div>

                                <div className="grid gap-3">
                                    {items.map((p) => {
                                        const estadoConfig = ESTADOS_PROCESSO[p.estado as EstadoProcesso];
                                        return (
                                            <Link key={p.id} href={`/processos/${p.id}`}>
                                                <Card className="bg-zinc-900/50 border-zinc-800 hover:border-lime-500/30 transition-all">
                                                    <CardContent className="py-4">
                                                        <div className="flex items-center gap-4">
                                                            <div className="flex flex-col items-center justify-center w-16 h-16 rounded-xl bg-orange-500/10 border border-orange-500/20">
                                                                <Clock className="h-4 w-4 text-orange-400 mb-1" />
                                                                <span className="text-sm font-bold text-orange-400">
                                                                    {p.horaAgendamento || "--:--"}
                                                                </span>
                                                            </div>

                                                            <div className="flex-1 min-w-0">
                                                                <div className="flex items-center gap-2">
                                                                    <span className="text-sm font-mono text-lime-400">{p.numero}</span>
                                                                    <span className={`text-xs px-2 py-0.5 rounded-full ${estadoConfig?.color} text-white`}>
                                                                        {estadoConfig?.label}
                                                                    </span>
                                                                </div>
                                                                <div className="flex items-center gap-3 mt-1">
                                                                    <span className="flex items-center gap-1 text-sm text-white">
                                                                        <Car className="h-3.5 w-3.5 text-zinc-500" />
                                                                        {p.veiculo.marca} {p.veiculo.modelo}
                                                                    </span>
                                                                    <span className="font-mono text-xs bg-zinc-800 px-1.5 py-0.5 rounded text-zinc-300">
                                                                        {p.veiculo.matricula}
                                                                    </span>
                                                                </div>
                                                                <div className="flex items-center gap-3 mt-1 text-xs text-zinc-500">
                                                                    <span className="flex items-center gap-1">
                                                                        <User className="h-3 w-3" />
                                                                        {p.cliente.nome}
                                                                    </span>
                                                                    {p.localRecolha && (
                                                                        <span className="flex items-center gap-1">
                                                                            <MapPin className="h-3 w-3" />
                                                                            {p.localRecolha}
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            </div>

                                                            {p.cotacao && (
                                                                <div className="text-right">
                                                                    <p className="text-lg font-bold text-emerald-400">{p.cotacao}€</p>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            </Link>
                                        );
                                    })}
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Sem data */}
                {semData.length > 0 && (
                    <div className="space-y-4">
                        <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wide flex items-center gap-2">
                            <Clock className="h-4 w-4 text-zinc-500" />
                            A Agendar ({semData.length})
                        </h3>
                        <div className="grid gap-2">
                            {semData.map((p) => (
                                <Link key={p.id} href={`/processos/${p.id}`}>
                                    <Card className="bg-zinc-900/30 border-zinc-800/50 hover:border-zinc-700 transition-all">
                                        <CardContent className="py-3">
                                            <div className="flex items-center gap-3">
                                                <span className="text-sm font-mono text-zinc-500">{p.numero}</span>
                                                <span className="text-sm text-white">{p.veiculo.marca} {p.veiculo.modelo}</span>
                                                <span className="font-mono text-xs text-zinc-500">{p.veiculo.matricula}</span>
                                                <span className="ml-auto text-xs text-zinc-500">{p.cliente.nome}</span>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}

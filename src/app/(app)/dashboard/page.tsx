import { Header } from "@/components/layout/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/StatusBadge";
import { getDashboardStats } from "@/lib/actions";
import { ESTADOS_LISTA } from "@/lib/constants";
import {
    Activity,
    Car,
    FileCheck,
    TrendingUp,
    Truck,
    Clock,
} from "lucide-react";
import Link from "next/link";

export default async function DashboardPage() {
    const stats = await getDashboardStats();

    return (
        <>
            <Header title="Dashboard" />
            <div className="p-6 space-y-6">
                {/* KPIs */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <KPICard
                        title="Processos Ativos"
                        value={stats.processosAtivos}
                        icon={<Activity className="h-5 w-5" />}
                        color="lime"
                    />
                    <KPICard
                        title="Recolhas Hoje"
                        value={stats.recolhasHoje.length}
                        icon={<Truck className="h-5 w-5" />}
                        color="orange"
                    />
                    <KPICard
                        title="Certificados Emitidos"
                        value={stats.certificados + stats.concluidos}
                        icon={<FileCheck className="h-5 w-5" />}
                        color="emerald"
                    />
                    <KPICard
                        title="Total de Processos"
                        value={stats.total}
                        icon={<TrendingUp className="h-5 w-5" />}
                        color="blue"
                    />
                </div>

                {/* Pipeline Overview + Recolhas Hoje */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Pipeline */}
                    <Card className="lg:col-span-2 bg-zinc-900/50 border-zinc-800">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-base font-semibold text-white flex items-center gap-2">
                                <Car className="h-4 w-4 text-lime-400" />
                                Pipeline de Processos
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-4 gap-3">
                                {ESTADOS_LISTA.map((estado) => {
                                    const count = stats.counts[estado.key as keyof typeof stats.counts] || 0;
                                    return (
                                        <Link
                                            key={estado.key}
                                            href={`/processos?estado=${estado.key}`}
                                            className="group"
                                        >
                                            <div className="rounded-lg bg-zinc-800/50 p-3 text-center transition-all hover:bg-zinc-800 hover:scale-[1.02]">
                                                <span className="text-xl">{estado.icon}</span>
                                                <p className="mt-1 text-xs text-zinc-400 group-hover:text-white transition-colors">
                                                    {estado.label}
                                                </p>
                                            </div>
                                        </Link>
                                    );
                                })}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Recolhas Hoje */}
                    <Card className="bg-zinc-900/50 border-zinc-800">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-base font-semibold text-white flex items-center gap-2">
                                <Clock className="h-4 w-4 text-orange-400" />
                                Recolhas Hoje
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {stats.recolhasHoje.length === 0 ? (
                                <p className="text-sm text-zinc-500 text-center py-4">
                                    Sem recolhas agendadas para hoje
                                </p>
                            ) : (
                                stats.recolhasHoje.map((p) => (
                                    <Link
                                        key={p.id}
                                        href={`/processos/${p.id}`}
                                        className="block rounded-lg bg-zinc-800/50 p-3 hover:bg-zinc-800 transition-all"
                                    >
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-medium text-white">
                                                {p.veiculo.marca} {p.veiculo.modelo}
                                            </span>
                                            <span className="text-xs text-zinc-400">
                                                {p.veiculo.matricula}
                                            </span>
                                        </div>
                                        <p className="mt-1 text-xs text-zinc-500">
                                            {p.cliente.nome}
                                        </p>
                                    </Link>
                                ))
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Recent Activity */}
                <Card className="bg-zinc-900/50 border-zinc-800">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-base font-semibold text-white flex items-center gap-2">
                            <Activity className="h-4 w-4 text-lime-400" />
                            Atividade Recente
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {stats.recentes.length === 0 ? (
                                <p className="text-sm text-zinc-500 text-center py-4">
                                    Nenhuma atividade recente
                                </p>
                            ) : (
                                stats.recentes.map((p) => (
                                    <Link
                                        key={p.id}
                                        href={`/processos/${p.id}`}
                                        className="flex items-center gap-4 rounded-lg p-3 hover:bg-zinc-800/50 transition-all group"
                                    >
                                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-800 text-sm font-mono text-zinc-300 group-hover:bg-lime-500/20 group-hover:text-lime-400 transition-all">
                                            {p.veiculo.matricula.substring(0, 2)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm font-medium text-white">
                                                    {p.numero}
                                                </span>
                                                <span className="text-xs text-zinc-500">•</span>
                                                <span className="text-sm text-zinc-400">
                                                    {p.veiculo.marca} {p.veiculo.modelo}
                                                </span>
                                            </div>
                                            <p className="text-xs text-zinc-500 truncate">
                                                {p.cliente.nome} — {p.veiculo.matricula}
                                            </p>
                                        </div>
                                        <StatusBadge estado={p.estado} />
                                    </Link>
                                ))
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

function KPICard({
    title,
    value,
    icon,
    color,
}: {
    title: string;
    value: number;
    icon: React.ReactNode;
    color: string;
}) {
    const colorMap: Record<string, string> = {
        lime: "bg-lime-500/10 text-lime-400 border-lime-500/20",
        orange: "bg-orange-500/10 text-orange-400 border-orange-500/20",
        emerald: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
        blue: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    };

    return (
        <Card className={`border ${colorMap[color]} bg-zinc-900/50`}>
            <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-xs font-medium text-zinc-400 uppercase tracking-wide">
                            {title}
                        </p>
                        <p className="mt-2 text-3xl font-bold text-white">{value}</p>
                    </div>
                    <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${colorMap[color]}`}>
                        {icon}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

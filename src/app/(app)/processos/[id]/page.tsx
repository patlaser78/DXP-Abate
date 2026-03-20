import { Header } from "@/components/layout/Header";
import { getProcessoById } from "@/lib/actions";
import { StatusBadge } from "@/components/StatusBadge";
import { EnviarCotacao } from "@/components/EnviarCotacao";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ESTADOS_LISTA } from "@/lib/constants";
import {
    ArrowLeft,
    User,
    Car,
    FileText,
    MapPin,
    Phone,
    Mail,
    Hash,
    Calendar,
    Fuel,
    Gauge,
    Palette,
} from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ProcessoActions } from "@/components/ProcessoActions";

export default async function ProcessoDetalhePage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const processo = await getProcessoById(id);
    if (!processo) notFound();

    const estadoAtual = ESTADOS_LISTA.find((e) => e.key === processo.estado);
    const estadoIndex = estadoAtual?.order ?? 0;

    return (
        <>
            <Header title={`Processo ${processo.numero}`} />
            <div className="p-6 space-y-6">
                {/* Back + Header */}
                <div className="flex items-center gap-4">
                    <Link
                        href="/processos"
                        className="flex h-9 w-9 items-center justify-center rounded-lg bg-zinc-800 hover:bg-zinc-700 transition-colors"
                    >
                        <ArrowLeft className="h-4 w-4" />
                    </Link>
                    <div className="flex-1">
                        <div className="flex items-center gap-3">
                            <h1 className="text-xl font-bold text-white">{processo.numero}</h1>
                            <StatusBadge estado={processo.estado} />
                        </div>
                        <p className="text-sm text-zinc-500 mt-0.5">
                            Criado em {new Date(processo.createdAt).toLocaleDateString("pt-PT")}
                        </p>
                    </div>
                    {processo.cotacao && (
                        <div className="text-right">
                            <p className="text-xs text-zinc-500 uppercase">Cotação</p>
                            <p className="text-2xl font-bold text-emerald-400">{processo.cotacao}€</p>
                        </div>
                    )}
                    <EnviarCotacao
                        data={{
                            processoNumero: processo.numero,
                            clienteNome: processo.cliente.nome,
                            clienteTelefone: processo.cliente.telefone,
                            clienteEmail: processo.cliente.email,
                            veiculoMarca: processo.veiculo.marca,
                            veiculoModelo: processo.veiculo.modelo,
                            veiculoMatricula: processo.veiculo.matricula,
                            veiculoAno: processo.veiculo.ano,
                            cotacao: processo.cotacao,
                        }}
                    />
                </div>

                {/* Timeline */}
                <Card className="bg-zinc-900/50 border-zinc-800">
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-1">
                            {ESTADOS_LISTA.map((estado, i) => (
                                <div key={estado.key} className="flex items-center flex-1">
                                    <div
                                        className={`flex h-8 w-8 items-center justify-center rounded-full text-sm shrink-0 transition-all ${i <= estadoIndex
                                            ? "bg-lime-500 text-black font-bold"
                                            : "bg-zinc-800 text-zinc-500"
                                            }`}
                                    >
                                        {i < estadoIndex ? "✓" : estado.icon}
                                    </div>
                                    {i < ESTADOS_LISTA.length - 1 && (
                                        <div
                                            className={`flex-1 h-0.5 mx-1 ${i < estadoIndex ? "bg-lime-500" : "bg-zinc-800"
                                                }`}
                                        />
                                    )}
                                </div>
                            ))}
                        </div>
                        <div className="flex mt-2">
                            {ESTADOS_LISTA.map((estado) => (
                                <div key={estado.key} className="flex-1 text-center">
                                    <p className="text-[10px] text-zinc-500">{estado.label}</p>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Cliente */}
                    <Card className="bg-zinc-900/50 border-zinc-800">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-base font-semibold text-white flex items-center gap-2">
                                <User className="h-4 w-4 text-lime-400" />
                                Dados do Cliente
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <InfoRow icon={<User className="h-4 w-4" />} label="Nome" value={processo.cliente.nome} />
                            <InfoRow icon={<Hash className="h-4 w-4" />} label="NIF" value={processo.cliente.nif} />
                            <InfoRow icon={<Phone className="h-4 w-4" />} label="Telefone" value={processo.cliente.telefone} />
                            {processo.cliente.email && (
                                <InfoRow icon={<Mail className="h-4 w-4" />} label="Email" value={processo.cliente.email} />
                            )}
                            {processo.cliente.morada && (
                                <InfoRow icon={<MapPin className="h-4 w-4" />} label="Morada" value={processo.cliente.morada} />
                            )}
                        </CardContent>
                    </Card>

                    {/* Veículo */}
                    <Card className="bg-zinc-900/50 border-zinc-800">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-base font-semibold text-white flex items-center gap-2">
                                <Car className="h-4 w-4 text-lime-400" />
                                Dados do Veículo
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="flex h-12 items-center justify-center rounded-lg bg-zinc-800 px-4 font-mono text-lg font-bold text-white tracking-wide">
                                    {processo.veiculo.matricula}
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-white">
                                        {processo.veiculo.marca} {processo.veiculo.modelo}
                                    </p>
                                    {processo.veiculo.ano && (
                                        <p className="text-xs text-zinc-500">{processo.veiculo.ano}</p>
                                    )}
                                </div>
                            </div>
                            <Separator className="bg-zinc-800" />
                            {processo.veiculo.vin && (
                                <InfoRow icon={<Hash className="h-4 w-4" />} label="VIN" value={processo.veiculo.vin} />
                            )}
                            {processo.veiculo.combustivel && (
                                <InfoRow icon={<Fuel className="h-4 w-4" />} label="Combustível" value={processo.veiculo.combustivel} />
                            )}
                            {processo.veiculo.quilometros && (
                                <InfoRow icon={<Gauge className="h-4 w-4" />} label="Quilómetros" value={`${processo.veiculo.quilometros.toLocaleString("pt-PT")} km`} />
                            )}
                            {processo.veiculo.cor && (
                                <InfoRow icon={<Palette className="h-4 w-4" />} label="Cor" value={processo.veiculo.cor} />
                            )}
                            {processo.veiculo.estado && (
                                <div className="flex items-center gap-2">
                                    <span className="text-xs text-zinc-500">Estado:</span>
                                    <Badge variant="outline" className="text-xs">{processo.veiculo.estado}</Badge>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Agendamento */}
                    <Card className="bg-zinc-900/50 border-zinc-800">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-base font-semibold text-white flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-orange-400" />
                                Agendamento
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {processo.dataAgendamento ? (
                                <>
                                    <InfoRow
                                        icon={<Calendar className="h-4 w-4" />}
                                        label="Data"
                                        value={new Date(processo.dataAgendamento).toLocaleDateString("pt-PT", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
                                    />
                                    {processo.horaAgendamento && (
                                        <InfoRow icon={<Calendar className="h-4 w-4" />} label="Hora" value={processo.horaAgendamento} />
                                    )}
                                </>
                            ) : (
                                <p className="text-sm text-zinc-500">Sem agendamento definido</p>
                            )}
                            {processo.localRecolha && (
                                <InfoRow icon={<MapPin className="h-4 w-4" />} label="Local" value={processo.localRecolha} />
                            )}
                        </CardContent>
                    </Card>

                    {/* Notas */}
                    <Card className="bg-zinc-900/50 border-zinc-800">
                        <CardHeader className="pb-3 text-white flex flex-row items-center justify-between">
                            <CardTitle className="text-base font-semibold flex items-center gap-2">
                                <FileText className="h-4 w-4 text-blue-400" />
                                Notas
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {processo.notas ? (
                                <p className="text-sm text-zinc-300 whitespace-pre-wrap">{processo.notas}</p>
                            ) : (
                                <p className="text-sm text-zinc-500">Sem notas</p>
                            )}
                        </CardContent>
                    </Card>

                    {/* Ações de Estado */}
                    <ProcessoActions
                        processoId={processo.id}
                        estado={processo.estado}
                        estadoIndex={estadoIndex}
                        estadosLista={ESTADOS_LISTA.map(e => ({ key: e.key, label: e.label, icon: e.icon, order: e.order }))}
                        localRecolhaAtual={processo.localRecolha}
                    />
                </div>
            </div>
        </>
    );
}

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
    return (
        <div className="flex items-center gap-3">
            <div className="text-zinc-500">{icon}</div>
            <div>
                <p className="text-[11px] text-zinc-500 uppercase tracking-wide">{label}</p>
                <p className="text-sm text-white">{value}</p>
            </div>
        </div>
    );
}

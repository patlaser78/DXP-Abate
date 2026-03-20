"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { updateProcessoEstado, agendarRecolha } from "@/lib/actions";
import { useRouter } from "next/navigation";
import {
    ArrowLeft,
    ArrowRight,
    Check,
    Calendar,
    Clock,
    MapPin,
    Loader2,
} from "lucide-react";

type ProcessoActionsProps = {
    processoId: string;
    estado: string;
    estadoIndex: number;
    estadosLista: { key: string; label: string; icon: string; order: number }[];
    localRecolhaAtual?: string | null;
};

export function ProcessoActions({
    processoId,
    estado,
    estadoIndex,
    estadosLista,
    localRecolhaAtual,
}: ProcessoActionsProps) {
    const router = useRouter();
    const [showAgendamento, setShowAgendamento] = useState(false);
    const [loading, setLoading] = useState(false);
    const [agendamento, setAgendamento] = useState({
        data: "",
        hora: "",
        local: localRecolhaAtual || "",
    });

    const handleAvancar = async () => {
        if (estado === "COTACAO") {
            // Show scheduling form instead of advancing directly
            setShowAgendamento(true);
            return;
        }

        setLoading(true);
        try {
            const nextState = estadosLista[estadoIndex + 1].key;
            await updateProcessoEstado(processoId, nextState);
            router.refresh();
        } finally {
            setLoading(false);
        }
    };

    const handleAgendar = async () => {
        if (!agendamento.data || !agendamento.hora) {
            alert("Por favor preenche a data e hora da recolha.");
            return;
        }
        setLoading(true);
        try {
            await agendarRecolha(processoId, {
                dataAgendamento: agendamento.data,
                horaAgendamento: agendamento.hora,
                localRecolha: agendamento.local || undefined,
            });
            setShowAgendamento(false);
            router.refresh();
        } finally {
            setLoading(false);
        }
    };

    const handleRecuar = async () => {
        setLoading(true);
        try {
            const prevState = estadosLista[estadoIndex - 1].key;
            await updateProcessoEstado(processoId, prevState);
            router.refresh();
        } finally {
            setLoading(false);
        }
    };

    const handleConcluir = async () => {
        setLoading(true);
        try {
            await updateProcessoEstado(processoId, "CONCLUIDO");
            router.refresh();
        } finally {
            setLoading(false);
        }
    };

    // Get contextual button label
    const getNextActionLabel = () => {
        switch (estado) {
            case "LEAD": return "Enviar Cotação";
            case "COTACAO": return "Aprovar e Agendar";
            case "AGENDADO": return "Confirmar Recolha";
            case "RECOLHIDO": return "Iniciar Modelo 9";
            case "MODELO9": return "Submeter à Valorcar";
            case "VALORCAR": return "Emitir Certificado";
            default: return `Avançar para ${estadosLista[estadoIndex + 1]?.label}`;
        }
    };

    // Only show "Concluir" when we're at CERTIFICADO state
    const canConcluir = estado === "CERTIFICADO";

    return (
        <Card className="bg-zinc-900/50 border-zinc-800 lg:col-span-2">
            <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold text-white">
                    Ações do Processo
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Scheduling form */}
                {showAgendamento && (
                    <div className="rounded-xl border border-lime-500/20 bg-lime-500/5 p-4 space-y-4">
                        <h4 className="text-sm font-semibold text-lime-400 flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            Agendar Recolha
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <div>
                                <Label className="text-xs text-zinc-400">Data *</Label>
                                <Input
                                    type="date"
                                    value={agendamento.data}
                                    onChange={(e) => setAgendamento(prev => ({ ...prev, data: e.target.value }))}
                                    className="mt-1 bg-zinc-900 border-zinc-700 text-white"
                                    min={new Date().toISOString().split("T")[0]}
                                />
                            </div>
                            <div>
                                <Label className="text-xs text-zinc-400">Hora *</Label>
                                <div className="relative mt-1">
                                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-500" />
                                    <Input
                                        type="time"
                                        value={agendamento.hora}
                                        onChange={(e) => setAgendamento(prev => ({ ...prev, hora: e.target.value }))}
                                        className="pl-9 bg-zinc-900 border-zinc-700 text-white"
                                    />
                                </div>
                            </div>
                            <div>
                                <Label className="text-xs text-zinc-400">Local de Recolha</Label>
                                <div className="relative mt-1">
                                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-500" />
                                    <Input
                                        value={agendamento.local}
                                        onChange={(e) => setAgendamento(prev => ({ ...prev, local: e.target.value }))}
                                        placeholder="Morada de recolha"
                                        className="pl-9 bg-zinc-900 border-zinc-700 text-white"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <Button
                                onClick={handleAgendar}
                                disabled={loading}
                                className="bg-lime-500 hover:bg-lime-600 text-black font-bold"
                            >
                                {loading ? (
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                ) : (
                                    <Check className="h-4 w-4 mr-2" />
                                )}
                                Confirmar Agendamento
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() => setShowAgendamento(false)}
                                className="border-zinc-700 hover:bg-zinc-800"
                            >
                                Cancelar
                            </Button>
                        </div>
                    </div>
                )}

                {/* Action buttons */}
                {!showAgendamento && (
                    <div className="flex flex-wrap gap-3">
                        {/* Recuar */}
                        {estadoIndex > 0 && (
                            <Button
                                variant="outline"
                                onClick={handleRecuar}
                                disabled={loading}
                                className="border-zinc-700 hover:bg-zinc-800"
                            >
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Recuar para {estadosLista[estadoIndex - 1].label}
                            </Button>
                        )}

                        {/* Avançar / Agendar */}
                        {estadoIndex < estadosLista.length - 1 && (
                            <Button
                                onClick={handleAvancar}
                                disabled={loading}
                                className="bg-lime-500 hover:bg-lime-600 text-black font-bold"
                            >
                                {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                                {getNextActionLabel()}
                                <ArrowRight className="h-4 w-4 ml-2" />
                            </Button>
                        )}

                        {/* Concluir — SÓ aparece em CERTIFICADO */}
                        {canConcluir && (
                            <Button
                                onClick={handleConcluir}
                                disabled={loading}
                                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
                            >
                                {loading ? (
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                ) : (
                                    <Check className="h-4 w-4 mr-2" />
                                )}
                                Concluir Processo
                            </Button>
                        )}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

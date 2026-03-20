"use client";

import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { COMBUSTIVEIS, MARCAS_VEICULO } from "@/lib/constants";
import { createProcesso } from "@/lib/actions";
import { ArrowLeft, ArrowRight, Check, User, Car, FileText, Scan } from "lucide-react";
import { useRouter } from "next/navigation";
import { DocumentScanner } from "@/components/DocumentScanner";

const STEPS = [
    { title: "Dados do Cliente", icon: <User className="h-4 w-4" /> },
    { title: "Scanner OCR", icon: <Scan className="h-4 w-4" /> },
    { title: "Dados do Veículo", icon: <Car className="h-4 w-4" /> },
    { title: "Cotação e Notas", icon: <FileText className="h-4 w-4" /> },
];

export default function NovoProcessoPage() {
    const [step, setStep] = useState(0);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const [form, setForm] = useState({
        clienteNome: "",
        clienteNif: "",
        clienteTelefone: "",
        clienteEmail: "",
        clienteMorada: "",
        clienteCc: "",
        veiculoMatricula: "",
        veiculoMarca: "",
        veiculoModelo: "",
        veiculoAno: "",
        veiculoVin: "",
        veiculoCombustivel: "",
        veiculoCor: "",
        veiculoQuilometros: "",
        veiculoEstado: "",
        cotacao: "",
        localRecolha: "",
        notas: "",
    });

    const update = (field: string, value: string) =>
        setForm((prev) => ({ ...prev, [field]: value }));

    const handleSubmit = async () => {
        setLoading(true);
        try {
            await createProcesso({
                clienteNome: form.clienteNome,
                clienteNif: form.clienteNif,
                clienteTelefone: form.clienteTelefone,
                clienteEmail: form.clienteEmail || undefined,
                clienteMorada: form.clienteMorada || undefined,
                clienteCc: form.clienteCc || undefined,
                veiculoMatricula: form.veiculoMatricula,
                veiculoMarca: form.veiculoMarca,
                veiculoModelo: form.veiculoModelo,
                veiculoAno: form.veiculoAno ? parseInt(form.veiculoAno) : undefined,
                veiculoVin: form.veiculoVin || undefined,
                veiculoCombustivel: form.veiculoCombustivel || undefined,
                veiculoCor: form.veiculoCor || undefined,
                veiculoQuilometros: form.veiculoQuilometros ? parseInt(form.veiculoQuilometros) : undefined,
                veiculoEstado: form.veiculoEstado || undefined,
                cotacao: form.cotacao ? parseFloat(form.cotacao) : undefined,
                localRecolha: form.localRecolha || undefined,
                notas: form.notas || undefined,
            });
            router.push("/processos");
            router.refresh();
        } catch {
            alert("Erro ao criar processo. Verifique os dados.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Header title="Novo Processo" />
            <div className="p-6 max-w-3xl mx-auto space-y-6">
                {/* Step indicator */}
                <div className="flex items-center gap-2">
                    {STEPS.map((s, i) => (
                        <div key={i} className="flex items-center flex-1">
                            <button
                                onClick={() => setStep(i)}
                                className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all ${i === step
                                    ? "bg-lime-500/15 text-lime-400"
                                    : i < step
                                        ? "text-lime-400/50"
                                        : "text-zinc-500"
                                    }`}
                            >
                                <div
                                    className={`flex h-6 w-6 items-center justify-center rounded-full text-xs ${i < step
                                        ? "bg-lime-500 text-black"
                                        : i === step
                                            ? "bg-lime-500/20 text-lime-400"
                                            : "bg-zinc-800 text-zinc-500"
                                        }`}
                                >
                                    {i < step ? <Check className="h-3 w-3" /> : i + 1}
                                </div>
                                <span className="hidden sm:inline">{s.title}</span>
                            </button>
                            {i < STEPS.length - 1 && (
                                <div className={`flex-1 h-px mx-2 ${i < step ? "bg-lime-500/30" : "bg-zinc-800"}`} />
                            )}
                        </div>
                    ))}
                </div>

                {/* Step Content */}
                <Card className="bg-zinc-900/50 border-zinc-800">
                    <CardHeader>
                        <CardTitle className="text-lg text-white flex items-center gap-2">
                            {STEPS[step].icon}
                            {STEPS[step].title}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {step === 0 && (
                            <>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="col-span-2">
                                        <Label className="text-zinc-400">Nome *</Label>
                                        <Input value={form.clienteNome} onChange={(e) => update("clienteNome", e.target.value)} placeholder="Nome completo" className="bg-zinc-900 border-zinc-700 text-white mt-1" />
                                    </div>
                                    <div>
                                        <Label className="text-zinc-400">NIF *</Label>
                                        <Input value={form.clienteNif} onChange={(e) => update("clienteNif", e.target.value)} placeholder="123456789" className="bg-zinc-900 border-zinc-700 text-white mt-1" />
                                    </div>
                                    <div>
                                        <Label className="text-zinc-400">Telefone *</Label>
                                        <Input value={form.clienteTelefone} onChange={(e) => update("clienteTelefone", e.target.value)} placeholder="912345678" className="bg-zinc-900 border-zinc-700 text-white mt-1" />
                                    </div>
                                    <div>
                                        <Label className="text-zinc-400">Email</Label>
                                        <Input value={form.clienteEmail} onChange={(e) => update("clienteEmail", e.target.value)} placeholder="email@exemplo.pt" className="bg-zinc-900 border-zinc-700 text-white mt-1" />
                                    </div>
                                    <div>
                                        <Label className="text-zinc-400">CC</Label>
                                        <Input value={form.clienteCc} onChange={(e) => update("clienteCc", e.target.value)} placeholder="Nº Cartão Cidadão" className="bg-zinc-900 border-zinc-700 text-white mt-1" />
                                    </div>
                                    <div className="col-span-2">
                                        <Label className="text-zinc-400">Morada</Label>
                                        <Input value={form.clienteMorada} onChange={(e) => update("clienteMorada", e.target.value)} placeholder="Rua, código postal, cidade" className="bg-zinc-900 border-zinc-700 text-white mt-1" />
                                    </div>
                                </div>
                            </>
                        )}

                        {step === 1 && (
                            <div className="space-y-4">
                                <p className="text-sm text-zinc-400">
                                    Digitalize o DUA ou Livrete para preencher automaticamente os dados do veículo.
                                </p>
                                <DocumentScanner
                                    onFieldsExtracted={(data) => {
                                        setForm(prev => ({
                                            ...prev,
                                            veiculoMatricula: data.matricula || prev.veiculoMatricula,
                                            veiculoMarca: data.marca || prev.veiculoMarca,
                                            veiculoModelo: data.modelo || prev.veiculoModelo,
                                            veiculoAno: data.ano?.toString() || prev.veiculoAno,
                                            veiculoVin: data.vin || prev.veiculoVin,
                                            veiculoCombustivel: data.combustivel || prev.veiculoCombustivel,
                                            clienteNome: data.nomeProprietario || prev.clienteNome,
                                            clienteMorada: data.morada || prev.clienteMorada,
                                        }));
                                    }}
                                />
                            </div>
                        )}

                        {step === 2 && (
                            <>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label className="text-zinc-400">Matrícula *</Label>
                                        <Input value={form.veiculoMatricula} onChange={(e) => update("veiculoMatricula", e.target.value.toUpperCase())} placeholder="AA-00-BB" className="bg-zinc-900 border-zinc-700 text-white mt-1 uppercase font-mono" />
                                    </div>
                                    <div>
                                        <Label className="text-zinc-400">Marca *</Label>
                                        <select value={form.veiculoMarca} onChange={(e) => update("veiculoMarca", e.target.value)} className="flex h-9 w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-1 text-sm text-white mt-1">
                                            <option value="">Selecionar...</option>
                                            {MARCAS_VEICULO.map((m) => (
                                                <option key={m} value={m}>{m}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <Label className="text-zinc-400">Modelo *</Label>
                                        <Input value={form.veiculoModelo} onChange={(e) => update("veiculoModelo", e.target.value)} placeholder="Ex: Clio, Golf, 206" className="bg-zinc-900 border-zinc-700 text-white mt-1" />
                                    </div>
                                    <div>
                                        <Label className="text-zinc-400">Ano</Label>
                                        <Input type="number" value={form.veiculoAno} onChange={(e) => update("veiculoAno", e.target.value)} placeholder="2010" className="bg-zinc-900 border-zinc-700 text-white mt-1" />
                                    </div>
                                    <div className="col-span-2">
                                        <Label className="text-zinc-400">VIN / Nº Quadro</Label>
                                        <Input value={form.veiculoVin} onChange={(e) => update("veiculoVin", e.target.value.toUpperCase())} placeholder="VF1BB0F0234567890" className="bg-zinc-900 border-zinc-700 text-white mt-1 font-mono uppercase" />
                                    </div>
                                    <div>
                                        <Label className="text-zinc-400">Combustível</Label>
                                        <select value={form.veiculoCombustivel} onChange={(e) => update("veiculoCombustivel", e.target.value)} className="flex h-9 w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-1 text-sm text-white mt-1">
                                            <option value="">Selecionar...</option>
                                            {COMBUSTIVEIS.map((c) => (
                                                <option key={c} value={c}>{c}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <Label className="text-zinc-400">Cor</Label>
                                        <Input value={form.veiculoCor} onChange={(e) => update("veiculoCor", e.target.value)} placeholder="Prata, Preto, Branco..." className="bg-zinc-900 border-zinc-700 text-white mt-1" />
                                    </div>
                                    <div>
                                        <Label className="text-zinc-400">Quilómetros</Label>
                                        <Input type="number" value={form.veiculoQuilometros} onChange={(e) => update("veiculoQuilometros", e.target.value)} placeholder="180000" className="bg-zinc-900 border-zinc-700 text-white mt-1" />
                                    </div>
                                    <div>
                                        <Label className="text-zinc-400">Estado do Veículo</Label>
                                        <select value={form.veiculoEstado} onChange={(e) => update("veiculoEstado", e.target.value)} className="flex h-9 w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-1 text-sm text-white mt-1">
                                            <option value="">Selecionar...</option>
                                            <option value="Funcional">Funcional</option>
                                            <option value="Parado">Parado</option>
                                            <option value="Acidentado">Acidentado</option>
                                            <option value="Sem motor">Sem motor</option>
                                        </select>
                                    </div>
                                </div>
                            </>
                        )}

                        {step === 3 && (
                            <>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label className="text-zinc-400">Cotação (€)</Label>
                                        <Input type="number" value={form.cotacao} onChange={(e) => update("cotacao", e.target.value)} placeholder="150" className="bg-zinc-900 border-zinc-700 text-white mt-1" />
                                    </div>
                                    <div>
                                        <Label className="text-zinc-400">Local de Recolha</Label>
                                        <Input value={form.localRecolha} onChange={(e) => update("localRecolha", e.target.value)} placeholder="Morada de recolha" className="bg-zinc-900 border-zinc-700 text-white mt-1" />
                                    </div>
                                    <div className="col-span-2">
                                        <Label className="text-zinc-400">Notas</Label>
                                        <Textarea value={form.notas} onChange={(e) => update("notas", e.target.value)} placeholder="Observações, detalhes do contacto..." className="bg-zinc-900 border-zinc-700 text-white mt-1 min-h-[100px]" />
                                    </div>
                                </div>
                            </>
                        )}
                    </CardContent>
                </Card>

                {/* Navigation */}
                <div className="flex justify-between">
                    <Button
                        variant="outline"
                        onClick={() => step > 0 ? setStep(step - 1) : router.back()}
                        className="border-zinc-700 text-zinc-300 hover:bg-zinc-800"
                    >
                        <ArrowLeft className="h-4 w-4 mr-1" />
                        {step > 0 ? "Anterior" : "Cancelar"}
                    </Button>

                    {step < STEPS.length - 1 ? (
                        <Button
                            onClick={() => setStep(step + 1)}
                            className="bg-lime-500 hover:bg-lime-600 text-black font-medium"
                        >
                            Seguinte
                            <ArrowRight className="h-4 w-4 ml-1" />
                        </Button>
                    ) : (
                        <Button
                            onClick={handleSubmit}
                            disabled={loading}
                            className="bg-lime-500 hover:bg-lime-600 text-black font-medium"
                        >
                            {loading ? "A criar..." : "Criar Processo"}
                            <Check className="h-4 w-4 ml-1" />
                        </Button>
                    )}
                </div>
            </div>
        </>
    );
}

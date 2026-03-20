"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import {
    Send,
    MessageCircle,
    Mail,
    Copy,
    Check,
    Euro,
    Edit3,
} from "lucide-react";

type CotacaoData = {
    processoNumero: string;
    clienteNome: string;
    clienteTelefone: string;
    clienteEmail?: string | null;
    veiculoMarca: string;
    veiculoModelo: string;
    veiculoMatricula: string;
    veiculoAno?: number | null;
    cotacao?: number | null;
};

export function EnviarCotacao({ data }: { data: CotacaoData }) {
    const [open, setOpen] = useState(false);
    const [valor, setValor] = useState(data.cotacao?.toString() || "");
    const [mensagemExtra, setMensagemExtra] = useState("");
    const [copied, setCopied] = useState(false);
    const [editMode, setEditMode] = useState(!data.cotacao);

    const valorNum = parseFloat(valor) || 0;

    const mensagem = gerarMensagem({
        clienteNome: data.clienteNome,
        veiculoMarca: data.veiculoMarca,
        veiculoModelo: data.veiculoModelo,
        veiculoMatricula: data.veiculoMatricula,
        veiculoAno: data.veiculoAno,
        valor: valorNum,
        mensagemExtra,
    });

    const telefoneClean = data.clienteTelefone.replace(/\s/g, "").replace(/^\+/, "");
    const telefoneIntl = telefoneClean.startsWith("351") ? telefoneClean : `351${telefoneClean}`;

    const whatsappUrl = `https://wa.me/${telefoneIntl}?text=${encodeURIComponent(mensagem)}`;
    const emailSubject = `Cotação Abate de Veículo - ${data.veiculoMatricula}`;
    const emailUrl = `mailto:${data.clienteEmail || ""}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(mensagem)}`;

    const handleCopy = () => {
        navigator.clipboard.writeText(mensagem);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="bg-lime-500 hover:bg-lime-600 text-black font-medium">
                    <Send className="h-4 w-4 mr-2" />
                    Enviar Cotação
                </Button>
            </DialogTrigger>
            <DialogContent className="bg-zinc-900 border-zinc-800 text-white max-w-lg">
                <DialogHeader>
                    <DialogTitle className="text-white flex items-center gap-2">
                        <Euro className="h-5 w-5 text-lime-400" />
                        Enviar Cotação ao Cliente
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-4">
                    {/* Info do veículo */}
                    <div className="rounded-lg bg-zinc-800/50 p-3 text-sm">
                        <div className="flex items-center justify-between">
                            <span className="text-zinc-400">Veículo:</span>
                            <span className="font-medium">{data.veiculoMarca} {data.veiculoModelo} {data.veiculoAno && `(${data.veiculoAno})`}</span>
                        </div>
                        <div className="flex items-center justify-between mt-1">
                            <span className="text-zinc-400">Matrícula:</span>
                            <span className="font-mono">{data.veiculoMatricula}</span>
                        </div>
                        <div className="flex items-center justify-between mt-1">
                            <span className="text-zinc-400">Cliente:</span>
                            <span>{data.clienteNome}</span>
                        </div>
                    </div>

                    {/* Valor da cotação */}
                    <div>
                        <Label className="text-zinc-400 text-xs uppercase tracking-wide">Valor da Cotação</Label>
                        <div className="flex items-center gap-2 mt-1">
                            {editMode ? (
                                <div className="relative flex-1">
                                    <Input
                                        type="number"
                                        value={valor}
                                        onChange={(e) => setValor(e.target.value)}
                                        placeholder="150"
                                        className="bg-zinc-800 border-zinc-700 text-white text-2xl font-bold pr-8 h-14"
                                        autoFocus
                                    />
                                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xl text-zinc-400">€</span>
                                </div>
                            ) : (
                                <div className="flex-1 flex items-center gap-2">
                                    <span className="text-3xl font-bold text-emerald-400">{valorNum}€</span>
                                    <button
                                        onClick={() => setEditMode(true)}
                                        className="text-zinc-500 hover:text-white transition-colors"
                                    >
                                        <Edit3 className="h-4 w-4" />
                                    </button>
                                </div>
                            )}
                            {editMode && (
                                <Button
                                    size="sm"
                                    variant="secondary"
                                    onClick={() => setEditMode(false)}
                                >
                                    <Check className="h-4 w-4" />
                                </Button>
                            )}
                        </div>
                    </div>

                    {/* Mensagem extra */}
                    <div>
                        <Label className="text-zinc-400 text-xs uppercase tracking-wide">Mensagem adicional (opcional)</Label>
                        <Textarea
                            value={mensagemExtra}
                            onChange={(e) => setMensagemExtra(e.target.value)}
                            placeholder="Ex: Recolha gratuita incluída, veículo tem peças aproveitáveis..."
                            className="bg-zinc-800 border-zinc-700 text-white mt-1 min-h-[60px] text-sm"
                        />
                    </div>

                    <Separator className="bg-zinc-800" />

                    {/* Preview da mensagem */}
                    <div>
                        <div className="flex items-center justify-between mb-1">
                            <Label className="text-zinc-400 text-xs uppercase tracking-wide">Pré-visualização</Label>
                            <button
                                onClick={handleCopy}
                                className="flex items-center gap-1 text-xs text-zinc-500 hover:text-white transition-colors"
                            >
                                {copied ? <Check className="h-3 w-3 text-lime-400" /> : <Copy className="h-3 w-3" />}
                                {copied ? "Copiado!" : "Copiar"}
                            </button>
                        </div>
                        <div className="rounded-lg bg-zinc-950 p-3 text-sm text-zinc-300 whitespace-pre-wrap max-h-[200px] overflow-y-auto border border-zinc-800">
                            {mensagem}
                        </div>
                    </div>

                    <Separator className="bg-zinc-800" />

                    {/* Botões de envio */}
                    <div className="grid grid-cols-2 gap-3">
                        <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                            <Button className="w-full bg-green-600 hover:bg-green-700 text-white font-medium h-12" disabled={!valor}>
                                <MessageCircle className="h-5 w-5 mr-2" />
                                WhatsApp
                            </Button>
                        </a>
                        <a href={emailUrl}>
                            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium h-12" disabled={!valor}>
                                <Mail className="h-5 w-5 mr-2" />
                                Email
                            </Button>
                        </a>
                    </div>

                    <p className="text-[11px] text-zinc-600 text-center">
                        WhatsApp abre numa nova janela · Email abre a tua app de email
                    </p>
                </div>
            </DialogContent>
        </Dialog>
    );
}

function gerarMensagem({
    clienteNome,
    veiculoMarca,
    veiculoModelo,
    veiculoMatricula,
    veiculoAno,
    valor,
    mensagemExtra,
}: {
    clienteNome: string;
    veiculoMarca: string;
    veiculoModelo: string;
    veiculoMatricula: string;
    veiculoAno?: number | null;
    valor: number;
    mensagemExtra: string;
}) {
    let msg = `Olá ${clienteNome.split(" ")[0]},

Obrigado pelo seu contacto! Aqui está a nossa cotação para o abate do seu veículo:

🚗 Veículo: ${veiculoMarca} ${veiculoModelo}${veiculoAno ? ` (${veiculoAno})` : ""}
🔢 Matrícula: ${veiculoMatricula}
💰 Valor da cotação: ${valor}€

✅ O nosso serviço inclui:
• Recolha gratuita do veículo
• Tratamento de toda a documentação
• Emissão do Certificado de Destruição
• Cancelamento automático da matrícula no IMT`;

    if (mensagemExtra) {
        msg += `\n\n📝 ${mensagemExtra}`;
    }

    msg += `\n\nSe aceitar, podemos agendar a recolha para a data que lhe for mais conveniente.

Para qualquer questão, não hesite em contactar-nos.

Cumprimentos,
SCM - Sucatas Casal do Marco
📞 934 435 836
🌐 abatedeveiculos.pt`;

    return msg;
}

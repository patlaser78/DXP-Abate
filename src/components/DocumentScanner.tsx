"use client";

import { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { parseDocumentoVeiculo, type DocumentoExtraido } from "@/lib/ocr-parser";
import {
    Camera,
    Upload,
    FileText,
    Loader2,
    CheckCircle,
    AlertTriangle,
    X,
    RotateCcw,
    Zap,
    Eye,
    Copy,
    Check,
} from "lucide-react";

type ScannerProps = {
    onFieldsExtracted?: (fields: DocumentoExtraido) => void;
};

type ScanState = "idle" | "loading" | "processing" | "done" | "error";

export function DocumentScanner({ onFieldsExtracted }: ScannerProps) {
    const [state, setState] = useState<ScanState>("idle");
    const [progress, setProgress] = useState(0);
    const [progressText, setProgressText] = useState("");
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [resultado, setResultado] = useState<DocumentoExtraido | null>(null);
    const [errorMsg, setErrorMsg] = useState("");
    const [showRawText, setShowRawText] = useState(false);
    const [copied, setCopied] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const cameraInputRef = useRef<HTMLInputElement>(null);

    const processImage = useCallback(async (file: File) => {
        setState("loading");
        setProgress(0);
        setProgressText("A preparar imagem...");

        // Create preview URL
        const url = URL.createObjectURL(file);
        setImageUrl(url);

        setState("processing");
        setProgressText("A carregar motor OCR...");
        setProgress(10);

        try {
            // Dynamic import to avoid SSR issues
            const Tesseract = await import("tesseract.js");

            setProgressText("A analisar documento...");
            setProgress(30);

            const result = await Tesseract.recognize(file, "por+eng", {
                logger: (m) => {
                    if (m.status === "recognizing text") {
                        const prog = Math.round(30 + (m.progress || 0) * 60);
                        setProgress(prog);
                        setProgressText(`A ler texto... ${Math.round((m.progress || 0) * 100)}%`);
                    }
                },
            });

            setProgress(95);
            setProgressText("A extrair campos...");

            const texto = result.data.text;
            const confianca = result.data.confidence;
            const extraido = parseDocumentoVeiculo(texto, confianca);

            setResultado(extraido);
            setProgress(100);
            setProgressText("Concluído!");
            setState("done");

            if (onFieldsExtracted) {
                onFieldsExtracted(extraido);
            }
        } catch (err) {
            console.error("OCR Error:", err);
            setErrorMsg("Erro ao processar a imagem. Tenta novamente com melhor iluminação.");
            setState("error");
        }
    }, [onFieldsExtracted]);

    const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) processImage(file);
    }, [processImage]);

    const reset = () => {
        setState("idle");
        setProgress(0);
        setProgressText("");
        setImageUrl(null);
        setResultado(null);
        setErrorMsg("");
        setShowRawText(false);
        if (fileInputRef.current) fileInputRef.current.value = "";
        if (cameraInputRef.current) cameraInputRef.current.value = "";
    };

    const handleCopyText = () => {
        if (resultado?.textoCompleto) {
            navigator.clipboard.writeText(resultado.textoCompleto);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    // Count extracted fields
    const camposExtraidos = resultado ? Object.entries(resultado)
        .filter(([key, val]) => key !== "textoCompleto" && key !== "confianca" && val)
        .length : 0;

    return (
        <Card className="bg-zinc-900/50 border-zinc-800">
            <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold text-white flex items-center gap-2">
                    <Zap className="h-4 w-4 text-amber-400" />
                    Scanner de Documentos (OCR)
                    <Badge variant="outline" className="text-[10px] text-amber-400 border-amber-400/30 ml-auto">
                        BETA
                    </Badge>
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Idle State - Upload/Camera buttons */}
                {state === "idle" && (
                    <div className="space-y-3">
                        <p className="text-sm text-zinc-400">
                            Tira uma foto ou faz upload do DUA / Livrete para preencher automaticamente os campos.
                        </p>
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <input
                                    ref={cameraInputRef}
                                    type="file"
                                    accept="image/*"
                                    capture="environment"
                                    onChange={handleFileSelect}
                                    className="hidden"
                                    id="camera-input"
                                />
                                <label htmlFor="camera-input">
                                    <Button
                                        asChild
                                        className="w-full h-24 bg-zinc-800/50 border border-zinc-700 border-dashed hover:bg-zinc-800 hover:border-lime-500/30 text-zinc-300 cursor-pointer"
                                        variant="ghost"
                                    >
                                        <div className="flex flex-col items-center gap-2">
                                            <Camera className="h-6 w-6 text-lime-400" />
                                            <span className="text-xs">Tirar Foto</span>
                                        </div>
                                    </Button>
                                </label>
                            </div>
                            <div>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*,.pdf"
                                    onChange={handleFileSelect}
                                    className="hidden"
                                    id="file-input"
                                />
                                <label htmlFor="file-input">
                                    <Button
                                        asChild
                                        className="w-full h-24 bg-zinc-800/50 border border-zinc-700 border-dashed hover:bg-zinc-800 hover:border-lime-500/30 text-zinc-300 cursor-pointer"
                                        variant="ghost"
                                    >
                                        <div className="flex flex-col items-center gap-2">
                                            <Upload className="h-6 w-6 text-blue-400" />
                                            <span className="text-xs">Upload Ficheiro</span>
                                        </div>
                                    </Button>
                                </label>
                            </div>
                        </div>
                        <p className="text-[11px] text-zinc-600 text-center">
                            Suporta JPG, PNG · Para melhores resultados, garante boa iluminação e imagem nítida
                        </p>
                    </div>
                )}

                {/* Processing State */}
                {(state === "loading" || state === "processing") && (
                    <div className="space-y-4 py-4">
                        {/* Preview image */}
                        {imageUrl && (
                            <div className="relative rounded-lg overflow-hidden max-h-48">
                                <img
                                    src={imageUrl}
                                    alt="Documento"
                                    className="w-full object-contain max-h-48 opacity-50"
                                />
                                <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                                    <Loader2 className="h-8 w-8 text-lime-400 animate-spin" />
                                </div>
                            </div>
                        )}

                        {/* Progress bar */}
                        <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-zinc-400">{progressText}</span>
                                <span className="text-lime-400 font-mono">{progress}%</span>
                            </div>
                            <div className="h-2 rounded-full bg-zinc-800 overflow-hidden">
                                <div
                                    className="h-full rounded-full bg-gradient-to-r from-lime-500 to-emerald-500 transition-all duration-500"
                                    style={{ width: `${progress}%` }}
                                />
                            </div>
                        </div>
                    </div>
                )}

                {/* Done State */}
                {state === "done" && resultado && (
                    <div className="space-y-4">
                        {/* Preview image small */}
                        {imageUrl && (
                            <div className="relative rounded-lg overflow-hidden max-h-32">
                                <img
                                    src={imageUrl}
                                    alt="Documento"
                                    className="w-full object-contain max-h-32"
                                />
                            </div>
                        )}

                        {/* Confidence indicator */}
                        <div className="flex items-center gap-2">
                            {resultado.confianca >= 60 ? (
                                <CheckCircle className="h-4 w-4 text-emerald-400" />
                            ) : (
                                <AlertTriangle className="h-4 w-4 text-amber-400" />
                            )}
                            <span className="text-sm text-zinc-300">
                                {resultado.confianca >= 80
                                    ? "Leitura de alta confiança"
                                    : resultado.confianca >= 60
                                        ? "Leitura de confiança média"
                                        : "Leitura de baixa confiança — verifica os campos"}
                            </span>
                            <Badge
                                className={`ml-auto text-xs ${resultado.confianca >= 80
                                        ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                                        : resultado.confianca >= 60
                                            ? "bg-amber-500/20 text-amber-400 border-amber-500/30"
                                            : "bg-red-500/20 text-red-400 border-red-500/30"
                                    }`}
                                variant="outline"
                            >
                                {resultado.confianca}%
                            </Badge>
                        </div>

                        <Separator className="bg-zinc-800" />

                        {/* Extracted fields */}
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label className="text-xs text-zinc-500 uppercase tracking-wide">
                                    Campos Extraídos ({camposExtraidos})
                                </Label>
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                                <ExtractedField label="Matrícula" value={resultado.matricula} highlight />
                                <ExtractedField label="Marca" value={resultado.marca} />
                                <ExtractedField label="Modelo" value={resultado.modelo} />
                                <ExtractedField label="Ano" value={resultado.ano?.toString()} />
                                <ExtractedField label="VIN / Quadro" value={resultado.vin} highlight />
                                <ExtractedField label="Combustível" value={resultado.combustivel} />
                                <ExtractedField label="Cor" value={resultado.cor} />
                                <ExtractedField label="NIF" value={resultado.nif} />
                                <ExtractedField label="Proprietário" value={resultado.nomeProprietario} className="col-span-2" />
                                <ExtractedField label="Morada" value={resultado.morada} className="col-span-2" />
                                {resultado.cilindrada && <ExtractedField label="Cilindrada" value={resultado.cilindrada} />}
                                {resultado.potencia && <ExtractedField label="Potência" value={resultado.potencia} />}
                                {resultado.dataMatricula && <ExtractedField label="Data Matrícula" value={resultado.dataMatricula} />}
                            </div>
                        </div>

                        <Separator className="bg-zinc-800" />

                        {/* Raw text toggle */}
                        <div>
                            <button
                                onClick={() => setShowRawText(!showRawText)}
                                className="flex items-center gap-2 text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
                            >
                                <Eye className="h-3 w-3" />
                                {showRawText ? "Esconder texto bruto" : "Ver texto bruto do OCR"}
                            </button>
                            {showRawText && (
                                <div className="mt-2 relative">
                                    <pre className="rounded-lg bg-zinc-950 p-3 text-[11px] text-zinc-400 whitespace-pre-wrap max-h-[200px] overflow-y-auto border border-zinc-800 font-mono">
                                        {resultado.textoCompleto}
                                    </pre>
                                    <button
                                        onClick={handleCopyText}
                                        className="absolute top-2 right-2 text-zinc-600 hover:text-zinc-300 transition-colors"
                                    >
                                        {copied ? <Check className="h-3.5 w-3.5 text-lime-400" /> : <Copy className="h-3.5 w-3.5" />}
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2">
                            <Button
                                onClick={reset}
                                variant="outline"
                                size="sm"
                                className="border-zinc-700 text-zinc-300 hover:bg-zinc-800"
                            >
                                <RotateCcw className="h-3.5 w-3.5 mr-1" />
                                Novo Scan
                            </Button>
                        </div>
                    </div>
                )}

                {/* Error State */}
                {state === "error" && (
                    <div className="space-y-3 py-4 text-center">
                        <AlertTriangle className="h-8 w-8 text-red-400 mx-auto" />
                        <p className="text-sm text-red-400">{errorMsg}</p>
                        <Button
                            onClick={reset}
                            variant="outline"
                            size="sm"
                            className="border-zinc-700 text-zinc-300"
                        >
                            <RotateCcw className="h-3.5 w-3.5 mr-1" />
                            Tentar Novamente
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

function ExtractedField({
    label,
    value,
    highlight,
    className,
}: {
    label: string;
    value?: string;
    highlight?: boolean;
    className?: string;
}) {
    if (!value) {
        return (
            <div className={`rounded-lg bg-zinc-800/30 p-2 opacity-40 ${className || ""}`}>
                <p className="text-[10px] text-zinc-600 uppercase tracking-wide">{label}</p>
                <p className="text-xs text-zinc-600 italic mt-0.5">Não encontrado</p>
            </div>
        );
    }

    return (
        <div className={`rounded-lg bg-zinc-800/50 p-2 ${highlight ? "border border-lime-500/20 bg-lime-500/5" : ""} ${className || ""}`}>
            <p className="text-[10px] text-zinc-500 uppercase tracking-wide">{label}</p>
            <p className={`text-sm font-medium mt-0.5 ${highlight ? "text-lime-400 font-mono" : "text-white"}`}>
                {value}
            </p>
        </div>
    );
}

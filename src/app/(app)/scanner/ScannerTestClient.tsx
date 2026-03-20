"use client";

import { useState } from "react";
import { DocumentScanner } from "@/components/DocumentScanner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { DocumentoExtraido } from "@/lib/ocr-parser";
import { FileText, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function ScannerTestClient() {
    const [resultado, setResultado] = useState<DocumentoExtraido | null>(null);

    return (
        <div className="space-y-6">
            <div className="rounded-xl bg-gradient-to-r from-amber-500/10 to-lime-500/10 border border-amber-500/20 p-4">
                <div className="flex items-start gap-3">
                    <FileText className="h-5 w-5 text-amber-400 mt-0.5" />
                    <div>
                        <h3 className="text-sm font-semibold text-white">Testar Scanner OCR</h3>
                        <p className="text-xs text-zinc-400 mt-1">
                            Faz upload de uma foto do DUA, Livrete, ou outro documento de veículo.
                            O scanner vai tentar extrair automaticamente os campos como matrícula, marca, modelo, VIN, etc.
                        </p>
                        <div className="flex gap-2 mt-2">
                            <Badge variant="outline" className="text-[10px] text-zinc-400 border-zinc-700">
                                📸 Foto com câmara
                            </Badge>
                            <Badge variant="outline" className="text-[10px] text-zinc-400 border-zinc-700">
                                📁 Upload de ficheiro
                            </Badge>
                            <Badge variant="outline" className="text-[10px] text-zinc-400 border-zinc-700">
                                🇵🇹 Português
                            </Badge>
                        </div>
                    </div>
                </div>
            </div>

            <DocumentScanner onFieldsExtracted={setResultado} />

            {resultado && (
                <Card className="bg-zinc-900/50 border-zinc-800">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-base font-semibold text-white flex items-center gap-2">
                            <ArrowRight className="h-4 w-4 text-lime-400" />
                            Próximo Passo
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-zinc-400 mb-3">
                            Os campos extraídos podem ser usados para criar um novo processo automaticamente.
                        </p>
                        <Link href="/processos/novo">
                            <Button className="bg-lime-500 hover:bg-lime-600 text-black font-medium">
                                Criar Processo com Dados Extraídos
                                <ArrowRight className="h-4 w-4 ml-2" />
                            </Button>
                        </Link>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}

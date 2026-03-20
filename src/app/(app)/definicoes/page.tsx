import { Header } from "@/components/layout/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { prisma } from "@/lib/prisma";
import { ROLES } from "@/lib/constants";
import { Settings, Users, Shield } from "lucide-react";

export default async function DefinicoesPage() {
    const users = await prisma.user.findMany({
        orderBy: { role: "asc" },
    });

    return (
        <>
            <Header title="Definições" />
            <div className="p-6 space-y-6 max-w-4xl">
                {/* Empresa */}
                <Card className="bg-zinc-900/50 border-zinc-800">
                    <CardHeader>
                        <CardTitle className="text-base font-semibold text-white flex items-center gap-2">
                            <Settings className="h-4 w-4 text-lime-400" />
                            Empresa
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-xs text-zinc-500 uppercase tracking-wide">Nome</p>
                                <p className="text-sm text-white mt-1">SCM - Sucatas Casal do Marco</p>
                            </div>
                            <div>
                                <p className="text-xs text-zinc-500 uppercase tracking-wide">Licenciamento</p>
                                <p className="text-sm text-white mt-1">Centro Autorizado Valorcar</p>
                            </div>
                            <div>
                                <p className="text-xs text-zinc-500 uppercase tracking-wide">Telefone</p>
                                <p className="text-sm text-white mt-1">+351 934 435 836</p>
                            </div>
                            <div>
                                <p className="text-xs text-zinc-500 uppercase tracking-wide">Email</p>
                                <p className="text-sm text-white mt-1">scm.vfv@outlook.pt</p>
                            </div>
                            <div className="col-span-2">
                                <p className="text-xs text-zinc-500 uppercase tracking-wide">Morada</p>
                                <p className="text-sm text-white mt-1">Rua Leite Faria 12, Vale Fetal, 2820-476 Charneca da Caparica</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Utilizadores */}
                <Card className="bg-zinc-900/50 border-zinc-800">
                    <CardHeader>
                        <CardTitle className="text-base font-semibold text-white flex items-center gap-2">
                            <Users className="h-4 w-4 text-lime-400" />
                            Utilizadores
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {users.map((user) => {
                                const roleConfig = ROLES[user.role as keyof typeof ROLES];
                                return (
                                    <div
                                        key={user.id}
                                        className="flex items-center gap-4 rounded-lg bg-zinc-800/30 p-3"
                                    >
                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-lime-500/20 text-sm font-bold text-lime-400">
                                            {user.name.split(" ").map((n) => n[0]).join("").substring(0, 2)}
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-white">{user.name}</p>
                                            <p className="text-xs text-zinc-500">{user.email}</p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Shield className="h-3.5 w-3.5 text-zinc-500" />
                                            <Badge variant="outline" className="text-xs">
                                                {roleConfig?.label || user.role}
                                            </Badge>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

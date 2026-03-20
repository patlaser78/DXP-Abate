"use client";

import { Bell, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function Header({ title }: { title: string }) {
    return (
        <header className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-sm px-6">
            <h2 className="text-lg font-semibold text-white">{title}</h2>

            <div className="ml-auto flex items-center gap-3">
                {/* Search */}
                <div className="relative hidden md:block">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                    <Input
                        placeholder="Pesquisar processos..."
                        className="w-64 pl-9 bg-zinc-900 border-zinc-700 text-sm text-white placeholder:text-zinc-500 focus:border-lime-500 focus:ring-lime-500/20"
                    />
                </div>

                {/* Notifications */}
                <Button variant="ghost" size="icon" className="relative text-zinc-400 hover:text-white">
                    <Bell className="h-4.5 w-4.5" />
                    <Badge className="absolute -top-0.5 -right-0.5 h-4 w-4 p-0 flex items-center justify-center text-[10px] bg-lime-500 text-black border-none">
                        3
                    </Badge>
                </Button>
            </div>
        </header>
    );
}

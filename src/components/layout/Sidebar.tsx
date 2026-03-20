"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    Kanban,
    CalendarDays,
    Settings,
    Recycle,
    LogOut,
    ScanLine,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Processos", href: "/processos", icon: Kanban },
    { name: "Scanner", href: "/scanner", icon: ScanLine },
    { name: "Agenda", href: "/agenda", icon: CalendarDays },
    { name: "Definições", href: "/definicoes", icon: Settings },
];

export function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className="fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-zinc-950 border-r border-zinc-800">
            {/* Logo */}
            <div className="flex h-16 items-center gap-3 px-6 border-b border-zinc-800">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-lime-500/20">
                    <Recycle className="h-5 w-5 text-lime-400" />
                </div>
                <div>
                    <h1 className="text-sm font-bold text-white tracking-tight">SCM Abate</h1>
                    <p className="text-[10px] text-zinc-500 uppercase tracking-widest">Gestão CRM</p>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 space-y-1 px-3 py-4">
                {navigation.map((item) => {
                    const isActive = pathname.startsWith(item.href);
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                                isActive
                                    ? "bg-lime-500/15 text-lime-400 shadow-sm shadow-lime-500/5"
                                    : "text-zinc-400 hover:text-white hover:bg-zinc-800/50"
                            )}
                        >
                            <item.icon className={cn("h-4.5 w-4.5", isActive ? "text-lime-400" : "")} />
                            {item.name}
                            {isActive && (
                                <div className="ml-auto h-1.5 w-1.5 rounded-full bg-lime-400" />
                            )}
                        </Link>
                    );
                })}
            </nav>

            {/* User section */}
            <div className="border-t border-zinc-800 p-4">
                <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-lime-500/20 text-sm font-bold text-lime-400">
                        CS
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white truncate">Carlos Silva</p>
                        <p className="text-xs text-zinc-500">Administrador</p>
                    </div>
                    <button className="text-zinc-500 hover:text-white transition-colors">
                        <LogOut className="h-4 w-4" />
                    </button>
                </div>
            </div>
        </aside>
    );
}

import { ESTADOS_PROCESSO, type EstadoProcesso } from "@/lib/constants";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export function StatusBadge({ estado }: { estado: string }) {
    const config = ESTADOS_PROCESSO[estado as EstadoProcesso];
    if (!config) return <Badge variant="outline">{estado}</Badge>;

    return (
        <Badge
            className={cn(
                "text-xs font-medium border-none shadow-sm",
                config.color,
                "text-white"
            )}
        >
            <span className="mr-1">{config.icon}</span>
            {config.label}
        </Badge>
    );
}

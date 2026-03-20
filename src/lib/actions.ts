"use server";
import { prisma } from "@/lib/prisma";

export async function getProcessos() {
    return prisma.processo.findMany({
        include: { cliente: true, veiculo: true, responsavel: true },
        orderBy: { createdAt: "desc" },
    });
}

export async function getProcessoById(id: string) {
    return prisma.processo.findUnique({
        where: { id },
        include: { cliente: true, veiculo: true, responsavel: true, documentos: true },
    });
}

export async function getDashboardStats() {
    const processes = await prisma.processo.findMany({
        select: { estado: true }
    });

    const counts = processes.reduce((acc, p) => {
        acc[p.estado] = (acc[p.estado] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    const total = processes.length;
    const processosAtivos = processes.filter(p => p.estado !== "CONCLUIDO").length;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const recolhasHoje = await prisma.processo.findMany({
        where: {
            estado: "AGENDADO",
            dataAgendamento: { gte: today, lt: tomorrow },
        },
        include: { cliente: true, veiculo: true },
    });

    const recentes = await prisma.processo.findMany({
        take: 5,
        orderBy: { updatedAt: "desc" },
        include: { cliente: true, veiculo: true },
    });

    return {
        total,
        processosAtivos,
        counts,
        recolhasHoje,
        recentes,
        certificados: counts["CERTIFICADO"] || 0,
        concluidos: counts["CONCLUIDO"] || 0
    };
}

export async function updateProcessoEstado(id: string, estado: string) {
    return prisma.processo.update({
        where: { id },
        data: { estado },
    });
}

export async function agendarRecolha(id: string, data: {
    dataAgendamento: string;
    horaAgendamento: string;
    localRecolha?: string;
}) {
    return prisma.processo.update({
        where: { id },
        data: {
            estado: "AGENDADO",
            dataAgendamento: new Date(data.dataAgendamento),
            horaAgendamento: data.horaAgendamento,
            localRecolha: data.localRecolha || undefined,
        },
    });
}

export async function createProcesso(data: {
    clienteNome: string;
    clienteNif: string;
    clienteTelefone: string;
    clienteEmail?: string;
    clienteMorada?: string;
    clienteCc?: string;
    veiculoMatricula: string;
    veiculoMarca: string;
    veiculoModelo: string;
    veiculoAno?: number;
    veiculoVin?: string;
    veiculoCombustivel?: string;
    veiculoCor?: string;
    veiculoQuilometros?: number;
    veiculoEstado?: string;
    cotacao?: number;
    localRecolha?: string;
    notas?: string;
}) {
    // Generate next process number
    const lastProcesso = await prisma.processo.findFirst({
        orderBy: { numero: "desc" },
    });
    const nextNum = lastProcesso
        ? parseInt(lastProcesso.numero.split("-")[2]) + 1
        : 1;
    const numero = `VFV-2026-${String(nextNum).padStart(3, "0")}`;

    // Create or find client
    let cliente = await prisma.cliente.findUnique({
        where: { nif: data.clienteNif },
    });
    if (!cliente) {
        cliente = await prisma.cliente.create({
            data: {
                nome: data.clienteNome,
                nif: data.clienteNif,
                cc: data.clienteCc,
                telefone: data.clienteTelefone,
                email: data.clienteEmail,
                morada: data.clienteMorada,
            },
        });
    }

    // Create vehicle
    const veiculo = await prisma.veiculo.create({
        data: {
            matricula: data.veiculoMatricula,
            marca: data.veiculoMarca,
            modelo: data.veiculoModelo,
            ano: data.veiculoAno,
            vin: data.veiculoVin,
            combustivel: data.veiculoCombustivel,
            cor: data.veiculoCor,
            quilometros: data.veiculoQuilometros,
            estado: data.veiculoEstado,
        },
    });

    // Create process
    return prisma.processo.create({
        data: {
            numero,
            estado: "LEAD",
            cotacao: data.cotacao,
            localRecolha: data.localRecolha,
            notas: data.notas,
            clienteId: cliente.id,
            veiculoId: veiculo.id,
        },
        include: { cliente: true, veiculo: true },
    });
}

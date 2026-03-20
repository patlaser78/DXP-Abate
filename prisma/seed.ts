import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
    console.log("🌱 A criar dados de demonstração...");

    // Limpar dados existentes
    await prisma.documento.deleteMany();
    await prisma.processo.deleteMany();
    await prisma.veiculo.deleteMany();
    await prisma.cliente.deleteMany();
    await prisma.user.deleteMany();

    // Criar utilizadores
    const hashedPassword = await bcrypt.hash("admin123", 10);

    const admin = await prisma.user.create({
        data: {
            name: "Carlos Silva",
            email: "admin@scm.pt",
            password: hashedPassword,
            role: "ADMIN",
        },
    });

    const operador = await prisma.user.create({
        data: {
            name: "Miguel Silva",
            email: "miguel@scm.pt",
            password: hashedPassword,
            role: "OPERATOR",
        },
    });

    const secretaria = await prisma.user.create({
        data: {
            name: "Ana Santos",
            email: "ana@scm.pt",
            password: hashedPassword,
            role: "SECRETARY",
        },
    });

    // Criar clientes
    const clientes = await Promise.all([
        prisma.cliente.create({
            data: { nome: "João Mendes", nif: "123456789", cc: "12345678", telefone: "912345678", email: "joao@email.pt", morada: "Rua das Flores 12, Almada" },
        }),
        prisma.cliente.create({
            data: { nome: "Maria Ferreira", nif: "987654321", cc: "87654321", telefone: "934567890", email: "maria@email.pt", morada: "Av. Brasil 45, Seixal" },
        }),
        prisma.cliente.create({
            data: { nome: "António Costa", nif: "456789123", cc: "45678912", telefone: "961234567", email: "antonio@email.pt", morada: "Rua do Sol 78, Setúbal" },
        }),
        prisma.cliente.create({
            data: { nome: "Sofia Rodrigues", nif: "321654987", telefone: "918765432", morada: "Travessa da Paz 3, Barreiro" },
        }),
        prisma.cliente.create({
            data: { nome: "Pedro Almeida", nif: "654321987", cc: "65432198", telefone: "926543210", email: "pedro@email.pt", morada: "Rua Nova 56, Charneca da Caparica" },
        }),
        prisma.cliente.create({
            data: { nome: "Carla Martins", nif: "789456123", telefone: "937891234", email: "carla@email.pt", morada: "Rua da Esperança 90, Sesimbra" },
        }),
        prisma.cliente.create({
            data: { nome: "Rui Fernandes", nif: "147258369", cc: "14725836", telefone: "965432178", morada: "Praça do Mar 15, Costa da Caparica" },
        }),
        prisma.cliente.create({
            data: { nome: "Luísa Santos", nif: "258369147", telefone: "912876543", email: "luisa@email.pt", morada: "Rua dos Pinheiros 33, Almada" },
        }),
    ]);

    // Criar veículos
    const veiculos = await Promise.all([
        prisma.veiculo.create({ data: { matricula: "AA-00-AA", marca: "Renault", modelo: "Clio", ano: 2008, vin: "VF1BB0F0234567890", combustivel: "Gasolina", cor: "Prata", quilometros: 210000, estado: "Parado" } }),
        prisma.veiculo.create({ data: { matricula: "BB-11-CC", marca: "Peugeot", modelo: "206", ano: 2005, vin: "VF33A5FXZ12345678", combustivel: "Gasóleo", cor: "Azul", quilometros: 340000, estado: "Acidentado" } }),
        prisma.veiculo.create({ data: { matricula: "CC-22-DD", marca: "Volkswagen", modelo: "Golf IV", ano: 2003, vin: "WVWZZZ1KZ12345678", combustivel: "Gasóleo", cor: "Preto", quilometros: 280000, estado: "Parado" } }),
        prisma.veiculo.create({ data: { matricula: "DD-33-EE", marca: "Ford", modelo: "Fiesta", ano: 2010, vin: "WF0XXXGCDX12345678", combustivel: "Gasolina", cor: "Branco", quilometros: 185000, estado: "Funcional" } }),
        prisma.veiculo.create({ data: { matricula: "EE-44-FF", marca: "Opel", modelo: "Corsa", ano: 2006, vin: "W0L000000Y2345678", combustivel: "Gasolina", cor: "Vermelho", quilometros: 195000, estado: "Parado" } }),
        prisma.veiculo.create({ data: { matricula: "FF-55-GG", marca: "Citroën", modelo: "C3", ano: 2012, vin: "VF7SXHMZ012345678", combustivel: "Gasóleo", cor: "Cinza", quilometros: 150000, estado: "Acidentado" } }),
        prisma.veiculo.create({ data: { matricula: "GG-66-HH", marca: "Seat", modelo: "Ibiza", ano: 2007, vin: "VSSZZZ6KZ12345678", combustivel: "Gasolina", cor: "Verde", quilometros: 225000, estado: "Parado" } }),
        prisma.veiculo.create({ data: { matricula: "HH-77-II", marca: "Toyota", modelo: "Yaris", ano: 2009, vin: "JTDKW9230A1234567", combustivel: "Gasolina", cor: "Azul", quilometros: 175000, estado: "Funcional" } }),
        prisma.veiculo.create({ data: { matricula: "11-AA-22", marca: "BMW", modelo: "320d", ano: 2004, vin: "WBAAP71000B123456", combustivel: "Gasóleo", cor: "Preto", quilometros: 310000, estado: "Acidentado" } }),
        prisma.veiculo.create({ data: { matricula: "33-BB-44", marca: "Mercedes-Benz", modelo: "C220", ano: 2006, vin: "WDB2030081A123456", combustivel: "Gasóleo", cor: "Prata", quilometros: 290000, estado: "Parado" } }),
    ]);

    // Criar processos em vários estados
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 5);

    await Promise.all([
        prisma.processo.create({
            data: { numero: "VFV-2026-001", estado: "CONCLUIDO", cotacao: 150, localRecolha: "Rua das Flores 12, Almada", notas: "Processo concluído sem problemas.", clienteId: clientes[0].id, veiculoId: veiculos[0].id, userId: operador.id },
        }),
        prisma.processo.create({
            data: { numero: "VFV-2026-002", estado: "CERTIFICADO", cotacao: 200, localRecolha: "Av. Brasil 45, Seixal", notas: "Certificado de destruição emitido. A aguardar confirmação IMT.", clienteId: clientes[1].id, veiculoId: veiculos[1].id, userId: operador.id },
        }),
        prisma.processo.create({
            data: { numero: "VFV-2026-003", estado: "VALORCAR", cotacao: 100, localRecolha: "Rua do Sol 78, Setúbal", notas: "Dados submetidos na plataforma Valorcar.", clienteId: clientes[2].id, veiculoId: veiculos[2].id, userId: admin.id },
        }),
        prisma.processo.create({
            data: { numero: "VFV-2026-004", estado: "MODELO9", cotacao: 175, localRecolha: "Travessa da Paz 3, Barreiro", notas: "Modelo 9 preenchido, a aguardar submissão.", clienteId: clientes[3].id, veiculoId: veiculos[3].id, userId: operador.id },
        }),
        prisma.processo.create({
            data: { numero: "VFV-2026-005", estado: "RECOLHIDO", cotacao: 250, localRecolha: "Rua Nova 56, Charneca da Caparica", notas: "Veículo recolhido. BMW em bom estado, peças aproveitáveis.", clienteId: clientes[4].id, veiculoId: veiculos[8].id, userId: operador.id },
        }),
        prisma.processo.create({
            data: { numero: "VFV-2026-006", estado: "AGENDADO", cotacao: 120, dataAgendamento: tomorrow, horaAgendamento: "10:00", localRecolha: "Rua da Esperança 90, Sesimbra", notas: "Recolha agendada para amanhã de manhã.", clienteId: clientes[5].id, veiculoId: veiculos[5].id, userId: operador.id },
        }),
        prisma.processo.create({
            data: { numero: "VFV-2026-007", estado: "AGENDADO", cotacao: 80, dataAgendamento: nextWeek, horaAgendamento: "14:30", localRecolha: "Praça do Mar 15, Costa da Caparica", clienteId: clientes[6].id, veiculoId: veiculos[6].id, userId: operador.id },
        }),
        prisma.processo.create({
            data: { numero: "VFV-2026-008", estado: "COTACAO", cotacao: 130, localRecolha: "Rua dos Pinheiros 33, Almada", notas: "Cliente aguarda resposta sobre cotação.", clienteId: clientes[7].id, veiculoId: veiculos[7].id, userId: secretaria.id },
        }),
        prisma.processo.create({
            data: { numero: "VFV-2026-009", estado: "LEAD", localRecolha: "Almada (zona centro)", notas: "Contacto recebido via WhatsApp.", clienteId: clientes[4].id, veiculoId: veiculos[4].id, userId: secretaria.id },
        }),
        prisma.processo.create({
            data: { numero: "VFV-2026-010", estado: "LEAD", localRecolha: "Seixal", notas: "Cliente ligou a pedir informações.", clienteId: clientes[1].id, veiculoId: veiculos[9].id, userId: secretaria.id },
        }),
    ]);

    console.log("✅ Dados de demonstração criados com sucesso!");
    console.log("");
    console.log("👤 Utilizadores criados (password: admin123):");
    console.log("   Admin:      admin@scm.pt");
    console.log("   Operador:   miguel@scm.pt");
    console.log("   Secretária: ana@scm.pt");
}

main()
    .then(async () => { await prisma.$disconnect(); })
    .catch(async (e) => { console.error(e); await prisma.$disconnect(); process.exit(1); });

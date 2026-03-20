/**
 * Parser de documentos de veículos portugueses
 * Extrai campos como matrícula, marca, modelo, VIN, etc.
 * a partir do texto bruto do OCR
 */

export type DocumentoExtraido = {
    matricula?: string;
    marca?: string;
    modelo?: string;
    vin?: string;
    ano?: number;
    combustivel?: string;
    cor?: string;
    cilindrada?: string;
    potencia?: string;
    peso?: string;
    nomeProprietario?: string;
    nif?: string;
    morada?: string;
    dataMatricula?: string;
    categoria?: string;
    tipo?: string;
    textoCompleto: string;
    confianca: number; // 0-100
};

// Padrões de matrícula portuguesa
const MATRICULA_PATTERNS = [
    /\b([A-Z]{2})-?(\d{2})-?([A-Z]{2})\b/g,       // AA-00-BB (novo formato)
    /\b(\d{2})-?([A-Z]{2})-?(\d{2})\b/g,            // 00-AA-00 (formato médio)
    /\b([A-Z]{2})-?(\d{2})-?(\d{2})\b/g,            // AA-00-00 (formato antigo)
    /\b(\d{2})-?(\d{2})-?([A-Z]{2})\b/g,            // 00-00-AA (formato antigo)
];

// VIN: 17 caracteres alfanuméricos (sem I, O, Q)
const VIN_PATTERN = /\b[A-HJ-NPR-Z0-9]{17}\b/g;

// NIF: 9 dígitos
const NIF_PATTERN = /\b(\d{9})\b/g;

// Data: DD/MM/YYYY ou DD-MM-YYYY
const DATA_PATTERN = /\b(\d{1,2})[\/\-.](\d{1,2})[\/\-.](\d{4})\b/g;

// Ano: 4 dígitos entre 1950 e 2030
const ANO_PATTERN = /\b(19[5-9]\d|20[0-3]\d)\b/g;

// Marcas de veículos conhecidas
const MARCAS_CONHECIDAS = [
    "RENAULT", "PEUGEOT", "CITROEN", "CITROËN", "VOLKSWAGEN", "VW", "FORD",
    "OPEL", "SEAT", "TOYOTA", "MERCEDES", "MERCEDES-BENZ", "BMW", "AUDI",
    "FIAT", "NISSAN", "HONDA", "HYUNDAI", "KIA", "VOLVO", "MITSUBISHI",
    "MAZDA", "SUZUKI", "DACIA", "SKODA", "ŠKODA", "CHEVROLET", "SMART",
    "MINI", "JEEP", "LAND ROVER", "JAGUAR", "ALFA ROMEO", "PORSCHE",
    "TESLA", "MG", "CUPRA", "DS", "LANCIA", "ROVER", "SAAB",
];

// Combustíveis
const COMBUSTIVEIS_MAP: Record<string, string> = {
    "GASOLINA": "Gasolina",
    "GASOL": "Gasolina",
    "GASOLEO": "Gasóleo",
    "GASÓLEO": "Gasóleo",
    "DIESEL": "Gasóleo",
    "GPL": "GPL",
    "GAS": "GPL",
    "ELETRICO": "Elétrico",
    "ELÉTRICO": "Elétrico",
    "ELECTRICO": "Elétrico",
    "ELECTRIC": "Elétrico",
    "HIBRIDO": "Híbrido",
    "HÍBRIDO": "Híbrido",
    "HYBRID": "Híbrido",
    "PLUG-IN": "Híbrido Plug-in",
};

// Cores comuns
const CORES_MAP: Record<string, string> = {
    "PRETO": "Preto", "PRETA": "Preto", "BLACK": "Preto",
    "BRANCO": "Branco", "BRANCA": "Branco", "WHITE": "Branco",
    "CINZENTO": "Cinzento", "CINZA": "Cinzento", "GREY": "Cinzento", "GRAY": "Cinzento",
    "PRATA": "Prata", "SILVER": "Prata", "PRATEADO": "Prata",
    "AZUL": "Azul", "BLUE": "Azul",
    "VERMELHO": "Vermelho", "VERMELHA": "Vermelho", "RED": "Vermelho",
    "VERDE": "Verde", "GREEN": "Verde",
    "AMARELO": "Amarelo", "YELLOW": "Amarelo",
    "BEGE": "Bege", "BEIGE": "Bege",
    "CASTANHO": "Castanho", "BROWN": "Castanho",
    "BORDEAUX": "Bordeaux", "BORDÔ": "Bordeaux",
    "LARANJA": "Laranja", "ORANGE": "Laranja",
};

export function parseDocumentoVeiculo(texto: string, confianca: number): DocumentoExtraido {
    const textoUpper = texto.toUpperCase();
    const linhas = texto.split("\n").map((l) => l.trim()).filter(Boolean);

    const resultado: DocumentoExtraido = {
        textoCompleto: texto,
        confianca: Math.round(confianca),
    };

    // 1. Extrair matrícula
    for (const pattern of MATRICULA_PATTERNS) {
        pattern.lastIndex = 0;
        const matches = [...textoUpper.matchAll(pattern)];
        if (matches.length > 0) {
            const match = matches[0];
            const groups = match.slice(1);
            resultado.matricula = groups.join("-");
            break;
        }
    }

    // 2. Extrair VIN
    VIN_PATTERN.lastIndex = 0;
    const vinMatches = [...textoUpper.matchAll(VIN_PATTERN)];
    if (vinMatches.length > 0) {
        resultado.vin = vinMatches[0][0];
    }

    // 3. Extrair marca
    for (const marca of MARCAS_CONHECIDAS) {
        if (textoUpper.includes(marca)) {
            resultado.marca = marca === "VW" ? "Volkswagen"
                : marca === "CITROËN" || marca === "CITROEN" ? "Citroën"
                    : marca === "MERCEDES-BENZ" || marca === "MERCEDES" ? "Mercedes-Benz"
                        : marca === "ŠKODA" || marca === "SKODA" ? "Škoda"
                            : marca.charAt(0) + marca.slice(1).toLowerCase();
            break;
        }
    }

    // 4. Extrair modelo (texto depois da marca na mesma linha)
    if (resultado.marca) {
        const marcaUpper = resultado.marca.toUpperCase();
        for (const linha of linhas) {
            const linhaUpper = linha.toUpperCase();
            const idx = linhaUpper.indexOf(marcaUpper);
            if (idx !== -1) {
                const resto = linha.substring(idx + marcaUpper.length).trim();
                if (resto.length > 1 && resto.length < 30) {
                    resultado.modelo = resto.replace(/^[\s\-:]+/, "").trim();
                    break;
                }
            }
        }
        // Try finding model on adjacent line
        if (!resultado.modelo) {
            for (let i = 0; i < linhas.length; i++) {
                if (linhas[i].toUpperCase().includes(marcaUpper) && i + 1 < linhas.length) {
                    const nextLine = linhas[i + 1].trim();
                    if (nextLine.length > 1 && nextLine.length < 25 && !/^\d+$/.test(nextLine)) {
                        resultado.modelo = nextLine;
                        break;
                    }
                }
            }
        }
    }

    // 5. Extrair combustível
    for (const [key, value] of Object.entries(COMBUSTIVEIS_MAP)) {
        if (textoUpper.includes(key)) {
            resultado.combustivel = value;
            break;
        }
    }

    // 6. Extrair cor
    for (const [key, value] of Object.entries(CORES_MAP)) {
        // Look for color near "COR" label
        const corIdx = textoUpper.indexOf("COR");
        if (corIdx !== -1) {
            const proximoTexto = textoUpper.substring(corIdx, corIdx + 40);
            if (proximoTexto.includes(key)) {
                resultado.cor = value;
                break;
            }
        }
        // Also check in context of color keywords
        if (textoUpper.includes(key)) {
            resultado.cor = value;
        }
    }

    // 7. Extrair NIF
    NIF_PATTERN.lastIndex = 0;
    const nifMatches = [...textoUpper.matchAll(NIF_PATTERN)];
    for (const match of nifMatches) {
        const nif = match[1];
        // Basic NIF validation: starts with 1,2,3,5,6,8,9
        if (/^[123568]/.test(nif)) {
            resultado.nif = nif;
            break;
        }
    }

    // 8. Extrair ano (de matrícula ou fabricação)
    ANO_PATTERN.lastIndex = 0;
    const anoMatches = [...textoUpper.matchAll(ANO_PATTERN)];
    if (anoMatches.length > 0) {
        // Pick the most likely year (from dates or standalone)
        const anos = anoMatches.map((m) => parseInt(m[1]));
        resultado.ano = anos.find((a) => a >= 1990 && a <= 2026) || anos[0];
    }

    // 9. Extrair data de matrícula
    DATA_PATTERN.lastIndex = 0;
    const dataMatches = [...texto.matchAll(DATA_PATTERN)];
    if (dataMatches.length > 0) {
        resultado.dataMatricula = dataMatches[0][0];
    }

    // 10. Extrair nome do proprietário (procura perto de "NOME", "PROPRIETÁRIO", "TITULAR")
    for (const label of ["PROPRIETARIO", "PROPRIETÁRIO", "TITULAR", "NOME"]) {
        const idx = textoUpper.indexOf(label);
        if (idx !== -1) {
            // Look on same line after label, or next line
            const afterLabel = texto.substring(idx + label.length).trim();
            const firstLine = afterLabel.split("\n")[0].replace(/^[\s:]+/, "").trim();
            if (firstLine.length > 3 && firstLine.length < 60 && /[A-Za-zÀ-ÿ]/.test(firstLine)) {
                resultado.nomeProprietario = firstLine;
                break;
            }
        }
    }

    // 11. Extrair morada (procura perto de "MORADA", "RESIDÊNCIA", "DOMICÍLIO")
    for (const label of ["MORADA", "RESIDENCIA", "RESIDÊNCIA", "DOMICILIO", "DOMICÍLIO"]) {
        const idx = textoUpper.indexOf(label);
        if (idx !== -1) {
            const afterLabel = texto.substring(idx + label.length).trim();
            const lines = afterLabel.split("\n").slice(0, 2);
            const morada = lines.map((l) => l.replace(/^[\s:]+/, "").trim()).filter(Boolean).join(", ");
            if (morada.length > 5) {
                resultado.morada = morada;
                break;
            }
        }
    }

    // 12. Extrair cilindrada (perto de "CILINDRADA" ou "CM3" ou "CC")
    const cilMatch = textoUpper.match(/(?:CILINDRADA|CM3|CM³)[:\s]*(\d{3,4})/);
    if (cilMatch) {
        resultado.cilindrada = cilMatch[1] + " cm³";
    }

    // 13. Extrair potência
    const potMatch = textoUpper.match(/(?:POTENCIA|POTÊNCIA|KW)[:\s]*(\d{2,3})/);
    if (potMatch) {
        resultado.potencia = potMatch[1] + " kW";
    }

    return resultado;
}

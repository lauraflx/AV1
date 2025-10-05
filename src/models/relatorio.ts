import Aeronave from "./aeronave"

export default class Relatorio {
    public aeronave: Aeronave
    public cliente: string
    public dataEntrega: Date

    constructor(aeronave: Aeronave, cliente: string, dataEntrega: Date) {
        this.aeronave = aeronave
        this.cliente = cliente
        this.dataEntrega = dataEntrega
    }

    gerar(): string {
        return `
===== RELATÓRIO FINAL DA AERONAVE =====
Cliente: ${this.cliente}
Data de entrega: ${this.dataEntrega.toDateString()}

Código: ${this.aeronave.codigo}
Modelo: ${this.aeronave.modelo}
Tipo: ${this.aeronave.tipo}
Capacidade: ${this.aeronave.capacidade}
Alcance: ${this.aeronave.alcance}

Peças: ${this.aeronave.pecas.length}
Etapas: ${this.aeronave.etapas.length}
Testes: ${this.aeronave.testes.length}
=======================================
        `
    }
}

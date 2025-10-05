import TipoPeca from "../padrão/tipopeca"
import StatusPeca from "../padrão/statuspeca"

export default class Peca {
    public nome: string
    public tipo: TipoPeca
    public fornecedor: string
    public status: StatusPeca

    constructor(nome: string, tipo: TipoPeca, fornecedor: string, status: StatusPeca) {
        this.nome = nome
        this.tipo = tipo
        this.fornecedor = fornecedor
        this.status = status
    }

    atualizarStatus(novoStatus: StatusPeca): void {
        this.status = novoStatus
    }
}

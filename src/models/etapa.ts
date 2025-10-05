import StatusEtapa from "../padrão/statusetapa"
import Funcionario from "./funcionario"

export default class Etapa {
    public nome: string
    public prazo: Date
    public status: StatusEtapa
    public funcionarios: Funcionario[]

    constructor(nome: string, prazo: Date) {
        this.nome = nome
        this.prazo = prazo
        this.status = StatusEtapa.PENDENTE
        this.funcionarios = []
    }

    iniciar(): void {
        if (this.status === StatusEtapa.PENDENTE) {
            this.status = StatusEtapa.ANDAMENTO
        }
    }

    finalizar(): void {
        if (this.status === StatusEtapa.ANDAMENTO) {
            this.status = StatusEtapa.CONCLUIDA
        }
    }

    associarFuncionario(funcionario: Funcionario): void {
        if (!this.funcionarios.find(f => f.id === funcionario.id)) {
            this.funcionarios.push(funcionario)
        }
    }

    listarFuncionarios(): void {
        this.funcionarios.forEach(f => console.log(f.nome))
    }
}

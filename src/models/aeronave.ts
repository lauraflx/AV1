import TipoAeronave from "../padrão/tipoaeronave"
import Peca from "./peca.js"
import Etapa from "./etapa.js"
import Teste from "./teste.js"

export default class Aeronave {
    public codigo: string
    public modelo: string
    public tipo: TipoAeronave
    public capacidade: number
    public alcance: number
    public pecas: Peca[]
    public etapas: Etapa[]
    public testes: Teste[]

    constructor(codigo: string, modelo: string, tipo: TipoAeronave, capacidade: number, alcance: number) {
        this.codigo = codigo
        this.modelo = modelo
        this.tipo = tipo
        this.capacidade = capacidade
        this.alcance = alcance
        this.pecas = []
        this.etapas = []
        this.testes = []
    }

    exibirDetalhes(): void {
        console.log(`Código: ${this.codigo}`)
        console.log(`Modelo: ${this.modelo}`)
        console.log(`Tipo: ${this.tipo}`)
        console.log(`Capacidade: ${this.capacidade}`)
        console.log(`Alcance: ${this.alcance}`)
    }
}

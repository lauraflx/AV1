import TipoTeste from "../padrão/tipoteste"
import ResultadoTeste from "../padrão/resultadoteste"

export default class Teste {
    public tipo: TipoTeste
    public resultado: ResultadoTeste

    constructor(tipo: TipoTeste, resultado: ResultadoTeste) {
        this.tipo = tipo
        this.resultado = resultado
    }
}

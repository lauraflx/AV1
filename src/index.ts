import readlineSync from "readline-sync"
import Aeronave from "./models/aeronave"
import Funcionario from "./models/funcionario"
import Relatorio from "./models/relatorio"
import Peça from "./models/peca"
import Etapa from "./models/etapa"

import TipoAeronave from "./padrão/tipoaeronave"
import NivelPermissao from "./padrão/nivelpermissao"

import FileService from "./servicos/fileservice"

// variáveis globais
let aeronaves: Aeronave[] = []
let funcionarios: Funcionario[] = []
let etapas: { id: number; nome: string; descricao: string; responsavel: string }[] = []
let pecas: { codigo: number; nome: string; fabricante: string; quantidade: number }[] = []
let testes: { id: number; nome: string; responsavel: string; resultado: string }[] = []
let usuarioLogado: Funcionario | null = null

function carregarDados() {
    // aeronaves
    try {
        const dadosAeronaves = FileService.carregar("./src/data/aeronaves.txt")
        if (dadosAeronaves && Array.isArray(dadosAeronaves)) {
            aeronaves = dadosAeronaves.map(
                (a: any) => new Aeronave(a.codigo, a.modelo, a.tipo, a.capacidade, a.alcance)
            )
        }
    } catch { aeronaves = [] }

    // funcionários
    try {
        const dadosFuncionarios = FileService.carregar("./src/data/funcionarios.txt")
        if (dadosFuncionarios && Array.isArray(dadosFuncionarios)) {
            funcionarios = dadosFuncionarios.map((f: any) =>
                new Funcionario(
                    f.id.toString().trim(),
                    f.nome.trim(),
                    f.telefone.trim(),
                    f.endereco.trim(),
                    f.usuario.trim(),
                    f.senha.trim(),
                    NivelPermissao[f.nivelPermissao as keyof typeof NivelPermissao]
                )
            )
        }
    } catch { funcionarios = [] }

    // etapas
    try {
        const dadosEtapas = FileService.carregar("./src/data/etapas.txt")
        if (dadosEtapas && Array.isArray(dadosEtapas)) {
            etapas = dadosEtapas
        }
    } catch { etapas = [] }

    // peças
    try {
        const dadosPecas = FileService.carregar("./src/data/pecas.txt")
        if (dadosPecas && Array.isArray(dadosPecas)) {
            pecas = dadosPecas
        }
    } catch { pecas = [] }

    // testes
    try {
        const dadosTestes = FileService.carregar("./src/data/testes.txt")
        if (dadosTestes && Array.isArray(dadosTestes)) {
            testes = dadosTestes.map((t: any) => ({
                id: t.id,
                nome: t.descricao,
                responsavel: t.responsavel,
                resultado: t.resultado
            }))
        }
    } catch { testes = [] }
}

function login() {
    console.log("\n=== LOGIN ===")
    const usuario = readlineSync.question("Usuario: ").trim()
    const senha = readlineSync.question("Senha: ", { hideEchoBack: true }).trim()

    const encontrado = funcionarios.find(
        f => f.usuario === usuario && f.senha === senha
    )

    if (encontrado) {
        usuarioLogado = encontrado
        console.log(`Login bem-sucedido! Bem-vindo(a), ${encontrado.nome}.`)
        menuPrincipal()
    } else {
        console.log("Usuario ou senha incorretos.")
    }
}

function menuLogin() {
    while (!usuarioLogado) {
        console.log("\n=== SISTEMA AEROCODE ===")
        console.log("1 - Login")
        console.log("2 - Cadastrar Funcionário")
        console.log("3 - Sair")

        const opcao = readlineSync.question("Escolha uma opcao: ")

        switch (opcao) {
            case "1": login(); break
            case "2": cadastrarFuncionario(false); break
            case "3": console.log("Encerrando sistema..."); process.exit(0)
            default: console.log("Opcao invalida!")
        }
    }
}

function menuPrincipal() {
    while (true) {
        console.log("\n=== SISTEMA AEROCODE ===")
        console.log("1 - Cadastrar Aeronave")
        console.log("2 - Listar Aeronaves")
        console.log("3 - Cadastrar Funcionário")
        console.log("4 - Listar Funcionários")
        console.log("5 - Gerar Relatório")
        console.log("6 - Cadastrar Etapa")
        console.log("7 - Listar Etapas")
        console.log("8 - Cadastrar Peça")
        console.log("9 - Listar Peças")
        console.log("10 - Cadastrar Teste")
        console.log("11 - Listar Testes")
        console.log("0 - Sair")

        const opcao = readlineSync.question("Escolha uma opcao: ")

        switch (opcao) {
            case "1": cadastrarAeronave(); break
            case "2": listarAeronaves(); break
            case "3": cadastrarFuncionario(true); break
            case "4": listarFuncionarios(); break
            case "5": gerarRelatorio(); break
            case "6": cadastrarEtapa(); break
            case "7": listarEtapas(); break
            case "8": cadastrarPeca(); break
            case "9": listarPecas(); break
            case "10": cadastrarTeste(); break
            case "11": listarTestes(); break
            case "0": usuarioLogado = null; menuLogin(); return
            default: console.log("Opcao invalida!")
        }
    }
}

function cadastrarAeronave() {
    console.log("\n=== Cadastro de Aeronave ===")
    const codigo = readlineSync.question("Codigo: ")
    const modelo = readlineSync.question("Modelo: ")
    const tipoIdx = readlineSync.keyInSelect(Object.values(TipoAeronave), "Tipo da aeronave")
    if (tipoIdx === -1) return
    const tipo = Object.values(TipoAeronave)[tipoIdx]
    const capacidade = readlineSync.questionInt("Capacidade: ")
    const alcance = readlineSync.questionInt("Alcance: ")

    const aeronave = new Aeronave(codigo, modelo, tipo, capacidade, alcance)
    aeronaves.push(aeronave)
    FileService.salvar("./src/data/aeronaves.txt", JSON.stringify(aeronaves, null, 2))
    console.log("Aeronave cadastrada com sucesso!")
}

function listarAeronaves() {
    console.log("\n=== Aeronaves Cadastradas ===")
    if (aeronaves.length === 0) { console.log("Nenhuma aeronave cadastrada!"); return }
    aeronaves.forEach(a => a.exibirDetalhes())
}

function cadastrarFuncionario(logado: boolean = false) {
    console.log("\n=== Cadastro de Funcionário ===")
    const id = (funcionarios.length + 1).toString()
    const nome = readlineSync.question("Nome: ").trim() // trim remove espaços em branco
    const telefone = readlineSync.question("Telefone: ").trim()
    const endereco = readlineSync.question("Endereco: ").trim()
    const usuario = readlineSync.question("Usuario: ").trim()
    const senha = readlineSync.question("Senha: ").trim()

    let nivelPermissao: NivelPermissao
    if (logado && usuarioLogado?.nivelPermissao === NivelPermissao.ADMINISTRADOR) {
        const nivelIdx = readlineSync.keyInSelect(Object.values(NivelPermissao), "Nivel de permissao")
        if (nivelIdx === -1) return
        nivelPermissao = Object.values(NivelPermissao)[nivelIdx]
    } else {
        nivelPermissao = NivelPermissao.OPERADOR
        console.log("Apenas nível OPERADOR pode ser criado sem login de administrador.")
    }

    const funcionario = new Funcionario(id, nome, telefone, endereco, usuario, senha, nivelPermissao)
    funcionarios.push(funcionario)
    FileService.salvar("./src/data/funcionarios.txt", JSON.stringify(funcionarios, null, 2))
    console.log("Funcionário cadastrado com sucesso!")
}

function listarFuncionarios() {
    console.log("\n=== Funcionarios Cadastrados ===")
    if (funcionarios.length === 0) { console.log("Nenhum funcionário cadastrado!"); return }
    funcionarios.forEach(f => console.log(`${f.id} - ${f.nome} (${f.nivelPermissao})`))
}

function gerarRelatorio() {
    console.log("\n=== Gerar Relatório ===")
    if (aeronaves.length === 0) { console.log("Nenhuma aeronave cadastrada!"); return }
    const idx = readlineSync.keyInSelect(aeronaves.map(a => a.modelo), "Escolha a aeronave")
    if (idx === -1) return

    const cliente = readlineSync.question("Nome do cliente: ")
    const dataEntrega = new Date()

    const relatorio = new Relatorio(aeronaves[idx], cliente, dataEntrega)
    const conteudo = relatorio.gerar()

    FileService.salvar("./src/data/relatorio.txt", conteudo)
    console.log("Relatório gerado com sucesso em /src/data/relatorio.txt")
}

function cadastrarEtapa() {
    console.log("\n=== Cadastro de Etapa ===")
    const id = etapas.length + 1
    const nome = readlineSync.question("Nome da etapa: ").trim()
    const descricao = readlineSync.question("Descrição: ").trim()
    const responsavel = readlineSync.question("Responsavel: ").trim()
    if (!nome) return

    const etapa = { id, nome, descricao, responsavel }
    etapas.push(etapa)
    FileService.salvar("./src/data/etapas.txt", JSON.stringify(etapas, null, 2))
    console.log("Etapa cadastrada com sucesso!")
}

function listarEtapas() {
    console.log("\n=== Etapas Cadastradas ===")
    if (etapas.length === 0) { console.log("Nenhuma etapa cadastrada!"); return }
    etapas.forEach((e, i) => {
        console.log(`${i + 1} - ${e.nome} (Responsável: ${e.responsavel})`)
        console.log(`    Descrição: ${e.descricao}`)
    })
}

function cadastrarPeca() {
    console.log("\n=== Cadastro de Peça ===")
    const codigo = readlineSync.questionInt("Codigo da peca: ")
    const nome = readlineSync.question("Nome da peca: ").trim()
    const fabricante = readlineSync.question("Fabricante: ").trim()
    const quantidade = readlineSync.questionInt("Quantidade: ")

    const peca = { codigo, nome, fabricante, quantidade }
    pecas.push(peca)
    FileService.salvar("./src/data/pecas.txt", JSON.stringify(pecas, null, 2))
    console.log("Peca cadastrada com sucesso!")
}

function listarPecas() {
    console.log("\n=== Peças Cadastradas ===")
    if (pecas.length === 0) { console.log("Nenhuma peca cadastrada!"); return }
    pecas.forEach((p, i) => {
        console.log(`${i + 1} - ${p.nome} (Fabricante: ${p.fabricante}, Qtde: ${p.quantidade})`)
    })
}

function cadastrarTeste() {
    console.log("\n=== Cadastro de Teste ===")
    const id = testes.length + 1
    const nome = readlineSync.question("Nome do teste: ").trim()
    const responsavel = readlineSync.question("Responsável: ").trim()
    const resultado = readlineSync.question("Resultado (Aprovado/Reprovado/Em andamento): ").trim()

    if (!nome) return
    const teste = { id, nome, responsavel, resultado }
    testes.push(teste)
    FileService.salvar("./src/data/testes.txt", JSON.stringify(testes, null, 2))
    console.log("Teste cadastrado com sucesso!")
}

function listarTestes() {
    console.log("\n=== Testes Cadastrados ===")
    if (testes.length === 0) { console.log("Nenhum teste cadastrado!"); return }
    testes.forEach((t, i) => {
        console.log(`${i + 1} - ${t.nome} (Responsável: ${t.responsavel})`)
        console.log(`    Resultado: ${t.resultado}`)
    })
}

carregarDados()
menuLogin()
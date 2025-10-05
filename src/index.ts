import readlineSync from "readline-sync"
import Aeronave from "./models/aeronave"
import Funcionario from "./models/funcionario"
import Relatorio from "./models/relatorio"

import TipoAeronave from "./padrão/tipoaeronave"
import NivelPermissao from "./padrão/nivelpermissao"

import FileService from "./servicos/fileservice"

// variáveis globais
let aeronaves: Aeronave[] = []
let funcionarios: Funcionario[] = []
let usuarioLogado: Funcionario | null = null

function carregarDados() {
    // carrega aeronaves
    try {
        const dadosAeronaves = FileService.carregar("./src/data/aeronaves.txt")
        if (dadosAeronaves && Array.isArray(dadosAeronaves)) {
            aeronaves = dadosAeronaves.map(
                (a: any) => new Aeronave(a.codigo, a.modelo, a.tipo, a.capacidade, a.alcance)
            )
        }
    } catch (err) {
        console.log("Arquivo de aeronaves inválido ou não encontrado. Corrija manualmente se necessário.")
        aeronaves = []
    }

    // carregar funcionários 
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
    } catch (err) {
        console.log("Arquivo de funcionários inválido ou não encontrado. Corrija manualmente o JSON.")
        funcionarios = []
    }
}

// ==== Login ====
function login() {
    console.log("\n=== LOGIN ===")
    const usuario = readlineSync.question("Usuario: ").trim() //remover espaços em branco
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

// ==== Menu de Login ====
function menuLogin() {
    while (!usuarioLogado) {
        console.log("\n=== SISTEMA AEROCODE ===")
        console.log("1 - Login")
        console.log("2 - Cadastrar Funcionário")
        console.log("3 - Sair")

        const opcao = readlineSync.question("Escolha uma opcao: ")

        switch (opcao) {
            case "1":
                login()
                break
            case "2":
                cadastrarFuncionario(false) //apenas operador
                break
            case "3":
                console.log("Encerrando sistema...")
                process.exit(0)
            default:
                console.log("Opcao invalida!")
        }
    }
}

// ==== Menu Principal ====
function menuPrincipal() {
    while (true) {
        console.log("\n=== SISTEMA AEROCODE ===")
        console.log("1 - Cadastrar Aeronave")
        console.log("2 - Listar Aeronaves")
        console.log("3 - Cadastrar Funcionário")
        console.log("4 - Listar Funcionários")
        console.log("5 - Gerar Relatório")
        console.log("0 - Sair")

        const opcao = readlineSync.question("Escolha uma opcao: ")

        switch (opcao) {
            case "1":
                cadastrarAeronave()
                break
            case "2":
                listarAeronaves()
                break
            case "3":
                cadastrarFuncionario(true) //pode criar qualquer nível sendo administrador
                break
            case "4":
                listarFuncionarios()
                break
            case "5":
                gerarRelatorio()
                break
            case "0":
                console.log("Saindo da conta...")
                usuarioLogado = null
                menuLogin()
                return
            default:
                console.log("Opcao invalida!")
        }
    }
}

// ==== Funções ====
function cadastrarAeronave() {
    console.log("\n=== Cadastro de Aeronave ===")
    const codigo = readlineSync.question("Codigo: ")
    const modelo = readlineSync.question("Modelo: ")
    const tipoIdx = readlineSync.keyInSelect(Object.values(TipoAeronave), "Tipo da aeronave")
    if (tipoIdx === -1) return // cancela se apertar esc
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
    if (aeronaves.length === 0) {
        console.log("Nenhuma aeronave cadastrada!")
        return
    }
    aeronaves.forEach(a => a.exibirDetalhes())
}

function cadastrarFuncionario(logado: boolean = false) {
    console.log("\n=== Cadastro de Funcionário ===")
    const id = (funcionarios.length + 1).toString()
    const nome = readlineSync.question("Nome: ").trim()
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
    if (funcionarios.length === 0) {
        console.log("Nenhum funcionário cadastrado!")
        return
    }
    funcionarios.forEach(f => {
        console.log(`${f.id} - ${f.nome} (${f.nivelPermissao})`)
    })
}

function gerarRelatorio() {
    console.log("\n=== Gerar Relatório ===")
    if (aeronaves.length === 0) {
        console.log("Nenhuma aeronave cadastrada!")
        return
    }
    const idx = readlineSync.keyInSelect(aeronaves.map(a => a.modelo), "Escolha a aeronave")
    if (idx === -1) return

    const cliente = readlineSync.question("Nome do cliente: ")
    const dataEntrega = new Date()

    const relatorio = new Relatorio(aeronaves[idx], cliente, dataEntrega)
    const conteudo = relatorio.gerar()

    FileService.salvar("./src/data/relatorio.txt", conteudo)
    console.log("Relatório gerado com sucesso em /src/data/relatorio.txt")
}

// Inicializa
carregarDados()
menuLogin()
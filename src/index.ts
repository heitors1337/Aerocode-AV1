import { existsSync, mkdirSync, readFileSync, renameSync, writeFileSync } from 'node:fs';
import { createInterface } from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import { Aeronave, AeronaveData } from './models/aeronave.js';
import { Etapa } from './models/etapa.js';
import { Funcionario, FuncionarioData } from './models/funcionario.js';
import { Peca } from './models/peca.js';
import { Relatorio } from './models/relatorio.js';
import { Teste } from './models/teste.js';
import {
    NivelPermissao,
    ResultadoTeste,
    StatusPeca,
    TipoAeronave,
    TipoPeca,
    TipoTeste
} from './enums/enums.js';

interface BancoData {
    aeronaves: AeronaveData[];
    funcionarios: FuncionarioData[];
}

interface BancoMemoria {
    aeronaves: Aeronave[];
    funcionarios: Funcionario[];
}

const ARQUIVO_DADOS = './dados/aerocode-db.json';
const rl = createInterface({ input, output });

function criarAdminPadrao(): Funcionario {
    return new Funcionario(1, 'Administrador Aerocode', '(00) 0000-0000', 'Sede Aerocode', 'admin', '123', NivelPermissao.ADMINISTRADOR);
}

function bancoPadrao(): BancoMemoria {
    return { aeronaves: [], funcionarios: [criarAdminPadrao()] };
}

function carregarBanco(): BancoMemoria {
    if (!existsSync(ARQUIVO_DADOS)) {
        return bancoPadrao();
    }

    try {
        const dados = JSON.parse(readFileSync(ARQUIVO_DADOS, 'utf-8')) as Partial<BancoData>;
        const funcionarios = Array.isArray(dados.funcionarios)
            ? dados.funcionarios.map((funcionario) => Funcionario.fromJSON(funcionario))
            : [];

        if (!funcionarios.some((funcionario) => funcionario.usuario === 'admin')) {
            funcionarios.unshift(criarAdminPadrao());
        }

        return {
            aeronaves: Array.isArray(dados.aeronaves) ? dados.aeronaves.map((aeronave) => Aeronave.fromJSON(aeronave)) : [],
            funcionarios
        };
    } catch {
        console.log('Arquivo de dados invalido. O sistema iniciou com um banco limpo para evitar falha.');
        return bancoPadrao();
    }
}

function salvarBanco(banco: BancoMemoria): void {
    mkdirSync('./dados', { recursive: true });
    const dados: BancoData = {
        aeronaves: banco.aeronaves.map((aeronave) => aeronave.toJSON()),
        funcionarios: banco.funcionarios.map((funcionario) => funcionario.toJSON())
    };
    const temporario = `${ARQUIVO_DADOS}.tmp`;
    writeFileSync(temporario, JSON.stringify(dados, null, 2), 'utf-8');
    renameSync(temporario, ARQUIVO_DADOS);
}

async function perguntar(texto: string): Promise<string> {
    return (await rl.question(texto)).trim();
}

async function perguntarObrigatorio(texto: string, limite = 80): Promise<string> {
    while (true) {
        const valor = await perguntar(texto);
        if (valor.length === 0) {
            console.log('Este campo e obrigatorio.');
            continue;
        }
        if (valor.length > limite) {
            console.log(`Use no maximo ${limite} caracteres.`);
            continue;
        }
        return valor;
    }
}

async function perguntarComPadrao(texto: string, padrao: string): Promise<string> {
    const valor = await perguntar(texto);
    return valor.length > 0 ? valor : padrao;
}

async function perguntarNumero(texto: string, minimo = 1): Promise<number> {
    while (true) {
        const valor = Number(await perguntar(texto));
        if (Number.isInteger(valor) && valor >= minimo) return valor;
        console.log(`Informe um numero inteiro maior ou igual a ${minimo}.`);
    }
}

async function perguntarCodigo(texto: string): Promise<string> {
    while (true) {
        const codigo = (await perguntarObrigatorio(texto, 30)).toUpperCase();
        if (/^[A-Z0-9_-]+$/.test(codigo)) return codigo;
        console.log('Use apenas letras, numeros, hifen ou underline.');
    }
}

async function perguntarUsuario(texto: string): Promise<string> {
    while (true) {
        const usuario = await perguntarObrigatorio(texto, 30);
        if (/^[a-zA-Z0-9_.-]+$/.test(usuario)) return usuario;
        console.log('Use apenas letras, numeros, ponto, hifen ou underline.');
    }
}

async function escolherEnum<T extends string>(titulo: string, valores: Record<string, T>): Promise<T> {
    const opcoes = Object.values(valores);
    while (true) {
        console.log(`\n${titulo}`);
        opcoes.forEach((valor, index) => console.log(`${index + 1} - ${valor}`));
        const indice = Number(await perguntar('Opcao: ')) - 1;
        if (Number.isInteger(indice) && indice >= 0 && indice < opcoes.length) return opcoes[indice];
        console.log('Opcao invalida.');
    }
}

async function autenticar(banco: BancoMemoria): Promise<Funcionario | null> {
    console.log('=== Login Aerocode ===');
    for (let tentativa = 1; tentativa <= 3; tentativa += 1) {
        const usuario = await perguntar('Usuario: ');
        const senha = await perguntar('Senha: ');
        const funcionario = banco.funcionarios.find((item) => item.autenticar(usuario, senha));
        if (funcionario) return funcionario;
        console.log('Usuario ou senha invalidos.');
    }
    return null;
}

function exigirPermissao(usuario: Funcionario, ...permissoes: NivelPermissao[]): boolean {
    if (usuario.podeAcessar(...permissoes)) return true;
    console.log('Acesso negado para seu nivel de permissao.');
    return false;
}

async function selecionarAeronave(banco: BancoMemoria): Promise<Aeronave | null> {
    const codigo = await perguntarCodigo('Codigo da aeronave: ');
    const aeronave = banco.aeronaves.find((item) => item.codigo.toLowerCase() === codigo.toLowerCase());
    if (!aeronave) console.log('Aeronave nao encontrada.');
    return aeronave ?? null;
}

async function cadastrarFuncionario(banco: BancoMemoria): Promise<void> {
    const id = await perguntarNumero('ID unico: ');
    if (banco.funcionarios.some((funcionario) => funcionario.id === id)) {
        console.log('Ja existe funcionario com esse ID.');
        return;
    }
    const usuario = await perguntarUsuario('Usuario de login: ');
    if (banco.funcionarios.some((funcionario) => funcionario.usuario.toLowerCase() === usuario.toLowerCase())) {
        console.log('Ja existe funcionario com esse usuario.');
        return;
    }
    const nome = await perguntarObrigatorio('Nome: ');
    const telefone = await perguntarObrigatorio('Telefone: ', 30);
    const endereco = await perguntarObrigatorio('Endereco: ', 120);
    const senha = await perguntarObrigatorio('Senha: ', 80);
    const nivel = await escolherEnum('Nivel de permissao', NivelPermissao);
    banco.funcionarios.push(new Funcionario(id, nome, telefone, endereco, usuario, senha, nivel));
    console.log('Funcionario cadastrado.');
}

async function cadastrarAeronave(banco: BancoMemoria): Promise<void> {
    const codigo = await perguntarCodigo('Codigo unico: ');
    if (banco.aeronaves.some((aeronave) => aeronave.codigo.toLowerCase() === codigo.toLowerCase())) {
        console.log('Ja existe aeronave com esse codigo.');
        return;
    }
    const modelo = await perguntarObrigatorio('Modelo: ');
    const tipo = await escolherEnum('Tipo da aeronave', TipoAeronave);
    const capacidade = await perguntarNumero('Capacidade: ');
    const alcance = await perguntarNumero('Alcance em km: ');
    banco.aeronaves.push(new Aeronave(codigo, modelo, tipo, capacidade, alcance));
    console.log('Aeronave cadastrada.');
}

async function adicionarPeca(banco: BancoMemoria): Promise<void> {
    const aeronave = await selecionarAeronave(banco);
    if (!aeronave) return;
    const nome = await perguntarObrigatorio('Nome da peca: ');
    const tipo = await escolherEnum('Tipo da peca', TipoPeca);
    const fornecedor = await perguntarObrigatorio('Fornecedor: ');
    const status = await escolherEnum('Status da peca', StatusPeca);
    console.log(aeronave.adicionarPeca(new Peca(nome, tipo, fornecedor, status)) ? 'Peca adicionada.' : 'Ja existe peca com esse nome nesta aeronave.');
}

async function atualizarPeca(banco: BancoMemoria): Promise<void> {
    const aeronave = await selecionarAeronave(banco);
    if (!aeronave) return;
    const nome = await perguntarObrigatorio('Nome da peca: ');
    const status = await escolherEnum('Novo status', StatusPeca);
    console.log(aeronave.atualizarStatusPeca(nome, status) ? 'Status atualizado.' : 'Peca nao encontrada.');
}

async function adicionarEtapa(banco: BancoMemoria): Promise<void> {
    const aeronave = await selecionarAeronave(banco);
    if (!aeronave) return;
    const nome = await perguntarObrigatorio('Nome da etapa: ');
    const prazo = await perguntarObrigatorio('Prazo de conclusao: ', 40);
    console.log(aeronave.adicionarEtapa(new Etapa(nome, prazo)) ? 'Etapa adicionada ao fim da ordem de producao.' : 'Ja existe etapa com esse nome nesta aeronave.');
}

async function alterarEtapa(banco: BancoMemoria, acao: 'iniciar' | 'finalizar'): Promise<void> {
    const aeronave = await selecionarAeronave(banco);
    if (!aeronave) return;
    const nome = await perguntarObrigatorio('Nome da etapa: ');
    try {
        if (acao === 'iniciar') aeronave.iniciarEtapa(nome);
        else aeronave.finalizarEtapa(nome);
        console.log(`Etapa ${acao === 'iniciar' ? 'iniciada' : 'finalizada'}.`);
    } catch (erro) {
        console.log((erro as Error).message);
    }
}

async function associarFuncionarioEtapa(banco: BancoMemoria): Promise<void> {
    const aeronave = await selecionarAeronave(banco);
    if (!aeronave) return;
    const etapaNome = await perguntarObrigatorio('Nome da etapa: ');
    const etapa = aeronave.etapas.find((item) => item.nome.toLowerCase() === etapaNome.toLowerCase());
    if (!etapa) {
        console.log('Etapa nao encontrada.');
        return;
    }
    const id = await perguntarNumero('ID do funcionario: ');
    const funcionario = banco.funcionarios.find((item) => item.id === id);
    if (!funcionario) {
        console.log('Funcionario nao encontrado.');
        return;
    }
    console.log(etapa.adicionarFuncionario(funcionario) ? 'Funcionario associado.' : 'Funcionario ja estava associado.');
}

async function registrarTeste(banco: BancoMemoria): Promise<void> {
    const aeronave = await selecionarAeronave(banco);
    if (!aeronave) return;
    const tipo = await escolherEnum('Tipo de teste', TipoTeste);
    const resultado = await escolherEnum('Resultado', ResultadoTeste);
    aeronave.registrarTeste(new Teste(tipo, resultado));
    console.log('Teste registrado.');
}

async function gerarRelatorio(banco: BancoMemoria): Promise<void> {
    const aeronave = await selecionarAeronave(banco);
    if (!aeronave) return;
    if (!aeronave.prontaParaEntrega()) {
        const confirmar = (await perguntarComPadrao('A aeronave ainda possui pendencias. Gerar mesmo assim? (s/N): ', 'n')).toLowerCase();
        if (confirmar !== 's') return;
    }
    const cliente = await perguntarObrigatorio('Nome do cliente: ');
    const caminho = Relatorio.salvar(aeronave, cliente);
    console.log(`Relatorio salvo em ${caminho}`);
}

function listarAeronaves(banco: BancoMemoria): void {
    if (banco.aeronaves.length === 0) {
        console.log('Nenhuma aeronave cadastrada.');
        return;
    }
    banco.aeronaves.forEach((aeronave) => console.log(`${aeronave.codigo} - ${aeronave.modelo} (${aeronave.tipo})`));
}

function listarFuncionarios(banco: BancoMemoria): void {
    banco.funcionarios.forEach((funcionario) => console.log(`${funcionario.id} - ${funcionario.nome} | ${funcionario.nivelPermissao} | ${funcionario.usuario}`));
}

async function menu(): Promise<void> {
    const banco = carregarBanco();
    const usuario = await autenticar(banco);
    if (!usuario) {
        console.log('Acesso encerrado.');
        rl.close();
        return;
    }

    console.log(`\nBem-vindo, ${usuario.nome}.`);
    let sair = false;
    while (!sair) {
        console.log('\n=== Aerocode CLI ===');
        console.log('1 - Cadastrar funcionario');
        console.log('2 - Listar funcionarios');
        console.log('3 - Cadastrar aeronave');
        console.log('4 - Listar aeronaves');
        console.log('5 - Ver detalhes da aeronave');
        console.log('6 - Adicionar peca');
        console.log('7 - Atualizar status de peca');
        console.log('8 - Adicionar etapa');
        console.log('9 - Iniciar etapa');
        console.log('10 - Finalizar etapa');
        console.log('11 - Associar funcionario a etapa');
        console.log('12 - Registrar teste');
        console.log('13 - Gerar relatorio final');
        console.log('0 - Salvar e sair');

        const opcao = await perguntar('Opcao: ');
        switch (opcao) {
            case '1':
                if (exigirPermissao(usuario, NivelPermissao.ADMINISTRADOR)) await cadastrarFuncionario(banco);
                break;
            case '2':
                if (exigirPermissao(usuario, NivelPermissao.ADMINISTRADOR, NivelPermissao.ENGENHEIRO)) listarFuncionarios(banco);
                break;
            case '3':
                if (exigirPermissao(usuario, NivelPermissao.ADMINISTRADOR, NivelPermissao.ENGENHEIRO)) await cadastrarAeronave(banco);
                break;
            case '4':
                listarAeronaves(banco);
                break;
            case '5': {
                const aeronave = await selecionarAeronave(banco);
                if (aeronave) aeronave.exibirDetalhes();
                break;
            }
            case '6':
                if (exigirPermissao(usuario, NivelPermissao.ADMINISTRADOR, NivelPermissao.ENGENHEIRO, NivelPermissao.OPERADOR)) await adicionarPeca(banco);
                break;
            case '7':
                if (exigirPermissao(usuario, NivelPermissao.ADMINISTRADOR, NivelPermissao.ENGENHEIRO, NivelPermissao.OPERADOR)) await atualizarPeca(banco);
                break;
            case '8':
                if (exigirPermissao(usuario, NivelPermissao.ADMINISTRADOR, NivelPermissao.ENGENHEIRO)) await adicionarEtapa(banco);
                break;
            case '9':
                if (exigirPermissao(usuario, NivelPermissao.ADMINISTRADOR, NivelPermissao.ENGENHEIRO, NivelPermissao.OPERADOR)) await alterarEtapa(banco, 'iniciar');
                break;
            case '10':
                if (exigirPermissao(usuario, NivelPermissao.ADMINISTRADOR, NivelPermissao.ENGENHEIRO, NivelPermissao.OPERADOR)) await alterarEtapa(banco, 'finalizar');
                break;
            case '11':
                if (exigirPermissao(usuario, NivelPermissao.ADMINISTRADOR, NivelPermissao.ENGENHEIRO)) await associarFuncionarioEtapa(banco);
                break;
            case '12':
                if (exigirPermissao(usuario, NivelPermissao.ADMINISTRADOR, NivelPermissao.ENGENHEIRO)) await registrarTeste(banco);
                break;
            case '13':
                if (exigirPermissao(usuario, NivelPermissao.ADMINISTRADOR, NivelPermissao.ENGENHEIRO)) await gerarRelatorio(banco);
                break;
            case '0':
                salvarBanco(banco);
                sair = true;
                break;
            default:
                console.log('Opcao invalida.');
        }
    }

    console.log('Dados salvos. Ate logo.');
    rl.close();
}

menu().catch((erro) => {
    console.error('Erro inesperado:', erro);
    rl.close();
});

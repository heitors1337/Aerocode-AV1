import { Aeronave } from './models/aeronave.js';
import { Etapa } from './models/etapa.js';
import { Peca } from './models/peca.js';
import { Teste } from './models/teste.js';
import { Funcionario } from './models/funcionario.js';
import { Relatorio } from './models/relatorio.js';
import { 
    TipoAeronave, 
    NivelPermissao, 
    StatusPeca, 
    TipoPeca, 
    TipoTeste, 
    ResultadoTeste 
} from './enums/enums.js';

const admin = new Funcionario(1, "Seu Nome", "1234-5678", "Rua da Embraer", "admin", "123", NivelPermissao.ADMINISTRADOR);

console.log("--- Login no Sistema Aerocode ---");
if (admin.autenticar("admin", "123")) {
    console.log("Login realizado com sucesso!\n");


    const aviao = new Aeronave("BR14B", "14-Bis Moderno", TipoAeronave.COMERCIAL, 8, 500);

    const asa = new Peca("Asa Direita", TipoPeca.NACIONAL, "Embraer Parts", StatusPeca.PRONTA);
    aviao.pecas.push(asa);

    const etapa1 = new Etapa("Montagem Estrutura", "10 dias");
    const etapa2 = new Etapa("Pintura", "3 dias");
    
    aviao.etapas.push(etapa1);
    aviao.etapas.push(etapa2);

    console.log("Iniciando produção...");
    aviao.finalizarEtapa("Montagem Estrutura"); 
    aviao.finalizarEtapa("Pintura");           
    const testeHidraulico = new Teste(TipoTeste.HIDRAULICO, ResultadoTeste.APROVADO);
    aviao.testes.push(testeHidraulico);

    console.log("\nGerando arquivos...");
    aviao.salvar(); 
    Relatorio.gerar(aviao, "Cliente Especial");

    console.log("\n--- PROCESSO CONCLUÍDO COM SUCESSO ---");
    aviao.exibirDetalhes();

} else {
    console.log("Usuário ou senha inválidos!");
}
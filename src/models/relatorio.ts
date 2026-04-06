import { Aeronave } from './aeronave.js';
import { Etapa } from './etapa.js';
import { Teste } from './teste.js'
import fs from 'node:fs';


export class Relatorio {
    static gerar(aeronave: Aeronave, cliente: string): void {
        const data = new Date().toLocaleDateString();
        let conteudo = `RELATÓRIO DE ENTREGA - AEROCODE\n`;
        conteudo += `-------------------------------------\n`;
        conteudo += `Cliente: ${cliente} | Data: ${data}\n`;
        conteudo += `Aeronave: ${aeronave.modelo} (Cód: ${aeronave.codigo})\n`;
        conteudo += `Status das Etapas:\n`;
        aeronave.etapas.forEach((e: Etapa) => conteudo += `- ${e.nome}: ${e.status}\n`);
        conteudo += `Testes Realizados:\n`;
        aeronave.testes.forEach((t: Teste) => conteudo += `- ${t.tipo}: ${t.resultado}\n`);

        fs.writeFileSync(`./relatorio_${aeronave.codigo}.txt`, conteudo);
        console.log("Relatório gerado com sucesso!");
    }
}

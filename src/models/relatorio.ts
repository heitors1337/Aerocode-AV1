import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { Aeronave } from './aeronave.js';

export class Relatorio {
    static gerar(aeronave: Aeronave, cliente: string, dataEntrega = new Date()): string {
        const dataFormatada = dataEntrega.toLocaleDateString('pt-BR');
        const linhas = [
            'RELATORIO FINAL DE ENTREGA - AEROCODE',
            '=====================================',
            `Cliente: ${cliente}`,
            `Data de entrega: ${dataFormatada}`,
            '',
            'AERONAVE',
            aeronave.detalhes(),
            '',
            `Situacao para entrega: ${aeronave.prontaParaEntrega() ? 'Liberada' : 'Pendente'}`
        ];
        return linhas.join('\n');
    }

    static salvar(aeronave: Aeronave, cliente: string, diretorio = './relatorios'): string {
        mkdirSync(diretorio, { recursive: true });
        const codigoSeguro = aeronave.codigo.replace(/[^a-z0-9_-]/gi, '_');
        const caminho = join(diretorio, `relatorio_${codigoSeguro}.txt`);
        writeFileSync(caminho, Relatorio.gerar(aeronave, cliente), 'utf-8');
        return caminho;
    }
}

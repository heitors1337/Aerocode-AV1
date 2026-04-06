import { TipoAeronave, StatusEtapa } from '../enums/enums.js';
import { Peca } from './peca.js';
import { Etapa } from './etapa.js';
import { Teste } from './teste.js';
import * as fs from 'fs';

export class Aeronave {
    public pecas: Peca[] = [];
    public etapas: Etapa[] = [];
    public testes: Teste[] = [];

    constructor(
        public codigo: string,
        public modelo: string,
        public tipo: TipoAeronave,
        public capacidade: number,
        public alcance: number
    ) {}

    exibirDetalhes(): void {
        console.log(`\n--- Detalhes da Aeronave [${this.codigo}] ---`);
        console.log(`Modelo: ${this.modelo} | Tipo: ${this.tipo}`);
        console.log(`Capacidade: ${this.capacidade} | Alcance: ${this.alcance}km`);
        console.log(`Peças: ${this.pecas.length} | Etapas: ${this.etapas.length} | Testes: ${this.testes.length}`);
    }

    finalizarEtapa(nomeEtapa: string): void {
        const index = this.etapas.findIndex(e => e.nome === nomeEtapa);
        if (index === -1) return console.log("Etapa não encontrada.");

        if (index > 0 && this.etapas[index - 1].status !== StatusEtapa.CONCLUIDA) {
            return console.log(`ERRO: A etapa anterior (${this.etapas[index - 1].nome}) não foi concluída!`);
        }

        this.etapas[index].status = StatusEtapa.CONCLUIDA;
        console.log(`Etapa ${nomeEtapa} concluída!`);
    }

    salvar(): void {
        fs.writeFileSync(`./${this.codigo}.txt`, JSON.stringify(this, null, 2));
    }
}
import { StatusEtapa, StatusPeca, TipoAeronave } from '../enums/enums.js';
import { Etapa, EtapaData } from './etapa.js';
import { Peca, PecaData } from './peca.js';
import { Teste, TesteData } from './teste.js';

export interface AeronaveData {
    codigo: string;
    modelo: string;
    tipo: TipoAeronave;
    capacidade: number;
    alcance: number;
    pecas: PecaData[];
    etapas: EtapaData[];
    testes: TesteData[];
}

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

    adicionarPeca(peca: Peca): boolean {
        if (this.pecas.some((item) => item.nome.toLowerCase() === peca.nome.toLowerCase())) {
            return false;
        }
        this.pecas.push(peca);
        return true;
    }

    adicionarEtapa(etapa: Etapa): boolean {
        if (this.etapas.some((item) => item.nome.toLowerCase() === etapa.nome.toLowerCase())) {
            return false;
        }
        this.etapas.push(etapa);
        return true;
    }

    registrarTeste(teste: Teste): void {
        this.testes.push(teste);
    }

    atualizarStatusPeca(nomePeca: string, status: StatusPeca): boolean {
        const peca = this.pecas.find((item) => item.nome.toLowerCase() === nomePeca.toLowerCase());
        if (!peca) return false;
        peca.atualizarStatus(status);
        return true;
    }

    iniciarEtapa(nomeEtapa: string): void {
        const indice = this.buscarIndiceEtapa(nomeEtapa);
        this.etapas[indice].iniciar(this.etapaAnteriorConcluida(indice));
    }

    finalizarEtapa(nomeEtapa: string): void {
        const indice = this.buscarIndiceEtapa(nomeEtapa);
        this.etapas[indice].finalizar(this.etapaAnteriorConcluida(indice));
    }

    prontaParaEntrega(): boolean {
        return this.etapas.length > 0
            && this.etapas.every((etapa) => etapa.status === StatusEtapa.CONCLUIDA)
            && this.pecas.length > 0
            && this.pecas.every((peca) => peca.status === StatusPeca.PRONTA)
            && this.testes.length > 0;
    }

    detalhes(): string {
        const linhas = [
            `Codigo: ${this.codigo}`,
            `Modelo: ${this.modelo}`,
            `Tipo: ${this.tipo}`,
            `Capacidade: ${this.capacidade}`,
            `Alcance: ${this.alcance} km`,
            'Pecas:',
            ...(this.pecas.length > 0 ? this.pecas.map((peca) => `- ${peca.nome} | ${peca.tipo} | ${peca.fornecedor} | ${peca.status}`) : ['- Nenhuma peca cadastrada']),
            'Etapas:',
            ...(this.etapas.length > 0 ? this.etapas.map((etapa, index) => `- ${index + 1}. ${etapa.nome} | prazo: ${etapa.prazo} | ${etapa.status} | funcionarios: ${etapa.funcionarios.length}`) : ['- Nenhuma etapa cadastrada']),
            'Testes:',
            ...(this.testes.length > 0 ? this.testes.map((teste) => `- ${teste.tipo}: ${teste.resultado}`) : ['- Nenhum teste registrado'])
        ];
        return linhas.join('\n');
    }

    exibirDetalhes(): void {
        console.log(this.detalhes());
    }

    toJSON(): AeronaveData {
        return {
            codigo: this.codigo,
            modelo: this.modelo,
            tipo: this.tipo,
            capacidade: this.capacidade,
            alcance: this.alcance,
            pecas: this.pecas.map((peca) => peca.toJSON()),
            etapas: this.etapas.map((etapa) => etapa.toJSON()),
            testes: this.testes.map((teste) => teste.toJSON())
        };
    }

    static fromJSON(data: AeronaveData): Aeronave {
        const aeronave = new Aeronave(data.codigo, data.modelo, data.tipo, data.capacidade, data.alcance);
        aeronave.pecas = Array.isArray(data.pecas) ? data.pecas.map((peca) => Peca.fromJSON(peca)) : [];
        aeronave.etapas = Array.isArray(data.etapas) ? data.etapas.map((etapa) => Etapa.fromJSON(etapa)) : [];
        aeronave.testes = Array.isArray(data.testes) ? data.testes.map((teste) => Teste.fromJSON(teste)) : [];
        return aeronave;
    }

    private buscarIndiceEtapa(nomeEtapa: string): number {
        const indice = this.etapas.findIndex((etapa) => etapa.nome.toLowerCase() === nomeEtapa.toLowerCase());
        if (indice === -1) {
            throw new Error('Etapa nao encontrada.');
        }
        return indice;
    }

    private etapaAnteriorConcluida(indice: number): boolean {
        return indice === 0 || this.etapas[indice - 1].status === StatusEtapa.CONCLUIDA;
    }
}

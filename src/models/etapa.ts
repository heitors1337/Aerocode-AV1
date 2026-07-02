import { StatusEtapa } from '../enums/enums.js';
import { Funcionario, FuncionarioData } from './funcionario.js';

export interface EtapaData {
    nome: string;
    prazo: string;
    status: StatusEtapa;
    funcionarios: FuncionarioData[];
}

export class Etapa {
    public funcionarios: Funcionario[] = [];

    constructor(
        public nome: string,
        public prazo: string,
        public status: StatusEtapa = StatusEtapa.PENDENTE
    ) {}

    iniciar(etapaAnteriorConcluida = true): void {
        if (!etapaAnteriorConcluida) {
            throw new Error('A etapa anterior precisa estar concluida.');
        }
        if (this.status === StatusEtapa.CONCLUIDA) {
            throw new Error('Esta etapa ja foi concluida.');
        }
        this.status = StatusEtapa.ANDAMENTO;
    }

    finalizar(etapaAnteriorConcluida = true): void {
        if (!etapaAnteriorConcluida) {
            throw new Error('A etapa anterior precisa estar concluida.');
        }
        if (this.status === StatusEtapa.PENDENTE) {
            throw new Error('A etapa precisa ser iniciada antes de ser finalizada.');
        }
        this.status = StatusEtapa.CONCLUIDA;
    }

    adicionarFuncionario(funcionario: Funcionario): boolean {
        if (this.funcionarios.some((item) => item.id === funcionario.id)) {
            return false;
        }
        this.funcionarios.push(funcionario);
        return true;
    }

    listarFuncionarios(): string[] {
        return this.funcionarios.map((funcionario) => `${funcionario.id} - ${funcionario.nome} (${funcionario.nivelPermissao})`);
    }

    toJSON(): EtapaData {
        return {
            nome: this.nome,
            prazo: this.prazo,
            status: this.status,
            funcionarios: this.funcionarios.map((funcionario) => funcionario.toJSON())
        };
    }

    static fromJSON(data: EtapaData): Etapa {
        const etapa = new Etapa(data.nome, data.prazo, data.status);
        etapa.funcionarios = Array.isArray(data.funcionarios) ? data.funcionarios.map((funcionario) => Funcionario.fromJSON(funcionario)) : [];
        return etapa;
    }
}

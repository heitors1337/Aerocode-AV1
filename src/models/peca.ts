import { StatusPeca, TipoPeca } from '../enums/enums.js';

export interface PecaData {
    nome: string;
    tipo: TipoPeca;
    fornecedor: string;
    status: StatusPeca;
}

export class Peca {
    constructor(
        public nome: string,
        public tipo: TipoPeca,
        public fornecedor: string,
        public status: StatusPeca = StatusPeca.EM_PRODUCAO
    ) {}

    atualizarStatus(novoStatus: StatusPeca): void {
        this.status = novoStatus;
    }

    toJSON(): PecaData {
        return { ...this };
    }

    static fromJSON(data: PecaData): Peca {
        return new Peca(data.nome, data.tipo, data.fornecedor, data.status);
    }
}

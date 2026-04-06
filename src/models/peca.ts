import { TipoPeca, StatusPeca } from '../enums/enums.js';
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
}
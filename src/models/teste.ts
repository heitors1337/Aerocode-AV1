import { ResultadoTeste, TipoTeste } from '../enums/enums.js';

export interface TesteData {
    tipo: TipoTeste;
    resultado: ResultadoTeste;
}

export class Teste {
    constructor(
        public tipo: TipoTeste,
        public resultado: ResultadoTeste
    ) {}

    toJSON(): TesteData {
        return { ...this };
    }

    static fromJSON(data: TesteData): Teste {
        return new Teste(data.tipo, data.resultado);
    }
}

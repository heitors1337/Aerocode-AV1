import { TipoTeste, ResultadoTeste } from '../enums/enums.js';

export class Teste {
    constructor(
        public tipo: TipoTeste,
        public resultado: ResultadoTeste
    ) {}
}
import { Funcionario } from "./funcionario.js";
import { StatusEtapa } from '../enums/enums.js';
export class Etapa {
    public funcionarios: Funcionario[] = [];
    
    constructor(
        public nome: string,
        public prazo: string,
        public status: StatusEtapa = StatusEtapa.PENDENTE
    ) {}

    adicionarFuncionario(func: Funcionario) {
        if (!this.funcionarios.find(f => f.id === func.id)) {
            this.funcionarios.push(func);
        }
    }
}
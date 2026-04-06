import { NivelPermissao } from '../enums/enums.js';
export class Funcionario {
    constructor(
        public id: number,
        public nome: string,
        public telefone: string,
        public endereco: string,
        public usuario: string,
        public senha: string,
        public nivelPermissao: NivelPermissao
    ) {}

    autenticar(user: string, pass: string): boolean {
        return this.usuario === user && this.senha === pass;
    }
}
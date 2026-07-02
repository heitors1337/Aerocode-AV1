import { randomBytes, scryptSync, timingSafeEqual } from 'node:crypto';
import { NivelPermissao } from '../enums/enums.js';

export interface FuncionarioData {
    id: number;
    nome: string;
    telefone: string;
    endereco: string;
    usuario: string;
    senha: string;
    nivelPermissao: NivelPermissao;
}

export class Funcionario {
    private static readonly HASH_PREFIXO = 'scrypt';

    constructor(
        public id: number,
        public nome: string,
        public telefone: string,
        public endereco: string,
        public usuario: string,
        public senha: string,
        public nivelPermissao: NivelPermissao
    ) {
        this.senha = Funcionario.prepararSenha(senha);
    }

    autenticar(usuario: string, senha: string): boolean {
        return this.usuario === usuario && Funcionario.verificarSenha(senha, this.senha);
    }

    podeAcessar(...permissoes: NivelPermissao[]): boolean {
        return permissoes.includes(this.nivelPermissao);
    }

    toJSON(): FuncionarioData {
        return { ...this };
    }

    static fromJSON(data: FuncionarioData): Funcionario {
        return new Funcionario(data.id, data.nome, data.telefone, data.endereco, data.usuario, data.senha, data.nivelPermissao);
    }

    private static prepararSenha(senha: string): string {
        if (senha.startsWith(`${Funcionario.HASH_PREFIXO}$`)) {
            return senha;
        }

        const salt = randomBytes(16).toString('hex');
        const hash = scryptSync(senha, salt, 64).toString('hex');
        return `${Funcionario.HASH_PREFIXO}$${salt}$${hash}`;
    }

    private static verificarSenha(senhaInformada: string, senhaArmazenada: string): boolean {
        const partes = senhaArmazenada.split('$');
        if (partes.length !== 3 || partes[0] !== Funcionario.HASH_PREFIXO) {
            return senhaInformada === senhaArmazenada;
        }

        const [, salt, hashOriginal] = partes;
        const hashInformado = scryptSync(senhaInformada, salt, 64);
        const hashSalvo = Buffer.from(hashOriginal, 'hex');

        return hashSalvo.length === hashInformado.length && timingSafeEqual(hashSalvo, hashInformado);
    }
}

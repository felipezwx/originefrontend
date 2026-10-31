
import { validarEmail, validarCPF, validarSenha } from "../utils/validacoes";

export class UsuarioCadastro {
    private nome: string;
    private email: string;
    private cpf: string;
    private senha: string;

    constructor(nome: string, email: string, cpf: string, senha: string) {
        this.nome = nome.trim();
        this.email = "";
        this.cpf = "";
        this.senha = senha;

        if (this.nome.length < 3) {
            throw new Error("Nome deve ter pelo menos 3 caracteres.");
        }

        if (!validarSenha(senha)) {
            throw new Error("Senha inválida.");
        }

        this.setEmail(email);
        this.setCpf(cpf);
    }

    setEmail(email: string) {
        if (!validarEmail(email)) {
            throw new Error("E-mail inválido.");
        }

        this.email = email.trim().toLowerCase();
    }

    setCpf(cpf: string) {
        if (!validarCPF(cpf)) {
            throw new Error("CPF inválido.");
        }

        this.cpf = cpf.replace(/\D/g, "");
    }

    get dadosParaCadastro() {
        return {
            nome: this.nome,
            email: this.email,
            cpf: this.cpf,
            senha: this.senha
        };
    }
}

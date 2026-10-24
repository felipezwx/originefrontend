import { useState } from "react";
import { validarEmail, validarCPF, validarSenha, formatarCPF } from "../utils/validacoes";
import { Link } from "react-router-dom";
import "../styles/cadastro.css";

export function Cadastro() {

    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [cpf, setCpf] = useState("");
    const [senha, setSenha] = useState("");
    const [confirmarSenha, setConfirmarSenha] = useState("");

    const [erro, setErro] = useState("");
    const [validado, setValidado] = useState(false);

    function handleCadastro() {
        setErro("");
        setValidado(false);

        if (nome.trim() === "") {
            setErro("Por favor, informe seu nome.");
            return;
        }

        if (!validarEmail(email)) {
            setErro("Digite um e-mail válido.");
            return;
        }

        if (!validarCPF(cpf)) {
            setErro("Digite um CPF válido.");
            return;
        }

        if (!validarSenha(senha)) {
            setErro("A senha deve ter no mínimo 8 caracteres, incluindo letra maiúscula, minúscula, número e caractere especial.");
            return;
        }

        if (senha !== confirmarSenha) {
            setErro("As senhas não coincidem.");
            return;
        }

        setValidado(true);
    }

    return (
        <main className="container-cadastro">
            <div className="cartao-cadastro">

                <div className="logo-cadastro">
                    <img src="/imagens/logo.png" alt="Originie Audiovisual" /> 
                </div>

                <div className="icone-cadastro">
                    <i className="bi bi-person-plus"></i>
                </div>

                <h1 className="titulo-cadastro">Criar Conta</h1>

                <p className="subtitulo-cadastro">
                    Faça seu cadastro na Originie
                </p>

                <form noValidate onSubmit={(event) => { event.preventDefault(); handleCadastro(); }}>

                    <div className="grupo-formulario">
                        <label htmlFor="campoNome">
                            <i className="bi bi-person me-1"></i> Nome
                        </label>
                        <input
                            type="text"
                            id="campoNome"
                            name="nome"
                            className="entrada-cadastro"
                            placeholder="Seu nome completo"
                            maxLength={100}
                            value={nome}
                            onChange={(event) => {
                                setNome(event.target.value);
                                setValidado(false);
                            }}
                        />
                    </div>

                    <div className="grupo-formulario">
                        <label htmlFor="campoEmail">
                            <i className="bi bi-envelope me-1"></i> Email
                        </label>
                        <input
                            type="email"
                            id="campoEmail"
                            name="email"
                            className="entrada-cadastro"
                            placeholder="seu@email.com"
                            value={email}
                            onChange={(event) => {
                                setEmail(event.target.value);
                                setValidado(false);
                            }}
                        />
                    </div>

                    <div className="grupo-formulario">
                        <label htmlFor="campoCPF">
                            <i className="bi bi-person-vcard me-1"></i> CPF
                        </label>
                        <input
                            type="text"
                            id="campoCPF"
                            name="cpf"
                            className="entrada-cadastro"
                            placeholder="000.000.000-00"
                            inputMode="numeric"
                            maxLength={14}
                            value={cpf}
                            onChange={(event) => {
                                setCpf(formatarCPF(event.target.value));
                                setErro("");
                                setValidado(false);
                            }}
                        />
                    </div>

                    <div className="grupo-formulario">
                        <label htmlFor="campoSenha">
                            <i className="bi bi-key me-1"></i> Senha
                        </label>
                        <input
                            type="password"
                            id="campoSenha"
                            name="senha"
                            className="entrada-cadastro"
                            placeholder="Digite sua senha"
                            value={senha}
                            onChange={(event) => {
                                setSenha(event.target.value);
                                setValidado(false);
                            }}
                        />
                    </div>

                    <div className="grupo-formulario">
                        <label htmlFor="campoConfirmarSenha">
                            <i className="bi bi-shield-check me-1"></i>
                        Confirmar senha
                        </label>
                        <input
                            type="password"
                            id="campoConfirmarSenha"
                            name="confirmarSenha"
                            className="entrada-cadastro"
                            placeholder="Digite a senha novamente"
                            value={confirmarSenha}
                            onChange={(event) => {
                                setConfirmarSenha(event.target.value);
                                setValidado(false);
                            }}
                        />
                    </div>

                    {erro && (
                        <div className="alerta-erro" role="alert">
                            {erro}
                        </div>
                    )}

                    {validado && (
                        <div className="alerta-sucesso" role="status">
                            Campos validados! Falta conectar à API.
                        </div>
                    )}

                    <button type="submit" className="botao-cadastro">
                        <i className="bi bi-person-plus me-2"></i>
                        Criar minha conta
                    </button>

                </form>

                <div className="link-login">
                <p>Já possui uma conta?</p>
                <Link to="/login">
                    <i className="bi bi-box-arrow-in-right me-1"></i>
                    Entrar na minha conta
                </Link>
                </div>

            </div>
        </main>
    )
}
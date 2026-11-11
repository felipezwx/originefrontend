import { useContext, useState } from "react";
import { UsuarioContext } from "../UsuarioContext";
import { validarEmail } from "../utils/validacoes";
import { Link, useNavigate } from "react-router-dom";
import { entrarUsuario } from "../services/api";
import "../styles/login.css";

export function Login() {

    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [erro, setErro] = useState("");
    const [carregando, setCarregando] = useState(false);

    const navigate = useNavigate();
    const contexto = useContext(UsuarioContext);

    async function handleLogin() {
        if (carregando) return;

        setErro("");

        if(email.trim() === "") {
            setErro("Por favor, informe seu e-mail.");
            return;
        }

        if(!validarEmail(email)) {
            setErro("Digite um e-mail válido.");
            return;
        }

        if(senha.trim() === "") {
            setErro("Por favor, informe sua senha.");
            return;
        }

        setCarregando(true);

        try {
            const resultado = await entrarUsuario({
                email: email.trim().toLowerCase(),
                senha
            });

            localStorage.setItem("token", resultado.token);
            contexto?.setUsuario(resultado.usuario);
            navigate("/");
        } catch (erro) {
            if (erro instanceof Error) {
                setErro(erro.message);
            } else {
                setErro("Erro ao fazer login.");
            }
        } finally {
            setCarregando(false);
        }

    }

    return (
        <main className="container-login">
            <div className="cartao-login">
                <div className="logo-login">
                    <img src="/imagens/logo.png" alt="Originie Audiovisual" />
                </div>

                <div className="icone-login">
                    <i className="bi bi-person-circle"></i>
                </div>

                <h1 className="titulo-login">Bem-vindo</h1>

                <p className="subtitulo-login">
                    Entre para acessar a Originie
                </p>

                <form noValidate onSubmit={(event) =>  { event.preventDefault(); handleLogin(); }}>
                    <div className="grupo-formulario">
                        <label htmlFor="campoEmail">
                            <i className="bi bi-envelope me-1"></i> Email
                        </label>

                        <input
                            type="email"
                            id="campoEmail"
                            name="email"
                            className="entrada-login"
                            placeholder="seu@email.com"
                            value={email}
                            onChange={(event) => {
                                setEmail(event.target.value);
                                setErro("");
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
                            className="entrada-login"
                            placeholder="Sua senha"
                            value={senha}
                            onChange={(event) => {
                                setSenha(event.target.value);
                                setErro("");
                            }}
                        />
                    </div>

                    {erro && (
                        <p className="mensagem-erro" role="alert">
                            {erro}
                        </p>
                    )}

                    <button type="submit" className="botao-entrar" disabled={carregando}>
                        <i className="bi bi-box-arrow-in-right me-2"></i>
                        {carregando ? "Entrando..." : "Entrar"}
                    </button>
                </form>

                <div className="divisor">ou</div>

                <div className="area-cadastro">
                    <p className="texto-cadastro">
                        Ainda não possui uma conta?
                    </p>

                    <Link to="/cadastro" className="botao-secundario">
                        <i className="bi bi-person-plus me-2"></i>
                        Criar uma conta
                    </Link>
                </div>

                <div className="dica-login">
                    <i className="bi bi-info-circle me-2"></i>
                    <strong>Acesso seguro</strong>
                    <p>Entre com seu email e senha cadastrados para acessar o site.</p>
                </div>
            </div>
        </main>
    );
}

import { useContext, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { UsuarioContext } from "../UsuarioContext";
import { atualizarPerfil } from "../services/api";
import { validarCPF, validarSenha } from "../utils/validacoes";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";

export function MinhaConta() {
    const contexto = useContext(UsuarioContext);
    const usuario = contexto?.usuario;
    const navigate = useNavigate();
    const [editando, setEditando] = useState(false);

    const [salvando, setSalvando] = useState(false);
    const [aviso, setAviso] = useState("");

    async function salvarPerfil(formulario: HTMLFormElement) {
        if (salvando) return;

        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/login", { replace: true });
            return;
        }

        const campos = new FormData(formulario);
        const nome = String(campos.get("nome") ?? "").trim();
        const cpf = String(campos.get("cpf") ?? "").replace(/\D/g, "");
        const senhaAtual = String(campos.get("senhaAtual") ?? "");
        const novaSenha = String(campos.get("novaSenha") ?? "");
        const confirmarSenha = String(campos.get("confirmarSenha") ?? "");

        if (!nome) {
            setAviso("Informe seu nome.");
            return;
        }

        if (!validarCPF(cpf)) {
            setAviso("Digite um CPF válido.");
            return;
        }

        if (novaSenha === senhaAtual) {
            setAviso("Escolha uma senha diferente da atual.");
            return;
        }

        if (!validarSenha(novaSenha)) {
            setAviso("Use pelo menos 8 caracteres, com maiúscula, minúscula, número e símbolo.");
            return;
        }

        if (novaSenha !== confirmarSenha) {
            setAviso("A confirmação precisa ser igual à nova senha.");
            return;
        }

        setAviso("");
        setSalvando(true);

        try {
            const atualizado = await atualizarPerfil(token, { nome, cpf, senhaAtual, novaSenha });

            if (localStorage.getItem("token") !== token) return;

            contexto?.setUsuario(atualizado);
            setEditando(false);
            setAviso("Perfil atualizado com sucesso.");
        } catch (erro) {
            setAviso(erro instanceof Error ? erro.message : "Erro ao atualizar o perfil.");
        } finally {
            setSalvando(false);
        }
    }

    function sairDaConta() {
        localStorage.removeItem("token");
        contexto?.setUsuario(null);
        navigate("/", { replace: true });
    }

    if (!localStorage.getItem("token")) {
        return <Navigate to="/login" replace />;
    }

    return (
        <div className="pagina-originie">
            <Header />

            <main className="container py-5 pagina-conta">
                <h1 className="titulo-secao mb-4">Minha conta</h1>
                {aviso && <p role="status">{aviso}</p>}

                {usuario ? (
                    editando ? (
                        <form
                            className="row g-3 mb-4 painel-conta"
                            onChange={() => setAviso("")}
                            onSubmit={(event) => {
                                event.preventDefault();
                                salvarPerfil(event.currentTarget);
                            }}
                        >
                            <div className="col-md-6">
                                <label htmlFor="nome" className="form-label">Nome Completo</label>
                                <input
                                    id="nome"
                                    name="nome"
                                    className="form-control"
                                    defaultValue={usuario.nome}
                                    autoFocus
                                />
                            </div>

                            <div className="col-md-6">
                                <label htmlFor="cpf" className="form-label">CPF</label>
                                <input
                                    id="cpf"
                                    name="cpf"
                                    className="form-control"
                                    inputMode="numeric"
                                    defaultValue={usuario.cpf ?? ""}
                                />
                            </div>

                            <div className="col-md-6">
                                <label htmlFor="email" className="form-label">E-mail</label>
                                <input
                                    id="email"
                                    type="email"
                                    className="form-control"
                                    value={usuario.email}
                                    readOnly
                                />
                            </div>

                            <div className="col-md-6">
                                <label htmlFor="senhaAtual" className="form-label">Senha atual</label>
                                <input
                                    id="senhaAtual"
                                    name="senhaAtual"
                                    type="password"
                                    autoComplete="current-password"
                                    className="form-control"
                                    required
                                />
                            </div>

                            <div className="col-md-6">
                                <label htmlFor="novaSenha" className="form-label">Nova senha</label>
                                <input
                                    id="novaSenha"
                                    name="novaSenha"
                                    type="password"
                                    autoComplete="new-password"
                                    className="form-control"
                                    required
                                />
                            </div>

                            <div className="col-md-6">
                                <label htmlFor="confirmarSenha" className="form-label">
                                    Confirmar nova senha
                                </label>
                                <input
                                    id="confirmarSenha"
                                    name="confirmarSenha"
                                    type="password"
                                    autoComplete="new-password"
                                    className="form-control"
                                    required
                                />
                            </div>

                            <div className="col-12 d-flex flex-wrap gap-2">
                                <button type="submit" className="botao-vermelho" disabled={salvando}>
                                    {salvando ? "Salvando..." : "Salvar alterações"}
                                </button>

                                <button
                                    type="button"
                                    className="btn btn-outline-light"
                                    disabled={salvando}
                                    onClick={() => {
                                        setAviso("");
                                        setEditando(false);
                                    }}
                                >
                                    Cancelar edição
                                </button>
                            </div>
                        </form>
                    ) : (
                        <div className="painel-conta mb-4">
                            <dl>
                                <dt>Nome completo</dt>
                                <dd className="mb-3">{usuario.nome}</dd>

                                <dt>E-mail</dt>
                                <dd className="mb-3">{usuario.email}</dd>

                                <dt>CPF</dt>
                                <dd className="mb-4">{usuario.cpf || "Não informado"}</dd>
                            </dl>

                            <button 
                                type="button"
                                className="btn btn-outline-light"
                                onClick={() => setEditando(true)}
                            >
                                Editar perfil
                            </button>
                        </div>
                    )
                ) : (
                    <p role="status">Aguardando os dados da conta...</p>
                )}

                <button
                    type="button"
                    className="btn sair-conta"
                    onClick={sairDaConta}
                >
                    Sair da conta
                </button>
            </main>

            <Footer />
        </div>
    );
}
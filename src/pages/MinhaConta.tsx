import { useContext, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { UsuarioContext } from "../UsuarioContext";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";

export function MinhaConta() {
    const contexto = useContext(UsuarioContext);
    const usuario = contexto?.usuario;
    const navigate = useNavigate();
    const [editando, setEditando] = useState(false);

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

            <main className="container py-5">
                <h1 className="titulo-secao mb-4">Minha conta</h1>

                {usuario ? (
                    editando ? (
                        <div className="row g-3 mb-4">
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

                            <div className="col-12">
                                <button
                                    type="button"
                                    className="btn btn-outline-light"
                                    onClick={() => setEditando(false)}
                                >
                                    Cancelar edição
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="mb-4">
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
                    className="botao-vermelho"
                    onClick={sairDaConta}
                >
                    Sair da conta
                </button>
            </main>

            <Footer />
        </div>
    );
}
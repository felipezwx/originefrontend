import { useContext } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { UsuarioContext } from "../UsuarioContext";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";

export function MinhaConta() {
    const contexto = useContext(UsuarioContext);
    const usuario = contexto?.usuario;
    const navigate = useNavigate();

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
                    <dl>
                        <dt>Nome completo</dt>
                        <dd className="mb-3">{usuario.nome}</dd>

                        <dt>E-mail</dt>
                        <dd className="mb-3">{usuario.email}</dd>

                        <dt>CPF</dt>
                        <dd className="mb-4">{usuario.cpf || "Não informado"}</dd>
                    </dl>
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
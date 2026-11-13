import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { UsuarioContext } from "../UsuarioContext";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";

export function Orcamento() {
    const usuario = useContext(UsuarioContext)?.usuario;
    const token = localStorage.getItem("token");

    if (!token) {
        return <Navigate to="/login" state={{ voltarPara: "/orcamento" }} replace />;
    }

    return (
        <div className="pagina-originie">
            <Header />

            <main className="container py-5">
                <h1 className="titulo-secao">Solicitar orçamento</h1>

                {usuario ? (
                    <div className="row g-3 mt-2">
                        <div className="col-md-6">
                            <label htmlFor="nome" className="form-label">Nome completo</label>
                            <input
                                id="nome"
                                type="text"
                                className="form-control"
                                value={usuario.nome}
                                readOnly
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
                            <label htmlFor="telefone" className="form-label">WhatsApp com DDD</label>
                            <input
                                id="telefone"
                                name="telefone"
                                type="tel"
                                autoComplete="tel"
                                className="form-control"
                                placeholder="(44) 99999-9999"
                            />
                        </div>

                        <div className="col-12">
                            <label htmlFor="mensagem" className="form-label">Conte sua ideia</label>
                            <textarea
                                id="mensagem"
                                name="mensagem"
                                className="form-control"
                                rows={5}
                                maxLength={5000}
                                required
                                placeholder="Que vídeo você imagina? Se já tiver uma data ou um local, conte aqui."
                            />
                        </div>
                    </div>
                ) : (
                    <p role="status">Aguardando os dados da conta...</p>
                )}
            </main>

            <Footer />
        </div>
    );
}
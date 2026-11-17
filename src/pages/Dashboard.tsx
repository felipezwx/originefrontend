import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { listarServicos } from "../services/api";

export function Dashboard() {
    const [total, setTotal] = useState<number | null>(null);
    const [erro, setErro] = useState("");

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) return;

        let ativo = true;

        listarServicos(token, 1)
            .then((resultado) => {
                if (ativo) setTotal(resultado.total);
            })
            .catch(() => {
                if (ativo) setErro("Não foi possível carregar o total de serviços.");
            });

        return () => {
            ativo = false;
        };
    }, []);

    return (
        <main className="container py-5">
            <Link to="/">Voltar ao site</Link>
            <h1 className="my-4">Painel administrativo</h1>

            <section className="card bg-dark text-light border-secondary p-4">
                <h2 className="h5">Total de serviços</h2>

                {erro ? (
                    <p role="alert">{erro}</p>
                ) : total === null ? (
                    <p role="status">Carregando...</p>
                ) : (
                    <p className="display-5 fw-bold">{total}</p>
                )}

                <Link to="/painel/servicos" className="link-light">
                    Ver serviços →
                </Link>
            </section>

            <Link
                to="/painel/orcamentos"
                className="btn btn-outline-light mt-3"
            >
                Ver orçamentos
            </Link>
            
        </main>
    );
}
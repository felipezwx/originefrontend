import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { listarServicos } from "../services/api";
import "../styles/dashboard.css";

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
        <div className="pagina-dashboard">
            <header className="dashboard-barra">
                <div className="dashboard-largura dashboard-barra-conteudo">
                    <Link to="/" aria-label="Originie — voltar ao site">
                        <img
                            src="/imagens/logo.png"
                            alt="Originie"
                            className="dashboard-logo"
                        />
                    </Link>

                    <nav aria-label="Navegação do administrador">
                        <Link to="/">Ver site</Link>
                        <Link to="/minha-conta">
                            <i className="bi bi-person-circle" aria-hidden="true"></i>
                            Minha conta
                        </Link>
                    </nav>
                </div>
            </header>

            <main className="dashboard-largura dashboard-conteudo">
                <div className="dashboard-introducao">
                    <div>
                        <h1>Painel administrativo</h1>
                        <p>Gerencie os clientes e acompanhe cada trabalho até a entrega.</p>
                    </div>

                    <Link
                        to="/painel/orcamentos/novo"
                        className="dashboard-botao"
                    >
                        <i className="bi bi-plus-lg" aria-hidden="true"></i>
                        Novo orçamento
                    </Link>
                </div>

                <nav className="dashboard-grade" aria-label="Áreas do painel">
                    {[
                        {
                            titulo: "Serviços",
                            descricao: "Organize o catálogo, os preços e as descrições.",
                            caminho: "/painel/servicos",
                            icone: "bi-camera-video"
                        },
                        {
                            titulo: "Orçamentos",
                            descricao: "Consulte os pedidos e atualize o andamento.",
                            caminho: "/painel/orcamentos",
                            icone: "bi-file-earmark-text"
                        },
                        {
                            titulo: "Clientes",
                            descricao: "Cadastre clientes e mantenha os contatos atualizados.",
                            caminho: "/painel/clientes",
                            icone: "bi-people"
                        },
                        {
                            titulo: "Projetos finalizados",
                            descricao: "Confira as entregas, os valores e as datas de conclusão.",
                            caminho: "/painel/projetos",
                            icone: "bi-check2-circle"
                        }
                    ].map(area => (
                        <Link
                            key={area.caminho}
                            to={area.caminho}
                            className="dashboard-cartao"
                        >
                            <span className="dashboard-cartao-topo">
                                <i
                                    className={`bi ${area.icone} dashboard-icone`}
                                    aria-hidden="true"
                                ></i>
                                <i
                                    className="bi bi-arrow-up-right dashboard-seta"
                                    aria-hidden="true"
                                ></i>
                            </span>

                            <h2>{area.titulo}</h2>
                            <p>{area.descricao}</p>
                        </Link>
                    ))}
                </nav>

                <div className="dashboard-resumo">
                    <i className="bi bi-camera-video" aria-hidden="true"></i>

                    {erro ? (
                        <p role="alert">{erro}</p>
                    ) : total === null ? (
                        <p role="status">Consultando o catálogo...</p>
                    ) : (
                        <p>
                            <strong>{total}</strong>
                            {" "}{total === 1 ? "serviço cadastrado" : "serviços cadastrados"}
                            {" "}no catálogo.
                        </p>
                    )}
                </div>
            </main>
        </div>
    );
}
import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { listarServicos, type Servico } from "../services/api";

const moeda = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL"
});

export function Servicos() {
    const token = localStorage.getItem("token");

    const [servicos, setServicos] = useState<Servico[]>([]);
    const [pagina, setPagina] = useState(1);
    const [totalPaginas, setTotalPaginas] = useState(0);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState("");

    useEffect(() => {
        if (!token) return;

        let ativo = true;

        async function carregarServicos(tokenAtual: string) {
            try {
                const resultado = await listarServicos(tokenAtual, pagina);

                if (ativo) {
                    setServicos(resultado.dados);
                    setTotalPaginas(resultado.totalPaginas);
                }
            } catch (erro) {
                if (ativo) {
                    setErro(erro instanceof Error ? erro.message : "Erro ao listar os serviços.");
                }
            } finally {
                if (ativo) setCarregando(false);
            }
        }

        carregarServicos(token);

        return () => {
            ativo = false;
        };
    }, [pagina, token]);

    function mudarPagina(novaPagina: number) {
        setCarregando(true);
        setErro("");
        setPagina(novaPagina);
    }

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    return (
        <main className="container py-4">
            <Link to="/">Voltar ao início</Link>
            <h1 className="my-4">Serviços</h1>

            {carregando && <p role="status">Carregando serviços...</p>}
            {erro && <p className="alert alert-danger" role="alert">{erro}</p>}

            {!carregando && !erro && (
                <>
                    {servicos.length === 0 ? (
                        <p>Nenhum serviço encontrado.</p>
                    ) : (
                        <div className="table-responsive">
                            <table className="table align-middle">
                                <thead>
                                    <tr>
                                        <th scope="col">ID</th>
                                        <th scope="col">Serviço</th>
                                        <th scope="col">Categoria</th>
                                        <th scope="col">Preço</th>
                                        <th scope="col">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {servicos.map((servico) => (
                                        <tr key={servico.id}>
                                            <td>{servico.id}</td>
                                            <td>{servico.nome}</td>
                                            <td>{servico.categoria}</td>
                                            <td>{moeda.format(Number(servico.preco))}</td>
                                            <td>{servico.ativo === 1 ? "Ativo" : "Inativo"}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </>
            )}

            {totalPaginas > 1 && (
                <nav aria-label="Paginação de serviços" className="d-flex align-items-center gap-3">
                    <button
                        className="btn btn-outline-secondary"
                        disabled={carregando || pagina === 1}
                        onClick={() => mudarPagina(pagina - 1)}
                    >
                        Anterior
                    </button>

                    <span>Página {pagina} de {totalPaginas}</span>

                    <button
                        className="btn btn-outline-secondary"
                        disabled={carregando || pagina >= totalPaginas}
                        onClick={() => mudarPagina(pagina + 1)}
                    >
                        Próxima
                    </button>
                </nav>
            )}
        </main>
    );
}
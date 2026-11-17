import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { excluirOrcamento, listarOrcamentos, type Orcamento } from "../services/api";
import "../styles/servicos.css";

export function OrcamentosAdmin() {
    const token = localStorage.getItem("token");

    const [orcamentos, setOrcamentos] = useState<Orcamento[]>([]);
    const [pagina, setPagina] = useState(1);
    const [totalPaginas, setTotalPaginas] = useState(0);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState("");
    const [excluindo, setExcluindo] = useState(false);
    const [erroExclusao, setErroExclusao] = useState("");
    const [mensagem, setMensagem] = useState("");
    const [versaoLista, setVersaoLista] = useState(0);

    useEffect(() => {
        if (!token) return;

        let ativo = true;

        listarOrcamentos(token, pagina)
            .then((resultado) => {
                if (ativo) {
                    setOrcamentos(resultado.dados);
                    setTotalPaginas(resultado.totalPaginas);
                }
            })
            .catch((erro) => {
                if (ativo) {
                    setErro(
                        erro instanceof Error
                            ? erro.message
                            : "Erro ao carregar os orçamentos."
                    );
                }
            })
            .finally(() => {
                if (ativo) setCarregando(false);
            });

        return () => {
            ativo = false;
        };
    }, [token, pagina, versaoLista]);

    async function confirmarExclusao(orcamento: Orcamento) {
        if (!token || excluindo) return;

        const confirmou = window.confirm(
            `Excluir o orçamento ${orcamento.id} de ${orcamento.nome_cliente}?`
        );

        if (!confirmou) return;

        setExcluindo(true);
        setErroExclusao("");
        setMensagem("");

        try {
            const resultado = await excluirOrcamento(token, orcamento.id);

            setMensagem(resultado.mensagem);
            setErro("");
            setCarregando(true);
            setPagina(1);
            setVersaoLista(anterior => anterior + 1);
        } catch (erro) {
            setErroExclusao(
                erro instanceof Error ? erro.message : "Erro ao excluir o orçamento."
            );
        } finally {
            setExcluindo(false);
        }
    }

    function mudarPagina(novaPagina: number) {
        setErro("");
        setCarregando(true);
        setPagina(novaPagina);
    }

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    return (
        <main className="pagina-servicos container py-4">
            <Link to="/painel">Voltar ao painel</Link>

            <div className="cabecalho-servicos">
                <h1>Orçamentos</h1>
                <Link to="/painel/orcamentos/novo" className="btn btn-danger">
                    Novo orçamento
                </Link>
            </div>

            {mensagem && (
                <p role="status" className="alert alert-success">{mensagem}</p>
            )}

            {erroExclusao && (
                <p role="alert" className="alert alert-danger">{erroExclusao}</p>
            )}

            {carregando && <p role="status">Carregando orçamentos...</p>}
            {erro && <p role="alert" className="alert alert-danger">{erro}</p>}

            {!carregando && !erro && (
                <>
                    {orcamentos.length === 0 ? (
                        <p>Nenhum orçamento encontrado.</p>
                    ) : (
                        <div className="table-responsive painel-tabela">
                            <table className="table align-middle tabela-admin">
                                <thead>
                                    <tr>
                                        <th scope="col">ID</th>
                                        <th scope="col">Cliente</th>
                                        <th scope="col">Serviço</th>
                                        <th scope="col">Status</th>
                                        <th scope="col">Data</th>
                                        <th scope="col">Ações</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orcamentos.map((orcamento) => (
                                        <tr key={orcamento.id}>
                                            <td>{orcamento.id}</td>
                                            <td>{orcamento.nome_cliente}</td>
                                            <td>{orcamento.servico || "Não informado"}</td>
                                            <td>{orcamento.status}</td>
                                            <td>
                                                {new Date(orcamento.criado_em)
                                                    .toLocaleDateString("pt-BR")}
                                            </td>
                                            <td>
                                                <Link
                                                    to={`/painel/orcamentos/${orcamento.id}/editar`}
                                                    className="btn btn-outline-light btn-sm"
                                                >
                                                    Editar
                                                </Link>
                                                <button
                                                    type="button"
                                                    className="btn btn-outline-danger btn-sm ms-2"
                                                    disabled={excluindo || carregando}
                                                    onClick={() => confirmarExclusao(orcamento)}
                                                >
                                                    Excluir
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </>
            )}

            {!erro && totalPaginas > 1 && (
                <nav
                    aria-label="Paginação de orçamentos"
                    className="d-flex align-items-center gap-3 mt-3"
                >
                    <button
                        type="button"
                        className="btn btn-outline-secondary"
                        disabled={carregando || excluindo || pagina === 1}
                        onClick={() => mudarPagina(pagina - 1)}
                    >
                        Anterior
                    </button>

                    <span>Página {pagina} de {totalPaginas}</span>

                    <button
                        type="button"
                        className="btn btn-outline-secondary"
                        disabled={carregando || excluindo || pagina >= totalPaginas}
                        onClick={() => mudarPagina(pagina + 1)}
                    >
                        Próxima
                    </button>
                </nav>
            )}
        </main>
    );
}
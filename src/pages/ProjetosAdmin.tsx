import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { excluirProjeto, listarProjetos, type Projeto } from "../services/api";
import "../styles/servicos.css";

const moeda = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL"
});

export function ProjetosAdmin() {
    const token = localStorage.getItem("token");

    const [projetos, setProjetos] = useState<Projeto[]>([]);
    const [pagina, setPagina] = useState(1);
    const [totalPaginas, setTotalPaginas] = useState(0);
    const [carregando, setCarregando] = useState(true);
    const [excluindo, setExcluindo] = useState(false);
    const [erro, setErro] = useState("");
    const [erroExclusao, setErroExclusao] = useState("");
    const [mensagem, setMensagem] = useState("");
    const [versaoLista, setVersaoLista] = useState(0);

    useEffect(() => {
        if (!token) return;

        let ativo = true;

        listarProjetos(token, pagina)
            .then((resultado) => {
                if (ativo) {
                    setProjetos(resultado.dados);
                    setTotalPaginas(resultado.totalPaginas);
                }
            })
            .catch((erro) => {
                if (ativo) {
                    setErro(
                        erro instanceof Error ? erro.message : "Erro ao carregar os projetos."
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

    function mudarPagina(novaPagina: number) {
        setErro("");
        setCarregando(true);
        setPagina(novaPagina);
    }

    async function confirmarExclusao(projeto: Projeto) {
        if (!token || excluindo) return;

        const confirmou = window.confirm(
            `Excluir o projeto ${projeto.id} de ${projeto.nome_cliente}? ` +
            `O orçamento ${projeto.id_contato} voltará para Pendente.`
        );

        if (!confirmou) return;

        setExcluindo(true);
        setErroExclusao("");
        setMensagem("");

        try {
            const resultado = await excluirProjeto(token, projeto.id);

            setMensagem(resultado.mensagem);
            setErro("");
            setCarregando(true);
            setPagina(1);
            setVersaoLista(anterior => anterior + 1);
        } catch (erro) {
            setErroExclusao(
                erro instanceof Error ? erro.message : "Erro ao excluir o projeto."
            );
        } finally {
            setExcluindo(false);
        }
    }

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    return (
        <main className="pagina-servicos container py-4">
            <Link to="/painel" className="botao-voltar">Voltar ao painel</Link>

            <div className="cabecalho-servicos">
                <h1>Projetos finalizados</h1>
                <Link to="/painel/projetos/novo" className="btn btn-danger">
                    Registrar projeto
                </Link>
            </div>

            {mensagem && (
                <p role="status" className="alert alert-success">{mensagem}</p>
            )}
            {erroExclusao && (
                <p role="alert" className="alert alert-danger">{erroExclusao}</p>
            )}
            {carregando && <p role="status">Carregando projetos...</p>}
            {erro && <p role="alert" className="alert alert-danger">{erro}</p>}

            {!carregando && !erro && (
                <>
                    {projetos.length === 0 ? (
                        <p>Nenhum projeto finalizado encontrado.</p>
                    ) : (
                        <div className="table-responsive painel-tabela">
                            <table className="table align-middle tabela-admin">
                                <thead>
                                    <tr>
                                        <th scope="col">ID</th>
                                        <th scope="col">Orçamento</th>
                                        <th scope="col">Cliente</th>
                                        <th scope="col">Serviço</th>
                                        <th scope="col">Valor final</th>
                                        <th scope="col">Conclusão</th>
                                        <th scope="col">Ações</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {projetos.map(projeto => (
                                        <tr key={projeto.id}>
                                            <td>{projeto.id}</td>
                                            <td>{projeto.id_contato}</td>
                                            <td>{projeto.nome_cliente}</td>
                                            <td>{projeto.servico || "Não informado"}</td>
                                            <td>{moeda.format(Number(projeto.valor_final))}</td>
                                            <td>
                                                {projeto.data_conclusao.split("-").reverse().join("/")}
                                            </td>
                                            <td>
                                                <Link
                                                    to={`/painel/projetos/${projeto.id}/editar`}
                                                    className="btn btn-outline-light btn-sm"
                                                >
                                                    Editar
                                                </Link>
                                                <button
                                                    type="button"
                                                    className="btn btn-outline-danger btn-sm ms-2"
                                                    disabled={excluindo || carregando}
                                                    onClick={() => confirmarExclusao(projeto)}
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
                    aria-label="Paginação de projetos"
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
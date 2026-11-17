import { useEffect, useState, } from "react";
import { Link, Navigate } from "react-router-dom";
import { excluirServico, listarServicos, type Servico } from "../services/api";
import "../styles/servicos.css";

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
    const [salvando, setSalvando] = useState(false);
    const [mensagemCadastro, setMensagemCadastro] = useState("");
    const [versaoLista, setVersaoLista] = useState(0);

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
    }, [pagina, token, versaoLista]);

    async function confirmarExclusao(servico: Servico) {
        if (!token || salvando) return;

        const confirmou = window.confirm(`Excluir o serviço "${servico.nome}"?`);
        if (!confirmou) return;

        setSalvando(true);
        setMensagemCadastro("");

        try {
            const resultado = await excluirServico(token, servico.id);

            setMensagemCadastro(resultado.mensagem);
            setErro("");
            setCarregando(true);
            setPagina(1);
            setVersaoLista(anterior => anterior + 1);
        } catch (erro) {
            window.alert(erro instanceof Error ? erro.message : "Erro ao excluir o serviço.");
        } finally {
            setSalvando(false);
        }
    }

    function mudarPagina(novaPagina: number) {
        setCarregando(true);
        setErro("");
        setPagina(novaPagina);
    }

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    return (
        <main className="pagina-servicos container py-4">
            <Link to="/">Voltar ao início</Link>
            <div className="cabecalho-servicos">
                <h1>Serviços</h1>

                <Link to="/painel/servicos/novo" className="btn btn-danger">
                    Novo serviço
                </Link>
                    
            </div>

            {mensagemCadastro && (
                <p role="status" className="alert alert-success">
                    {mensagemCadastro}
                </p>
            )}

            {carregando && <p role="status">Carregando serviços...</p>}
            {erro && <p className="alert alert-danger" role="alert">{erro}</p>}

            {!carregando && !erro && (
                <>
                    {servicos.length === 0 ? (
                        <p>Nenhum serviço encontrado.</p>
                    ) : (
                        <div className="table-responsive painel-tabela">
                            <table className="table align-middle tabela-admin">
                                <thead>
                                    <tr>
                                        <th scope="col">ID</th>
                                        <th scope="col">Serviço</th>
                                        <th scope="col">Categoria</th>
                                        <th scope="col">Preço</th>
                                        <th scope="col">Status</th>
                                        <th scope="col">Ações</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {servicos.map((servico) => (
                                        <tr key={servico.id}>
                                            <td>{servico.id}</td>
                                            <td>{servico.nome}</td>
                                            <td>{servico.categoria}</td>
                                            <td>{moeda.format(Number(servico.preco))}</td>
                                            <td>
                                                <span className={servico.ativo === 1 ? "status-ativo" : "status-inativo"}>
                                                    {servico.ativo === 1 ? "Ativo" : "Inativo"}
                                                </span>
                                            </td>
                                            <td>
                                                <Link
                                                    to={`/painel/servicos/${servico.id}/editar`}
                                                    className="btn btn-outline-light btn-sm"
                                                >
                                                    Editar
                                                </Link>
                                                <button
                                                    type="button"
                                                    className="btn btn-outline-danger btn-sm ms-2"
                                                    disabled={salvando}
                                                    onClick={() => confirmarExclusao(servico)}
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
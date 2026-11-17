import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { excluirCliente, listarClientes, type Cliente } from "../services/api";
import "../styles/servicos.css";

export function ClientesAdmin() {
    const token = localStorage.getItem("token");

    const [clientes, setClientes] = useState<Cliente[]>([]);
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

        listarClientes(token, pagina)
            .then((resultado) => {
                if (ativo) {
                    setClientes(resultado.dados);
                    setTotalPaginas(resultado.totalPaginas);
                }
            })
            .catch((erro) => {
                if (ativo) {
                    setErro(
                        erro instanceof Error ? erro.message : "Erro ao carregar os clientes."
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

    async function confirmarExclusao(cliente: Cliente) {
        if (!token || excluindo) return;

        if (!window.confirm(`Excluir o cliente "${cliente.nome}"?`)) return;

        setExcluindo(true);
        setErroExclusao("");
        setMensagem("");

        try {
            const resultado = await excluirCliente(token, cliente.id);

            setMensagem(resultado.mensagem);
            setErro("");
            setCarregando(true);
            setPagina(1);
            setVersaoLista(anterior => anterior + 1);
        } catch (erro) {
            setErroExclusao(
                erro instanceof Error ? erro.message : "Erro ao excluir o cliente."
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
            <Link to="/painel">Voltar ao painel</Link>

            <div className="cabecalho-servicos">
                <h1>Clientes</h1>
                <Link to="/painel/clientes/novo" className="btn btn-danger">
                    Novo cliente
                </Link>
            </div>

            {mensagem && (
                <p role="status" className="alert alert-success">{mensagem}</p>
            )}
            {erroExclusao && (
                <p role="alert" className="alert alert-danger">{erroExclusao}</p>
            )}
            {carregando && <p role="status">Carregando clientes...</p>}
            {erro && <p role="alert" className="alert alert-danger">{erro}</p>}

            {!carregando && !erro && (
                <>
                    {clientes.length === 0 ? (
                        <p>Nenhum cliente encontrado.</p>
                    ) : (
                        <div className="table-responsive painel-tabela">
                            <table className="table align-middle tabela-admin">
                                <thead>
                                    <tr>
                                        <th scope="col">ID</th>
                                        <th scope="col">Nome</th>
                                        <th scope="col">E-mail</th>
                                        <th scope="col">Telefone</th>
                                        <th scope="col">Ações</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {clientes.map(cliente => (
                                        <tr key={cliente.id}>
                                            <td>{cliente.id}</td>
                                            <td>{cliente.nome}</td>
                                            <td>{cliente.email}</td>
                                            <td>{cliente.telefone || "Não informado"}</td>
                                            <td>
                                                <Link
                                                    to={`/painel/clientes/${cliente.id}/editar`}
                                                    className="btn btn-outline-light btn-sm"
                                                >
                                                    Editar
                                                </Link>
                                                <button
                                                    type="button"
                                                    className="btn btn-outline-danger btn-sm ms-2"
                                                    disabled={excluindo || carregando}
                                                    onClick={() => confirmarExclusao(cliente)}
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
                    aria-label="Paginação de clientes"
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
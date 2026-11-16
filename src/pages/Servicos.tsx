import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { listarServicos, type Servico } from "../services/api";
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
    const [cadastroAberto, setCadastroAberto] = useState(false);

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
        <main className="pagina-servicos container py-4">
            <Link to="/">Voltar ao início</Link>
            <h1 className="my-4">Serviços</h1>

            <button
                type="button"
                className="btn btn-outline-light mb-3"
                aria-expanded={cadastroAberto}
                aria-controls="cadastro-servico"
                onClick={() => setCadastroAberto(!cadastroAberto)}
            >
                {cadastroAberto ? "Fechar cadastro" : "Novo serviço"}
            </button>

            <section id="cadastro-servico" hidden={!cadastroAberto} className="mb-4">
                <h2 className="h4 mb-3">Cadastrar serviço</h2>

                <label htmlFor="nome-servico" className="form-label">
                    Nome do serviço
                </label>
                <input
                    id="nome-servico"
                    name="nome"
                    type="text"
                    className="form-control"
                    maxLength={100}
                    required
                />

                <label htmlFor="categoria-servico" className="form-label mt-3">
                    Categoria
                </label>
                <select id="categoria-servico" name="categoria" className="form-select" defaultValue="" required>
                    <option value="" disabled>Selecione uma categoria</option>
                    <option value="comercial">Comercial</option>
                    <option value="artistico">Artístico</option>
                    <option value="social">Social</option>
                    <option value="evento">Evento</option>
                </select>

                <label htmlFor="preco-servico" className="form-label mt-3">
                    Preço (R$)
                </label>
                <input
                    id="preco-servico"
                    name="preco"
                    type="number"
                    min="0"
                    max="99999999.99"
                    step="0.01"
                    className="form-control"
                    required
                />

                <label htmlFor="descricao-servico" className="form-label mt-3">
                    Descrição
                </label>
                <textarea
                    id="descricao-servico"
                    name="descricao"
                    rows={3}
                    className="form-control"
                    required
                />

                <label htmlFor="video-servico" className="form-label mt-3">
                    Caminho do vídeo (opcional)
                </label>
                <input
                    id="video-servico"
                    name="video"
                    type="text"
                    maxLength={255}
                    placeholder="videos/txt.mp4"
                    className="form-control"
                />

            </section>

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
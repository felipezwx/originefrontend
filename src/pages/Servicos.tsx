import { useEffect, useState, type SubmitEvent } from "react";
import { Link, Navigate } from "react-router-dom";
import { atualizarServico, cadastrarServico, excluirServico, listarServicos, type Servico } from "../services/api";
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
    const [salvando, setSalvando] = useState(false);
    const [erroCadastro, setErroCadastro] = useState("");
    const [mensagemCadastro, setMensagemCadastro] = useState("");
    const [versaoLista, setVersaoLista] = useState(0);
    const [servicoEmEdicao, setServicoEmEdicao] = useState<Servico | null>(null);

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

    async function salvarServico(evento: SubmitEvent<HTMLFormElement>) {
        evento.preventDefault();
        if (!token || salvando) return;

        const formulario = evento.currentTarget;
        const campos = new FormData(formulario);
        const nome = String(campos.get("nome") ?? "").trim();
        const slug = nome
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-+|-+$/g, "");

        setErroCadastro("");
        setMensagemCadastro("");

        if (!slug) {
            setErroCadastro("Inclua uma letra ou um número no nome do serviço.");
            return;
        }

        setSalvando(true);

        try {

            const dados = {
                    nome,
                    slug: servicoEmEdicao?.slug ?? slug,
                    categoria: String(campos.get("categoria") ?? ""),
                    preco: String(campos.get("preco") ?? ""),
                    descricao: String(campos.get("descricao") ?? "").trim(),
                    video: String(campos.get("video") ?? "").trim() || null,
                    ativo: servicoEmEdicao?.ativo ?? 1
                };

            const resultado = servicoEmEdicao
                ? await atualizarServico(token, servicoEmEdicao.id, dados)
                : await cadastrarServico(token, dados);

            formulario.reset();
            setCadastroAberto(false);
            setMensagemCadastro(resultado.mensagem);
            setErro("");
            setCarregando(true);
            if (!servicoEmEdicao) setPagina(1);
            setServicoEmEdicao(null);
            setVersaoLista(anterior => anterior + 1);
        } catch (erro) {
            setErroCadastro(
                erro instanceof Error ? erro.message : "Erro ao cadastrar o serviço."
            );
        } finally {
            setSalvando(false);
        }
    }

    async function confirmarExclusao(servico: Servico) {
        if (!token || salvando) return;

        const confirmou = window.confirm(`Excluir o serviço "${servico.nome}"?`);
        if (!confirmou) return;

        setSalvando(true);
        setMensagemCadastro("");

        try {
            const resultado = await excluirServico(token, servico.id);

            if (servicoEmEdicao?.id === servico.id) {
                setServicoEmEdicao(null);
                setCadastroAberto(false);
                setErroCadastro("");
            }

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
            <h1 className="my-4">Serviços</h1>

            <button
                type="button"
                className="btn btn-outline-light mb-3"
                aria-expanded={cadastroAberto}
                aria-controls="cadastro-servico"
                disabled={salvando}
                onClick={() => {
                    setServicoEmEdicao(null);
                    setCadastroAberto(!cadastroAberto);
                    setErroCadastro("");
                    setMensagemCadastro("");
                }}
            >
                {cadastroAberto ? "Fechar Formulário" : "Novo serviço"}
            </button>

            <form key={servicoEmEdicao?.id ?? "novo"} id="cadastro-servico" hidden={!cadastroAberto} className="mb-4" onSubmit={salvarServico}>
                <h2 className="h4 mb-3">
                    {servicoEmEdicao ? "Editar serviço" : "Cadastrar serviço"}
                </h2>

                <label htmlFor="nome-servico" className="form-label">
                    Nome do serviço
                </label>
                <input
                    id="nome-servico"
                    name="nome"
                    defaultValue={servicoEmEdicao?.nome ?? ""}
                    type="text"
                    className="form-control"
                    maxLength={100}
                    required
                />

                <label htmlFor="categoria-servico" className="form-label mt-3">
                    Categoria
                </label>
                <select id="categoria-servico" name="categoria" className="form-select" defaultValue={servicoEmEdicao?.categoria ?? ""} required>
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
                    defaultValue={servicoEmEdicao?.preco ?? ""}
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
                    defaultValue={servicoEmEdicao?.descricao ?? ""}
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
                    defaultValue={servicoEmEdicao?.video ?? ""}
                    type="text"
                    maxLength={255}
                    placeholder="videos/txt.mp4"
                    className="form-control"
                />

                {erroCadastro && (
                    <p role="alert" className="alert alert-danger mt-3">
                        {erroCadastro}
                    </p>
                )}

                <button type="submit" className="btn btn-danger mt-3" disabled={salvando}>
                    {salvando ? "Salvando..." : "Salvar serviço"}
                </button>

            </form>

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
                                                <button
                                                    type="button"
                                                    className="btn btn-outline-light btn-sm"
                                                    disabled={salvando}
                                                    onClick={() => {
                                                        setServicoEmEdicao(servico);
                                                        setCadastroAberto(true);
                                                        setErroCadastro("");
                                                        setMensagemCadastro("");
                                                    }}
                                                >
                                                    Editar
                                                </button>
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
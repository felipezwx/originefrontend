import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState, type SubmitEvent } from "react";
import { atualizarServico, cadastrarServico, consultarServico, type Servico } from "../services/api";
import "../styles/servicos.css";

export function FormularioServico() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [salvando, setSalvando] = useState(false);
    const [erroCadastro, setErroCadastro] = useState("");

    const [servico, setServico] = useState<Servico | null>(null);
    const [erroConsulta, setErroConsulta] = useState("");

    useEffect(() => {
        if (!id) return;

        const token = localStorage.getItem("token");
        if (!token) return;

        let ativo = true;

        consultarServico(token, Number(id))
            .then((resultado) => {
                if (ativo) {
                    setServico(resultado);
                    setErroConsulta("");
                }
            })
            .catch((erro) => {
                if (ativo) {
                    setServico(null);
                    setErroConsulta(
                        erro instanceof Error ? erro.message : "Erro ao buscar o serviço."
                    );
                }
            });

        return () => {
            ativo = false;
        };
    }, [id]);

async function salvarServico(evento: SubmitEvent<HTMLFormElement>) {
    evento.preventDefault();
    if (salvando) return;

    const token = localStorage.getItem("token");
    if (!token) {
        navigate("/login", { replace: true });
        return;
    }

    const campos = new FormData(evento.currentTarget);
    const nome = String(campos.get("nome") ?? "").trim();
    const slug = nome.normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");

    if (!slug) {
        setErroCadastro("Inclua uma letra ou um número no nome do serviço.");
        return;
    }

    setErroCadastro("");
    setSalvando(true);

    try {
        const dados = {
            nome,
            slug: id && servico ? servico.slug : slug,
            categoria: String(campos.get("categoria") ?? ""),
            preco: String(campos.get("preco") ?? ""),
            descricao: String(campos.get("descricao") ?? "").trim(),
            video: String(campos.get("video") ?? "").trim() || null,
            ativo: id && servico ? servico.ativo : 1
            };

        if (id) {
            if (servico?.id !== Number(id)) return;
            await atualizarServico(token, servico.id, dados);
        } else {
            await cadastrarServico(token, dados);
        }

        navigate("/painel/servicos", { replace: true });
    } catch (erro) {
        setErroCadastro(erro instanceof Error ? erro.message : "Erro ao cadastrar o serviço.");
    } finally {
        setSalvando(false);
    }
}

if (id && servico?.id !== Number(id)) {
    return (
        <main className="pagina-servicos container py-4">
            <Link to="/painel/servicos" className="botao-voltar">Voltar aos serviços</Link>
            {erroConsulta ? (
                <p role="alert" className="alert alert-danger">{erroConsulta}</p>
            ) : (
                <p role="status">Carregando serviço...</p>
            )}
        </main>
    );
}

    return (
        <main className="pagina-servicos container py-4">
            <Link to="/painel/servicos" className="botao-voltar">Voltar aos serviços</Link>

            <div className="cabecalho-servicos">
                <h1>{id ? "Editar serviço" : "Novo serviço"}</h1>
            </div>

            <form key={id ?? "novo"} id="cadastro-servico" className="mb-4" onSubmit={salvarServico}>
                <label htmlFor="nome-servico" className="form-label">
                    Nome do serviço
                </label>
                <input
                    id="nome-servico"
                    name="nome"
                    defaultValue={id ? servico?.nome : ""}
                    type="text"
                    className="form-control"
                    maxLength={100}
                    required
                />

                <label htmlFor="categoria-servico" className="form-label mt-3">
                    Categoria
                </label>
                <select id="categoria-servico" name="categoria" className="form-select" defaultValue={id ? servico?.categoria : ""} required>
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
                    defaultValue={id ? servico?.preco : ""}
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
                    defaultValue={id ? servico?.descricao : ""}
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
                    defaultValue={id ? servico?.video ?? "" : ""}
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

        </main>
    );
}
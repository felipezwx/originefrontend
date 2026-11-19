import { useEffect, useState, type SubmitEvent } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { atualizarProjeto, cadastrarProjeto, consultarProjeto, listarOrcamentos, type DadosProjeto, type Orcamento, type Projeto } from "../services/api";
import "../styles/servicos.css";

export function FormularioProjeto() {
    const { id } = useParams();

    return <CamposProjeto key={id ?? "novo"} id={id} />;
}

function CamposProjeto({ id }: { id: string | undefined }) {
    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    const [projeto, setProjeto] = useState<Projeto | null>(null);
    const [orcamentos, setOrcamentos] = useState<Orcamento[]>([]);
    const [carregando, setCarregando] = useState(true);
    const [salvando, setSalvando] = useState(false);
    const [erroConsulta, setErroConsulta] = useState("");
    const [erroSalvar, setErroSalvar] = useState("");

    useEffect(() => {
        if (!token) return;

        let ativo = true;

        async function carregar(tokenAtual: string) {
            try {
                if (id) {
                    if (!/^[1-9]\d*$/.test(id)) {
                        throw new Error("ID do projeto inválido.");
                    }

                    const resultado = await consultarProjeto(tokenAtual, Number(id));

                    if (ativo) setProjeto(resultado);
                } else {
                    const primeira = await listarOrcamentos(tokenAtual, 1);
                    const registros = [...primeira.dados];

                    for (let pagina = 2; pagina <= primeira.totalPaginas; pagina++) {
                        const resultado = await listarOrcamentos(tokenAtual, pagina);
                        registros.push(...resultado.dados);
                    }

                    if (ativo) setOrcamentos(registros);
                }
            } catch (erro) {
                if (ativo) {
                    setErroConsulta(
                        erro instanceof Error
                            ? erro.message
                            : "Erro ao carregar o formulário."
                    );
                }
            } finally {
                if (ativo) setCarregando(false);
            }
        }

        carregar(token);

        return () => {
            ativo = false;
        };
    }, [id, token]);

    async function salvar(evento: SubmitEvent<HTMLFormElement>) {
        evento.preventDefault();
        if (!token || salvando) return;

        const campos = new FormData(evento.currentTarget);
        const valorFinal = String(campos.get("valor_final") ?? "").trim();
        const dataConclusao = String(campos.get("data_conclusao") ?? "");
        const observacao = String(campos.get("observacao") ?? "").trim();

        setErroSalvar("");

        if (!/^(0|[1-9]\d{0,7})(\.\d{1,2})?$/.test(valorFinal)) {
            setErroSalvar("Informe um valor válido com até duas casas decimais.");
            return;
        }

        const dados: DadosProjeto = {
            valor_final: valorFinal,
            data_conclusao: dataConclusao,
            observacao: observacao || null
        };

        setSalvando(true);

        try {
            if (id) {
                await atualizarProjeto(token, Number(id), dados);
            } else {
                await cadastrarProjeto(token, {
                    ...dados,
                    id_contato: Number(campos.get("id_contato"))
                });
            }

            navigate("/painel/projetos", { replace: true });
        } catch (erro) {
            setErroSalvar(
                erro instanceof Error ? erro.message : "Erro ao salvar o projeto."
            );
        } finally {
            setSalvando(false);
        }
    }

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    return (
        <main className="pagina-servicos container py-4">
            <Link to="/painel/projetos" className="botao-voltar">Voltar aos projetos</Link>

            <div className="cabecalho-servicos">
                <h1>{id ? "Editar projeto" : "Finalizar projeto"}</h1>
            </div>

            {carregando && <p role="status">Carregando formulário...</p>}

            {erroConsulta && (
                <p role="alert" className="alert alert-danger">
                    {erroConsulta}
                </p>
            )}

            {!carregando && !erroConsulta && (
                <form id="cadastro-servico" className="mb-4" onSubmit={salvar}>
                    <fieldset disabled={salvando}>
                        {id ? (
                            <p className="mb-3">
                                Orçamento #{projeto?.id_contato} — {projeto?.nome_cliente}
                            </p>
                        ) : (
                            <>
                                <label htmlFor="orcamento-projeto" className="form-label">
                                    Orçamento
                                </label>
                                <select
                                    id="orcamento-projeto"
                                    name="id_contato"
                                    className="form-select"
                                    defaultValue=""
                                    required
                                >
                                    <option value="" disabled>
                                        Selecione um orçamento
                                    </option>
                                    {orcamentos.map(orcamento => (
                                        <option key={orcamento.id} value={orcamento.id}>
                                            #{orcamento.id} — {orcamento.nome_cliente}
                                            {" — "}{orcamento.servico || "Serviço não informado"}
                                        </option>
                                    ))}
                                </select>

                                {orcamentos.length === 0 && (
                                    <p className="mt-2">
                                        Cadastre um orçamento para registrar o projeto.
                                    </p>
                                )}
                            </>
                        )}

                        <label htmlFor="valor-projeto" className="form-label mt-3">
                            Valor final (R$)
                        </label>
                        <input
                            id="valor-projeto"
                            name="valor_final"
                            type="number"
                            className="form-control"
                            min="0"
                            max="99999999.99"
                            step="0.01"
                            defaultValue={projeto?.valor_final ?? ""}
                            required
                        />

                        <label htmlFor="data-projeto" className="form-label mt-3">
                            Data de conclusão
                        </label>
                        <input
                            id="data-projeto"
                            name="data_conclusao"
                            type="date"
                            className="form-control"
                            min="1000-01-01"
                            max="9999-12-31"
                            defaultValue={projeto?.data_conclusao ?? ""}
                            required
                        />

                        <label htmlFor="observacao-projeto" className="form-label mt-3">
                            Observação (opcional)
                        </label>
                        <textarea
                            id="observacao-projeto"
                            name="observacao"
                            className="form-control"
                            rows={3}
                            maxLength={255}
                            defaultValue={projeto?.observacao ?? ""}
                        />

                        {erroSalvar && (
                            <p role="alert" className="alert alert-danger mt-3">
                                {erroSalvar}
                            </p>
                        )}

                        <button
                            type="submit"
                            className="btn btn-danger mt-3"
                            disabled={!id && orcamentos.length === 0}
                        >
                            {salvando ? "Salvando..." : "Salvar projeto"}
                        </button>
                    </fieldset>
                </form>
            )}
        </main>
    );
}
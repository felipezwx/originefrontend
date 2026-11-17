import { useEffect, useState, type SubmitEvent } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { consultarOrcamento, listarClientes, listarServicos, salvarOrcamento, type Cliente, type DadosOrcamento, type Servico } from "../services/api";
import "../styles/servicos.css";

async function carregarTodasPaginas<T>(
    buscar: (pagina: number) => Promise<{
        dados: T[];
        totalPaginas: number;
    }>
): Promise<T[]> {
    const primeira = await buscar(1);
    const registros = [...primeira.dados];

    for (let pagina = 2; pagina <= primeira.totalPaginas; pagina++) {
        const resultado = await buscar(pagina);
        registros.push(...resultado.dados);
    }

    return registros;
}

export function FormularioOrcamento() {
    const { id } = useParams();

    return <CamposOrcamento key={id ?? "novo"} id={id} />;
}

function CamposOrcamento({ id }: { id: string | undefined }) {
    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    const [clientes, setClientes] = useState<Cliente[]>([]);
    const [servicos, setServicos] = useState<Servico[]>([]);
    const [dadosIniciais, setDadosIniciais] = useState<DadosOrcamento>({
        id_cliente: 0,
        servicosIds: [],
        mensagem: "",
        status: "Pendente"
    });
    const [carregando, setCarregando] = useState(true);
    const [salvando, setSalvando] = useState(false);
    const [erroConsulta, setErroConsulta] = useState("");
    const [erroSalvar, setErroSalvar] = useState("");

    useEffect(() => {
        if (!token) return;

        let ativo = true;

        async function carregar(tokenAtual: string) {
            try {
                if (id && !/^[1-9]\d*$/.test(id)) {
                    throw new Error("ID do orçamento inválido.");
                }

                const [listaClientes, listaServicos, detalhes] = await Promise.all([
                    carregarTodasPaginas(pagina => listarClientes(tokenAtual, pagina)),
                    carregarTodasPaginas(pagina => listarServicos(tokenAtual, pagina)),
                    id ? consultarOrcamento(tokenAtual, Number(id)) : Promise.resolve(null)
                ]);

                if (!ativo) return;

                setClientes(listaClientes);
                setServicos(listaServicos);

                if (detalhes) {
                    setDadosIniciais({
                        id_cliente: detalhes.orcamento.id_cliente,
                        servicosIds: detalhes.servicos.map(servico => servico.id),
                        mensagem: detalhes.orcamento.mensagem,
                        status: detalhes.orcamento.status
                    });
                }
            } catch (erro) {
                if (ativo) {
                    setErroConsulta(
                        erro instanceof Error ? erro.message : "Erro ao carregar o formulário."
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
        const servicosIds = campos.getAll("servicosIds").map(Number);
        const mensagem = String(campos.get("mensagem") ?? "").trim();

        setErroSalvar("");

        if (servicosIds.length === 0 || servicosIds.length > 25) {
            setErroSalvar("Selecione entre 1 e 25 serviços.");
            return;
        }

        if (!mensagem) {
            setErroSalvar("Preencha a descrição do orçamento.");
            return;
        }

        setSalvando(true);

        try {
            await salvarOrcamento(token, {
                id_cliente: Number(campos.get("id_cliente")),
                servicosIds,
                mensagem,
                status: String(campos.get("status"))
            }, id ? Number(id) : undefined);

            navigate("/painel/orcamentos", { replace: true });
        } catch (erro) {
            setErroSalvar(
                erro instanceof Error ? erro.message : "Erro ao salvar o orçamento."
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
            <Link to="/painel/orcamentos">Voltar aos orçamentos</Link>

            <div className="cabecalho-servicos">
                <h1>{id ? "Editar orçamento" : "Novo orçamento"}</h1>
            </div>

            {carregando && <p role="status">Carregando formulário...</p>}
            {erroConsulta && (
                <p role="alert" className="alert alert-danger">{erroConsulta}</p>
            )}

            {!carregando && !erroConsulta && (
                <form id="cadastro-servico" className="mb-4" onSubmit={salvar}>
                    <fieldset disabled={salvando}>
                        <label htmlFor="cliente-orcamento" className="form-label">
                            Cliente
                        </label>
                        <select
                            id="cliente-orcamento"
                            name="id_cliente"
                            className="form-select"
                            defaultValue={dadosIniciais.id_cliente || ""}
                            required
                        >
                            <option value="" disabled>Selecione um cliente</option>
                            {clientes.map(cliente => (
                                <option key={cliente.id} value={cliente.id}>
                                    {cliente.nome} — {cliente.email}
                                </option>
                            ))}
                        </select>

                        {clientes.length === 0 && (
                            <p className="mt-2">Cadastre um cliente para criar o orçamento.</p>
                        )}

                        <fieldset className="mt-4">
                            <legend className="h5">Serviços desejados</legend>
                            {servicos.length === 0 && <p>Nenhum serviço disponível.</p>}

                            {servicos.map(servico => (
                                <div className="form-check mb-2" key={servico.id}>
                                    <input
                                        id={`servico-${servico.id}`}
                                        name="servicosIds"
                                        type="checkbox"
                                        value={servico.id}
                                        className="form-check-input"
                                        defaultChecked={dadosIniciais.servicosIds.includes(servico.id)}
                                    />
                                    <label
                                        htmlFor={`servico-${servico.id}`}
                                        className="form-check-label"
                                    >
                                        {servico.nome}
                                    </label>
                                </div>
                            ))}
                        </fieldset>

                        <label htmlFor="mensagem-orcamento" className="form-label mt-3">
                            Descrição do pedido
                        </label>
                        <textarea
                            id="mensagem-orcamento"
                            name="mensagem"
                            className="form-control"
                            rows={4}
                            maxLength={5000}
                            defaultValue={dadosIniciais.mensagem}
                            required
                        />

                        <label htmlFor="status-orcamento" className="form-label mt-3">
                            Status
                        </label>
                        <select
                            id="status-orcamento"
                            name="status"
                            className="form-select"
                            defaultValue={dadosIniciais.status}
                            required
                        >
                            <option value="Pendente">Pendente</option>
                            <option value="Em andamento">Em andamento</option>
                            <option value="Concluído">Concluído</option>
                            <option value="Cancelado">Cancelado</option>
                        </select>

                        {erroSalvar && (
                            <p role="alert" className="alert alert-danger mt-3">
                                {erroSalvar}
                            </p>
                        )}

                        <button
                            type="submit"
                            className="btn btn-danger mt-3"
                            disabled={clientes.length === 0 || servicos.length === 0}
                        >
                            {salvando ? "Salvando..." : "Salvar orçamento"}
                        </button>
                    </fieldset>
                </form>
            )}
        </main>
    );
}
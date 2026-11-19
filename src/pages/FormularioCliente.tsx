import { useEffect, useState, type SubmitEvent } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { consultarCliente, salvarCliente, type Cliente } from "../services/api";
import { validarEmail } from "../utils/validacoes";
import "../styles/servicos.css";

export function FormularioCliente() {
    const { id } = useParams();

    return <CamposCliente key={id ?? "novo"} id={id} />;
}

function CamposCliente({ id }: { id: string | undefined }) {
    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    const [cliente, setCliente] = useState<Cliente | null>(null);
    const [carregando, setCarregando] = useState(Boolean(id));
    const [salvando, setSalvando] = useState(false);
    const [erroConsulta, setErroConsulta] = useState("");
    const [erroSalvar, setErroSalvar] = useState("");

    useEffect(() => {
        if (!id || !token) return;

        let ativo = true;

        async function carregar(tokenAtual: string, idAtual: string) {
            try {
                if (!/^[1-9]\d*$/.test(idAtual)) {
                    throw new Error("ID do cliente inválido.");
                }

                const resultado = await consultarCliente(tokenAtual, Number(idAtual));

                if (ativo) setCliente(resultado);
            } catch (erro) {
                if (ativo) {
                    setErroConsulta(
                        erro instanceof Error ? erro.message : "Erro ao buscar o cliente."
                    );
                }
            } finally {
                if (ativo) setCarregando(false);
            }
        }

        carregar(token, id);

        return () => {
            ativo = false;
        };
    }, [id, token]);

    async function salvar(evento: SubmitEvent<HTMLFormElement>) {
        evento.preventDefault();
        if (!token || salvando) return;

        const campos = new FormData(evento.currentTarget);
        const nome = String(campos.get("nome") ?? "").trim();
        const email = String(campos.get("email") ?? "").trim().toLowerCase();
        const telefone = String(campos.get("telefone") ?? "").trim();

        setErroSalvar("");

        if (nome.length < 3 || nome.length > 100) {
            setErroSalvar("O nome deve ter entre 3 e 100 caracteres.");
            return;
        }

        if (!validarEmail(email) || email.length > 100) {
            setErroSalvar("Informe um e-mail válido com até 100 caracteres.");
            return;
        }

        setSalvando(true);

        try {
            await salvarCliente(token, {
                nome,
                email,
                telefone: telefone || null
            }, id ? Number(id) : undefined);

            navigate("/painel/clientes", { replace: true });
        } catch (erro) {
            setErroSalvar(
                erro instanceof Error ? erro.message : "Erro ao salvar o cliente."
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
            <Link to="/painel/clientes" className="botao-voltar">Voltar aos clientes</Link>

            <div className="cabecalho-servicos">
                <h1>{id ? "Editar cliente" : "Novo cliente"}</h1>
            </div>

            {carregando && <p role="status">Carregando cliente...</p>}
            {erroConsulta && (
                <p role="alert" className="alert alert-danger">{erroConsulta}</p>
            )}

            {!carregando && !erroConsulta && (
                <form id="cadastro-servico" className="mb-4" onSubmit={salvar}>
                    <fieldset disabled={salvando}>
                        <label htmlFor="nome-cliente" className="form-label">
                            Nome
                        </label>
                        <input
                            id="nome-cliente"
                            name="nome"
                            type="text"
                            className="form-control"
                            minLength={3}
                            maxLength={100}
                            defaultValue={cliente?.nome ?? ""}
                            required
                        />

                        <label htmlFor="email-cliente" className="form-label mt-3">
                            E-mail
                        </label>
                        <input
                            id="email-cliente"
                            name="email"
                            type="email"
                            className="form-control"
                            maxLength={100}
                            defaultValue={cliente?.email ?? ""}
                            required
                        />

                        <label htmlFor="telefone-cliente" className="form-label mt-3">
                            Telefone (opcional)
                        </label>
                        <input
                            id="telefone-cliente"
                            name="telefone"
                            type="tel"
                            className="form-control"
                            maxLength={20}
                            defaultValue={cliente?.telefone ?? ""}
                        />

                        {erroSalvar && (
                            <p role="alert" className="alert alert-danger mt-3">
                                {erroSalvar}
                            </p>
                        )}

                        <button type="submit" className="btn btn-danger mt-3">
                            {salvando ? "Salvando..." : "Salvar cliente"}
                        </button>
                    </fieldset>
                </form>
            )}
        </main>
    );
}
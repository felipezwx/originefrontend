import { Navigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { listarServicosPublicos, type ServicoPublico } from "../services/api";
import { UsuarioContext } from "../UsuarioContext";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";

export function Orcamento() {
    const usuario = useContext(UsuarioContext)?.usuario;
    const token = localStorage.getItem("token");
    const [servicos, setServicos] = useState<ServicoPublico[]>([]);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState("");
    const [aviso, setAviso] = useState("");

    useEffect(() => {
        if (!token) return;

        let ativo = true;

        async function carregarServicos() {
            try {
                const primeira = await listarServicosPublicos();
                const lista = [...primeira.dados];

                for (let pagina = 2; pagina <= primeira.totalPaginas; pagina++) {
                    if (!ativo) return;
                    const proxima = await listarServicosPublicos(pagina);
                    lista.push(...proxima.dados);
                }

                if (ativo) setServicos(lista);
            } catch (erro) {
                if (ativo) {
                    setErro(erro instanceof Error ? erro.message : "Erro ao carregar os serviços.");
                }
            } finally {
                if (ativo) setCarregando(false);
            }
        }

        carregarServicos();

        return () => {
            ativo = false;
        };
    }, [token]);

    function conferirPedido(formulario: HTMLFormElement) {
        const dados = new FormData(formulario);
        const servicosIds = dados.getAll("servicosIds").map(Number);
        const mensagem = String(dados.get("mensagem") ?? "").trim();

        if (servicosIds.length === 0) {
            setAviso("Escolha pelo menos um serviço.");
            return;
        }

        if (!mensagem) {
            setAviso("Descreva sua ideia para o orçamento.");
            return;
        }

        const nomes = servicos
            .filter((servico) => servicosIds.includes(servico.id))
            .map((servico) => servico.nome);

        setAviso(`Serviços escolhidos: ${nomes.join(", ")}. Pedido ainda não enviado.`);
    }

    if (!token) {
        return <Navigate to="/login" state={{ voltarPara: "/orcamento" }} replace />;
    }

    return (
        <div className="pagina-originie pagina-orcamento">
            <Header />

            <main className="container py-5">
                <h1 className="titulo-secao">Solicitar orçamento</h1>

                {usuario ? (
                    <form 
                        className="row g-3 mt-2"
                        onChange={() => setAviso("")}
                        onSubmit={(event) => {
                            event.preventDefault();
                            conferirPedido(event.currentTarget);
                        }}
                        >
                        <div className="col-md-6">
                            <label htmlFor="nome" className="form-label">Nome completo</label>
                            <input
                                id="nome"
                                type="text"
                                className="form-control"
                                value={usuario.nome}
                                readOnly
                            />
                        </div>

                        <div className="col-md-6">
                            <label htmlFor="email" className="form-label">E-mail</label>
                            <input
                                id="email"
                                type="email"
                                className="form-control"
                                value={usuario.email}
                                readOnly
                            />
                        </div>

                        <div className="col-md-6">
                            <label htmlFor="telefone" className="form-label">WhatsApp com DDD</label>
                            <input
                                id="telefone"
                                name="telefone"
                                type="tel"
                                required
                                autoComplete="tel"
                                className="form-control"
                                placeholder="(44) 99999-9999"
                            />
                        </div>

                        <fieldset className="col-12">
                        <legend className="form-label">Quais serviços você procura?</legend>

                        {carregando && <p role="status">Carregando serviços...</p>}
                        {erro && <p role="alert">{erro}</p>}

                        {!carregando && !erro && servicos.length === 0 && (
                            <p>Nenhum serviço disponível no momento.</p>
                        )}

                        <div className="row g-2">
                            {servicos.map((servico) => (
                                <div className="col-sm-6" key={servico.id}>
                                    <div className="form-check">
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            id={`servico-${servico.id}`}
                                            name="servicosIds"
                                            value={servico.id}
                                        />
                                        <label
                                            className="form-check-label"
                                            htmlFor={`servico-${servico.id}`}
                                        >
                                            {servico.nome}
                                        </label>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </fieldset>

                        <div className="col-12">
                            <label htmlFor="mensagem" className="form-label">Conte sua ideia</label>
                            <textarea
                                id="mensagem"
                                name="mensagem"
                                className="form-control"
                                rows={5}
                                maxLength={5000}
                                required
                                placeholder="Que vídeo você imagina? Se já tiver uma data ou um local, conte aqui."
                            />
                        </div>

                        <div className="col-12">
                            <button
                                type="submit"
                                className="botao-vermelho"
                                disabled={carregando || Boolean(erro) || servicos.length === 0}
                            >
                                Conferir pedido
                            </button>

                            {aviso && <p className="mt-3" role="status">{aviso}</p>}
                        </div>
                    </form>
                ) : (
                    <p role="status">Aguardando os dados da conta...</p>
                )}
            </main>

            <Footer />
        </div>
    );
}
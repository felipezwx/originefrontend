import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { listarServicosPublicos, type ServicoPublico } from "../services/api";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import "../styles/style.css";
import "../styles/layout.css";

export function Catalogo() {
    const [servicos, setServicos] = useState<ServicoPublico[]>([]);
    const [busca, setBusca] = useState("");
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState("");

    useEffect(() => {
        let ativo = true;

        async function carregarCatalogo() {
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
                    setErro(erro instanceof Error ? erro.message : "Erro ao carregar o catálogo.");
                }
            } finally {
                if (ativo) setCarregando(false);
            }
        }

        carregarCatalogo();

        return () => {
            ativo = false;
        };
    }, []);

    const termo = busca.trim().toLowerCase();

    const servicosFiltrados = servicos.filter((servico) =>
        servico.nome.toLowerCase().includes(termo) ||
        servico.descricao.toLowerCase().includes(termo)
    );

    return (
        <div className="pagina-originie">
            <Header />
            <main className="container py-5">
                <Link to="/">Voltar ao início</Link>
                <h1 className="titulo-secao my-4">Serviços</h1>

                {carregando && <p role="status">Carregando serviços...</p>}
                {erro && <p role="alert">{erro}</p>}

                {!carregando && !erro && (
                    <>
                        <div className="busca-servicos">
                            <label htmlFor="buscaServico" className="visually-hidden">
                                Buscar serviço por nome ou descrição
                            </label>

                            <i className="bi bi-search" aria-hidden="true"></i>

                            <input
                                id="buscaServico"
                                type="search"
                                className="form-control"
                                placeholder="Digite o nome ou parte da descrição"
                                value={busca}
                                onChange={(event) => setBusca(event.target.value)}
                            />
                        </div>

                        {servicosFiltrados.length === 0 && (
                            <p>Nenhum serviço encontrado para essa busca.</p>
                        )}

                        <div className="row g-4">
                            {servicosFiltrados.map((servico) => (
                                <div className="col-md-4" key={servico.id}>
                                    <div className="cartao-servico h-100">
                                        {servico.video ? (
                                            <video
                                                className="video-cartao"
                                                src={`/${servico.video}`}
                                                controls
                                                playsInline
                                                preload="metadata"
                                                aria-label={`Vídeo de ${servico.nome}`}
                                            />
                                        ) : (
                                            <div className="marcador-video">
                                                <i className="bi bi-camera-video texto-vermelho icone-video-vazio"></i>
                                            </div>
                                        )}

                                        <div className="corpo-cartao">
                                            <span className="badge fundo-vermelho mb-2">
                                                {servico.categoria}
                                            </span>

                                            <h5 className="titulo-cartao">
                                                {servico.nome}
                                            </h5>

                                            <p className="descricao-cartao">
                                                {servico.descricao}
                                            </p>
                                        </div>

                                        <div className="p-3 border-top border-dark">
                                            <small className="texto-vermelho fw-semibold">
                                                R$ {Number(servico.preco).toLocaleString("pt-BR", {
                                                    minimumFractionDigits: 2,
                                                    maximumFractionDigits: 2
                                                })}
                                            </small>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </main>

            <Footer />
        </div>
    );
}
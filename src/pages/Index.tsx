import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import "../styles/style.css";
import "../styles/layout.css";

const servicos = [
    {
        id: 1,
        nome: "Resumo de Evento",
        categoria: "evento",
        descricao: "Transformamos eventos em narrativas dinâmicas e memoráveis.",
        preco: 1000
    },
    {
        id: 2,
        nome: "VT Comercial",
        categoria: "comercial",
        descricao: "Criamos vídeos comerciais que unem estratégia, estética e posicionamento.",
        preco: 1200
    },
    {
        id: 3,
        nome: "Highlights",
        categoria: "evento",
        descricao: "Os melhores momentos reunidos em uma edição intensa.",
        preco: 600
    }
];

export function Index() {
    return (
        <div className="pagina-originie">
            <Header />

            <main>
                <section className="heroi-principal" id="inicio">
                    <div className="sobreposicao-heroi"></div>

                    <div className="barra-gravacao">
                        <span className="ponto-gravacao"></span>
                        <span className="texto-vermelho">REC</span>
                    </div>

                    <div className="container conteudo-heroi">
                        <div className="row">
                            <div className="col-lg-8">
                                <p className="sobrancelha-heroi revelacao">
                                    Produtora Audiovisual — Campo Mourão, PR
                                </p>

                                <h1 className="titulo-heroi revelacao d1">
                                    Vídeos que
                                    <br />
                                    <span className="texto-vermelho">
                                        geram impacto.
                                    </span>
                                </h1>

                                <p className="subtitulo-heroi revelacao d2">
                                    Transformamos histórias, marcas e experiências
                                    em vídeos com qualidade cinematográfica.
                                </p>

                                <div className="d-flex flex-wrap gap-3 revelacao d3">
                                    <a href="#servicos" className="botao-vermelho">
                                        Ver Serviços
                                        <i className="bi bi-play-circle ms-1"></i>
                                    </a>

                                    <a href="#contato" className="botao-contorno btn btn-lg">
                                        Solicitar Orçamento
                                    </a>
                                </div>
                            </div>
                        </div>

                        <div className="estatisticas-heroi revelacao d4">
                            <div className="row g-0">
                                <div className="col-4 estatistica-item">
                                    <span className="numero-estatistica">
                                        8<span className="texto-vermelho">+</span>
                                    </span>
                                    <span className="etiqueta-estatistica">
                                        Serviços
                                    </span>
                                </div>

                                <div className="col-4 estatistica-item">
                                    <span className="numero-estatistica">
                                        Same <span className="texto-vermelho">Day</span>
                                    </span>
                                    <span className="etiqueta-estatistica">
                                        Entrega no mesmo dia
                                    </span>
                                </div>

                                <div className="col-4 estatistica-item">
                                    <span className="numero-estatistica">
                                        100<span className="texto-vermelho">%</span>
                                    </span>
                                    <span className="etiqueta-estatistica">
                                        Qualidade Cinematográfica
                                    </span>
                                </div>
                            </div>
                        </div>

                    </div>
                </section>

                <section className="secao-clara py-5" id="servicos">
                    <div className="container">
                        <div className="row mb-5 revelacao">
                            <div className="col-lg-6">
                                <p className="etiqueta">
                                    <i className="bi bi-camera-video-fill me-2 texto-vermelho"></i>
                                    O Que Fazemos
                                </p>

                                <h2 className="titulo-secao">
                                    Soluções para cada
                                    <span className="texto-vermelho"> momento.</span>
                                </h2>
                            </div>

                            <div className="col-lg-6 d-flex align-items-end justify-content-lg-end">
                                <a href="#contato" className="botao-contorno btn">
                                    Solicitar serviço
                                    <i className="bi bi-arrow-right ms-1"></i>
                                </a>
                            </div>
                        </div>

                        <div className="row g-4">
                            {servicos.map((servico) => (
                                <div className="col-md-4 revelacao" key={servico.id}>
                                    <div className="cartao-servico h-100">
                                        <div className="marcador-video">
                                            <i className="bi bi-camera-video texto-vermelho icone-video-vazio"></i>
                                        </div>

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
                                                R$ {servico.preco.toLocaleString("pt-BR", {
                                                    minimumFractionDigits: 2,
                                                    maximumFractionDigits: 2
                                                })}
                                            </small>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                    </div>
                </section>

                <section className="secao-escura py-0" id="sobre">
                    <div className="container-fluid px-0">
                        <div className="row g-0">
                            <div className="col-lg-6">
                                <div className="video-preenchimento-alternativo">
                                    <i className="bi bi-film"></i>
                                </div>
                            </div>

                            <div className="col-lg-6 d-flex align-items-center secao-clara">
                                <div className="p-5 revelacao">
                                    <p className="etiqueta">
                                        <i className="bi bi-film me-2 texto-vermelho"></i>
                                        Portfólio
                                    </p>

                                    <h2 className="titulo-secao mb-4">
                                        Cada projeto,
                                        <br />
                                        <span className="texto-vermelho">
                                            uma história única.
                                        </span>
                                    </h2>

                                    <p className="texto-sobre mb-4">
                                        Produzimos vídeos com qualidade cinematográfica
                                        e estratégia de comunicação.
                                    </p>

                                    <a href="#contato" className="botao-vermelho">
                                        Quero um vídeo assim
                                        <i className="bi bi-arrow-right ms-1"></i>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="secao-cta" id="contato">
                    <div className="container text-center revelacao">
                        <h2 className="titulo-cta">
                            Pronto para contar
                            <span className="cta-italico"> sua história?</span>
                        </h2>

                        <p className="subtitulo-cta">
                            Entre em contato e vamos criar algo memorável juntos.
                        </p>

                        <a href="#servicos" className="btn btn-light btn-lg">
                            Conhecer nossos serviços
                            <i className="bi bi-arrow-right ms-1"></i>
                        </a>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}

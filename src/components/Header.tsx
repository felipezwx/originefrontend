import { useContext, useState } from "react";
import { UsuarioContext } from "../UsuarioContext";
import { Link } from "react-router-dom";


export function Header() {
    const [menuAberto, setMenuAberto] = useState(false);
    const usuario = useContext(UsuarioContext)?.usuario;

    return (
        <nav
            className="navbar navbar-expand-lg navbar-dark sticky-top"
            id="barraNavegacao"
        >
            <div className="container">

                <Link to="/" className="navbar-brand">
                    <img src="/imagens/logo.png" alt="Originie Audiovisual"height="36" />
                </Link>

                <button
                    className="navbar-toggler border-0"
                    type="button"
                    aria-controls="menuNavegacao"
                    aria-expanded={menuAberto}
                    aria-label="Abrir menu"
                    onClick={() => setMenuAberto(!menuAberto)}
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div
                    className={`collapse navbar-collapse ${menuAberto ? "show" : ""}`}
                    id="menuNavegacao"
                >
                    <ul className="navbar-nav ms-auto align-items-lg-center gap-lg-1">

                        <li className="nav-item">
                            <Link
                                className="nav-link link-nav ativo"
                                to="/"
                                onClick={() => setMenuAberto(false)}
                            >
                                Início
                            </Link>
                        </li>

                        <li className="nav-item">
                            <a
                                className="nav-link link-nav"
                                href="/#sobre"
                                onClick={() => setMenuAberto(false)}
                            >
                                Sobre
                            </a>
                        </li>

                        <li className="nav-item">
                            <Link
                                className="nav-link link-nav"
                                to="/servicos"
                                onClick={() => setMenuAberto(false)}
                            >
                                Serviços
                            </Link>
                        </li>

                        <li className="nav-item ms-lg-2">

                            {usuario ? (
                                <span className="nav-link link-nav">
                                    <i className="bi bi-person-circle me-1"></i>
                                    {usuario.nome.trim().split(/\s+/)[0]}
                                </span>
                            ) : (

                                <Link
                                    className="nav-link link-nav"
                                    to="/login"
                                    onClick={() => setMenuAberto(false)}
                                >
                                    <i className="bi bi-person-circle me-1"></i>
                                    Entrar
                                </Link>
                            )}
                        </li>

                        <li className="nav-item ms-lg-2">
                            <a
                                className="botao-vermelho"
                                href="/#contato"
                                onClick={() => setMenuAberto(false)}
                            >
                                Orçamento
                                <i className="bi bi-arrow-right ms-1"></i>
                            </a>
                        </li>

                    </ul>
                </div>

            </div>
        </nav>
    );
}

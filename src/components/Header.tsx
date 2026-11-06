import { Link } from "react-router-dom";

export function Header() {
    return (
        <header className="site-header">

            <Link to="/" className="site-logo">
                <img src="/imagens/logo.png" alt="Originie" />
            </Link>

            <nav className="site-nav">
                <a href="#inicio">Início</a>
                <a href="#servicos">Serviços</a>
                <a href="#sobre">Sobre</a>
            </nav>

            <div className="site-acesso">
                <Link to="/login" className="site-entrar">
                    Entrar
                </Link>

                <Link to="/cadastro" className="site-cadastrar">
                    Criar conta
                </Link>
            </div>

        </header>
    );
}
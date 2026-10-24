import "../styles/cadastro.css";

export function Cadastro() {
    return (
        <main className="container-cadastro">
            <div className="cartao-cadastro">

                <div className="logo-cadastro">
                    <img src="/imagens/logo.png" alt="Originie Audiovisual" /> 
                </div>

                <div className="icone-cadastro">
                    <i className="bi bi-person-plus"></i>
                </div>

                <h1 className="titulo-cadastro">Criar Conta</h1>

                <p className="subtitulo-cadastro">
                    Faça seu cadastro na Originie
                </p>

                <form onSubmit={(event) => event.preventDefault()}>

                    <div className="grupo-formulario">
                        <label htmlFor="campoNome">
                            <i className="bi bi-person me-1"></i> Nome
                        </label>
                        <input
                            type="text"
                            id="campoNome"
                            name="nome"
                            className="entrada-cadastro"
                            placeholder="Seu nome completo"
                            maxLength={100}
                            required
                        />
                    </div>

                    <div className="grupo-formulario">
                        <label htmlFor="campoEmail">
                            <i className="bi bi-envelope me-1"></i> Email
                        </label>
                        <input
                            type="email"
                            id="campoEmail"
                            name="email"
                            className="entrada-cadastro"
                            placeholder="seu@email.com"
                            required
                        />
                    </div>

                    <div className="grupo-formulario">
                        <label htmlFor="campoCPF">
                            <i className="bi bi-person-vcard me-1"></i> CPF
                        </label>
                        <input
                            type="text"
                            id="campoCPF"
                            name="cpf"
                            className="entrada-cadastro"
                            placeholder="000.000.000-00"
                            inputMode="numeric"
                            maxLength={14}
                            required
                        />
                    </div>

                    <div className="grupo-formulario">
                        <label htmlFor="campoSenha">
                            <i className="bi bi-key me-1"></i> Senha
                        </label>
                        <input
                            type="password"
                            id="campoSenha"
                            name="senha"
                            className="entrada-cadastro"
                            placeholder="Digite sua senha"
                            required
                        />
                    </div>

                    <div className="grupo-formulario">
                        <label htmlFor="campoConfirmarSenha">
                            <i className="bi bi-shield-check me-1"></i>
                        Confirmar senha
                        </label>
                        <input
                            type="password"
                            id="campoConfirmarSenha"
                            name="confirmarSenha"
                            className="entrada-cadastro"
                            placeholder="Digite a senha novamente"
                            required
                        />
                    </div>

                    <button type="submit" className="botao-cadastro">
                        <i className="bi bi-person-plus me-2"></i>
                        Criar minha conta
                    </button>

                </form>

                <div className="link-login">
                <p>Já possui uma conta?</p>
                <a href="/">
                    <i className="bi bi-box-arrow-in-right me-1"></i>
                    Entrar na minha conta
                </a>
                </div>

            </div>
        </main>
    )
}
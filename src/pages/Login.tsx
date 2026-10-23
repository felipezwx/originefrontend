
import "../styles/login.css";

export function Login() {
  return (
    <main className="container-login">
      <div className="cartao-login">
        <div className="logo-login">
          <img src="/imagens/logo.png" alt="Originie Audiovisual" />
        </div>

        <div className="icone-login">
          <i className="bi bi-person-circle"></i>
        </div>

        <h1 className="titulo-login">Bem-vindo</h1>

        <p className="subtitulo-login">
          Entre para acessar a Originie
        </p>

        <form onSubmit={(event) => event.preventDefault()}>
          <div className="grupo-formulario">
            <label htmlFor="campoEmail">
              <i className="bi bi-envelope me-1"></i> Email
            </label>

            <input
              type="email"
              id="campoEmail"
              name="email"
              className="entrada-login"
              placeholder="seu@email.com"
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
              className="entrada-login"
              placeholder="Sua senha"
              required
            />
          </div>

          <button type="submit" className="botao-entrar">
            <i className="bi bi-box-arrow-in-right me-2"></i>
            Entrar
          </button>
        </form>

        <div className="divisor">ou</div>

        <div className="area-cadastro">
          <p className="texto-cadastro">
            Ainda não possui uma conta?
          </p>

          <a href="/cadastro" className="botao-secundario">
            <i className="bi bi-person-plus me-2"></i>
            Criar uma conta
          </a>
        </div>

        <div className="dica-login">
          <i className="bi bi-info-circle me-2"></i>
          <strong>Acesso seguro</strong>
          <p>Entre com seu email e senha cadastrados para acessar o site.</p>
        </div>
      </div>
    </main>
  );
}

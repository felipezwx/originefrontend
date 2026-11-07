export function Footer() {
    return (
        <footer className="rodape mt-auto">
            <div className="container">
                <div className="row align-items-center gy-3">

                    <div className="col-md-4">
                        <img src="/imagens/logo.png" alt="Originie" height="30" className="logo-rodape"/>
                    </div>

                    <div className="col-md-4 text-center">
                        <p className="copia-rodape mb-0">
                            © {new Date().getFullYear()} Originie Audiovisual — Campo Mourão, PR
                        </p>
                    </div>

                    <div className="col-md-4 text-md-end">
                        <span className="badge fundo-vermelho">
                            Campo Mourão, PR
                        </span>
                    </div>

                </div>
            </div>

        </footer>
    );
}
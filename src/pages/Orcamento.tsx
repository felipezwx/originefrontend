import { Navigate } from "react-router-dom";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";

export function Orcamento() {
    const token = localStorage.getItem("token");

    if (!token) {
        return <Navigate to="/login" state={{ voltarPara: "/orcamento" }} replace />;
    }

    return (
        <div className="pagina-originie">
            <Header />

            <main className="container py-5">
                <h1 className="titulo-secao">Solicitar orçamento</h1>
            </main>

            <Footer />
        </div>
    );
}
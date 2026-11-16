import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import { Index } from "./pages/Index";
import { Login } from "./pages/Login";
import { Cadastro } from "./pages/Cadastro";
import { Servicos } from "./pages/Servicos";
import { Catalogo } from "./pages/Catalogo";
import { Orcamento } from "./pages/Orcamento";
import { MinhaConta } from "./pages/MinhaConta";
import { Dashboard } from "./pages/Dashboard";
import { useEffect, useState } from "react";
import { UsuarioContext } from "./UsuarioContext";
import { consultarPerfil, type Usuario } from "./services/api";

function App() {
    const [usuario, setUsuario] = useState<Usuario | null>(null);
    const [carregandoPerfil, setCarregandoPerfil] = useState(
        () => Boolean(localStorage.getItem("token"))
    );

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) return;

        let ativo = true;

        consultarPerfil(token)
            .then((perfil) => {
                if (ativo && localStorage.getItem("token") === token) {
                    setUsuario(perfil);
                }
            })
            .catch(() => {
                // Se a consulta falhar, o cabeçalho continua mostrando Entrar.
            })
            .finally(() => {
                if (ativo) setCarregandoPerfil(false);
            });

        return () => {
            ativo = false;
        };
    }, []);

    return (
        <UsuarioContext.Provider value={{ usuario, setUsuario }}>
            <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/login" element={<Login />} />
                <Route path="/cadastro" element={<Cadastro />} />
                <Route path="/servicos" element={<Catalogo />} />
                <Route
                    path="/painel"
                    element={
                        !localStorage.getItem("token") ? (
                            <Navigate to="/login" replace />
                        ) : carregandoPerfil ? (
                            <p role="status">Carregando perfil...</p>
                        ) : usuario?.tipo === "admin" ? (
                            <Outlet />
                        ) : (
                            <Navigate to="/" replace />
                        )
                    }
                >
                    <Route index element={<Dashboard />} />
                    <Route path="servicos" element={<Servicos />} />
                </Route>
                <Route path="/orcamento" element={<Orcamento />} />
                <Route path="/minha-conta" element={<MinhaConta />} />
            </Routes>
        </UsuarioContext.Provider>
    );
}

export default App;

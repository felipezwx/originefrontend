import { Routes, Route, } from "react-router-dom";
import { Index } from "./pages/Index";
import { Login } from "./pages/Login";
import { Cadastro } from "./pages/Cadastro";
import { useEffect, useState } from "react";
import { UsuarioContext } from "./UsuarioContext";
import { consultarPerfil, type Usuario } from "./services/api";

function App() {
    const [usuario, setUsuario] = useState<Usuario | null>(null);

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
            </Routes>
        </UsuarioContext.Provider>
    );
}

export default App;

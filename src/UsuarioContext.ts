import { createContext } from "react";
import type { Usuario } from "./services/api";

type DadosContexto = {
    usuario: Usuario | null;
    setUsuario: (usuario: Usuario | null) => void;
};

export const UsuarioContext = createContext<DadosContexto | null>(null);
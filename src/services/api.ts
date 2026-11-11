const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

type DadosCadastro = {
    nome: string;
    email: string;
    cpf: string;
    senha: string;
};

type RespostaCadastro = {
    mensagem: string;
};

type DadosLogin = {
    email: string;
    senha: string;
};

export type Usuario = {
    id: number;
    nome: string;
    email: string;
    cpf: string | null;
    tipo: "usuario" | "admin";
};

type RespostaLogin = {
    mensagem: string;
    token: string;
    usuario: Usuario;
};

export async function cadastrarUsuario(dados: DadosCadastro): Promise<RespostaCadastro> {
    let resposta: Response;

    try {
        resposta = await fetch(`${API_URL}/api/auth/cadastro`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(dados)
        });
    } catch {
        throw new Error("Não foi possível conectar ao servidor.");
    }

    const resultado = await resposta.json();

    if (!resposta.ok) {
        throw new Error(resultado.mensagem || "Erro ao realizar cadastro.");
    }

    return resultado;
}

export async function entrarUsuario(dados: DadosLogin): Promise<RespostaLogin> {
    let resposta: Response;

    try {
        resposta = await fetch(`${API_URL}/api/auth/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(dados)
        });
    } catch {
        throw new Error("Não foi possível conectar ao servidor.");
    }

    const resultado = await resposta.json();

    if (!resposta.ok) {
        throw new Error(resultado.mensagem || "Erro ao fazer login.");
    }

    return resultado;
}

export async function consultarPerfil(token: string): Promise<Usuario> {
    let resposta: Response;

    try {
        resposta = await fetch(`${API_URL}/api/auth/perfil`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
    } catch {
        throw new Error("Não foi possível conectar ao servidor.");
    }

    const resultado = await resposta.json();

    if (!resposta.ok) {
        throw new Error(resultado.mensagem || "Erro ao consultar perfil.");
    }

    return resultado.usuario;
}
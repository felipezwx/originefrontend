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

export type Servico = {
    id: number;
    nome: string;
    slug: string;
    descricao: string;
    preco: string;
    categoria: string;
    video: string | null;
    ativo: number;
};

type RespostaServicos = {
    pagina: number;
    limite: number;
    total: number;
    totalPaginas: number;
    dados: Servico[];
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

export async function listarServicos(
    token: string,
    pagina: number = 1
): Promise<RespostaServicos> {
    let resposta: Response;

    try {
        resposta = await fetch(`${API_URL}/api/servicos?pagina=${pagina}&limite=10`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
    } catch {
        throw new Error("Não foi possível conectar ao servidor.");
    }

    const resultado = await resposta.json();

    if (!resposta.ok) {
        throw new Error(resultado.mensagem || "Erro ao listar os serviços.");
    }

    return resultado;
}

export type ServicoPublico = Omit<Servico, "ativo">;

type RespostaServicosPublicos = Omit<RespostaServicos, "dados"> & {
    dados: ServicoPublico[];
};

export async function listarServicosPublicos(
    pagina: number = 1
): Promise<RespostaServicosPublicos> {
    let resposta: Response;

    try {
        resposta = await fetch(
            `${API_URL}/api/servicos/publicos?pagina=${pagina}&limite=10`
        );
    } catch {
        throw new Error("Não foi possível conectar ao servidor.");
    }

    const resultado = await resposta.json();

    if (!resposta.ok) {
        throw new Error(resultado.mensagem || "Erro ao carregar o catálogo.");
    }

    return resultado;
}
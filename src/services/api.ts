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

type DadosEdicaoPerfil = {
    nome: string;
    cpf: string;
    senhaAtual: string;
    novaSenha: string;
}

type DadosNovoServico = Omit<Servico, "id">;

export type Orcamento = {
    id: number;
    id_cliente: number;
    nome_cliente: string;
    email_cliente: string;
    telefone_cliente: string | null;
    servico: string | null;
    mensagem: string;
    status: string;
    criado_em: string;
};

type RespostaOrcamentos = {
    pagina: number;
    limite: number;
    total: number;
    totalPaginas: number;
    dados: Orcamento[];
};

export type Cliente = {
    id: number;
    nome: string;
    email: string;
    telefone: string | null;
};

type RespostaClientes = {
    pagina: number;
    limite: number;
    total: number;
    totalPaginas: number;
    dados: Cliente[];
};

export type DadosOrcamento = {
    id_cliente: number;
    servicosIds: number[];
    mensagem: string;
    status: string;
};

type DetalhesOrcamento = {
    orcamento: Orcamento;
    servicos: { id: number; nome: string }[];
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

export async function atualizarPerfil(
    token: string,
    dados: DadosEdicaoPerfil
): Promise<Usuario> {
    let resposta: Response;

    try {
        resposta = await fetch(`${API_URL}/api/auth/perfil`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(dados)
        });
    } catch {
        throw new Error("Não foi possivel conectar ao servidor.");
    }

    const resultado = await resposta.json();

    if(!resposta.ok) {
        throw new Error(resultado.mensagem || "Erro ao atualizar o perfil.");
    }
    
    return resultado.usuario;

}

export async function cadastrarServico(
    token: string,
    dados: DadosNovoServico
): Promise<{ id: number; mensagem: string }> {
    let resposta: Response;

    try {
        resposta = await fetch(`${API_URL}/api/servicos`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(dados)
        });
    } catch {
        throw new Error("Não foi possível conectar ao servidor.");
    }

    const resultado = await resposta.json();

    if (!resposta.ok) {
        throw new Error(resultado.mensagem || "Erro ao cadastrar o serviço.");
    }

    return resultado;
}

export async function atualizarServico(
    token: string,
    id: number,
    dados: DadosNovoServico
): Promise<{ mensagem: string }> {
    let resposta: Response;

    try {
        resposta = await fetch(`${API_URL}/api/servicos/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(dados)
        });
    } catch {
        throw new Error("Não foi possível conectar ao servidor.");
    }

    const resultado = await resposta.json();

    if (!resposta.ok) {
        throw new Error(resultado.mensagem || "Erro ao atualizar o serviço.");
    }

    return resultado;
}

export async function excluirServico(
    token: string,
    id: number
): Promise<{ mensagem: string }> {
    let resposta: Response;

    try {
        resposta = await fetch(`${API_URL}/api/servicos/${id}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
    } catch {
        throw new Error("Não foi possível conectar ao servidor.");
    }

    const resultado = await resposta.json();

    if (!resposta.ok) {
        throw new Error(resultado.mensagem || "Erro ao excluir o serviço.");
    }

    return resultado;
}

export async function consultarServico(
    token: string,
    id: number
): Promise<Servico> {
    let resposta: Response;

    try {
        resposta = await fetch(`${API_URL}/api/servicos/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
    } catch {
        throw new Error("Não foi possível conectar ao servidor.");
    }

    const resultado = await resposta.json();

    if (!resposta.ok) {
        throw new Error(resultado.mensagem || "Erro ao consultar o serviço.");
    }

    return resultado.servico;
}

export async function listarOrcamentos(
    token: string,
    pagina: number = 1
): Promise<RespostaOrcamentos> {
    let resposta: Response;

    try {
        resposta = await fetch(`${API_URL}/api/orcamentos?pagina=${pagina}&limite=10`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
    } catch {
        throw new Error("Não foi possível conectar ao servidor.");
    }

    const resultado = await resposta.json();

    if (!resposta.ok) {
        throw new Error(resultado.mensagem || "Erro ao listar os orçamentos.");
    }

    return resultado;
}

export async function listarClientes(
    token: string,
    pagina: number = 1
): Promise<RespostaClientes> {
    let resposta: Response;

    try {
        resposta = await fetch(`${API_URL}/api/clientes?pagina=${pagina}&limite=10`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
    } catch {
        throw new Error("Não foi possível conectar ao servidor.");
    }

    const resultado = await resposta.json();

    if (!resposta.ok) {
        throw new Error(resultado.mensagem || "Erro ao listar os clientes.");
    }

    return resultado;
}

export async function consultarOrcamento(
    token: string,
    id: number
): Promise<DetalhesOrcamento> {
    let resposta: Response;

    try {
        resposta = await fetch(`${API_URL}/api/orcamentos/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
    } catch {
        throw new Error("Não foi possível conectar ao servidor.");
    }

    const resultado = await resposta.json();

    if (!resposta.ok) {
        throw new Error(resultado.mensagem || "Erro ao consultar o orçamento.");
    }

    return resultado;
}

export async function salvarOrcamento(
    token: string,
    dados: DadosOrcamento,
    id?: number
): Promise<{ mensagem: string }> {
    const caminho = id === undefined
        ? "/api/orcamentos"
        : `/api/orcamentos/${id}`;

    let resposta: Response;

    try {
        resposta = await fetch(`${API_URL}${caminho}`, {
            method: id === undefined ? "POST" : "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(dados)
        });
    } catch {
        throw new Error("Não foi possível conectar ao servidor.");
    }

    const resultado = await resposta.json();

    if (!resposta.ok) {
        throw new Error(resultado.mensagem || "Erro ao salvar o orçamento.");
    }

    return resultado;
}

export async function excluirOrcamento(
    token: string,
    id: number
): Promise<{ mensagem: string }> {
    let resposta: Response;

    try {
        resposta = await fetch(`${API_URL}/api/orcamentos/${id}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
    } catch {
        throw new Error("Não foi possível conectar ao servidor.");
    }

    const resultado = await resposta.json();

    if (!resposta.ok) {
        throw new Error(resultado.mensagem || "Erro ao excluir o orçamento.");
    }

    return resultado;
}
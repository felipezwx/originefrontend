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

export type DadosCliente = Omit<Cliente, "id">;

export type Projeto = {
    id: number;
    id_contato: number;
    valor_final: string;
    data_conclusao: string;
    observacao: string | null;
    criado_em: string;
    servico: string | null;
    status: string;
    id_cliente: number;
    nome_cliente: string;
    email_cliente: string;
};

export type DadosProjeto = {
    valor_final: string;
    data_conclusao: string;
    observacao: string | null;
};

export type DadosNovoProjeto = DadosProjeto & {
    id_contato: number;
};

type RespostaProjetos = {
    pagina: number;
    limite: number;
    total: number;
    totalPaginas: number;
    dados: Projeto[];
};

export type ServicoPublico = Omit<Servico, "ativo">;

type RespostaServicosPublicos = Omit<RespostaServicos, "dados"> & {
    dados: ServicoPublico[];
};

type RespostaMensagem = {
    mensagem: string;
};

type OpcoesRequisicao = {
    metodo?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
    token?: string;
    dados?: unknown;
    mensagemErro: string;
};

async function requisicao<T>(
    caminho: string,
    opcoes: OpcoesRequisicao
): Promise<T> {
    const headers = new Headers();

    if (opcoes.token) {
        headers.set("Authorization", `Bearer ${opcoes.token}`);
    }

    if (opcoes.dados !== undefined) {
        headers.set("Content-Type", "application/json");
    }

    let resposta: Response;

    try {
        resposta = await fetch(`${API_URL}${caminho}`, {
            method: opcoes.metodo ?? "GET",
            headers,
            body: opcoes.dados === undefined
                ? undefined
                : JSON.stringify(opcoes.dados)
        });
    } catch {
        throw new Error("Não foi possível conectar ao servidor.");
    }

    let resultado: unknown;

    try {
        resultado = await resposta.json();
    } catch {
        throw new Error(opcoes.mensagemErro);
    }

    if (!resposta.ok) {
        const mensagem =
            typeof resultado === "object" &&
            resultado !== null &&
            "mensagem" in resultado &&
            typeof resultado.mensagem === "string" &&
            resultado.mensagem.length > 0
                ? resultado.mensagem
                : opcoes.mensagemErro;

        throw new Error(mensagem);
    }

    return resultado as T;
}

export async function cadastrarUsuario(
    dados: DadosCadastro
): Promise<RespostaCadastro> {
    return requisicao<RespostaCadastro>("/api/auth/cadastro", {
            metodo: "POST",
            dados,
            mensagemErro: "Erro ao realizar cadastro."
        });
}

export async function entrarUsuario(
    dados: DadosLogin
): Promise<RespostaLogin> {
    return requisicao<RespostaLogin>("/api/auth/login", {
        metodo: "POST",
        dados,
        mensagemErro: "Erro ao fazer login."
    });
}

export async function consultarPerfil(token: string): Promise<Usuario> {
    const resultado = await requisicao<{ usuario: Usuario }>(
        "/api/auth/perfil", 
        {
            token,
            mensagemErro: "Erro ao consultar o perfil."
            }
        );

    return resultado.usuario;
}

export async function listarServicos(
    token: string,
    pagina: number = 1
): Promise<RespostaServicos> {
    return requisicao<RespostaServicos>(
        `/api/servicos?pagina=${pagina}&limite=10`,
        {
            token,
            mensagemErro: "Erro ao listar os serviços."
        }
    );
}

export async function listarServicosPublicos(
    pagina: number = 1
): Promise<RespostaServicosPublicos> {
    return requisicao<RespostaServicosPublicos>(
        `/api/servicos/publicos?pagina=${pagina}&limite=10`,
        {
            mensagemErro: "Erro ao carregar o catálogo."
        }
    );
}

export async function atualizarPerfil(
    token: string,
    dados: DadosEdicaoPerfil
): Promise<Usuario> {
    const resultado = await requisicao<{ usuario: Usuario }>(
        "/api/auth/perfil", 
        {
            metodo: "PUT",
            token,
            dados,
            mensagemErro: "Erro ao atualizar o perfil."
        }
    );
    
    return resultado.usuario;

}

export async function cadastrarServico(
    token: string,
    dados: DadosNovoServico
): Promise<{ id: number; mensagem: string }> {
    return requisicao<{ id: number; mensagem: string }>("/api/servicos", {
        metodo: "POST",
        token,
        dados,
        mensagemErro: "Erro ao cadastrar o serviço."
    });
}

export async function atualizarServico(
    token: string,
    id: number,
    dados: DadosNovoServico
): Promise<{ mensagem: string }> {
    return requisicao<RespostaMensagem>(`/api/servicos/${id}`, {
        metodo: "PUT",
        token,
        dados,
        mensagemErro: "Erro ao atualizar serviço."
    });
}

export async function excluirServico(
    token: string,
    id: number
): Promise<RespostaMensagem> {
    return requisicao<RespostaMensagem>(`/api/servicos/${id}`, {
        metodo: "DELETE",
        token,
        mensagemErro: "Erro ao excluir o serviço."
    });
}

export async function consultarServico(
    token: string,
    id: number
): Promise<Servico> {
    const resultado = await requisicao<{ servico: Servico }> (
        `/api/servicos/${id}`,
        {
            token,
            mensagemErro: "Erro ao consultar o serviço."
        }
    );

    return resultado.servico;
}

export async function listarOrcamentos(
    token: string,
    pagina: number = 1
): Promise<RespostaOrcamentos> {
    return requisicao<RespostaOrcamentos>(
        `/api/orcamentos?pagina=${pagina}&limite=10`,
        {
            token,
            mensagemErro: "Erro ao listar os orçamentos."
        }
    );
}

export async function listarClientes(
    token: string,
    pagina: number = 1
): Promise<RespostaClientes> {
    return requisicao<RespostaClientes>(
        `/api/clientes?pagina=${pagina}&limite=10`,
        {
            token,
            mensagemErro: "Erro ao listar os clientes."
        }
    );
}

export async function consultarOrcamento(
    token: string,
    id: number
): Promise<DetalhesOrcamento> {
    return requisicao<DetalhesOrcamento>(`/api/orcamentos/${id}`, {
        token,
        mensagemErro: "Erro ao consultar o orçamento."
    });
}

export async function salvarOrcamento(
    token: string,
    dados: DadosOrcamento,
    id?: number
): Promise<RespostaMensagem> {
    const caminho = id === undefined
        ? "/api/orcamentos"
        : `/api/orcamentos/${id}`;

    return requisicao<RespostaMensagem>(caminho, {
        metodo: id === undefined ? "POST" : "PUT",
        token,
        dados,
        mensagemErro: "Erro ao salvar o orçamento."
    });
}

export async function excluirOrcamento(
    token: string,
    id: number
): Promise<RespostaMensagem> {
    return requisicao<RespostaMensagem>(`/api/orcamentos/${id}`, {
        metodo: "DELETE",
        token,
        mensagemErro: "Erro ao excluir o orçamento."
    });
}

export async function consultarCliente(
    token: string,
    id: number
): Promise<Cliente> {
    const resultado = await requisicao<{ cliente: Cliente}> (
        `/api/clientes/${id}`,
        {
            token,
            mensagemErro: "Erro ao consultar o cliente."
        }
    );

    return resultado.cliente;
}

export async function salvarCliente(
    token: string,
    dados: DadosCliente,
    id?: number
): Promise<{ mensagem: string; cliente: Cliente }> {
    const caminho = id === undefined
        ? "/api/clientes"
        : `/api/clientes/${id}`;

    return requisicao<{ mensagem: string; cliente: Cliente }> (caminho, {
        metodo: id === undefined ? "POST" : "PUT",
        token,
        dados,
        mensagemErro: "Erro ao salvar o cliente."
    });
}

export async function excluirCliente(
    token: string,
    id: number
): Promise<RespostaMensagem> {
    return requisicao<RespostaMensagem>(`/api/clientes/${id}`, {
        metodo: "DELETE",
        token,
        mensagemErro: "Erro ao excluir o cliente."
    });
}

export async function listarProjetos(
    token: string,
    pagina: number = 1
): Promise<RespostaProjetos> {
    return requisicao<RespostaProjetos>(
        `/api/projetos?pagina=${pagina}&limite=10`,
        {
            token,
            mensagemErro: "Erro ao listar os projetos."
        }
    );
} 

export async function consultarProjeto(
    token: string,
    id: number
): Promise<Projeto> {
    const resultado = await requisicao<{ projeto: Projeto }> (
        `/api/projetos/${id}`,
        {
            token,
            mensagemErro: "Erro ao consultar o projeto."
        }
    );

    return resultado.projeto;
}

export async function cadastrarProjeto(
    token: string,
    dados: DadosNovoProjeto
): Promise<RespostaMensagem> {
    return requisicao<RespostaMensagem>("/api/projetos", {
        metodo: "POST",
        token,
        dados,
        mensagemErro: "Erro ao cadastrar o projeto."
    });
}

export async function atualizarProjeto(
    token: string,
    id: number,
    dados: DadosProjeto
): Promise<RespostaMensagem> {
    return requisicao<RespostaMensagem>(`/api/projetos/${id}`, {
        metodo: "PUT",
        token,
        dados,
        mensagemErro: "Erro ao atualizar o projeto."
    });
}

export async function excluirProjeto(
    token: string,
    id: number
): Promise<RespostaMensagem> {
    return requisicao<RespostaMensagem>(`/api/projetos/${id}`, {
        metodo: "DELETE",
        token,
        mensagemErro: "Erro ao excluir o projeto."
    });
}
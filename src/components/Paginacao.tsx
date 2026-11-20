type PaginacaoProps = {
    pagina: number;
    totalPaginas: number;
    bloqueada: boolean;
    descricao: string;
    aoMudarPagina: (novaPagina: number) => void;
};

export function Paginacao({
    pagina,
    totalPaginas,
    bloqueada,
    descricao,
    aoMudarPagina
}: PaginacaoProps) {
    if (totalPaginas <= 1) return null;

    return (
        <nav
            aria-label={descricao}
            className="d-flex flex-wrap align-items-center gap-3 mt-3"
        >
            <button
                type="button"
                className="btn btn-outline-secondary"
                disabled={bloqueada || pagina <= 1}
                onClick={() => aoMudarPagina(pagina - 1)}
            >
                Anterior
            </button>

            <span aria-live="polite">
                Página {pagina} de {totalPaginas}
            </span>

            <button
                type="button"
                className="btn btn-outline-secondary"
                disabled={bloqueada || pagina >= totalPaginas}
                onClick={() => aoMudarPagina(pagina + 1)}
            >
                Próxima
            </button>
        </nav>
    );
}
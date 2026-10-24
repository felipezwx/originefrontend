
export function validarEmail(email: string): boolean {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  return regex.test(email.trim());
}

export function validarCPF(cpf: string): boolean {
    const numeros = cpf.replace(/\D/g, "");

    if (numeros.length !== 11) {
        return false;
    }

    if (/^(\d)\1{10}$/.test(numeros)) {
        return false;
    }

    for (let digito = 9; digito < 11; digito++) {
        let soma = 0;

        for (let i = 0; i < digito; i++) {
            soma += Number(numeros[i]) * (digito + 1 - i);
        }

        let verificador = (soma * 10) % 11;

        if (verificador === 10) {
            verificador = 0;
        }

        if (verificador !== Number(numeros[digito])) {
            return false;
        }
    }

    return true;
}

export function validarSenha(senha: string): boolean {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

    return regex.test(senha);
}


export function formatarCPF(cpf: string): string {
    const numeros = cpf.replace(/\D/g, "").slice(0, 11);

    return numeros
        .replace(/^(\d{3})(\d)/, "$1.$2")
        .replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
        .replace(/\.(\d{3})(\d)/, ".$1-$2");
}

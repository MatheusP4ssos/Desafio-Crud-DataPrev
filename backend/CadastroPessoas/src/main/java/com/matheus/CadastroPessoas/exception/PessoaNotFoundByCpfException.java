package com.matheus.CadastroPessoas.exception;

public class PessoaNotFoundByCpfException extends RuntimeException {
    public PessoaNotFoundByCpfException(String cpf) {
        super(String.format("Não foi encontrada nenhuma pessoa com o CPF: %s", cpf));
    }
}

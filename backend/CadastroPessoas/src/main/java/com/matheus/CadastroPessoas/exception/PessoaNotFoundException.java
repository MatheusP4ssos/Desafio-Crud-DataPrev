package com.matheus.CadastroPessoas.exception;

public class PessoaNotFoundException extends RuntimeException {
    public PessoaNotFoundException(Long id) {
        super("Pessoa não identificada com o ID: " + id);
    }

    public PessoaNotFoundException(String message) {
        super(message);
    }
}
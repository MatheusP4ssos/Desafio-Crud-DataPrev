package com.matheus.CadastroPessoas.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;

public class PessoaDTO {

    @NotBlank(message = "O CPF é obrigatório")
    @Size(min = 11, max = 11, message = "O CPF deve ter exatamente 11 caracteres")
    private String cpf;

    @NotBlank(message = "O nome é obrigatório")
    private String nome;

    @NotNull(message = "A data de nascimento é obrigatória")
    private LocalDate dataNascimento;

    @NotBlank(message = "O sexo é obrigatório")
    @Size(min = 1, max = 1, message = "Por favor digite apenas 'M' para masculino ou 'F' para feminino")
    private String sexo;

    public PessoaDTO() {
    }

    public PessoaDTO(String cpf, String nome, LocalDate dataNascimento, String sexo) {
        this.cpf = cpf;
        this.nome = nome;
        this.dataNascimento = dataNascimento;
        this.sexo = sexo;
    }

    public String getCpf() {
        return cpf;
    }

    public String getNome() {
        return nome;
    }

    public LocalDate getDataNascimento() {
        return dataNascimento;
    }

    public String getSexo() {
        return sexo;
    }
}

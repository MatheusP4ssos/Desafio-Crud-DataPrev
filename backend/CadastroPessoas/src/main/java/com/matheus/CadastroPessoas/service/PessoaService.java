package com.matheus.CadastroPessoas.service;

import com.matheus.CadastroPessoas.entity.Pessoa;
import com.matheus.CadastroPessoas.dto.PessoaDTO;
import com.matheus.CadastroPessoas.exception.PessoaNotFoundException;
import com.matheus.CadastroPessoas.repository.PessoaRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PessoaService {

    private final PessoaRepository repository;

    public PessoaService(PessoaRepository repository) {
        this.repository = repository;
    }

    public Pessoa cadastrar(PessoaDTO dto) {

        if (repository.existsByCpf(dto.getCpf())) {
            throw new IllegalArgumentException("Já existe uma pessoa cadastrada com este CPF.");
        }

        Pessoa pessoa = new Pessoa();
        pessoa.setNome(dto.getNome());
        pessoa.setCpf(dto.getCpf());
        pessoa.setDataNascimento(dto.getDataNascimento());
        pessoa.setSexo(dto.getSexo());

        return repository.save(pessoa);
    }

    public List<Pessoa> listar() {
        return repository.findAll();
    }

    public Pessoa buscarPorId(Long id) {
        return repository.findById(id).orElseThrow(() ->
                new PessoaNotFoundException(id));
    }

    public void remover(Long id) {
        if (!repository.existsById(id)) {
            throw new PessoaNotFoundException(id);
        }
        repository.deleteById(id);
    }

    public Pessoa atualizar(Long id, PessoaDTO dto) {
        Pessoa pessoaExistente = repository.findById(id).orElseThrow(() -> new PessoaNotFoundException(id));

        pessoaExistente.setNome(dto.getNome());
        pessoaExistente.setCpf(dto.getCpf());
        pessoaExistente.setDataNascimento(dto.getDataNascimento());
        pessoaExistente.setSexo(dto.getSexo());

        return repository.save(pessoaExistente);
    }
}


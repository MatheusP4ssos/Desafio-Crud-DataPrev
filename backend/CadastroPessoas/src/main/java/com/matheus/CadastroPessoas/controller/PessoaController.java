package com.matheus.CadastroPessoas.controller;

import com.matheus.CadastroPessoas.dto.PessoaDTO;
import com.matheus.CadastroPessoas.entity.Pessoa;
import com.matheus.CadastroPessoas.service.GerarRelatorioService;
import com.matheus.CadastroPessoas.service.PessoaService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

@RestController
@RequestMapping("/pessoas")
public class PessoaController {

    private final GerarRelatorioService gerarRelatorioService;
    private final PessoaService service;
    
    @Value("${app.relatorio.dir:./relatorios}")
    private String relatorioDir;

    public PessoaController(PessoaService service, GerarRelatorioService gerarRelatorioService) {
        this.service = service;
        this.gerarRelatorioService = gerarRelatorioService;
    }

    @PostMapping
    public ResponseEntity<Pessoa> cadastrar(@RequestBody @Valid PessoaDTO dto) {
        Pessoa pessoa = service.cadastrar(dto);
        return ResponseEntity.ok(pessoa);
    }

    @GetMapping
    public ResponseEntity<List<Pessoa>> listar() {
        return ResponseEntity.ok(service.listar());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Pessoa> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(service.buscarPorId(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> remover(@PathVariable Long id) {
        service.remover(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<Pessoa> atualizar(@PathVariable Long id, @RequestBody @Valid PessoaDTO dto) {
        Pessoa pessoaAtualizada = service.atualizar(id, dto);
        return ResponseEntity.ok(pessoaAtualizada);
    }

    @GetMapping("/relatorio/download/{nomeArquivo}")
    public ResponseEntity<byte[]> downloadRelatorio(@PathVariable String nomeArquivo) {
        try {
            File diretorio = new File(relatorioDir);
            if (!diretorio.exists()) {
                diretorio.mkdirs();
            }
            
            Path arquivo = Paths.get(relatorioDir, nomeArquivo);
            if (!Files.exists(arquivo)) {
                return ResponseEntity.notFound().build();
            }
            
            byte[] conteudo = Files.readAllBytes(arquivo);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            headers.setContentDispositionFormData("filename", nomeArquivo);

            return new ResponseEntity<>(conteudo, headers, HttpStatus.OK);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping("/relatorio/gerar")
    public ResponseEntity<String> gerarRelatorio() {
        try {
            String nomeArquivo = gerarRelatorioService.gerarRelatorio();
            return ResponseEntity.ok(nomeArquivo);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Erro ao gerar relatório: " + e.getMessage());
        }
    }
}
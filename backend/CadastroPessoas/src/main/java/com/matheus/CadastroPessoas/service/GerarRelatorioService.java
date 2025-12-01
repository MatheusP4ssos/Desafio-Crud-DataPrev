package com.matheus.CadastroPessoas.service;

import com.matheus.CadastroPessoas.entity.Pessoa;
import com.matheus.CadastroPessoas.repository.PessoaRepository;
import com.openhtmltopdf.pdfboxout.PdfRendererBuilder;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.FileOutputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
public class GerarRelatorioService {

    private final PessoaRepository repository;
    private final String relatoriosDir;

    public GerarRelatorioService(PessoaRepository repository) {
        this.repository = repository;
        this.relatoriosDir = "./relatorios";
    }

    public String gerarRelatorio() {
        try {
            Path dirPath = Paths.get(relatoriosDir);
            Files.createDirectories(dirPath);

            String nomeArquivo = "relatorio_" +
                LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd_HHmmss")) + 
                ".pdf";
            
            Path caminhoCompleto = dirPath.resolve(nomeArquivo);

            List<Pessoa> pessoas = repository.findAll();
            String html = gerarHTML(pessoas);

            try (ByteArrayOutputStream outputStream = new ByteArrayOutputStream()) {
                PdfRendererBuilder builder = new PdfRendererBuilder();
                builder.withHtmlContent(html, "file:///" + Paths.get("").toAbsolutePath() + "/");
                builder.toStream(outputStream);
                builder.run();

                try (FileOutputStream fos = new FileOutputStream(caminhoCompleto.toFile())) {
                    outputStream.writeTo(fos);
                }
            }

            return nomeArquivo;
        } catch (Exception e) {
            throw new RuntimeException("Erro ao gerar relatório PDF: " + e.getMessage(), e);
        }
    }

    private String gerarHTML(List<Pessoa> pessoas) {
        StringBuilder html = new StringBuilder();

        html.append("<!DOCTYPE html>");
        html.append("<html lang='pt-BR'>");
        html.append("<head>");
        html.append("<meta charset='UTF-8' />");
        html.append("<style>");
        html.append("table { width: 100%; border-collapse: collapse; margin-top: 20px; }");
        html.append("th, td { border: 1px solid #444; padding: 8px; text-align: left; }");
        html.append("th { background-color: #eaeaea; }");
        html.append("h1 { text-align: center; }");
        html.append("</style>");
        html.append("</head>");
        html.append("<body>");

        html.append("<h1>Relatório de Pessoas</h1>");
        html.append("<table>");
        html.append("<tr><th>CPF</th><th>Nome</th><th>Data de Nascimento</th><th>Sexo</th></tr>");

        for (Pessoa pessoa : pessoas) {
            html.append("<tr>");
            html.append("<td>").append(pessoa.getCpf()).append("</td>");
            html.append("<td>").append(pessoa.getNome()).append("</td>");
            html.append("<td>").append(pessoa.getDataNascimento()).append("</td>");
            html.append("<td>").append(pessoa.getSexo()).append("</td>");
            html.append("</tr>");
        }

        html.append("</table>");
        html.append("</body></html>");

        return html.toString();
    }
}
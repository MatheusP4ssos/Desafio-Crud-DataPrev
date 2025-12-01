import { useState } from "react";
import Operations from "../assets/header/operation";

export default function ReportButton() {
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    try {
      setLoading(true);
      const postRes = await fetch("/pessoas/relatorio/gerar", {
        method: "POST",
      });
      if (!postRes.ok) {
        const body = await postRes.text().catch(() => "");
        throw new Error(
          `Erro ao gerar relatório: ${postRes.status} ${postRes.statusText} ${body}`
        );
      }

      let filename = (await postRes.text()).trim();
      if (!filename) {
        try {
          const j = await postRes.json();
          filename = j.filename || j.name || j.file || "";
        } catch {
          filename = "";
        }
      }
      if (!filename)
        throw new Error("Nome do arquivo retornado vazio do backend");

      const getRes = await fetch(
        `/pessoas/relatorio/download/${encodeURIComponent(filename)}`
      );
      if (!getRes.ok)
        throw new Error(
          `Erro ao baixar relatório: ${getRes.status} ${getRes.statusText}`
        );

      const blob = await getRes.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (e) {
      console.error(e);
      alert(e.message || String(e));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed right-4 bottom-4 z-50">
      <Operations
        icon="fa-solid fa-file-export"
        color={`bg-blue-500 text-white px-4 py-3 shadow-lg ${
          loading ? "opacity-60 cursor-progress" : "hover:bg-blue-600"
        }`}
        text={loading ? "Gerando..." : "Gerar Relatório"}
        onClick={handleGenerate}
      />
    </div>
  );
}

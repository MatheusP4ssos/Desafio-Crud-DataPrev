import { useEffect, useState } from "react";
import TableBody from "./table-body";

export default function Main() {
  const [pageNumber, setPageNumber] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  useEffect(() => {
    const handler = (e) => {
      const info = e.detail || {};
      setPageNumber(info.pageNumber ?? 0);
      setPageSize(info.pageSize ?? 10);
      setTotalPages(info.totalPages ?? 0);
      setTotalElements(info.totalElements ?? 0);
    };
    window.addEventListener("pageInfo", handler);
    return () => window.removeEventListener("pageInfo", handler);
  }, []);

  function goToPage(page, size) {
    window.dispatchEvent(
      new CustomEvent("goToPage", { detail: { page, size } })
    );
  }

  return (
    <>
      <div className="p-1 flex flex-col justify-center">
        <div className="mb-4 flex items-center gap-2">
          <div className="relative">
            <input
              id="cpf-search"
              placeholder="Buscar por CPF"
              className="border p-2 rounded pl-10"
              onKeyDown={async (e) => {
                if (e.key === "Enter") {
                  const cpf = e.target.value.trim();
                  if (!cpf) return;
                  try {
                    const res = await fetch(
                      `/pessoas/cpf/${encodeURIComponent(cpf)}`
                    );
                    if (res.status === 404) {
                      alert("Nenhum usuário encontrado com este CPF");
                      return;
                    }
                    const pessoa = await res.json();
                    window.dispatchEvent(
                      new CustomEvent("searchResult", { detail: pessoa })
                    );
                  } catch (err) {
                    console.error(err);
                    alert("Erro ao buscar por CPF");
                  }
                }
              }}
            />
            <i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          </div>
          <button
            className="px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            onClick={async () => {
              const input = document.getElementById("cpf-search");
              const cpf = input?.value?.trim();
              if (!cpf) return alert("Digite um CPF para buscar");
              try {
                const res = await fetch(
                  `/pessoas/cpf/${encodeURIComponent(cpf)}`
                );
                if (res.status === 404)
                  return alert("Nenhum usuário encontrado com este CPF");
                const pessoa = await res.json();
                window.dispatchEvent(
                  new CustomEvent("searchResult", { detail: pessoa })
                );
              } catch (err) {
                console.error(err);
                alert("Erro ao buscar por CPF");
              }
            }}
          >
            Buscar
          </button>
          <button
            className="px-3 py-2 bg-gray-300 rounded hover:bg-gray-400"
            onClick={async () => {
              const input = document.getElementById("cpf-search");
              if (input) input.value = "";
              window.dispatchEvent(new CustomEvent("clearSearch"));
            }}
          >
            Limpar
          </button>
        </div>
        <table className="min-w-full border-separate border-spacing-y-3">
          <thead>
            <tr className="text-left text-gray-700 font-semibold">
              <th className="px-4">Nome</th>
              <th className="px-4">CPF</th>
              <th className="px-4">Data Nascimento</th>
              <th className="px-4">Sexo</th>
              <th className="px-4">Ações</th>
            </tr>
          </thead>
          <TableBody />
        </table>
        <div className="mt-3 flex items-center justify-between">
          <div>
            <button
              className="px-3 py-1 bg-gray-200 rounded mr-2"
              onClick={() => goToPage(Math.max(0, pageNumber - 1), pageSize)}
              disabled={pageNumber <= 0}
            >
              Anterior
            </button>
            <button
              className="px-3 py-1 bg-gray-200 rounded"
              onClick={() =>
                goToPage(Math.min(totalPages - 1, pageNumber + 1), pageSize)
              }
              disabled={pageNumber >= totalPages - 1}
            >
              Próxima
            </button>
          </div>
          <div className="text-sm text-gray-600">
            Página {pageNumber + 1} de {totalPages} — {totalElements} registros
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm">Itens por página:</label>
            <select
              value={pageSize}
              onChange={(e) => {
                const newSize = Number(e.target.value);
                setPageSize(newSize);
                goToPage(0, newSize);
              }}
              className="border p-1 rounded"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </div>
        </div>
      </div>
    </>
  );
}

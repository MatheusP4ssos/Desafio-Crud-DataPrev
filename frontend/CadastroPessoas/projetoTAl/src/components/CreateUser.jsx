import { useState } from "react";
import { createPortal } from "react-dom";

export default function CreateUser({ open, onClose }) {
  const [nome, setNome] = useState("");
  const [cpf, setCpf] = useState("");
  const [sexo, setSexo] = useState("");
  const [dataNascimento, setDataNascimento] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!open) return null;

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      const payload = { nome, cpf, sexo, dataNascimento };
      const res = await fetch(`/pessoas`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const txt = await res.text().catch(() => null);
        throw new Error(`${res.status} ${res.statusText} ${txt || ""}`);
      }
      const newUser = await res.json();
      window.dispatchEvent(new CustomEvent("userCreated", { detail: newUser }));
      onClose();
    } catch (e) {
      setError(e.message || String(e));
    } finally {
      setLoading(false);
    }
  };

  return createPortal(
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-96">
        <h2 className="text-xl font-bold mb-4">Criar Usuário</h2>

        {error && <div className="text-red-600 mb-2">{error}</div>}

        <input
          className="border p-2 w-full mb-3 rounded"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          placeholder="Nome"
        />
        <input
          className="border p-2 w-full mb-3 rounded"
          value={cpf}
          onChange={(e) => setCpf(e.target.value)}
          placeholder="CPF"
        />
        <input
          className="border p-2 w-full mb-3 rounded"
          value={sexo}
          onChange={(e) => setSexo(e.target.value)}
          placeholder="Sexo"
        />
        <input
          className="border p-2 w-full mb-3 rounded"
          value={dataNascimento}
          onChange={(e) => setDataNascimento(e.target.value)}
          placeholder="Data de Nascimento"
        />

        <div className="flex justify-end gap-3 mt-4">
          <button
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            onClick={onClose}
            disabled={loading}
          >
            Cancelar
          </button>
          <button
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Enviando..." : "Criar"}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}

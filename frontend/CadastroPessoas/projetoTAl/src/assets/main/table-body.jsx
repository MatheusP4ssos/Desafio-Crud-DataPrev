import { useEffect, useState, useCallback } from "react";
import { createPortal } from "react-dom";

export default function TableBody() {
  const [visibleUsers, setVisibleUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [pageNumber, setPageNumber] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  // load a specific page from the backend (server-side pagination)
  const loadPage = useCallback(async (page = 0, size = pageSize) => {
    try {
      const res = await fetch(`/pessoas?page=${page}&size=${size}`);
      const data = await res.json();
      const content = data.content ?? data;
      setVisibleUsers(content);
      const current = data.number ?? page;
      setPageNumber(current);

      // inform UI (Main) about current pagination state
      window.dispatchEvent(
        new CustomEvent("pageInfo", {
          detail: {
            pageNumber: current,
            pageSize: size,
            totalPages: data.totalPages ?? 1,
            totalElements: data.totalElements ?? (content ? content.length : 0),
          },
        })
      );
    } catch (e) {
      console.error("Error loading page:", e);
    }
  }, [pageSize]);

  useEffect(() => {
    // load first page on mount (defer to avoid synchronous setState in effect)
    setTimeout(() => loadPage(0, pageSize), 0);

    const createdHandler = () => {
      // after creating a user, reload first page to keep ordering predictable
      loadPage(0, pageSize);
    };

    const searchHandler = (e) => {
      const pessoa = e.detail;
      if (pessoa) {
        setVisibleUsers([pessoa]);
        setPageNumber(0);
        window.dispatchEvent(
          new CustomEvent("pageInfo", {
            detail: {
              pageNumber: 0,
              pageSize: 1,
              totalPages: 1,
              totalElements: 1,
            },
          })
        );
      }
    };

    const clearHandler = () => {
      loadPage(0, pageSize);
    };

    const goToPageHandler = (e) => {
      const { page, size } = e.detail || {};
      if (size) setPageSize(size);
      loadPage(page ?? 0, size ?? pageSize);
    };

    window.addEventListener("userCreated", createdHandler);
    window.addEventListener("searchResult", searchHandler);
    window.addEventListener("clearSearch", clearHandler);
    window.addEventListener("goToPage", goToPageHandler);
    return () => {
      window.removeEventListener("userCreated", createdHandler);
      window.removeEventListener("searchResult", searchHandler);
      window.removeEventListener("clearSearch", clearHandler);
      window.removeEventListener("goToPage", goToPageHandler);
    };
  }, [loadPage, pageSize]);

  const handleDeleteUser = async (id) => {
    try {
      console.log("deleting user id:", id);
      await fetch(`/pessoas/${id}`, {
        method: "DELETE",
      });
      // reload current page after delete to keep pagination consistent
      await loadPage(pageNumber, pageSize);
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("Erro ao deletar usuário: " + (error.message || error));
    }
  };

  const handleSave = async () => {
    try {
      const res = await fetch(`/pessoas/${editingUser.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editingUser),
      });
      await res.json();
      // refresh current page after update to reflect any server-side changes
      await loadPage(pageNumber, pageSize);
      setEditingUser(null);
    } catch (error) {
      console.error("Error saving user:", error);
      alert("Erro ao salvar usuário: " + (error.message || error));
    }
  };

  return (
    <>
      <tbody>
        {visibleUsers.map((user) => (
          <tr key={user.id}>
            <td className="px-4">{user.nome}</td>
            <td className="px-4">{user.cpf}</td>
            <td className="px-4">{user.cpf}</td>
            <td className="px-4">{user.dataNascimento}</td>
            <td className="px-4">{user.sexo}</td>
            <td className="px-4">
              <i
                className="fa-solid fa-pen-to-square text-yellow-500 cursor-pointer hover:text-yellow-600 mr-3"
                onClick={() => setEditingUser(user)}
              />
              <i
                className="fa-solid fa-trash text-red-500 cursor-pointer hover:text-red-600"
                onClick={() => handleDeleteUser(user.id)}
                title="Deletar"
                role="button"
              />
            </td>
          </tr>
        ))}
      </tbody>

      {editingUser &&
        createPortal(
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg w-96">
              <h2 className="text-xl font-bold mb-4">Editar Usuário</h2>

              <input
                className="border p-2 w-full mb-3 rounded"
                value={editingUser?.nome || ""}
                onChange={(e) =>
                  setEditingUser({ ...editingUser, nome: e.target.value })
                }
                placeholder="Nome"
              />
              <input
                className="border p-2 w-full mb-3 rounded"
                value={editingUser?.cpf || ""}
                onChange={(e) =>
                  setEditingUser({ ...editingUser, cpf: e.target.value })
                }
                placeholder="CPF"
              />
              <input
                className="border p-2 w-full mb-3 rounded"
                value={editingUser?.sexo || ""}
                onChange={(e) =>
                  setEditingUser({ ...editingUser, sexo: e.target.value })
                }
                placeholder="Sexo"
              />
              <input
                className="border p-2 w-full mb-3 rounded"
                value={editingUser?.dataNascimento || ""}
                onChange={(e) =>
                  setEditingUser({
                    ...editingUser,
                    dataNascimento: e.target.value,
                  })
                }
                placeholder="Data de Nascimento"
              />

              <div className="flex justify-end gap-3 mt-4">
                <button
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                  onClick={() => setEditingUser(null)}
                >
                  Cancelar
                </button>
                <button
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  onClick={handleSave}
                >
                  Salvar
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}

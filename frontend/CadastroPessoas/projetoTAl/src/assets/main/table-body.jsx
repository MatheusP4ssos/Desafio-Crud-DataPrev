import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

export default function TableBody() {
  const [useUsers, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);

  useEffect(() => {
    async function _fetchData() {
      try {
        const res = await fetch(`/pessoas`, { method: "GET" });
        const data = await res.json();
        console.log("fetched users:", data);
        setUsers(data);
      } catch (e) {
        console.log(e);
      }
    }
    _fetchData();
    const handler = (e) => {
      const newUser = e.detail;
      if (newUser) setUsers((prev) => [newUser, ...prev]);
    };
    window.addEventListener("userCreated", handler);
    return () => window.removeEventListener("userCreated", handler);
  }, []);

  const handleDeleteUser = async (id) => {
    try {
      console.log("deleting user id:", id);
      await fetch(`/pessoas/${id}`, {
        method: "DELETE",
      });
      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));
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
      const updatedUser = await res.json();
      setUsers(
        useUsers.map((u) => (u.id === updatedUser.id ? updatedUser : u))
      );
      setEditingUser(null);
    } catch (error) {
      console.error("Error saving user:", error);
      alert("Erro ao salvar usuário: " + (error.message || error));
    }
  };

  return (
    <>
      <tbody>
        {useUsers.map((user) => (
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
                  onClick={() => handleSave(editingUser)}
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

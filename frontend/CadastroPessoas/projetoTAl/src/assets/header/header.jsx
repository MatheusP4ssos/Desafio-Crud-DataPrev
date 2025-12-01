import { useState } from "react";
import Logo from "./logo";
import Operations from "./operation";
import CreateUser from "../../components/CreateUser";

export default function Header() {
  const [showCreate, setShowCreate] = useState(false);

  return (
    <>
      <div className="bg-sky-900 p-3 flex justify-between ">
        <Logo></Logo>
        <div className=" flex gap-1">
          <Operations
            icon="fa-solid fa-user-plus"
            color="bg-green-500 text-white px-3 py-2 hover:bg-green-600"
            text="Adicionar Pessoa"
            onClick={() => setShowCreate(true)}
          />
        </div>
      </div>

      <CreateUser open={showCreate} onClose={() => setShowCreate(false)} />
    </>
  );
}

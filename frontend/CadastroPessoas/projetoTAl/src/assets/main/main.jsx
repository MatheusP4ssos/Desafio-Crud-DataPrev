import TableBody from "./table-body";
export default function Main() {
  return (
    <>
      <div className="p-1 flex flex-col justify-center">
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
      </div>
    </>
  );
}

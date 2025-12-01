import UserIcon from "../../components/UserIcon";

export default function Logo() {
  return (
    <div className="flex items-center gap-2 text-white">
      <UserIcon className="w-6 h-6 text-white" />

      <h1 className="text-xl text-white">
        Cadastro <strong> Pessoas </strong>
      </h1>
    </div>
  );
}

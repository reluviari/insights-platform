interface Props {
  active: boolean;
}

export default function UserStatus(props: Props) {
  const { active } = props;
  return (
    <div className="px-2 py-1 text-sm font-normal border border-neutral-200 rounded-2xl w-fit flex items-center gap-1">
      <div
        className={`w-4 h-4 rounded-full ${
          active ? "bg-system-success-500 " : "bg-system-error-500"
        }`}
      />
      <>{active ? "Ativo" : "Inativo"}</>
    </div>
  );
}

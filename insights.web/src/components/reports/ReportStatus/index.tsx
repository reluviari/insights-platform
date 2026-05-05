interface Props {
  active?: boolean;
}

export default function ReportStatus({ active }: Props) {
  if (active === undefined || active === null) {
    return null;
  }

  return (
    <div className="flex items-center gap-1 text-sm font-normal border border-neutral-200 rounded-2xl w-fit px-2 py-1">
      <div
        className={`w-4 h-4 rounded-full ${
          active ? "bg-system-success-500" : "bg-system-error-500"
        }`}
      />
      <span>{active ? "Ativo" : "Inativo"}</span>
    </div>
  );
}

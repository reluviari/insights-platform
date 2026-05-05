import Error from "@src/assets/icons/Error";

interface Props {
  type: "success" | "error" | "warning" | "info";
  children: React.ReactNode;
  className?: string;
}

export default function Alert(props: Props) {
  const { type, children, className } = props;

  const icon: any = {
    error: (
      <span>
        <Error />
      </span>
    ),
  };

  return (
    <div
      className={`
        bg-system-error-100 flex gap-2 w-full items-center
        text-system-error-500 px-4 py-2 font-normal text-sm
        leading-5 rounded-lg	${className}
      `}
    >
      {icon[type]} {children}
    </div>
  );
}

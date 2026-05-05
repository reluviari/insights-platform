import { ReactNode } from "react";

interface Props {
  className?: string;
  children: ReactNode;
}

export default function BaseModal(props: Props) {
  const { className, children } = props;

  return (
    <div
      className="
      flex justify-center items-center overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none bg-[#313131] bg-opacity-70"
    >
      <div
        className={`relative border-0 rounded-xl h-auto p-6 shadow-modal flex flex-col bg-neutral-0 outline-none focus:outline-none ${className}`}
      >
        {children}
      </div>
    </div>
  );
}

import { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

export default function Chip(props: Props) {
  const { children } = props;
  return (
    <div className="px-2 py-1 text-sm font-normal border border-neutral-200 rounded-2xl w-fit">
      {children}
    </div>
  );
}

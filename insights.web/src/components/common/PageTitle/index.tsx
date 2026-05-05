import { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

export default function PageTitle(props: Props) {
  const { children } = props;
  return (
    <div className="grow shrink basis-0 flex-col justify-center items-start inline-flex my-4">
      <div className="text-stone-900 text-3xl font-bold leading-10">{children}</div>
    </div>
  );
}

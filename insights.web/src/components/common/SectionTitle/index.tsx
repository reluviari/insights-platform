import { ReactNode } from "react";

interface Props {
  title: string;
  description: string;
  icon: ReactNode;
}

export default function SectionTitle(props: Props) {
  const { title, description, icon } = props;

  return (
    <div className="h-12 justify-start items-center gap-4 inline-flex">
      <div className="w-12 h-12 relative">{icon}</div>
      <div className="grow shrink basis-0 flex-col justify-center items-start gap-1 inline-flex">
        <div className="self-stretch text-neutral-800 text-lg font-bold font-sans leading-7">
          {title}
        </div>
        <div className="self-stretch text-neutral-400 text-sm font-medium font-sans leading-tight">
          {description}
        </div>
      </div>
    </div>
  );
}

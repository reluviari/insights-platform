import Arrow from "@src/assets/icons/Arrow";
import { useRouter } from "next/router";

interface Props {
  links: {
    label: string;
    route: string;
    active?: boolean;
  }[];
}
export default function Breadcrumbs(props: Props) {
  const { links } = props;
  const router = useRouter();

  return (
    <div className="self-stretch h-[22px] flex-col justify-start items-start flex">
      <div className="justify-start items-center gap-2 inline-flex">
        {links.map((link, index) => (
          <div className="flex items-center" key={`${index}-${link.label}`}>
            <div
              onClick={() => router.push(link.route)}
              className="p-px justify-start items-start gap-px flex cursor-pointer"
            >
              <div
                className={`text-neutral-800 text-sm font-medium leading-tight ${
                  link.active && "text-primary"
                }`}
              >
                {link.label}
              </div>
            </div>
            {index + 1 !== links.length && (
              <div className="text-slate-400 text-sm font-medium leading-snug ml-1">
                <Arrow />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

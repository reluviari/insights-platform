import Active from "@src/assets/icons/Active";
import classNames from "classnames";
import Image from "next/image";
import { ReactNode, memo } from "react";

interface Props {
  icon?: string | ReactNode;
  label: string;
  active?: boolean;
  expanded: boolean;
  onClick?: () => void;
}

function Item(props: Props) {
  const { icon, label, active, onClick, expanded } = props;

  const activeClass = classNames({
    "bg-neutral-500": active,
    "text-neutral-0": active,
    "text-neutral-400": !active,
  });

  return (
    <div className="relative px-5">
      {active && (
        <div className="absolute left-[-7px] z-30 bottom-[-8px]">
          <Active />
        </div>
      )}
      <div
        className={classNames(
          `flex relative items-center gap-3 text-lg font-semibold rounded-xl leading-7
        h-12 px-3 my-6 cursor-pointer hover:bg-neutral-500
        w-full hover:text-neutral-0 transition-all ease-in-out duration-300 ${activeClass}`,
          {
            "max-w-[48px]": !expanded,
            "max-w-full": expanded,
          },
        )}
        onClick={onClick}
      >
        {typeof icon === "object" ? (
          <div className="flex justify-center items-center">{icon}</div>
        ) : (
          <Image
            src={(icon as string) || "/chart.svg"}
            alt={`${label} icon`}
            width={24}
            height={24}
            className={`relative ${icon ? "image-invert" : ""}`}
          />
        )}
        <div
          className={classNames(
            "transition-width ease-in-out delay-300 duration-300 overflow-hidden",
            {
              "opacity-100": expanded,
              "h-auto": expanded,
              "w-30": expanded,
              "opacity-0": !expanded,
              "h-0": !expanded,
              "w-0": !expanded,
            },
          )}
        >
          {expanded && label}
        </div>
      </div>
    </div>
  );
}

export default memo(Item);

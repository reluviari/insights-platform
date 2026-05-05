import MoreHoriz from "@src/assets/icons/MoreHoriz";
import classNames from "classnames";
import { ReactNode, useCallback, useEffect, useRef, useState } from "react";

import useCloseOutside from "@src/hooks/useCloseOutside";

interface Props {
  items: Item[];
}

interface Item {
  label: string;
  icon?: ReactNode;
  onClick: () => void;
  disabled?: boolean;
  disabledMessage?: string;
}

export default function Dropdown(props: Props) {
  const { items } = props;
  const [active, setActive] = useState(false);
  const [alignTop, setAlignTop] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const toggleActive = useCallback(() => setActive(prev => !prev), []);
  useCloseOutside(ref, setActive);

  useEffect(() => {
    const handleAlignDropdown = () => {
      if (buttonRef.current && ref.current) {
        const buttonRect = buttonRef.current.getBoundingClientRect();
        const dropdownRect = ref.current.getBoundingClientRect();
        const viewportHeight = window.innerHeight;

        if (buttonRect.bottom + dropdownRect.height > viewportHeight) {
          setAlignTop(true);
        } else {
          setAlignTop(false);
        }
      }
    };

    if (active) {
      handleAlignDropdown();
      window.addEventListener("resize", handleAlignDropdown);
    }

    return () => window.removeEventListener("resize", handleAlignDropdown);
  }, [active]);

  return (
    <div className="w-8 self-stretch justify-end items-start gap-3 flex">
      <div className="w-8 h-8 rounded justify-center items-center relative">
        <button
          ref={buttonRef}
          onClick={toggleActive}
          className="hover:bg-neutral-300 w-8 h-8 p-0.5 bg-solid-slate-600 rounded border border-neutral-300 justify-center items-center flex"
        >
          <MoreHoriz />
        </button>
        <div
          ref={ref}
          className={classNames(
            "cursor-pointer w-[319px] absolute rounded border shadow-neutral-900 bg-white z-40",
            {
              hidden: !active,
              "bottom-full mb-1": alignTop,
              "top-full mt-1": !alignTop,
              "right-0": true,
            },
          )}
        >
          {items?.map(item => (
            <div
              key={item.label}
              className={classNames("justify-center items-center gap-2 flex p-4 rounded", {
                "hover:bg-neutral-300 bg-neutral-0 cursor-pointer": !item.disabled,
                "cursor-not-allowed text-neutral-1000": item.disabled,
              })}
              onClick={!item.disabled ? item.onClick : undefined}
              title={item.disabled ? item.disabledMessage : undefined}
            >
              <div className="w-6 h-6 flex justify-center items-center">{item.icon}</div>
              <div className="text-neutral-500 grow shrink basis-0 top-1 text-sm font-medium leading-tight">
                <a className={item.disabled ? "text-neutral-1000" : ""}>{item.label}</a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

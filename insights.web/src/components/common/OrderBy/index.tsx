import DropdownIcon from "@src/assets/icons/DropdownIcon";
import classNames from "classnames";
import { useCallback, useEffect, useRef, useState } from "react";

import useCloseOutside from "@src/hooks/useCloseOutside";

interface Props {
  items: Item[];
}

interface Item {
  label: string;
  onClick: () => void;
  isActive?: boolean;
}

export default function OrderBy({ items }: Props) {
  const [active, setActive] = useState(false);
  const [alignRight, setAlignRight] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const toggleActive = useCallback(() => setActive(prev => !prev), []);
  useCloseOutside(ref, setActive);

  const isActive = items.some(item => item.isActive);

  useEffect(() => {
    const handleAlignDropdown = () => {
      if (buttonRef.current && ref.current) {
        const buttonRect = buttonRef.current.getBoundingClientRect();
        const dropdownRect = ref.current.getBoundingClientRect();
        const viewportWidth = window.innerWidth;

        if (buttonRect.right + dropdownRect.width > viewportWidth) {
          setAlignRight(true);
        } else {
          setAlignRight(false);
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
    <div className="w-8 self-stretch justify-end items-start gap-3 flex relative z-30">
      <div className="w-8 h-8 rounded justify-center items-center">
        <button
          ref={buttonRef}
          onClick={toggleActive}
          className="hover:bg-neutral-300 w-8 h-8 p-0.5 bg-solid-slate-600 rounded justify-center items-center flex"
        >
          <DropdownIcon props={isActive} />
        </button>
        <div
          ref={ref}
          className={classNames(
            "cursor-pointer mt-1 absolute border shadow-neutral-900 w-[270px] rounded-lg top-full bg-white overflow-hidden z-50",
            {
              hidden: !active,
              "left-auto right-0": alignRight,
              "left-[10px]": !alignRight,
            },
          )}
        >
          <div className="flex items-center gap-3 bg-neutral-0 pt-2 pr-4 pb-2 pl-3 text-neutral-800 text-[15px] pointer-events-none text-left capitalize">
            Ordenação
          </div>
          {items.map(item => (
            <div
              key={item.label}
              className="flex items-center hover:bg-neutral-300 bg-neutral-0 pt-4 pr-6 pb-4 pl-3 border-t border-neutral-300"
              onClick={item.onClick}
            >
              <div className="flex items-center grow ml-2 text-left capitalize">
                <a className="text-[#5C5F61]">{item.label}</a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

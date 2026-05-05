import classNames from "classnames";
import React, { InputHTMLAttributes } from "react";
import Image from "next/image";

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
  width?: "small" | "medium" | "large";
}

function InputSearch(props: Props, ref: React.LegacyRef<HTMLInputElement>) {
  const { error, disabled, width = "medium", ...rest } = props;

  const borderClass = classNames({
    "border-system-error-500": error,
    "border-neutral-400": !error,
  });

  const disabledClass = classNames({
    "bg-neutral-200 text-neutral-300 focus:bg-neutral-200 cursor-auto": disabled,
    "bg-neutral-0 text-neutral-900": !disabled,
  });

  const sizeClass = classNames({
    "py-2 px-2 text-[13px]": width === "small",
    "py-3 px-3 text-[15px]": width === "medium",
    "py-4 px-4 text-[16px]": width === "large",
  });

  return (
    <div
      className={`
      flex border border-solid leading-tight hover:border-neutral-500 rounded-lg focus:outline-none ${borderClass} ${disabledClass} `}
    >
      <Image
        alt="Search"
        src={"/search.svg"}
        width="24"
        height="24"
        style={{ marginLeft: "12px" }}
      />
      <input
        ref={ref}
        className={`
           hover:border-neutral-500 rounded-lg focus:outline-none ${borderClass} ${disabledClass} ${sizeClass}`}
        {...rest}
        style={{ width: 360 }}
      />
    </div>
  );
}

export default React.forwardRef(InputSearch);

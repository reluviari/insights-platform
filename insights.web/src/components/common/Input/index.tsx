import classNames from "classnames";
import React, { InputHTMLAttributes } from "react";

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
  width?: "small" | "medium" | "large";
}

function Input(props: Props, ref: React.LegacyRef<HTMLInputElement>) {
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
    "py-2 px-3 text-[13px]": width === "small",
    "py-3 px-4 text-[15px]": width === "medium",
    "py-4 px-5 text-[16px]": width === "large",
  });

  return (
    <input
      ref={ref}
      className={`
        mt-1 border border-solid appearance-none
        block w-full leading-tight text-neutral-900
        bg-neutral-0 focus:bg-neutral-100
        hover:border-neutral-500 rounded-lg focus:outline-none ${borderClass} ${disabledClass} ${sizeClass}`}
      {...rest}
    />
  );
}

export default React.forwardRef(Input);

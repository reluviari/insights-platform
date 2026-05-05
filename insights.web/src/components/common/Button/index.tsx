import classNames from "classnames";
import { ButtonHTMLAttributes, ReactNode } from "react";

import Loading from "../Loading";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  size: "medium" | "small" | "large" | "x-small";
  variant: "primary" | "secondary" | "tertiary" | "danger" | "neutral";
  full?: boolean;
  icon?: ReactNode;
}

export default function Button(props: Props) {
  const { children, isLoading, disabled, className, size, variant, full, ...rest } = props;

  const baseClass = classNames("font-semibold leading-6 flex justify-center items-center", {
    "w-full": full,
  });

  const variantClass = classNames({
    "bg-neutral-900 text-neutral-0 disabled:bg-neutral-200 hover:bg-neutral-400 disabled:text-neutral-400":
      variant === "primary",
    "bg-neutral-0 text-neutral-900 border border-neutral-900 hover:border-neutral-400 hover:text-neutral-400 disabled:border-neutral-300 disabled:text-neutral-300":
      variant === "secondary",
    "bg-red-0 text-red-400 border border-red-400 hover:border-red-900 hover:text-red-900 disabled:border-red-300 disabled:text-red-300":
      variant === "tertiary",
    "bg-[#DA3333] text-[#FFFFFF] hover:bg-[#C92A2A] disabled:bg-red-400": variant === "danger",
    "bg-white text-neutral-900 border border-neutral-300 hover:bg-neutral-100":
      variant === "neutral",
  });

  const sizeClass = classNames({
    "py-2 px-4 h-[56px] text-base rounded-lg": size === "large",
    "py-2 px-4 h-[44px] text-base rounded-lg": size === "medium",
    "py-2 px-4 h-[40px] text-sm rounded-md": size === "small",
    "py-2 px-3 h-[36px] text-sm rounded-md": size === "x-small",
  });

  const btnClass = classNames(baseClass, variantClass, sizeClass, className);

  return (
    <button {...rest} disabled={disabled} className={`${btnClass}`}>
      {isLoading ? (
        <Loading
          color={
            variant === "primary" || variant === "danger" ? "fill-neutral-0" : "fill-neutral-900"
          }
        />
      ) : (
        children
      )}
    </button>
  );
}

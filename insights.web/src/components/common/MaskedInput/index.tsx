"use client";

import classNames from "classnames";
import { type InputHTMLAttributes, forwardRef, useImperativeHandle, useRef, useState } from "react";
import { IMaskInput } from "react-imask";

type MaskedInputOptions = {
  mask: any;
  scale?: number;
  thousandsSeparator?: string;
  padFractionalZeros?: boolean;
  normalizeZeros?: boolean;
  radix?: string;
  mapToRadix?: string[];
  min?: number | Date;
  max?: number | Date;
  disabled?: boolean;
  width?: "small" | "medium" | "large";
};

export type MaskedInputProps = InputHTMLAttributes<HTMLInputElement> & {
  mask: string | MaskedInputOptions;
};

export const MaskedInput = forwardRef(
  ({ value = "", className, mask, disabled, width, ...props }: MaskedInputProps, ref) => {
    const [inputValue, setInputValue] = useState(value);
    const maskedInputRef = useRef(null);

    if (!inputValue && value) {
      setInputValue(value);
    }

    let normalizedMask = mask;
    let maskOptions = {};

    if (typeof mask !== "string") {
      normalizedMask = mask.mask;
      maskOptions = mask;
    }

    const handleAccept = (currentValue: any) => {
      setInputValue(currentValue);
      props.onChange?.(currentValue);
    };

    useImperativeHandle(ref, () => maskedInputRef?.current, []);

    // const borderClass = classNames({
    //   "border-system-error-500": error,
    //   "border-neutral-400": !error,
    // });

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
      <IMaskInput
        value={inputValue as string}
        mask={normalizedMask as any /** @todo Melhorar tipo. */}
        className={`${sizeClass} flex w-full rounded-lg border border-input bg-background px-3 
        py-2 font-mono text-sm placeholder:text-muted-foreground 
        focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50`}
        onAccept={handleAccept}
        inputRef={maskedInputRef}
        {...props}
        {...maskOptions}
      />
    );
  },
);

MaskedInput.displayName = "MaskedInput";

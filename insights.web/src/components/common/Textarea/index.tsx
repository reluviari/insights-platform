import classNames from "classnames";
import React, { TextareaHTMLAttributes } from "react";

interface Props extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
}

function Textarea(props: Props, ref: React.LegacyRef<HTMLTextAreaElement>) {
  const { error, disabled, ...rest } = props;

  const borderClass = classNames({
    "border-system-error-500": error,
    "border-neutral-400": !error,
  });

  return (
    <textarea
      ref={ref}
      className={`
        w-full border border-neutral-400 border-solid appearance-none
        py-3 px-4 rounded text-[15px] bg-neutral-0
        focus:bg-neutral-100 focus:outline-none
        ${borderClass}
      `}
      {...rest}
    />
  );
}

export default React.forwardRef(Textarea);

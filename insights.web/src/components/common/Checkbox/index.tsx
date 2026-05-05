import React, { InputHTMLAttributes } from "react";

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

function Checkbox(props: Props, ref: React.LegacyRef<HTMLInputElement>) {
  const { label, id, ...rest } = props;

  return (
    <div className="flex items-center">
      <input
        ref={ref}
        {...rest}
        id={id}
        aria-describedby="checkbox-1"
        type="checkbox"
        className="
    accent-primary 
      cursor-pointer
    bg-gray-50
    border-gray-300 
    focus:ring-3
    focus:ring-black 
    h-4 
    w-4 
    rounded"
      />
      <label
        htmlFor={id}
        className="ml-[12px] 
    text-neutral-900 
    text-sm 
    font-medium 
    not-italic"
      >
        {label}
      </label>
    </div>
  );
}

export default React.forwardRef(Checkbox);

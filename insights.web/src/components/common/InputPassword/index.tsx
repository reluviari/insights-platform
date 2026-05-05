import EyeInvisible from "@src/assets/icons/EyeInvisible";
import EyeVisible from "@src/assets/icons/EyeVisible";
import classNames from "classnames";
import React, { InputHTMLAttributes, useState } from "react";

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: boolean;
}

function InputPassword(props: Props, ref: React.LegacyRef<HTMLInputElement>) {
  const [show, setShow] = useState(false);

  const { error, ...rest } = props;

  const borderClass = classNames({
    "border-system-error-500": error,
    "border-neutral-900": !error,
  });

  const toggle = () => setShow(current => !current);

  return (
    <div className="relative w-full">
      <label
        htmlFor={props.id}
        className="font-inter text-sm font-medium leading-1 tracking-wider text-left"
      >
        {props.label}
      </label>
      <div className="absolute right-4 top-10 cursor-pointer text-neutral-900" onClick={toggle}>
        {show ? <EyeVisible /> : <EyeInvisible />}
      </div>
      <input
        ref={ref}
        type={show ? "text" : "password"}
        className={`
          mt-2 border border-solid appearance-none
          block w-full py-3 px-4 leading-tight text-neutral-900 text-[15px] bg-neutral-0
          focus:bg-neutral-100 focus:border-neutral-500 hover:border-neutral-500 rounded-lg focus:outline-none ${borderClass}
        `}
        {...rest}
      />
    </div>
  );
}

export default React.forwardRef(InputPassword);

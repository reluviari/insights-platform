import classNames from "classnames";
import React from "react";

type CustomSelectType = {
  id: string;
  name: string;
  placeholder?: string;
  data: any[];
  value: string;
  onChange: (value: string) => void;
  isDisabled?: boolean;
  error: boolean;
  required?: boolean;
  disabledOptions?: string[];
};

const Select = ({
  id,
  name,
  placeholder,
  data,
  value,
  onChange,
  isDisabled,
  error,
  required,
  disabledOptions,
}: CustomSelectType) => {
  const inputClasses = classNames({
    "cursor-not-allowed": isDisabled,
  });

  const borderClass = classNames({
    "border-system-error-500": error,
    "border-neutral-400": !error,
  });

  return (
    <select
      id={id}
      name={name}
      value={value}
      required={required}
      className={classNames(
        `form-select appearance-none bg-no-repeat mt-1 border border-solid block w-full py-3 px-4 leading-tight text-black placeholder-gray-300 text-[15px] bg-neutral-0 focus:bg-neutral-100 hover:border-neutral-500 border-neutral-400 rounded-lg focus:outline-none ${inputClasses} ${borderClass}`,
      )}
      onChange={e => onChange(e.target.value)}
      style={{ backgroundColor: isDisabled ? "lightgray" : "inherit" }}
      disabled={isDisabled}
    >
      {placeholder && <option value={placeholder}>{placeholder}</option>}
      {data?.map((item: any) => (
        <option key={item.id} disabled={disabledOptions?.indexOf(item.id) >= 0} value={item.id}>
          {item?.name || item?.title}
        </option>
      ))}
    </select>
  );
};

export default Select;

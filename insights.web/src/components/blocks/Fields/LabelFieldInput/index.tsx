import Input from "@src/components/common/Input";
import { MaskedInput } from "@src/components/common/MaskedInput";
import React from "react";

type InputType = {
  label: string;
  id: string;
  name: string;
  type: string;
  placeholder: string;
  setValue: any;
  error: boolean;
  required?: boolean;
  mask?: string;
  maxLength?: number;
};

const LabelFieldInput = (
  { label, id, name, type, placeholder, setValue, error, required, mask, maxLength }: InputType,
  ref: any,
) => {
  const updateFieldValue = (value: string) => {
    setValue(name, value);
  };

  return (
    <div id="LabelFieldInput" className="w-full">
      <label
        htmlFor={id}
        className="font-inter text-sm font-medium leading-1 tracking-wider text-left"
      >
        {label}
      </label>
      {required && <label>*</label>}
      {!!mask ? (
        <MaskedInput
          id={id}
          ref={ref}
          name={name}
          type={type}
          mask={mask}
          placeholder={placeholder}
          onChange={(value: any) => {
            updateFieldValue(value);
          }}
          width="medium"
          maxLength={maxLength}
        />
      ) : (
        <Input
          id={id}
          ref={ref}
          name={name}
          type={type}
          placeholder={placeholder}
          onChange={e => updateFieldValue(e.target.value)}
          error={error}
          maxLength={maxLength}
        />
      )}
    </div>
  );
};

export default React.forwardRef(LabelFieldInput);

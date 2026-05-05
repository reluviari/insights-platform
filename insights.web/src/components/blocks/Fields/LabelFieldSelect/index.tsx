import Select from "@src/components/common/Select";
import React from "react";
import { Controller } from "react-hook-form";

type CustomSelectType = {
  label: string;
  id: string;
  name: string;
  placeholder?: string;
  data: any[];
  control: any;
  isDisabled?: boolean;
  error?: boolean;
  required?: boolean;
  disabledOptions?: string[];
  defaultValue?: string;
};

const LabelFieldSelect = ({
  label,
  id,
  name,
  placeholder,
  data,
  control,
  isDisabled,
  error,
  required,
  disabledOptions,
  defaultValue,
}: CustomSelectType) => {
  return (
    <div id="LabelFieldSelect" className="w-full">
      <label
        htmlFor={id}
        className="font-inter text-sm font-medium leading-3 tracking-wider text-left"
      >
        {label}
      </label>
      {required && <label>*</label>}
      <Controller
        name={name}
        control={control}
        defaultValue={defaultValue}
        render={({ field }) => (
          <Select
            id={id}
            name={name}
            placeholder={placeholder}
            data={data}
            value={field.value}
            isDisabled={isDisabled}
            error={error}
            onChange={field.onChange}
            disabledOptions={disabledOptions}
          />
        )}
      />
    </div>
  );
};

export default LabelFieldSelect;

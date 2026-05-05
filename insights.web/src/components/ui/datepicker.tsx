"use client";

import { Button } from "@src/components/ui/button";
import { Calendar } from "@src/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@src/components/ui/popover";
import { cn } from "@src/lib/utils";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar as CalendarIcon } from "lucide-react";
import * as React from "react";
import { Controller } from "react-hook-form";
import { validate } from "uuid";

type CustomSelectDateType = {
  label: string;
  id: string;
  name: string;
  placeholder: string;
  control: any;
  error: boolean;
  disabled?: any;
};

const DatePicker = ({
  label,
  id,
  name,
  placeholder,
  control,
  error,
  disabled,
}: CustomSelectDateType) => {
  return (
    <div id="DatePicker" className="w-full">
      <div className="w">
        <label
          htmlFor="id"
          className="font-inter text-sm font-medium leading-3 tracking-wider text-left "
        >
          {label}
        </label>
      </div>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-[100%] justify-start text-left font-normal",
                  !field.value && "text-muted-foreground",
                )}
                style={{ borderColor: error ? "red" : "grey" }}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {field.value ? (
                  format(new Date(field.value), "dd/MM/yyyy")
                ) : (
                  <span>{placeholder}</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                locale={ptBR}
                selected={field.value}
                onSelect={field.onChange}
                disabled={disabled}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        )}
      />
    </div>
  );
};

export default DatePicker;

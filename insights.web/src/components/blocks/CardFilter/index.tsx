import CloseSmall from "@src/assets/icons/CloseSmall";
import TrashFilter from "@src/assets/icons/TrashFilter";
import LabelFieldSelect from "@src/components/blocks/Fields/LabelFieldSelect";
import Button from "@src/components/common/Button";
import DatePicker from "@src/components/ui/datepicker";
import { PropsWithChildren, useEffect, useState } from "react";
import { Controller } from "react-hook-form";
import CreatableSelect from "react-select/creatable";

import Label from "../../common/Label";

const filterTypes = [
  {
    name: "Contém",
    id: "In",
  },
  {
    name: "Não Contém",
    id: "NotIn",
  },
];

type CardFilterCustom = {
  key: string;
  remove: any;
  tables: any;
  columns: any;
  disabledColumns: any;
  control: any;
  register: any;
  index: any;
  setValue: any;
  type: string;
  errors?: any;
  getValues: any;
  handleChangeRemoveColumnSelected: any;
  handleChangeColumnTrash: any;
  columEditText: string;
};

const CardFilter = ({
  key,
  remove,
  tables,
  columns,
  disabledColumns,
  control,
  register,
  index,
  setValue,
  columEditText,
  type,
  errors,
  getValues,
  handleChangeRemoveColumnSelected,
  handleChangeColumnTrash,
}: CardFilterCustom) => {
  const [columnsFiltered, setColumnsFiltered] = useState([]);
  const [oldValue, setOldValue] = useState("");

  const MultiValueRemove = (props: PropsWithChildren<any>) => {
    return (
      <div
        className={`pr-3 mt-2 cursor-pointer ${props.innerProps.className} `}
        onClick={props.innerProps.onClick}
      >
        <CloseSmall colors="#CE0058" />
      </div>
    );
  };

  const handleSelectChangeTables = (selectedOptions: string) => {
    setColumnsFiltered(columns.filter((column: any) => column.table == selectedOptions));
    handleChangeRemoveColumnSelected("", getValues(`filters.${index}.column`), true);
    setValue(`filters.${index}.column`, "");
  };

  useEffect(() => {
    setColumnsFiltered(
      columns.filter((column: any) => column.table == getValues(`filters.${index}.table`)),
    );
    if (columEditText && getValues(`filters.${index}.column`) == columEditText) {
      const oldValue = getValues(`filters.${index}.column`);
      setValue(`filters.${index}.column`, columEditText);
      handleChangeRemoveColumnSelected(getValues(`filters.${index}.column`), oldValue);
    }
  }, [
    columEditText,
    columns,
    getValues,
    index,
    setColumnsFiltered,
    setValue,
    handleChangeRemoveColumnSelected,
  ]);

  return (
    <div
      key={key}
      className="mt-2 mb-3 mx-4 w-[882px] h-full px-6 pt-5 pb-[30px] bg-neutral-100 rounded-xl border border-zinc-500 flex-col justify-start items-start gap-5 inline-flex"
    >
      <div className="w-full flex w-full  items-end">
        <div className="w-full">
          <Label> Filtro {index + 1}</Label>
        </div>
        <div>
          <Button
            variant="tertiary"
            size="medium"
            className="group"
            onClick={() => {
              handleChangeColumnTrash(getValues(`filters.${index}.column`));
              remove(index);
              return;
            }}
          >
            <TrashFilter className="group-hover:fill-red-100 group-hover:stroke-red-100" />
          </Button>
        </div>
      </div>
      {type === "text" && (
        <div className="flex w-full gap-4 items-baseline">
          <div className="w-full">
            <LabelFieldSelect
              label="Tabela"
              id={`filters.${index}.table`}
              name={`filters.${index}.table`}
              placeholder="Selecione uma das opções"
              data={tables}
              control={control}
              required={true}
              error={Boolean(errors?.filters?.[index]?.table)}
              {...register(`filters.${index}.table`, {
                required: true,
                onChange: (e: any) => {
                  handleSelectChangeTables(e.target.value);
                },
              })}
            />
            {errors?.filters?.[index]?.table && (
              <p className="text-message-error">Por favor, selecione uma tabela.</p>
            )}
          </div>
        </div>
      )}
      <div className="flex w-full gap-4 items-baseline">
        {type === "date" && (
          <div className="w-full">
            <LabelFieldSelect
              label="Tabela"
              id={`filters.${index}.table`}
              name={`filters.${index}.table`}
              placeholder="Selecione uma das opções"
              data={tables}
              control={control}
              required={true}
              error={Boolean(errors?.filters?.[index]?.table)}
              {...register(`filters.${index}.table`, {
                required: true,
                onChange: (e: any) => {
                  handleSelectChangeTables(e.target.value);
                },
              })}
            />
            {errors?.filters?.[index]?.table && (
              <p className="text-message-error">Por favor, selecione uma tabela.</p>
            )}
          </div>
        )}
        <div className="w-full">
          <LabelFieldSelect
            label="Coluna"
            id={`filters.${index}.column`}
            name={`filters.${index}.column`}
            placeholder="Selecione uma das opções"
            data={columnsFiltered}
            control={control}
            required={true}
            error={Boolean(errors?.filters?.[index]?.column)}
            disabledOptions={disabledColumns}
            {...register(`filters.${index}.column`, {
              required: true,
              onChange: (e: any) => {
                handleChangeRemoveColumnSelected(e.target.value, oldValue, true);
                setOldValue(e.target.value);
              },
            })}
          />
          {errors?.filters?.[index]?.column && (
            <p className="text-message-error">Por favor, selecione uma coluna.</p>
          )}
        </div>
        {type === "text" && (
          <div className="w-full">
            <LabelFieldSelect
              label="Tipo de Filtro"
              id={`filters.${index}.filterType`}
              name={`filters.${index}.filterType`}
              placeholder="Selecione uma das opções"
              data={filterTypes}
              control={control}
              required={true}
              error={Boolean(errors?.filters?.[index]?.filterType)}
              {...register(`filters.${index}.filterType`, {
                required: true,
              })}
            />
            {errors?.filters?.[index]?.filterType && (
              <p className="text-message-error">Por favor, selecione um tipo.</p>
            )}
          </div>
        )}
      </div>
      {type === "text" ? (
        <div className="flex w-full gap-4 items-baseline">
          <div className="w-full">
            <div className="w">
              <Label className="font-inter text-sm font-medium leading-3 tracking-wider text-left ">
                Valores*
              </Label>
            </div>
            <Controller
              name={`filters.${index}.values`}
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <CreatableSelect
                  {...field}
                  styles={{
                    control: (baseStyles, state) => ({
                      ...baseStyles,
                      borderColor: errors?.filters?.[index]?.values ? "red" : "grey",
                      height: "min-content",
                      borderRadius: "8px",
                      backgroundColor: "#fff",
                    }),
                    placeholder: base => ({
                      ...base,
                      backgroundColor: "#fff",
                    }),
                    input: base => ({
                      ...base,
                      fontSize: "1em",
                      color: "grey",
                      fontWeight: 400,
                      backgroundColor: "#fff",
                    }),
                    multiValueLabel: base => ({
                      ...base,
                      color: "#CE0058",
                      borderColor: "#CE0058",
                      height: "32px",
                      paddingTop: "5px",
                      paddingLeft: "10px",
                      fontSize: "14px",
                      fontWeight: "400",
                      fontFamily: "Inter, sans-serif",
                    }),
                    multiValue: base => ({
                      ...base,
                      backgroundColor: "#CE005814",
                      borderRadius: "16px",
                      border: "1px solid",
                      borderColor: "#CE0058",
                    }),
                  }}
                  isMulti
                  components={{
                    DropdownIndicator: () => null,
                    MultiValueRemove,
                  }}
                  placeholder={"Informe os valores que serão utilizados nos filtros"}
                  onChange={(value: any, action: any) => setValue(`filters.${index}.values`, value)}
                />
              )}
            />
            {errors?.filters?.[index]?.values && (
              <p className="text-message-error">Por favor, preencha o campo.</p>
            )}
          </div>
        </div>
      ) : (
        <div className="flex w-full gap-4 items-baseline">
          <div className="w-full">
            <DatePicker
              label="Data Inicial*"
              id={`filters.${index}.initialDate`}
              name={`filters.${index}.initialDate`}
              placeholder="Selecione uma data"
              control={control}
              error={Boolean(errors?.filters?.[index]?.initialDate)}
              {...register(`filters.${index}.initialDate`, { required: true })}
            />
            {errors?.filters?.[index]?.initialDate && (
              <p className="text-message-error">Por favor, escolha uma data.</p>
            )}
          </div>
          <div className="w-full">
            <DatePicker
              label="Data Final"
              id={`filters.${index}.finalDate`}
              name={`filters.${index}.finalDate`}
              placeholder="Selecione uma data"
              control={control}
              disabled={(date: Date) => {
                const initialDate = new Date(getValues(`filters.${index}.initialDate`));
                return date < initialDate || date > new Date();
              }}
              {...register(`filters.${index}.finalDate`, { required: false })}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default CardFilter;

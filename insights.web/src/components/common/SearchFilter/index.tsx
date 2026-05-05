import CloseSmall from "@src/assets/icons/CloseSmall";
import Button from "@src/components/common/Button";
import { useGetCustomersQuery } from "@src/services/customers";
import { FilterUserSearch } from "@src/shared/interfaces/FilterUserSearch";
import classNames from "classnames";
import Image from "next/image";
import { PropsWithChildren, ReactNode, useCallback, useEffect, useRef, useState } from "react";
import CreatableSelect from "react-select/creatable";

import ToDivide from "../ToDivide";

import useCloseOutside from "@src/hooks/useCloseOutside";

interface Prop {
  dataSearch: (value: FilterUserSearch) => void;
}

export default function SearchFilter({ dataSearch }: Prop) {
  type ModalDeleteCustomer = { visible: boolean; removedValue?: any };

  const [active, setActive] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState("Selecionar todos");
  const {
    data: dataCustomers,
    isLoading: isLoadingCustomers,
    isFetching,
  } = useGetCustomersQuery({ page: 0, pageSize: 50 });
  const [customerOptions, setCustomerOptions] = useState([]);
  const [selectedCustomerOptions, setSelectedCustomerOptions] = useState([]);
  const [deleteCustomerOptions, setDeleteCustomerOptions] = useState<ModalDeleteCustomer>({
    visible: false,
    removedValue: undefined,
  });

  const clearFilters = () => {
    setStatus("Selecionar todos");
    setSelectedCustomerOptions([]);
  };

  const applyFilters = () => {
    const filterUserSearch: FilterUserSearch = {
      search: null,
      status: null,
      customers: null,
      orderBy: null,
    };
    if (status == "Ativo") {
      filterUserSearch.status = true;
    } else if (status == "Inativo") {
      filterUserSearch.status = false;
    }
    if (selectedCustomerOptions.length > 0) {
      const customers = selectedCustomerOptions.map((e: { id: string }) => {
        return e.id;
      });
      filterUserSearch.customers = customers;
    }
    dataSearch(filterUserSearch);
    setActive(false);
  };

  const toggleActive = useCallback(() => setActive(prev => !prev), []);

  useCloseOutside(ref, setActive);

  useEffect(() => {
    if (!dataCustomers || dataCustomers.rows.length < 1) return;
    const customers = dataCustomers.rows.map((e: { name: string; id: string }) => {
      return {
        label: e.name,
        value: e.id,
        id: e.id,
      };
    });
    setCustomerOptions(customers);
  }, [dataCustomers]);

  useEffect(() => {
    if (deleteCustomerOptions.removedValue?.value) {
      setSelectedCustomerOptions(state => {
        return state.filter(value => value.value !== deleteCustomerOptions.removedValue.value);
      });
    }
  }, [deleteCustomerOptions]);

  const handleSelectChange = (selectedOptions: any, { action, removedValue }: any) => {
    if (action == "remove-value" && Object.keys(removedValue).length > 0) {
      setDeleteCustomerOptions({ visible: true, removedValue: removedValue });
    } else {
      setSelectedCustomerOptions(selectedOptions);
    }
  };

  const MultiValueRemove = (props: PropsWithChildren<any>) => {
    return (
      <div
        className={`absolute pl-3 mt-2.5 cursor-pointer ${props.innerProps.className} `}
        onClick={props.innerProps.onClick}
      >
        <CloseSmall />
      </div>
    );
  };

  return (
    <div className="w-11 self-stretch justify-end items-start gap-3 flex z-40">
      <div className="w-11 h-11 rounded justify-center items-center">
        <button
          onClick={toggleActive}
          className="hover:bg-neutral-300 w-11 h-11 p-0.5 bg-solid-slate-600 rounded border border-neutral-300 justify-center items-center flex"
        >
          <Image alt="Tuner" src={"/tuner.svg"} width="24" height="24" />
        </button>

        <div
          ref={ref}
          style={{ right: "455px" }}
          className={classNames(
            "w-[500px] mt-2 relative right-70 rounded border shadow-neutral-900",
            {
              hidden: !active,
            },
          )}
        >
          <div className="bg-neutral-0 p-5 shadow-md bg-opacity-25 bg-black rounded-xl h-auto">
            <div className="flex justify-between h-10 font-inter text-18 font-semibold leading-28 tracking-normal text-left">
              <div> Selecione os filtros desejados</div>
            </div>

            <ToDivide />

            <div className="text-neutral-600 text-sm font-inter p-4">
              <div className="h-8 font-semibold ">
                <label>Status do usuário</label>
              </div>
              <div className="">
                <div style={{ padding: 4 }}>
                  <input
                    id="radioAll"
                    type="radio"
                    value="Selecionar todos"
                    checked={status === "Selecionar todos"}
                    onChange={e => setStatus(e.target.value)}
                  />
                  <label style={{ paddingLeft: 8 }} htmlFor="radioAll">
                    Selecionar todos
                  </label>
                </div>
                <div style={{ padding: 4 }}>
                  <input
                    id="radioActive"
                    type="radio"
                    value="Ativo"
                    checked={status === "Ativo"}
                    onChange={e => setStatus(e.target.value)}
                  />
                  <label style={{ paddingLeft: 8 }} htmlFor="radioActive">
                    Ativo
                  </label>
                </div>
                <div style={{ padding: 4 }}>
                  <input
                    id="radioDesactive"
                    type="radio"
                    value="Inativo"
                    checked={status === "Inativo"}
                    onChange={e => setStatus(e.target.value)}
                  />
                  <label style={{ paddingLeft: 8 }} htmlFor="radioDesactive">
                    Inativo
                  </label>
                </div>
              </div>
            </div>

            <ToDivide />

            <div className="text-neutral-600 text-sm font-inter p-4">
              <div>
                <div className="h-8 font-semibold ">
                  <label>Nome da empresa</label>
                </div>
                <CreatableSelect
                  styles={{
                    control: (baseStyles, state) => ({
                      ...baseStyles,
                      borderColor: "grey",
                      height: "max-content",
                      minHeight: "46px",
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
                      color: "#000000",
                      border: "1px solid grey",
                      borderRadius: "16px",
                      width: "99px",
                      height: "32px",
                      paddingTop: "4px",
                      paddingLeft: "30px",
                      fontSize: "14px",
                      fontWeight: "400",
                      fontFamily: "Inter, sans-serif",
                    }),
                    multiValue: base => ({
                      ...base,
                      backgroundColor: "#fff",
                    }),
                  }}
                  isMulti
                  components={{
                    DropdownIndicator: () => null,
                    MultiValueRemove,
                  }}
                  placeholder={"Selecione as opções"}
                  closeMenuOnSelect={false}
                  options={customerOptions}
                  value={selectedCustomerOptions}
                  onChange={(value: any, action: any) => handleSelectChange(value, action)}
                  isLoading={isLoadingCustomers}
                  isSearchable={false}
                  isClearable={false}
                ></CreatableSelect>
              </div>
            </div>

            <ToDivide />

            <div className="flex flex-row justify-center mt-6 h-12 p-1 gap-6">
              <Button variant="secondary" size="small" onClick={clearFilters} full>
                Limpar filtros
              </Button>
              <Button variant="primary" size="small" onClick={applyFilters} full>
                Aplicar filtros
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

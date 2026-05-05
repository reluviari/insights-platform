import Chart from "@src/assets/icons/Chart";
import Close from "@src/assets/icons/Close";
import CloseSmall from "@src/assets/icons/CloseSmall";
import LabelFieldSelect from "@src/components/blocks/Fields/LabelFieldSelect";
import GeneralInfoSection from "@src/components/blocks/GeneralInfoSection";
import Button from "@src/components/common/Button";
import ToDivide from "@src/components/common/ToDivide";
import Modal from "@src/components/modal";
import { attachReport } from "@src/services/customers";
import { useGetDepartmentsQuery } from "@src/services/departments";
import { useGetUserReportsQuery } from "@src/services/reports";
import { selectCustomerLoading } from "@src/store/slices/customers/selectors";
import { toast } from "@src/utils/toast";
import { PropsWithChildren } from "react";
import { useForm } from "react-hook-form";
import Select from "react-select";

import { useAppDispatch, useAppSelector } from "@src/store/hooks";

export default function AttachReport({ onClose, customerId }: any) {
  const dispatch = useAppDispatch();
  const isLoadingCustomers = useAppSelector(selectCustomerLoading);

  const { data } = useGetUserReportsQuery({});

  const handleCloseModal = () => {
    if (onClose) {
      onClose();
    }
  };

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isValid },
    control,
  } = useForm({ mode: "onChange" });

  const params = { page: 0, pageSize: 50 };

  const { data: departmentData } = useGetDepartmentsQuery({
    params,
    customerId,
  });

  const newDepartmentData = departmentData?.rows.map((row: any) => {
    return {
      label: row.title,
      value: row.title,
    };
  });

  const onSubmit = async (data: any) => {
    dispatch(attachReport(data)).then((response: any) => {
      if (response) {
        toast({
          type: "success",
          title: "Relatório Atualizado",
          message: "O relatório foi atualizado com sucesso para o cliente.",
        });
        handleCloseModal();
      }
    });
  };

  const handleSelectChange = (selectedOptions: any) => {
    setValue("customer", customerId);
    setValue("department", selectedOptions);
  };

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

  return (
    <div>
      <Modal>
        <form
          id="attachReportForm"
          className="w-[930px] h-[500px]"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="bg-neutral-0  pt-0 shadow-md bg-opacity-25 bg-black rounded-xl">
            <div className="h-full pb-6">
              <div className="flex px-5">
                <GeneralInfoSection
                  title="Adicionar relatório"
                  description="Selecione o relatório que o cliente terá acesso e ajuste as configurações dos filtros para a visualização desejada."
                  iconComponent={<Chart />}
                  iconClose={<Close />}
                  event={() => handleCloseModal()}
                />
              </div>

              <ToDivide />

              <div className="flex gap-2 w-full pt-6 px-5">
                <LabelFieldSelect
                  label="Selecione o relatório"
                  id="report"
                  name="report"
                  placeholder="Selecione uma das opções"
                  data={data?.reports}
                  control={control}
                  error={Boolean(errors.report)}
                  {...register("report", { required: true })}
                />
              </div>

              <div className="w-full flex flex-col px-5 pb-3 pt-5 mb-5">
                <label className="font-inter text-base font-medium leading-1 tracking-wider text-left mb-2">
                  Defina quais grupos de usuário terão acesso a este relatório
                </label>
                <Select
                  styles={{
                    control: (baseStyles, state) => ({
                      ...baseStyles,
                      borderColor: "grey",
                      height: "46px",
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
                  placeholder={"Selecione as opções"}
                  closeMenuOnSelect={false}
                  onChange={handleSelectChange}
                  options={newDepartmentData}
                  instanceId="postType"
                />
              </div>
              <ToDivide />

              <div className="mt-5 justify-end flex gap-2 w-50 h-9 px-5">
                <Button onClick={() => handleCloseModal()} size="medium" variant="secondary">
                  Cancelar
                </Button>

                <Button size="medium" variant="primary" isLoading={isLoadingCustomers}>
                  Adicionar relatório
                </Button>
              </div>
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
}

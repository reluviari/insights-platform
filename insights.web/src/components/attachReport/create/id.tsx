import Add from "@src/assets/icons/Add";
import Chart from "@src/assets/icons/Chart";
import Close from "@src/assets/icons/Close";
import CloseSmall from "@src/assets/icons/CloseSmall";
import CardFilter from "@src/components/blocks/CardFilter";
import LabelFieldSelect from "@src/components/blocks/Fields/LabelFieldSelect";
import GeneralInfoSection from "@src/components/blocks/GeneralInfoSection";
import Button from "@src/components/common/Button";
import ToDivide from "@src/components/common/ToDivide";
import { ReportDetail, ReportPages } from "@src/components/customers/Interfaces";
import Modal from "@src/components/modal";
import { attachReport, editAssociateReport } from "@src/services/customers";
import { useGetDepartmentsQuery } from "@src/services/departments";
import { attachReportToDepartment } from "@src/services/reports";
import {
  useGetReportsQuery,
  useLazyGetReportPagesQuery,
  useLazyGetTargetFiltersQuery,
} from "@src/services/reports";
import { selectCustomerLoading } from "@src/store/slices/customers/selectors";
import { selectReportLoading } from "@src/store/slices/reports/selectors";
import { toast } from "@src/utils/toast";
import { PropsWithChildren, useEffect, useState } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import Select from "react-select";
import { v4 as uuid } from "uuid";

import { useAppDispatch, useAppSelector } from "@src/store/hooks";

export default function AttachReportEdit({
  onClose,
  onUpdateReportDetails,
  customerId,
  reportEditable,
}: {
  onClose: any;
  onUpdateReportDetails: any;
  customerId: string;
  reportEditable?: ReportDetail;
}) {
  const dispatch = useAppDispatch();
  const isLoadingCustomers = useAppSelector(selectCustomerLoading);
  const isLoadingReports = useAppSelector(selectReportLoading);

  const filters = { isActive: true };
  const { data } = useGetReportsQuery(filters);

  const handleCloseModal = () => {
    if (onClose) {
      onClose();
    }
  };

  const handleUpdateReportDetails = (data: any) => {
    if (onUpdateReportDetails) {
      onUpdateReportDetails(data);
    }
  };

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors, isValid },
    control,
    watch,
  } = useForm({ mode: "onChange" });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "filters",
  });

  const params = { page: 0, pageSize: 50 };
  const selectedReport = watch("report");
  const selectedReportPages = watch("reportPages");

  const [triggerGetReportPages, { isLoading: isLoadingReportPages, data: dataReportPages }] =
    useLazyGetReportPagesQuery();
  const [targetFiltersTrigger, { isLoading: targetFiltersLoading, data: targetFiltersData }] =
    useLazyGetTargetFiltersQuery();

  const [tables, setTables] = useState([]);
  const [columns, setColumns] = useState([]);
  const [columnsSelected, setColumnsSelected] = useState([]);
  const [optionPages, setOptionPages] = useState([]);

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

  const { data: departmentData } = useGetDepartmentsQuery({
    params,
    customerId,
  });

  const newDepartmentData = departmentData?.rows.map((row: any) => {
    return {
      name: row.title,
      id: row.id,
    };
  });

  const onSubmit = async (data: any) => {
    if (!reportEditable) {
      // FIRST API - Associar um report a um customer: - attachReport
      dispatch(attachReport({ customer: customerId, report: data?.report }));
    }

    // SECOND API - Adiciona o relatorio associado ao customer a um departamento:
    const ReportPages = dataReportPages?.map((e: any) => {
      return {
        name: e.name,
        displayName: e.displayName,
        visible: selectedReportPages.filter((i: any) => i.id == e.name).length ? true : false,
      };
    });

    const ReportFilters = data.filters.map((e: any) => {
      let map = {};
      if (!!e.initialDate) {
        const conditions = [];
        if (!!e.initialDate && !!e.finalDate) {
          conditions.push({ operator: filterTypesDate[0].id, value: e.initialDate });
          conditions.push({ operator: filterTypesDate[1].id, value: e.finalDate });
        } else {
          conditions.push({ operator: filterTypesDate[0].id, value: e.initialDate });
        }
        map = {
          id: e.id,
          $schema: `http://powerbi.com/product/schema#advanced`,
          filterType: "0",
          targetId: e.column,
          logicalOperator: "And",
          conditions: conditions,
        };
      } else
        map = {
          id: e.id,
          $schema: `http://powerbi.com/product/schema#basic`,
          filterType: "1",
          targetId: e.column,
          operator: e.filterType,
          values: e.values.map((i: any) => i.value),
        };
      return map;
    });

    if (!!reportEditable) {
      const deleteIds: string[] = [];
      reportEditable.reportFilters.forEach((e: any) => {
        if (!data.filters.find((f: any) => f.id == e.id)) {
          deleteIds.push(e.id);
        }
      });

      dispatch(
        editAssociateReport(
          {
            reportPages: ReportPages,
            reportFilters: ReportFilters,
            newDepartmentId: data.department,
            deleteIds: deleteIds,
          },
          data?.report,
          customerId,
          data.department,
        ),
      ).then((response: any) => {
        if (response) {
          toast({
            type: "success",
            title: "Relatório Atualizado",
            message: "O relatório foi atualizado com sucesso para o cliente.",
          });
          handleCloseModal();
          handleUpdateReportDetails(response);
        } else {
          toast({
            type: "error",
            title: "Erro ao atualizar relatório",
            message: "Não foi possível atualizar o relatório.",
          });
        }
      });
    } else {
      dispatch(
        attachReportToDepartment(
          {
            departmentId: data.department,
            report: data?.report,
            reportPages: ReportPages,
            reportFilters: ReportFilters,
          },
          customerId,
        ),
      ).then((response: any) => {
        if (response) {
          toast({
            type: "success",
            title: "Relatório Atualizado",
            message: "O relatório foi atualizado com sucesso para o cliente.",
          });
          handleCloseModal();
          handleUpdateReportDetails(response);
        } else {
          toast({
            type: "error",
            title: "Erro ao atualizar relatório",
            message: "Já existe um filtro criado deste relatório ao grupo selecionado.",
          });
        }
      });
    }
  };
  const handleSelectChange = (selectedOptions: any) => {
    const newReportPages: any[] = [];
    dataReportPages?.forEach((e: any) => {
      if (!selectedOptions.find((page: ReportPages) => page.name === e.name)) {
        newReportPages.push({ label: e.displayName, value: e.name });
      }
    });
    setOptionPages(newReportPages);
    const optionsSelectedWithVisibleTrue = selectedOptions.map((e: any) => {
      return {
        displayName: e.label,
        name: e.label,
        id: e.value,
        visible: true,
        label: e.label,
        value: e.value,
      };
    });
    setValue("reportPages", optionsSelectedWithVisibleTrue);
  };

  const filterTypesDate = [
    {
      name: "Maior ou igual",
      id: "GreaterThanOrEqual",
    },
    {
      name: "Menor ou igual",
      id: "LessThanOrEqual",
    },
  ];

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

  const handleChangeRemoveColumnSelected = (
    columnId: string,
    oldValue: string,
    click?: boolean,
  ) => {
    if (columnsSelected.indexOf(columnId) < 0) {
      if (click && oldValue !== columnId) {
        const selecteds = [...columnsSelected];
        selecteds.splice(selecteds.indexOf(oldValue), 1, columnId);
        setColumnsSelected(selecteds);
      } else {
        const selecteds = [...columnsSelected];
        selecteds.push(columnId);
        setColumnsSelected(selecteds);
      }
    }
  };

  const handleChangeColumnTrash = (columnId: string) => {
    if (columnsSelected.indexOf(columnId) >= 0) {
      const selecteds = [...columnsSelected];
      selecteds.splice(selecteds.indexOf(columnId), 1);
      setColumnsSelected(selecteds);
    }
  };

  const targetFilterNomalized = (targetFiltersData: any) => {
    const tables: any[] = [];
    const columns: any[] = [];

    targetFiltersData?.rows.forEach((e: any) => {
      tables.push(e.table);
      columns.push({ id: e.id, table: e.table, name: !!e.displayName ? e.displayName : e.column });
    });
    const uniqueTables = new Set(tables);
    let uniqueTablesArray = Array.from(uniqueTables);
    uniqueTablesArray = uniqueTablesArray.map(e => {
      return {
        name: e,
        id: e,
      };
    });
    setTables(uniqueTablesArray);
    setColumns(columns);
  };

  const optionPagesNormalized = (dataReportPages: any) => {
    let newPagesReportData: any[] = [];

    if (reportEditable && reportEditable.reportPages.length > 0) {
      dataReportPages?.forEach((e: any) => {
        if (!reportEditable.reportPages.find((page: ReportPages) => page.name === e.name)) {
          newPagesReportData.push({ label: e.displayName, value: e.name });
        }
      });
    } else {
      newPagesReportData = dataReportPages?.map((row: any) => {
        return {
          label: row.displayName,
          value: row.name,
        };
      });
    }
    setOptionPages(newPagesReportData);
  };

  useEffect(() => {
    if (targetFiltersData) {
      targetFilterNomalized(targetFiltersData);
    }
  }, [targetFiltersData]);

  useEffect(() => {
    if (dataReportPages) {
      optionPagesNormalized(dataReportPages);
    }
  }, [dataReportPages]);

  useEffect(() => {
    if (selectedReport) {
      triggerGetReportPages({ reportId: selectedReport });
      targetFiltersTrigger({ reportId: selectedReport });
    }
  }, [selectedReport, triggerGetReportPages, targetFiltersTrigger]);

  useEffect(() => {
    if (reportEditable) {
      setValue("report", reportEditable.id);
      setValue("department", reportEditable.department.id);
      const optionsSelectedWithVisibleTrue = reportEditable.reportPages.map((e: ReportPages) => {
        return {
          displayName: e.displayName,
          name: e.displayName,
          id: e.name,
          visible: true,
          label: e.displayName,
          value: e.name,
        };
      });
      setValue("reportPages", optionsSelectedWithVisibleTrue);
      const filters = reportEditable.reportFilters.map((e: any) => {
        if (e.values?.length > 0) {
          return {
            id: e.id,
            filterType: e.operator,
            table: e.target.table,
            column: e.target.id,
            values: e.values.map((i: any) => {
              return {
                label: i,
                value: i,
              };
            }),
            type: "text",
          };
        } else {
          return {
            id: e.id,
            table: e.target.table,
            column: e.target.id,
            displayName: e.target.displayName,
            initialDate: e.conditions[0]?.value,
            finalDate: e.conditions[1]?.value,
            type: "date",
          };
        }
      });
      filters.forEach((e: any) => {
        append(e);
      });
    }
  }, [append, setValue, reportEditable, watch]);
  return (
    <div>
      <Modal>
        <form id="attachReportForm" className="w-[930px] h-full" onSubmit={handleSubmit(onSubmit)}>
          <div className="bg-neutral-0  pt-0 shadow-md bg-opacity-25 bg-black rounded-xl">
            <div className="h-full h-[410px] pb-4">
              <div className="flex px-5">
                <GeneralInfoSection
                  title={!!reportEditable ? "Editar relatório" : "Adicionar relatório"}
                  description="Selecione o relatório que o cliente terá acesso e ajuste as configurações dos filtros para a visualização desejada."
                  iconComponent={<Chart />}
                  iconClose={<Close />}
                  event={() => handleCloseModal()}
                />
              </div>

              <ToDivide />

              <div className="flex gap-2 w-full pt-6 px-5">
                <LabelFieldSelect
                  label="Selecione o relatório*"
                  id="report"
                  name="report"
                  placeholder="Selecione uma das opções"
                  data={data}
                  control={control}
                  isDisabled={!!reportEditable}
                  error={Boolean(errors.report)}
                  {...register("report", {
                    required: true,
                  })}
                />
              </div>

              {errors.report && (
                <p className="text-message-error mb-4 ml-5"> Por favor, selecione um relatório.</p>
              )}

              <div className="flex gap-2 w-full pt-3 px-5">
                <LabelFieldSelect
                  label="Defina o grupo de usuário que vai ter acesso a este relatório*"
                  id="department"
                  name="department"
                  placeholder="Selecione uma das opções"
                  data={newDepartmentData}
                  control={control}
                  isDisabled={!!reportEditable}
                  error={Boolean(errors.department)}
                  {...register("department", {
                    required: true,
                  })}
                />
              </div>
              {errors.department && (
                <p className="text-message-error mb-4 ml-5">Por favor, selecione um grupo.</p>
              )}

              <div className="flex flex-col px-2">
                <GeneralInfoSection
                  title="Páginas do relatório"
                  description="Selecione quais páginas do relatório os usuários terão acesso*."
                />
                <div className="px-3 ">
                  <Controller
                    name="reportPages"
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => (
                      <Select
                        {...field}
                        styles={{
                          control: (baseStyles, state) => ({
                            ...baseStyles,
                            borderColor: errors.reportPages && !isValid ? "red" : "grey",
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
                        placeholder={"Selecione as opções"}
                        closeMenuOnSelect={false}
                        onChange={handleSelectChange}
                        options={optionPages}
                        instanceId="postType"
                        isLoading={isLoadingReportPages}
                      />
                    )}
                  />
                  {errors.reportPages && !isValid && (
                    <p className="text-message-error">
                      Por favor, selecione pelo menos uma página.
                    </p>
                  )}
                </div>
              </div>

              <div className="flex flex-col px-2 mt-2">
                <GeneralInfoSection
                  title="Filtros"
                  description="Adicione filtros e parametrize a forma de visualização do relatório de acordo com que foi contratado pelo cliente."
                />
              </div>
              {fields.map((item: any, i) => (
                <CardFilter
                  key={item.id}
                  remove={remove}
                  handleChangeColumnTrash={handleChangeColumnTrash}
                  tables={tables}
                  columns={columns}
                  disabledColumns={columnsSelected}
                  control={control}
                  register={register}
                  index={i}
                  columEditText={item.column}
                  setValue={setValue}
                  type={item.type}
                  errors={errors}
                  getValues={getValues}
                  handleChangeRemoveColumnSelected={handleChangeRemoveColumnSelected}
                />
              ))}

              <div className="flex gap-4 mx-4 mb-2">
                <Button
                  variant="secondary"
                  size="x-small"
                  type="button"
                  className="group gap-1"
                  onClick={() => {
                    append({
                      id: uuid(),
                      column: "",
                      table: "",
                      displayName: "",
                      type: "text",
                    });
                  }}
                >
                  <Add className="group-hover:stroke-neutral-400" /> Adicionar filtro texto
                </Button>
                <Button
                  variant="secondary"
                  size="x-small"
                  type="button"
                  className="group gap-1"
                  onClick={() =>
                    append({
                      id: uuid(),
                      column: "",
                      table: "",
                      displayName: "",
                      initialDate: "",
                      finalDate: "",
                      type: "date",
                    })
                  }
                >
                  <Add className="group-hover:stroke-neutral-400" /> Adicionar filtro data
                </Button>
              </div>

              <ToDivide />

              <div className="mt-5 justify-end flex gap-2 w-50 h-9 px-5">
                <Button onClick={() => handleCloseModal()} size="medium" variant="secondary">
                  Cancelar
                </Button>

                <Button
                  type="submit"
                  size="medium"
                  variant="primary"
                  isLoading={!!reportEditable ? isLoadingReports : isLoadingCustomers}
                >
                  {!!reportEditable ? "Editar" : "Adicionar"} relatório
                </Button>
              </div>
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
}

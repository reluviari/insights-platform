import ArrowDown from "@src/assets/icons/ArrowDown";
import ArrowUp from "@src/assets/icons/ArrowUp";
import Company from "@src/assets/icons/Company";
import Edit from "@src/assets/icons/Edit";
import TrashFilter from "@src/assets/icons/TrashFilter";
import AttachReportEdit from "@src/components/attachReport/create/id";
import Button from "@src/components/common/Button";
import ConfirmModal from "@src/components/common/ConfirmModal";
import { desassociateReport } from "@src/services/customers";
import { AdvancedFilterConditionOperatorsEnum } from "@src/shared/enums/advanced-filter-condition-operators.enum";
import { FilterOperatorsEnum } from "@src/shared/enums/filter-operators.enum";
import { selectReportLoading } from "@src/store/slices/reports/selectors";
import { toast } from "@src/utils/toast";
import { format } from "date-fns";
import Image from "next/image";
import React, { useState } from "react";

import { ReportDetail, ReportDetailComponentProps, ReportPages } from "../Interfaces";

import { useAppDispatch, useAppSelector } from "@src/store/hooks";

const ReportDetailComponent: React.FC<ReportDetailComponentProps> = props => {
  const {
    key,
    report,
    handleToggleExpand,
    onUpdateReportDetails,
    expandedIndex,
    index,
    customerId,
  } = props;
  const dispatch = useAppDispatch();
  const isLoadingReports = useAppSelector(selectReportLoading);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  const handleOpenConfirmModal = () => {
    setIsConfirmModalOpen(true);
  };

  const handleCloseConfirmModal = () => {
    setIsConfirmModalOpen(false);
  };

  const handleOpenReportModal = () => {
    setIsReportModalOpen(true);
  };

  const handleCloseReportModal = () => {
    setIsReportModalOpen(false);
  };

  const handleSuccess = (message: string) => {
    toast({
      title: "Relatório removido com sucesso",
      message: message,
      type: "success",
    });
  };

  const handleError = (message: string) => {
    toast({
      title: "Ocorreu um erro",
      message: message,
      type: "error",
    });
  };

  const handleConfirm = () => {
    onSubmitModal(report, customerId);
  };

  const onSubmitModal = async (report: ReportDetail, customerId: string) => {
    dispatch(desassociateReport(report.id, report.department.id, customerId))
      .then((response: any) => {
        handleSuccess("O relatório foi removido do grupo do cliente");
        onUpdateReportDetails(response);
      })
      .catch(error => handleError(`Erro ao remover o relatório do grupo do cliente`))
      .finally(() => handleCloseConfirmModal());
  };

  return (
    <div
      key={key}
      className={`mb-5 p-6 flex rounded-lg bg-neutral-0 border-card shadow-card ${
        expandedIndex != index ? "h-36" : "h-auto"
      }`}
    >
      <div>
        <div className="bg-neutral-200 mr-3 p-2 rounded-md">
          {report.icon ? (
            <Image
              className="icon-black"
              src={report.icon}
              alt={report.title}
              width={32}
              height={32}
            />
          ) : (
            <Company width={32} height={32} />
          )}
        </div>
      </div>
      <div className="w-full">
        <div className="flex justify-between">
          <div className="text-base font-bold text-left text-neutral-900 font-inter bg-gray-800 text-white">
            {report.title}
          </div>
          <div onClick={() => handleToggleExpand(index)} className="flex cursor-pointer">
            {expandedIndex !== index ? <ArrowDown /> : <ArrowUp />}
          </div>
        </div>
        <div id="departments section" className="mt-3">
          <div className="flex justify-between">
            <div>
              <div className="font-inter text-sm leading-6 font-bold text-left text-neutral-900">
                Grupo:
              </div>
              <div className="flex text-sm gap-2 mt-2 mb-5">
                <div className="py-1.5 px-3 border border-neutral-300 rounded-2xl font-normal">
                  {report.department.title}
                </div>
              </div>
            </div>
            {expandedIndex === index && (
              <div className="flex items-center w-48">
                <Button
                  variant="secondary"
                  size="medium"
                  className="group"
                  onClick={handleOpenReportModal}
                >
                  <Edit className="group-hover:fill-neutral-400 group-hover:stroke-neutral-400" />
                  <div className="ml-2">Editar</div>
                </Button>
                {isReportModalOpen && (
                  <AttachReportEdit
                    onClose={handleCloseReportModal}
                    onUpdateReportDetails={props.onUpdateReportDetails}
                    customerId={customerId}
                    reportEditable={report}
                  />
                )}
                <Button
                  title="Excluir relatório"
                  variant="tertiary"
                  size="medium"
                  className="group ml-4"
                  onClick={handleOpenConfirmModal}
                >
                  <TrashFilter className="group-hover:fill-red-100 group-hover:stroke-red-100" />
                </Button>
                {isConfirmModalOpen && (
                  <ConfirmModal
                    isOpen={!!isConfirmModalOpen}
                    onClose={handleCloseConfirmModal}
                    onConfirm={handleConfirm}
                    title="Deseja remover o relatório desse grupo?"
                    description="Esta ação não poderá ser revertida"
                    confirmText="Sim, remover relatório"
                    cancelText="Cancelar"
                    isLoading={isLoadingReports}
                  ></ConfirmModal>
                )}
              </div>
            )}
          </div>
          {expandedIndex === index && (
            <div>
              {report.reportPages && report.reportPages.length && (
                <div className="flex flex-row gap-1 justify-between">
                  <div>
                    <div className="text-sm leading-6 font-bold">Páginas do relatório</div>
                    <div className="flex flex-wrap">
                      {report?.reportPages?.map((page: ReportPages, pageIndex: number) => (
                        <React.Fragment key={pageIndex}>
                          <p className="py-1 font-semibold text-neutral-400 text-sm leading-6">
                            {!!page.displayName ? page.displayName : page.name}
                          </p>
                          {pageIndex < report.reportPages.length - 1 && (
                            <span className="py-1 pr-1.5 text-neutral-400 font-normal text-sm leading-6">
                              ,
                            </span>
                          )}
                        </React.Fragment>
                      ))}
                    </div>
                  </div>
                </div>
              )}
              {report.reportFilters && report.reportFilters.length > 0 ? (
                <div className="flex flex-col gap-1">
                  {report?.reportFilters?.map((filter: any, filterIndex: number) => (
                    <div key={filterIndex} className="pt-3">
                      <p className="text-sm leading-6">
                        <strong>Filtro {filterIndex + 1}:</strong>
                      </p>
                      <p className="flex gap-1 text-sm leading-6">
                        <strong className="text-neutral-400">Tabela:</strong>
                        <p className="text-neutral-400">{filter.target?.table}</p>
                      </p>
                      <p className="flex gap-1 text-sm leading-6">
                        <strong className="text-neutral-400">Coluna:</strong>
                        <p className="text-neutral-400">
                          {!!filter.target?.displayName
                            ? filter.target?.displayName
                            : filter.target?.column}
                        </p>
                      </p>
                      {!!filter.values && (
                        <div>
                          <p className="flex gap-1 text-sm leading-6">
                            <strong className="text-neutral-400">Tipo de Filtro:</strong>
                            <p className="text-neutral-400">
                              {filter.operator === FilterOperatorsEnum.In ? "Contém" : "Não contém"}
                            </p>
                          </p>
                          <p className="flex gap-1 text-sm leading-6">
                            <strong className=" text-neutral-400">Valores:</strong>
                            <p className="text-neutral-400">{filter.values?.join(", ")}</p>
                          </p>
                        </div>
                      )}
                      {filter.conditions && filter.conditions.length > 0 ? (
                        <div className="flex flex-col gap-1 pt-1">
                          {filter.conditions.map((condition: any, conditionIndex: number) => (
                            <div key={conditionIndex}>
                              <p className="text-neutral-900 text-sm leading-6">
                                <strong>Condição {conditionIndex + 1}:</strong>
                              </p>
                              <p className="flex gap-1 text-sm leading-6">
                                <strong className="text-neutral-400">Tipo de Filtro:</strong>
                                <p className="text-neutral-400">
                                  {condition.operator ===
                                  AdvancedFilterConditionOperatorsEnum.GreaterThanOrEqual
                                    ? "Maior ou igual"
                                    : "Menor ou igual"}
                                </p>
                              </p>
                              <p className="flex gap-1 text-sm leading-6">
                                <strong className="text-neutral-400">Valor:</strong>
                                <p className="text-neutral-400">
                                  {format(new Date(condition.value), "dd/MM/yyyy").toString()}
                                </p>
                              </p>
                            </div>
                          ))}
                        </div>
                      ) : null}
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default React.memo(ReportDetailComponent);

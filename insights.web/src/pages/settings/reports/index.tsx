import Breadcrumbs from "@src/components/common/Breadcrumbs";
import Button from "@src/components/common/Button";
import Card from "@src/components/common/Card";
import ConfirmModal from "@src/components/common/ConfirmModal";
import InputSearch from "@src/components/common/InputSearch";
import Layout from "@src/components/common/Layout";
import Loading from "@src/components/common/Loading";
import PageTitle from "@src/components/common/PageTitle";
import ToggleReport from "@src/components/messages/toggle-report";
import { NextPageWithLayout } from "@src/pages/_app";
import { getReports, updateReport, deleteReport, updateStatusReport } from "@src/services/reports";
import { useLazyGetSynchronizeReportQuery } from "@src/services/reports";
import { selectReportData, selectReportLoading } from "@src/store/slices/reports/selectors";
import { home } from "@src/utils/constants";
import { toast } from "@src/utils/toast";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

import { useAppSelector, useAppDispatch } from "@src/store/hooks";

import "react-toastify/dist/ReactToastify.css";

const ReportsPage: NextPageWithLayout = () => {
  const dispatch = useAppDispatch();
  const reports = useAppSelector(selectReportData);
  const isLoadingReports = useAppSelector(selectReportLoading);
  const router = useRouter();
  const [trigger, { isLoading, data }] = useLazyGetSynchronizeReportQuery();
  const [dataReports, setDataReports] = useState(reports);
  const [filter, setFilter] = useState("");
  const pageTitle = `${process.env.NEXT_PUBLIC_PLATAFORM_NAME} | Relatórios`;

  const [selectedReport, setSelectedReport] = useState<{ id: string; isActive: boolean } | null>(
    null,
  );
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [confirmText, setConfirmText] = useState("");
  const [cancelText, setCancelText] = useState("");
  const [selectedReportId, setSelectedReportId] = useState("");
  const [selectedReportTitle, setSelectedReportTitle] = useState("");
  const [showReportDeleteModal, setShowReportDeleteModal] = useState(false);

  useEffect(() => {
    dispatch(getReports());
  }, [dispatch]);

  const HandleSynchronize = () => {
    trigger({}).then(() => {
      dispatch(getReports());
      toast({
        title: "Lista de relatórios atualizada",
        message: "A lista de relatórios foi sincronizada com o PowerBI",
        type: "success",
      });
    });
  };

  const handleToggleReport = (id: string, isActive: boolean) => {
    setSelectedReport({ id, isActive });
  };

  const handleCloseToggleReport = () => {
    setSelectedReport(null);
  };

  const handleSuccess = (message: string) => {
    const dataReportsUpdated = dataReports.reports.map(report => {
      if (report.id === selectedReport.id) {
        report = {
          ...report,
          isActive: !selectedReport.isActive,
        };
      }
      return report;
    });

    setDataReports({ reports: dataReportsUpdated });
    toast({
      title: `Relatório ${selectedReport?.isActive ? "está inativo" : "foi ativado"}`,
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
    if (selectedReport) {
      toggleReportStatus(selectedReport.id, selectedReport.isActive);
    }
  };

  const toggleReportStatus = async (id: string, isActive: boolean) => {
    try {
      const report = reports.reports.find((report: any) => report.id === id);
      if (!report) throw new Error("Relatório não encontrado");

      await dispatch(
        updateStatusReport({
          id,
          isActive: !isActive,
          title: report.title,
        }),
      );

      handleSuccess(
        `O relatório ${
          isActive
            ? "não está mais disponível aos usuários."
            : "agora está disponível aos usuários."
        }`,
      );
    } catch (err) {
      handleError(`Erro ao ${isActive ? "desativar" : "ativar"} o relatório.`);
    } finally {
      handleCloseToggleReport();
    }
  };

  const showDeleteModal = (id: string, title: string) => {
    setSelectedReportId(id);
    setSelectedReportTitle(title);
    setShowReportDeleteModal(true);
  };

  const closeModal = () => {
    setSelectedReportId("");
    setSelectedReportTitle("");
    setShowReportDeleteModal(false);
  };

  const handleDeleteReport = async () => {
    try {
      await dispatch(deleteReport(selectedReportId));
      toast({
        title: "Relatório excluído",
        message: `O relatório ${selectedReportTitle} e todos os dados associados foram excluídos com sucesso.`,
        type: "success",
      });
      setSelectedReportId("");
      setShowReportDeleteModal(false);
      dispatch(getReports());
    } catch (err) {
      toast({
        title: "Ocorreu um erro",
        message: "Ocorreu um erro ao tentar excluir o relatório. Tente novamente mais tarde.",
        type: "error",
      });
    }
  };

  useEffect(() => {
    if (!!reports && filter == "") {
      const copyData = reports;
      setDataReports(copyData);
    }
  }, [reports]);

  const searchEnter = () => {
    if (filter == "") {
      const copyData = reports;
      setDataReports(copyData);
      return;
    }

    const reportFilter = reports?.reports?.filter((report: { title: string }) =>
      report.title.toLowerCase().includes(filter.toLowerCase()),
    );
    const copyData = {
      reports: reportFilter,
    };
    setDataReports(copyData);
  };

  const renderReports = () => {
    if (!dataReports || !dataReports.reports) return null;
    return dataReports.reports.map((report: any, index: number) => (
      <Card
        key={index}
        {...report}
        menuAction={true}
        cardWidth="w-full"
        labelMenuAction="Editar Relatório"
        urlRedirectMenuAction="/settings/reports/update/[id]"
        showCreatedAt={true}
        isActive={report.isActive}
        menuItems={[
          {
            icon: <Image src="/edit.svg" alt="Edit" width={18.28} height={18.25} />,
            label: "Editar Relatório",
            onClick: () => router.push(`/settings/reports/update/${report.id}`),
          },
          {
            icon: report.isActive ? (
              <Image src="/block.svg" alt="Block" width={20} height={20} />
            ) : (
              <Image src="/check_circle.svg" alt="CheckCircle" width={20} height={20} />
            ),
            label: report.isActive ? "Desativar Relatório" : "Ativar Relatório",
            onClick: () => handleToggleReport(report.id, report.isActive),
          },
          {
            icon: <Image src="/delete.svg" alt="Delete" width={16} height={18} />,
            label: "Excluir Relatório",
            onClick: () => showDeleteModal(report.id, report.title),
          },
        ]}
      />
    ));
  };

  return (
    <section className="flex min-h-screen w-full">
      <Head>
        <title>{pageTitle}</title>
      </Head>
      <div className="w-full bg-neutral-100 px-10 py-8">
        <Breadcrumbs
          links={[
            {
              label: "Home",
              route: home,
            },
            {
              label: "Configurações",
              route: "/settings",
            },
            {
              label: "Relatórios",
              route: "/settings/reports",
              active: true,
            },
          ]}
        />
        <div className="flex justify-baseline items-baseline gap-5 justify-between h-20 w-full">
          <div className="flex text-stone-900 text-3xl font-sans font-bold leading-10">
            <PageTitle>Relatórios</PageTitle>
          </div>
          <div className="flex-end flex gap-3 h-11">
            {reports.reports && !isLoadingReports && (
              <InputSearch
                id="search"
                name="search"
                type="text"
                placeholder="Pesquise pelo nome do relatório"
                value={filter}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFilter(e.target.value)}
                onKeyPress={(e: React.KeyboardEvent<HTMLInputElement>) => {
                  if (e.key === "Enter") {
                    searchEnter();
                  }
                }}
              />
            )}
            <div className="border border-neutral-700"></div>
            <Button
              variant="primary"
              size="medium"
              onClick={HandleSynchronize}
              isLoading={isLoading}
            >
              Sincronizar
            </Button>
          </div>
        </div>
        {isLoadingReports && (
          <div className="w-full relative flex justify-center items-center mt-20 mx-5">
            <Loading color="fill-neutral-900" />
          </div>
        )}
        {!isLoadingReports &&
          (dataReports.reports && dataReports.reports.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {renderReports()}
            </div>
          ) : (
            <div className="flex justify-center items-center mt-20">
              <p>Nenhum relatório encontrado. Verifique a pesquisa e tente novamente.</p>
            </div>
          ))}
      </div>
      {selectedReport && (
        <ConfirmModal
          isOpen={!!selectedReport}
          onClose={handleCloseToggleReport}
          onConfirm={handleConfirm}
          title={title}
          description={description}
          confirmText={confirmText}
          cancelText={cancelText}
        >
          <ToggleReport
            onClose={handleCloseToggleReport}
            reportId={selectedReport.id}
            isActive={selectedReport.isActive}
            setTitle={setTitle}
            setDescription={setDescription}
            setConfirmText={setConfirmText}
            setCancelText={setCancelText}
            onSuccess={handleSuccess}
            onError={handleError}
          />
        </ConfirmModal>
      )}
      {showReportDeleteModal && (
        <ConfirmModal
          isOpen={!!selectedReportId}
          onClose={closeModal}
          onConfirm={handleDeleteReport}
          title="Confirmação de exclusão do relatório"
          description={
            <>
              Você está prestes a excluir o relatório{" "}
              <span className="font-bold text-[#475467]">{selectedReportTitle}</span>. Esta ação é
              irreversível e todos os dados associados, serão permanentemente removidos. Tem certeza
              de que deseja continuar?
            </>
          }
          confirmText="Sim, excluir"
          cancelText="Cancelar"
        />
      )}
    </section>
  );
};

ReportsPage.getLayout = function getLayout(page: any) {
  return <Layout>{page}</Layout>;
};

export default ReportsPage;

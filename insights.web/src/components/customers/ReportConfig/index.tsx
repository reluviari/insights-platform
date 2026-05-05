import Chart from "@src/assets/icons/Chart";
import GeneralInfoSection from "@src/components/blocks/GeneralInfoSection";
import { useState } from "react";

import { Department, ReportDetail } from "../Interfaces";
import ReportDetailComponent from "../ReportDetails";

export const ReportConfig = ({
  reportsDetail,
  onUpdateReportDetails,
  customerId,
}: {
  reportsDetail: ReportDetail[];
  onUpdateReportDetails: any;
  customerId: string;
}) => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const handleToggleExpand = (index: number) => {
    setExpandedIndex(prevIndex => (prevIndex === index ? null : index));
  };

  return (
    <>
      <div>
        <GeneralInfoSection
          iconComponent={<Chart />}
          title="Configurar relatórios"
          description="Defina quais relatórios o cliente terá acesso e personalize os filtros para cada um deles."
        />
      </div>

      <div className="">
        {reportsDetail?.map((report: ReportDetail, index: number) => (
          <ReportDetailComponent
            key={index}
            report={report}
            handleToggleExpand={handleToggleExpand}
            onUpdateReportDetails={onUpdateReportDetails}
            expandedIndex={expandedIndex}
            index={index}
            customerId={customerId}
          />
        ))}
        {reportsDetail?.length === 0 && (
          <p>
            Até o momento nenhum relatório foi adicionado para este cliente. Clique no botão abaixo
            para adicionar.
          </p>
        )}
      </div>
    </>
  );
};

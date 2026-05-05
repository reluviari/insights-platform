import Layout from "@src/components/common/Layout";
import Loading from "@src/components/common/Loading";
import ReportNotAvailable from "@src/components/powerBiEmbed/ReportNotAvailable";
import { useLazyGetReportQuery, useGetUserReportsQuery } from "@src/services/reports";
import { IReports } from "@src/shared/interfaces/reports.interface";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import { NextPageWithLayout } from "../_app";

const PowerBiEmbed = dynamic(() => import("@src/components/powerBiEmbed"), { ssr: false });

interface ReportProps {
  reports: IReports[];
}

const Report: NextPageWithLayout<ReportProps> = ({ reports }) => {
  const router = useRouter();
  const { slugs } = router.query;
  const [workspaceId, externalId] = Array.isArray(slugs) ? slugs : [];

  const [triggerReport, { isLoading, data, isFetching }] = useLazyGetReportQuery();
  const { data: userReportsData } = useGetUserReportsQuery({});
  const { token, reportFilters, reportPages } = data || {};

  const [hasAccess, setHasAccess] = useState(false);
  const [reportIsActive, setReportIsActive] = useState(true);

  useEffect(() => {
    if (!workspaceId && !externalId) return;
    triggerReport({ workspaceId, externalId });
  }, [workspaceId, externalId, triggerReport]);

  useEffect(() => {
    if (!userReportsData || !userReportsData.reports || !Array.isArray(userReportsData.reports)) {
      return;
    }

    const userReports = userReportsData.reports;
    const access = userReports.some((report: IReports) => report.externalId === externalId);

    if (access !== hasAccess) setHasAccess(access);
    const activeReport = userReports.find((report: IReports) => report.externalId === externalId);
    setReportIsActive(activeReport?.isActive ?? true);
  }, [userReportsData, externalId, hasAccess]);

  return (
    <>
      {isLoading && (
        <div className="w-full relative flex justify-center items-center mt-20">
          <Loading color="fill-neutral-900" />
        </div>
      )}
      {!!workspaceId && !!externalId && !isLoading && !isFetching && (
        <>
          {hasAccess && reportIsActive ? (
            <PowerBiEmbed
              externalId={externalId}
              token={token}
              filters={reportFilters}
              activePages={reportPages}
            />
          ) : (
            <ReportNotAvailable message="O relatório não está disponível." />
          )}
        </>
      )}
    </>
  );
};

Report.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};

export default Report;

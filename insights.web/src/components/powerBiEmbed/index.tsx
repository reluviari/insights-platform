import { Embed, Report, models } from "powerbi-client";
import { PowerBIEmbed } from "powerbi-client-react";
import { useEffect, useState } from "react";

type PowerBiComponentsProps = {
  token: string;
  externalId: string;
  filters?: models.ReportLevelFilters[];
  activePages?: ActivePagesProps[];
};

type ActivePagesProps = {
  pages: pagesProps[];
};

type pagesProps = {
  visible: boolean;
  name: string;
};

const PowerbiEmbedComponent = ({
  token,
  externalId,
  filters,
  activePages,
}: PowerBiComponentsProps) => {
  const [report, setReport] = useState<Report | undefined>();

  useEffect(() => {
    report?.on("loaded", async () => {
      const pages: models.IPage[] | undefined = await report.getPages();

      const pagesToDelete = pages?.filter((page: models.IPage) => {
        const isNotVisible = activePages[0]?.pages?.some(
          activePage => activePage.name === page.name && activePage.visible === false,
        );

        return isNotVisible;
      });

      if (pagesToDelete && pagesToDelete.length > 0) {
        for (const page of pagesToDelete) {
          await report.deletePage(page.name);
        }
      }
    });
  }, [activePages, report]);

  return (
    <PowerBIEmbed
      key={externalId}
      embedConfig={{
        type: "report",
        id: externalId,
        accessToken: token,
        tokenType: models.TokenType.Embed,
        filters,
        settings: {
          panes: {
            filters: {
              expanded: false,
              visible: false,
            },
          },
          background: models.BackgroundType.Default,
        },
      }}
      getEmbeddedComponent={(embedObject: Embed) => {
        setReport(embedObject as Report);
      }}
      eventHandlers={
        new Map([
          [
            "loaded",
            function () {
              console.log("Report loaded");
            },
          ],
          [
            "rendered",
            function () {
              console.log("Report rendered");
            },
          ],
          [
            "error",
            function (event) {
              console.log(event);
              console.log(event.detail);
            },
          ],
        ])
      }
      cssClassName={"reportClass"}
    />
  );
};

export default PowerbiEmbedComponent;

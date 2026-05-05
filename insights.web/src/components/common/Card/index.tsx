import Calendar from "@src/assets/icons/Calendar";
import Company from "@src/assets/icons/Company";
import Edit from "@src/assets/icons/Edit";
import User from "@src/assets/icons/User";
import Dropdown from "@src/components/common/Dropdown";
import ReportStatus from "@src/components/reports/ReportStatus";
import { IReports } from "@src/shared/interfaces/reports.interface";
import classNames from "classnames";
import Image from "next/image";
import { useRouter } from "next/router";
import React from "react";

interface Props {
  id?: string;
  title: string;
  createdAt?: string;
  icon?: string;
  description?: string;
  listIcons?: Array<object>;
  listCount?: number;
  iternIcon?: JSX.Element | string;
  cardWidth?: string;
  menuAction?: boolean;
  labelMenuAction?: string;
  urlRedirectMenuAction?: string;
  route?: string;
  reports?: IReports[];
  reportsCount?: number;
  isReportCount?: boolean;
  isActive?: boolean;
  onToggleReport?: (id: string, isActive: boolean) => void;
  menuItems?: { icon: JSX.Element; label: string; onClick: () => void }[];
  children?: React.ReactNode;
  justifyClass?: string;
}

function Card(props: Props) {
  const {
    id,
    title,
    createdAt,
    icon,
    description,
    listIcons,
    listCount,
    iternIcon,
    cardWidth = "",
    menuAction,
    route,
    reports = [],
    reportsCount = 0,
    labelMenuAction,
    urlRedirectMenuAction,
    isReportCount,
    isActive: reportIsActive,
    onToggleReport,
    menuItems,
    children,
    justifyClass = "justify-start",
  } = props;

  const router = useRouter();

  const formatedDate = React.useMemo(
    () => (createdAt ? new Intl.DateTimeFormat("pt-BR").format(new Date(createdAt)) : null),
    [createdAt],
  );

  const iconList = (listIcons: any[]): React.ReactNode => {
    return (
      <div className="flex">
        {listIcons &&
          listIcons.map((item: any, index) => (
            <div
              className={`flex w-8 h-8 relative rounded-full border border-neutral-0 items-center justify-center`}
              style={{ left: index > 0 ? -(7 * index) : 0 }}
              key={index}
            >
              {item.logo || item.avatar ? (
                <Image
                  className="rounded-full"
                  src={item.logo ? item.logo : item.avatar}
                  alt="icon"
                  fill={true}
                />
              ) : (
                <User width={50} height={50} />
              )}
            </div>
          ))}
        {(listCount > 0 && listCount - listIcons?.length > 0) || (listCount > 0 && !listIcons) ? (
          <div
            className="h-8 w-8 ml-3 relative bg-neutral-0 border border-neutral-200 rounded-[100px] flex-col justify-center items-center inline-flex"
            style={{ left: -30 }}
          >
            <div className="text-primary text-base font-semibold leading-7 tracking-tight">
              +{isReportCount ? listCount : listCount - listIcons?.length}
            </div>
          </div>
        ) : null}
      </div>
    );
  };

  const renderReports = () => {
    const removeDuplicates = (reports: IReports[]) => {
      const titles = new Set<string>();
      return reports.filter(report => {
        if (titles.has(report.title)) {
          return false;
        } else {
          titles.add(report.title);
          return true;
        }
      });
    };

    const uniqueReports = removeDuplicates(reports);
    const reportsToShow = uniqueReports.slice(0, 3);
    const additionalReports = uniqueReports.slice(3);

    return (
      <div className="flex gap-2 px-6 flex-wrap">
        {reportsToShow.map(report => (
          <div
            className="rounded-full px-3 py-1 border border-neutral-200 flex justify-center w-fit text-sm"
            key={report.id}
          >
            {report.title}
          </div>
        ))}
        {additionalReports.length > 0 && (
          <div
            className="rounded-full bg-primary flex justify-center items-center h-8 w-8 text-sm font-semibold"
            title={additionalReports.map(report => report.title).join("\n")}
            style={{ color: "white" }}
          >
            {`+${additionalReports.length}`}
          </div>
        )}
      </div>
    );
  };

  const items = menuItems || [];

  return (
    <div
      onClick={() => {
        route ? router.push(route) : 0;
      }}
      className={classNames(
        "cursor-pointer border border-neutral-0 hover:border hover:border-neutral-400 py-6 h-44 bg-neutral-0 rounded flex-col items-start gap-5 inline-flex row-span-1",
        justifyClass,
        `${cardWidth}`,
      )}
    >
      <div className="self-stretch h-[74px] bg-white px-6 justify-start items-center gap-3 inline-flex">
        <div className="flex-col justify-center items-start gap-1 inline-flex">
          {iternIcon ? (
            <div className="rounded-full shadow shadow-neutral-300 p-[10px] h-[72px] w-[72px]">
              {iternIcon}
            </div>
          ) : (
            <div className="flex items-center justify-center w-[72px] h-[72px]">
              {icon ? (
                <Image
                  className="border border-white rounded-full shadow shadow-neutral-300 p-[5px]"
                  src={icon}
                  alt="icon"
                  width="72"
                  height="72"
                />
              ) : (
                <Company width={58} height={58} />
              )}
            </div>
          )}
        </div>
        <div className="grow shrink basis-0 h-[54px] justify-start items-center gap-3 flex">
          <div className="flex-col justify-center items-start gap-1 inline-flex">
            <div className="py-px justify-start items-center inline-flex">
              <div
                className="text-neutral-900 text-xl font-semibold leading-tight line-clamp-1 w-full break-words"
                title={title}
              >
                {title}
              </div>
            </div>
            {reportIsActive !== undefined && <ReportStatus active={reportIsActive} />}
            <div className="self-stretch justify-start items-center gap-4 inline-flex">
              {(listIcons && listIcons.length > 0) || listCount >= 0 ? (
                <div className="justify-start items-start flex">
                  <>{iconList(listIcons)}</>
                  {createdAt && (
                    <div className="justify-start items-start flex">
                      <div
                        className="text-neutral-400 text-sm font-normal leading-tight line-clamp-1 w-full break-words"
                        title={`Cadastrado em ${formatedDate}`}
                      >
                        Cadastrado em {formatedDate}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="justify-start items-start gap-[5px] flex">
                  <div className="w-6 h-6 relative ">
                    <Calendar />
                  </div>
                  <div
                    className="text-neutral-400 text-sm font-normal leading-tight line-clamp-1 w-full break-words"
                    title={`Cadastrado em ${formatedDate}`}
                  >
                    Cadastrado em {formatedDate}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        {menuAction ? <Dropdown items={items} /> : <></>}
      </div>
      {description && (
        <div className="self-stretch px-6 justify-start items-center inline-flex">
          <div
            className="text-neutral-500 text-sm font-normal leading-tight line-clamp-2 w-full break-words"
            title={description}
          >
            {description}
          </div>
        </div>
      )}
      {reports && renderReports()}
      <div className="self-stretch px-6 justify-start items-center inline-flex">{children}</div>
    </div>
  );
}

export default React.memo(Card);

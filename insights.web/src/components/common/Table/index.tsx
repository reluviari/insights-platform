import { ReactNode } from "react";
import InfiniteScroll from "react-infinite-scroll-component";

import Loading from "../Loading";
import Row from "./components/Row";

interface Props {
  columns: Column[];
  data: any[];
  loadMore: () => void;
  hasMore: boolean;
}

export interface Column {
  key: string;
  label: string | JSX.Element;
  render?: (value: any, row: any) => ReactNode;
}

export default function Table(props: Props) {
  const { columns, data, loadMore, hasMore } = props;

  return (
    <InfiniteScroll
      className="overflow-full mb-5"
      style={{ overflow: "full" }}
      dataLength={data.length}
      hasMore={hasMore}
      next={loadMore}
      loader={
        <div className="flex w-full justify-center p-4">
          <Loading />
        </div>
      }
    >
      <table className="w-full text-left rounded-md border border-neutral-200 ">
        <thead className="uppercase bg-neutral-100 rounded-sm border-b border-neutral-200 text-center">
          <tr>
            {columns?.map(column => (
              <th
                scope="col"
                className="px-6 py-4 text-neutral-900 text-[12px] font-semibold"
                key={column.key}
              >
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data?.map(row => (
            <Row key={row.id} row={row} columns={columns} />
          ))}
        </tbody>
      </table>
    </InfiniteScroll>
  );
}

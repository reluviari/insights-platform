import { ReactNode } from "react";

import RowCheckbox from "./components/RowCheckbox";

interface Props {
  columns: Column[];
  data: any[];
}

export interface Column {
  key: string;
  label: string | ReactNode;
  render?: (value: any, row: any) => ReactNode;
}

export default function TableCheckbox(props: Props) {
  const { columns, data } = props;

  return (
    <table className="w-full text-left rounded-md border border-neutral-200 ">
      <thead className="bg-neutral-100 rounded-sm border-b border-neutral-200">
        <tr>
          {columns?.map(column => (
            <th
              scope="col"
              className="px-6 py-4 font-normal text-base leading-5 text-[#485668]"
              key={column.key}
            >
              {column.label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data?.map(row => (
          <RowCheckbox key={row.id} row={row} columns={columns} />
        ))}
      </tbody>
    </table>
  );
}

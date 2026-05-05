import _ from "lodash";
import { memo } from "react";

import { Column } from "../..";

interface Props {
  row: any;
  columns: Column[];
}

function Row(props: Props) {
  const { row, columns } = props;

  return (
    <>
      <tr className="bg-neutral-0 border-b border-neutral-200" key={row.id}>
        {columns.map(column => (
          <td key={`${row.id}-${column.key}`} className="px-6 py-4 text-sm text-center">
            {column.render ? column.render(_.get(row, column.key), row) : _.get(row, column.key)}
          </td>
        ))}
      </tr>
    </>
  );
}

export default memo(Row);

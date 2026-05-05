import { Checkbox } from "@src/components/ui/checkbox";
import { Controller } from "react-hook-form";

interface Props {
  rowId: string;
  control: any;
  data: any[];
  setCheckedAll: (checked: boolean) => void;
  getValues: () => any;
}

export default function CheckboxAll(props: Props) {
  const { rowId, control, data, setCheckedAll, getValues } = props;
  return (
    <Controller
      control={control}
      name={rowId}
      render={({ field }) => (
        <Checkbox
          onCheckedChange={checked => {
            field.onChange(checked);
            if (!checked) {
              setCheckedAll(false);
            } else {
              const allChecked = data.every((r: any) => getValues()[r.id]);
              if (allChecked) {
                setCheckedAll(true);
              }
            }
          }}
          checked={field.value}
        />
      )}
    />
  );
}

import OrderBy from "../OrderBy";

interface DropdownProps {
  isActive: boolean;
  fieldName: string;
}
interface Props {
  fieldName: string;
  handleOrder: (field: string, order: string, key: string) => void;
  isActiveState: DropdownProps[];
}

export const orderBy = (props: Props) => [
  {
    label: "Classificar em ordem crescente",
    isActive:
      props.isActiveState.find(item => item.fieldName === props.fieldName)?.isActive ?? false,
    onClick: () => props.handleOrder(`${props.fieldName}`, "asc", props.fieldName),
  },
  {
    label: "Classificar em ordem decrescente",
    isActive:
      props.isActiveState.find(item => item.fieldName === props.fieldName)?.isActive ?? false,
    onClick: () => props.handleOrder(`${props.fieldName}`, "desc", props.fieldName),
  },
  {
    label: "Limpar ordenação",
    isActive: false,
    onClick: () => props.handleOrder(`${props.fieldName}`, null, null),
  },
];

export default function SubMenu(props: Props) {
  return <OrderBy items={orderBy(props)} />;
}

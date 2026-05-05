import Image from "next/image";

interface Props {
  props?: boolean;
}

export default function DropdownMenu(props: Props) {
  const alternative = props?.props;

  if (alternative === true) {
    return <Image src="/switch_left.svg" alt="arrow" width={24} height={24} />;
  } else {
    return <Image src="/dropdownIcon.svg" alt="arrow" width={24} height={24} />;
  }
}

import { SVGProps } from "react";
interface Colors {
  colors?: Array<string>;
}

export default function Close(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement> & Colors) {
  const { width = "52", height = "52" } = props;

  return (
    <svg
      width={width}
      height={height}
      viewBox="-10 -4 2 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M13 1L1 13M1 1L13 13" stroke="#667085" />
    </svg>
  );
}

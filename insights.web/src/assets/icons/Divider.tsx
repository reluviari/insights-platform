import { SVGProps } from "react";

export default function Divider(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="480" height="1" viewBox="0 0 480 1" fill="none">
      <path fill-rule="evenodd" clip-rule="evenodd" d="M480 1H0V0H480V1Z" fill="#E4E7EC" />
    </svg>
  );
}

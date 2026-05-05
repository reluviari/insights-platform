import { SVGProps } from "react";
interface Colors {
  colors?: Array<string>;
}

export default function Reports(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement> & Colors) {
  const {
    width = "48",
    height = "48",
    // colors = ["#232323", "#232323", "#D31C5B", "#232323"],
    colors = ["#232323", "#232323", "#232323", "#232323"],
  } = props;
  return (
    <svg width="52" height="52" viewBox="0 0 52 52" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M21.125 8.66658V47.6666H30.875V8.66658C30.875 6.28325 29.9 4.33325 26.975 4.33325H25.025C22.1 4.33325 21.125 6.28325 21.125 8.66658Z"
        fill={colors[0]}
      />
      <path
        opacity="0.4"
        d="M6.5 21.6666V47.6666H15.1667V21.6666C15.1667 19.2833 14.3 17.3333 11.7 17.3333H9.96667C7.36667 17.3333 6.5 19.2833 6.5 21.6666Z"
        fill={colors[1]}
      />
      <path
        d="M36.8333 32.5001V47.6667H45.4999V32.5001C45.4999 30.1167 44.6333 28.1667 42.0333 28.1667H40.2999C37.6999 28.1667 36.8333 30.1167 36.8333 32.5001Z"
        fill={colors[2]}
      />
      <path
        d="M47.6668 47.6667H4.3335C3.44516 47.6667 2.7085 46.9301 2.7085 46.0417C2.7085 45.1534 3.44516 44.4167 4.3335 44.4167H47.6668C48.5552 44.4167 49.2918 45.1534 49.2918 46.0417C49.2918 46.9301 48.5552 47.6667 47.6668 47.6667Z"
        fill={colors[3]}
      />
    </svg>
  );
}

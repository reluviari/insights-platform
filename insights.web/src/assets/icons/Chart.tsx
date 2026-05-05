import { SVGProps } from "react";
interface Colors {
  colors?: Array<string>;
}

export default function Chart(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement> & Colors) {
  const { width = "52", height = "52" } = props;

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M21.125 8.66683V47.6668H30.875V8.66683C30.875 6.2835 29.9 4.3335 26.975 4.3335H25.025C22.1 4.3335 21.125 6.2835 21.125 8.66683Z"
        fill="#292D32"
      />
      <path
        opacity="0.4"
        d="M6.5 21.6668V47.6668H15.1667V21.6668C15.1667 19.2835 14.3 17.3335 11.7 17.3335H9.96667C7.36667 17.3335 6.5 19.2835 6.5 21.6668Z"
        fill="#292D32"
      />
      <path
        d="M36.8333 32.4998V47.6665H45.4999V32.4998C45.4999 30.1165 44.6333 28.1665 42.0333 28.1665H40.2999C37.6999 28.1665 36.8333 30.1165 36.8333 32.4998Z"
        fill="#D31C5B"
      />
      <path
        d="M47.6668 47.6665H4.3335C3.44516 47.6665 2.7085 46.9298 2.7085 46.0415C2.7085 45.1532 3.44516 44.4165 4.3335 44.4165H47.6668C48.5552 44.4165 49.2918 45.1532 49.2918 46.0415C49.2918 46.9298 48.5552 47.6665 47.6668 47.6665Z"
        fill="#292D32"
      />
    </svg>
  );
}

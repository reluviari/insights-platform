import { SVGProps } from "react";
interface Colors {
  colors?: string;
}

export default function CloseSmall(
  props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement> & Colors,
) {
  const { width = "52", height = "52", colors = "#1C1B1F" } = props;

  return (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M1.26683 9.66683L0.333496 8.7335L4.06683 5.00016L0.333496 1.26683L1.26683 0.333496L5.00016 4.06683L8.7335 0.333496L9.66683 1.26683L5.9335 5.00016L9.66683 8.7335L8.7335 9.66683L5.00016 5.9335L1.26683 9.66683Z"
        fill={colors}
      />
    </svg>
  );
}

export default function Active() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="23"
      height="67"
      viewBox="0 0 23 67"
      className="fill-primary"
    >
      <g filter="url(#filter0_d_1930_8182)">
        <path d="M8.62251 58.6621C8.27871 58.6621 8 58.3834 8 58.0396L8 9.28993C8 8.9432 8.28109 8.66211 8.62782 8.66211C8.88097 8.66211 9.11148 8.81893 9.20848 9.05275C17.0014 27.837 16.8612 38.7567 9.2029 58.2633C9.10955 58.5011 8.87795 58.6621 8.62251 58.6621Z" />
      </g>
      <defs>
        <filter
          id="filter0_d_1930_8182"
          x="0"
          y="0.662109"
          width="23"
          height="66"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feMorphology
            radius="2"
            operator="dilate"
            in="SourceAlpha"
            result="effect1_dropShadow_1930_8182"
          />
          <feOffset />
          <feGaussianBlur stdDeviation="3" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0.827451 0 0 0 0 0.109804 0 0 0 0 0.356863 0 0 0 0.3 0"
          />
          <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_1930_8182" />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect1_dropShadow_1930_8182"
            result="shape"
          />
        </filter>
      </defs>
    </svg>
  );
}

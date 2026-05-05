export default function Add(props: any) {
  const { className } = props;
  return (
    <svg
      className={`stroke-neutral-900 ${className}`}
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
    >
      <path d="M4.5 9H13.5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9 13.5V4.5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

interface Props {
  active: boolean;
}
export default function UserStatus(props: Props) {
  const { active } = props;
  return (
    <div
      className={`w-3.5 h-3.5 absolute -right-2 -top-2 rounded-full ${
        active ? "bg-system-success-500 " : "bg-system-error-500"
      }`}
    />
  );
}

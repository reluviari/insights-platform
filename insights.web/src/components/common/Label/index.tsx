interface Props extends React.LabelHTMLAttributes<HTMLLabelElement> {
  children: React.ReactNode;
}

export default function Label(props: Props) {
  const { children } = props;
  return (
    <label className="text-neutral-900 text-sm font-medium not-italic" {...props}>
      {children}
    </label>
  );
}

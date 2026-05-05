import Link from "next/link";

export default function LinkHilight(props: any) {
  const { children, href, ...rest } = props;

  return (
    <Link
      className="text-primary 
    inline-block
    text-sm 
    font-semibold
    relative
    cursor-pointer 
    not-italic 
    transition-all 
    duration-500 
    before:content-['']
    before:absolute
    before:-bottom-1
    before:left-0
    before:w-0
    before:h-[2px]
    before:rounded-full
    before:opacity-0
    before:transition-all
    before:duration-500
    before:bg-primary
    before:from-gray-600
    before:via-slate-400
    before:to-zinc-500
    hover:before:w-full
    hover:before:opacity-100"
      href={href}
      {...rest}
    >
      {children}
    </Link>
  );
}

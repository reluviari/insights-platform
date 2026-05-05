import { genRanHex } from "@src/utils/color";
import { useMemo } from "react";

interface Props {
  name?: string;
  image?: string;
  active?: boolean;
}

export default function Avatar(props: Props) {
  const { name, image } = props;

  const [firstName, lastName] = name?.toUpperCase()?.split(" ");
  const ramdomColor = useMemo(() => `#${genRanHex()}`, []);

  return (
    <div className="rounded-xl w-[48px] h-[48px] p-1 bg-neutral-500">
      {Boolean(image) ? (
        <></>
      ) : (
        <div
          style={{ backgroundColor: ramdomColor }}
          className={`
            rounded-xl flex justify-center items-center
            h-full font-semibold tracking-[1px] text-neutral-900`}
        >
          {firstName?.charAt(0)}
          {lastName?.charAt(0)}
        </div>
      )}
    </div>
  );
}

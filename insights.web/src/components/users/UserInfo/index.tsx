/* eslint-disable @next/next/no-img-element */
import User from "@src/assets/icons/User";

interface UserInfoProps {
  avatar: string;
  name: string;
  email: string;
}

export default function UserInfo(props: UserInfoProps) {
  const { avatar, name, email } = props;
  return (
    <div className="flex items-center gap-3">
      {avatar ? (
        <div className="relative w-12 h-12 rounded-full overflow-hidden mr-2">
          <img src={avatar} alt={name} className="absolute inset-0 w-full h-full object-cover" />
        </div>
      ) : (
        <User />
      )}
      <div className="flex flex-col gap-1 items-start">
        <div className="text-neutral-900 font-semibold leading-5">{name}</div>
        <div className="text-[12px] text-neutral-400 font-medium leading-4">{email}</div>
      </div>
    </div>
  );
}

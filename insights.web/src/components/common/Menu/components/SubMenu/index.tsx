import classNames from "classnames";
import Image from "next/image";
import { Dispatch, SetStateAction } from "react";

import Item from "../Item";

interface ISubMenuData {
  logout?: () => void;
  setOpen: Dispatch<SetStateAction<boolean>>;
  open: boolean;
}

function SubMenu(props: ISubMenuData): JSX.Element {
  const { logout, open, setOpen } = props;

  const openClass = classNames("transition-all duration-500", {
    block: open,
    hidden: !open,
  });

  return (
    <div onMouseLeave={() => setOpen(false)} className="absolute left-0 bottom-0">
      <div className={`shadow-submenu bg-neutral-900 rounded-xl w-80 py-2 ${openClass} `}>
        {/* <Item expanded label="Editar perfil" icon="/user.svg" /> */}
        <Item expanded label="Sair da plataforma" icon={"/logout.svg"} onClick={logout} />
      </div>
    </div>
  );
}

export default SubMenu;

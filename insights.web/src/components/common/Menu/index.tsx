import SettingsIcon from "@src/assets/icons/Settings";
import { logout } from "@src/services/login";
import { IReports } from "@src/shared/interfaces/reports.interface";
import { selectAuthUser } from "@src/store/slices/login/selectors";
import { User } from "@src/store/slices/login/types";
import classNames from "classnames";
import Image from "next/image";
import { useRouter } from "next/router";
import { useState } from "react";

import Avatar from "./components/Avatar";
import Item from "./components/Item";
import SubMenu from "./components/SubMenu";

import { useAppDispatch, useAppSelector } from "@src/store/hooks";

interface IMenuData {
  reports?: IReports[];
  workspaceId?: string;
}

export default function Menu(props: IMenuData) {
  const { reports, workspaceId } = props;
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSubMenuOpen, setIsSubMenuOpen] = useState(false);
  const user: User = useAppSelector(selectAuthUser) || ({ name: "", email: "", roles: [] } as User);
  const router = useRouter();
  const dispatch = useAppDispatch();

  const logoutHandler = async () => {
    dispatch(logout());
    router.push("/login");
  };

  const handleOpenMenu = (): void => {
    setIsMenuOpen(true);
  };

  const handleCloseMenu = (): void => {
    setIsMenuOpen(false);
  };

  const arrowSubMenuIcon = (
    <Image
      src={"/rightArrow.svg"}
      onClick={() => setIsSubMenuOpen(true)}
      alt="arrow icon"
      className="ml-4 rotate-90"
      width={10}
      height={15}
      priority
    />
  );

  const LogoAfya = <Image src={"/logoafya.png"} alt="logafya" width={78} height={34} />;
  const LogoAfyaSmall = <Image src={"/smallLogo.png"} alt="smalllog" width={32} height={34} />;

  const classWidth = classNames({
    "min-w-[330px]": isMenuOpen,
    "min-w-[88px]": !isMenuOpen,
  });

  return (
    <div
      className={`bg-neutral-900 min-h-full max-h-full fixed transition-all ease-in-out duration-500 z-50 ${classWidth}`}
      onMouseEnter={handleOpenMenu}
      onMouseLeave={handleCloseMenu}
    >
      <div
        className={classNames({
          "px-8": isMenuOpen,
          "px-4": !isMenuOpen,
        })}
      >
        <div
          className={classNames("py-6 transition-all min-h-11 flex", {
            "justify-center": !isMenuOpen,
            "justify-start": isMenuOpen,
          })}
        >
          {isMenuOpen ? LogoAfya : LogoAfyaSmall}
        </div>
        <hr className="h-1 text-neutral-0" />
      </div>

      <div className="flex flex-col justify-between w-full h-[calc(100vh-15vh)]">
        <div
          className={`w-full max-h-[60vh] scrollbar-thin ${
            isMenuOpen ? "overflow-y-auto" : "overflow-hidden"
          }`}
        >
          {reports?.map(report => (
            <Item
              key={report.externalId}
              onClick={() => router.push(`/${workspaceId}/${report.externalId}`)}
              active={router.asPath.includes(`/${report.externalId}`)}
              label={report.title}
              icon={report.icon}
              expanded={isMenuOpen}
            />
          ))}
        </div>
        <div className="">
          {user?.roles?.includes("ADMIN") && (
            <Item
              active={router.asPath.includes(`/settings`)}
              label={"Configurações"}
              onClick={() => router.push(`/settings`)}
              icon={<SettingsIcon width={26} height={24} />}
              expanded={isMenuOpen}
            />
          )}

          <div
            className={classNames("flex relative bottom-0 flex-col w-full mb-[32px]", {
              "px-8": isMenuOpen,
              "px-4": !isMenuOpen,
            })}
          >
            <hr className="h-1 text-neutral-0" />
            <div
              className={classNames("flex mt-6 items-center max-h-[48px] h-full", {
                "gap-5": isMenuOpen,
                "justify-center": !isMenuOpen,
              })}
            >
              <div>
                <Avatar name={user.name} image="" />
              </div>
              <div
                className={classNames(
                  "transition-all ease-in-out delay-300 duration-300 overflow-hidden",
                  {
                    "opacity-100": isMenuOpen,
                    "h-auto": isMenuOpen,
                    "w-30": isMenuOpen,
                    "opacity-0": !isMenuOpen,
                    "h-0": !isMenuOpen,
                    "w-0": !isMenuOpen,
                  },
                )}
              >
                <span className="text-neutral-400 font-semibold"> Olá! 👋</span>
                <h3 className="text-2xl font-semibold text-neutral-0">{user.name}</h3>
              </div>
              <div
                className={classNames(
                  "relative transition-all ease-in-out delay-300 duration-300",
                  {
                    "opacity-100": isMenuOpen,
                    "h-auto": isMenuOpen,
                    "w-30": isMenuOpen,
                    "opacity-0": !isMenuOpen,
                    "h-0": !isMenuOpen,
                    "w-0": !isMenuOpen,
                  },
                )}
              >
                <span className="cursor-pointer">{arrowSubMenuIcon}</span>
                <SubMenu setOpen={setIsSubMenuOpen} open={isSubMenuOpen} logout={logoutHandler} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

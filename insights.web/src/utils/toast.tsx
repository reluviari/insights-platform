import Close from "@src/assets/icons/Close";
import ErrorCircle from "@src/assets/icons/ErrorCircle";
import SuccessCircle from "@src/assets/icons/SuccessCircle";
import WarningCircle from "@src/assets/icons/WarningCircle";
import classNames from "classnames";
import hotToast from "react-hot-toast";

interface IToast {
  type: "success" | "error" | "warning";
  title: string;
  message: string;
}

const ICON = {
  error: <ErrorCircle />,
  warning: <WarningCircle />,
  success: <SuccessCircle />,
};

export const toast = ({ type, title, message }: IToast) => {
  const bgColor = classNames({
    "bg-system-success-100": type === "success",
    "bg-system-error-100": type === "error",
    "bg-system-warning-100": type === "warning",
  });

  hotToast.custom(
    t => (
      <div
        className={`${
          t.visible ? "animate-enter" : "animate-leave"
        } max-w-md w-full bg-white shadow-lg rounded-md pointer-events-auto flex bg-neutral-0`}
      >
        <div
          className={`flex justify-center items-center w-[80px] h-full rounded-s-md flex-shrink-0 ${bgColor}`}
        >
          {ICON[type]}
        </div>
        <div className="flex-1 p-4">
          <div className="flex justify-between mb-1.5">
            <h1 className="font-semibold text-base">{title}</h1>
            <div className="cursor-pointer max-h-6" onClick={() => hotToast.dismiss(t.id)}>
              <Close />
            </div>
          </div>
          <p className="text-sm font-normal">{message}</p>
        </div>
      </div>
    ),
    { position: "bottom-right" },
  );
};

import React, { useCallback } from "react";

interface Props {
  children: React.ReactNode;
  onClose?: () => void;
  title?: string;
  isCloseIcon?: boolean;
  width?: string | number;
  height?: string | number;
  color?: string;
}

const Modal: React.FC<Props> = ({
  onClose,
  children,
  title,
  isCloseIcon,
  width,
  height,
  color,
}: Props): JSX.Element => {
  const handleCloseClick = useCallback(
    (event: React.MouseEvent): void => {
      event.preventDefault();

      onClose();
    },
    [onClose],
  );

  return (
    <div className="flex justify-center overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none bg-[#313131] bg-opacity-70">
      <div
        className={`
                    relative 
                    ${width ? width : "w-auto"} 
                    ${height ? height : "h-auto"} 
                    my-6 
                    mx-auto 
           `}
      >
        <div
          className={`
                    border-0 
                    rounded-xl 
                    shadow-modal 
                    relative 
                    flex 
                    flex-col 
                    w-full 
                    overflow-y-hidden
                    ${color ? color : "bg-neutral-0"} 
                    outline-none focus:outline-none`}
        >
          {isCloseIcon && (
            <div
              className="
                            flex 
                            items-center 
                            justify-end 
                            p-5 
                            border-b 
                            border-solid
                             border-gray-300 
                             rounded-t"
            >
              <div className="flex justify-end text-2xl cursor-pointer">
                <span onClick={handleCloseClick}>x</span>
              </div>
              {title && <h1>{title}</h1>}
            </div>
          )}
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;

import Button from "@src/components/common/Button";
import Image from "next/image";
import React, { useCallback, ReactNode } from "react";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string | ReactNode;
  confirmText: string;
  cancelText: string;
  children?: ReactNode;
  isLoading?: boolean;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText,
  cancelText,
  children,
  isLoading,
}: ConfirmModalProps): JSX.Element => {
  const handleConfirmClick = useCallback(
    (event: React.MouseEvent): void => {
      event.preventDefault();
      onClose();
      onConfirm();
    },
    [onClose, onConfirm],
  );

  if (!isOpen) return null;

  return (
    <div
      className="flex justify-center items-center overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none bg-[#313131] bg-opacity-70"
      onClick={onClose}
    >
      <div className="relative w-[490px] h-auto my-6 mx-auto" onClick={e => e.stopPropagation()}>
        <div className="border-0 rounded-xl shadow-modal relative flex flex-col w-full bg-neutral-0 outline-none focus:outline-none">
          <div className="flex justify-between items-start p-5 border-b border-solid border-neutral-200 rounded-t">
            <div className="flex items-center gap-2">
              <div className="bg-red-50 p-4 rounded-full flex justify-center items-center shrink-0">
                <Image src="/warning.svg" alt="Warning" width={24} height={24} />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-neutral-900">{title}</h2>
                <p className="text-sm text-neutral-500 mt-1">{description}</p>
              </div>
            </div>
            <button className="text-slate-400 hover:text-neutral-800" onClick={onClose}>
              <Image src="/x_close.svg" alt="Close" width={24} height={24} />
            </button>
          </div>
          <div className="p-6">
            {children}
            <div className="flex justify-between gap-4">
              <Button variant="neutral" size="medium" className="w-[48%]" onClick={onClose}>
                {cancelText}
              </Button>
              <Button
                variant="danger"
                size="medium"
                className="w-[48%]"
                onClick={handleConfirmClick}
                isLoading={isLoading}
              >
                {confirmText}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;

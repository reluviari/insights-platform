import Arrow from "@src/assets/icons/Arrow";
import Close from "@src/assets/icons/Close";
import Divider from "@src/assets/icons/Divider";
import LeftArrow from "@src/assets/icons/LeftArrow";
import TrashModal from "@src/assets/icons/TrashModal";
import Button from "@src/components/common/Button";

import BaseModal from "../BaseModal";
import Loading from "../common/Loading";

interface modalProps {
  title?: string;
  content?: string;
  isLoading?: boolean;
  onConfirm?: any;
  onClose?: any;
}

export default function ModalConfirm(props: modalProps) {
  const { title, content, isLoading, onClose, onConfirm } = props;

  const handleCloseModal = () => {
    if (onClose) {
      onClose();
    }
  };

  const handleConfirmDelete = () => {
    if (onConfirm) {
      onConfirm();
    }
  };

  return (
    <BaseModal className="w-[480px]">
      <div className="flex flex-row gap-4">
        <div>
          <TrashModal />
        </div>
        <div className="flex flex-col w-full">
          <div className="flex justify-between w-full">
            <div className="text-neutral-900 text-lg font-semibold font-['Inter'] leading-7">
              Deseja remover esse {title}?
            </div>
            <button onClick={() => handleCloseModal()}>
              <Close />
            </button>
          </div>
          <div className="text-neutral-600 text-sm font-normal font-['Inter'] leading-tight">
            {content}
          </div>
        </div>
      </div>

      <div className="self-center h-[15px] pb-6 mt-5">
        <Divider></Divider>
      </div>
      <div className="Content self-stretch px-6 pb-1 justify-start items-start gap-3 inline-flex">
        <button
          onClick={() => handleCloseModal()}
          className="grow shrink basis-0 h-11 py-2 bg-neutral-0 rounded-[10px] border border-neutral-900 justify-center items-center gap-3 flex hover:border-neutral-400 hover:text-neutral-400 text-neutral-900 text-base font-semibold font-['Inter'] leading-normal"
        >
          <LeftArrow />
          Retornar
        </button>
        <button
          onClick={() => handleConfirmDelete()}
          className="grow shrink basis-0 h-11 py-2 bg-[#DA3333] rounded-[10px] justify-center items-center gap-3 flex text-neutral-0 text-base font-semibold font-['Inter'] leading-normal hover:text-neutral-200"
        >
          {isLoading ? <Loading color={"fill-neutral-0"} /> : "Sim, Remover"}
        </button>
      </div>
    </BaseModal>
  );
}

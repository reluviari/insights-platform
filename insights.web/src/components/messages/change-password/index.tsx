import Button from "@src/components/common/Button";
import Modal from "@src/components/modal";
import Image from "next/image";
import React, { useState } from "react";

import CreateNewPassword from "../create-new-password";
import SendPasswordReset from "../send-password-reset";

interface Props {
  onClose: () => void;
  userId: string;
  email: string;
}

const ChangePassword = (props: Props) => {
  const { onClose, userId, email } = props;
  const textStyle = "text-neutral-600 text-lg font-normal not-italic text-left";
  const [showPasswordChangeModal, setShowPasswordChangeModal] = useState(false);
  const [showPasswordResetModal, setShowPasswordResetModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [selectedUserEmail, setSelectedUserEmail] = useState("");

  const showChangeModal = (userId: string, email: string) => {
    setSelectedUserId(userId);
    setSelectedUserEmail(email);
    setShowPasswordChangeModal(true);
  };

  const showResetModal = (email: string) => {
    setSelectedUserEmail(email);
    setShowPasswordResetModal(true);
  };

  const closeModal = () => {
    setSelectedUserId("");
    setSelectedUserEmail("");
    setShowPasswordChangeModal(false);
    setShowPasswordResetModal(false);
  };

  return (
    <>
      <div className="relative p-6 flex flex-auto justify-center gap-4 items-center flex-col">
        <h1 className="text-neutral-900 text-lg font-semibold not-italic text-center">
          Redefinição de senha
        </h1>
        <div
          className="absolute right-6 top-8 cursor-pointer text-neutral-900 text-lg"
          onClick={onClose}
        >
          <Image src="/close_simple.svg" alt="X" width={14} height={14} />
        </div>
        <p className={textStyle}>Selecione a opção desejada para resetar a senha do usuário.</p>
      </div>
      <div className="flex flex-row justify-center p-6 gap-4">
        <Button
          className="mb-3"
          variant="primary"
          size="medium"
          full
          onClick={() => showChangeModal(props.userId, props.email)}
        >
          Criar nova senha
        </Button>

        <Button
          className="mb-3"
          variant="primary"
          size="medium"
          full
          onClick={() => showResetModal(props.email)}
        >
          Resetar senha
        </Button>
      </div>
      {showPasswordChangeModal && (
        <Modal isCloseIcon={false} width="w-[600px]" height="h-[588px]">
          <CreateNewPassword
            onClose={closeModal}
            userId={selectedUserId}
            email={selectedUserEmail}
          />
        </Modal>
      )}
      {showPasswordResetModal && (
        <Modal isCloseIcon={false} width="w-[400px]" height="h-[588px]">
          <SendPasswordReset onClose={closeModal} email={selectedUserEmail} />
        </Modal>
      )}
    </>
  );
};

export default ChangePassword;

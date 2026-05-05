import Button from "@src/components/common/Button";
import { sendPasswordResetEmail } from "@src/services/login";
import { toast } from "@src/utils/toast";
import Image from "next/image";
import React, { useCallback, useState } from "react";

import { useAppDispatch } from "@src/store/hooks";

interface Props {
  onClose: () => void;
  email: string;
}

const SendPasswordReset = (props: Props) => {
  const { onClose, email } = props;
  const textStyle = "text-neutral-600 text-lg font-normal not-italic text-left";
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(false);

  const sendResetEmail = useCallback(async () => {
    setIsLoading(true);
    try {
      await dispatch(sendPasswordResetEmail(email));
      toast({
        title: "E-mail enviado",
        message: `Um email com as instruções de recuperação de senha foi enviado para ${email}`,
        type: "success",
      });
    } catch (err) {
      toast({
        title: "Ocorreu um erro",
        message: "Ocorreu um erro ao enviar o email de redefinição de senha",
        type: "error",
      });
    } finally {
      onClose();
      setIsLoading(false);
    }
  }, [dispatch, email, onClose]);

  return (
    <>
      <div className="relative p-6 flex flex-auto justify-center gap-4 items-center flex-col">
        <h1 className="text-neutral-900 text-lg font-semibold not-italic text-center">
          Enviar reset de senha
        </h1>
        <div
          className="absolute right-6 top-8 cursor-pointer text-neutral-900 text-lg"
          onClick={onClose}
        >
          <Image src="/close_simple.svg" alt="X" width={14} height={14} />
        </div>
        <p className={textStyle}>
          Você está prestes a enviar um e-mail com instruções para redefinir a senha do usuário{" "}
          <b>{email}</b> Deseja continuar?
        </p>
      </div>
      <div className="flex flex-row justify-center p-6 gap-4">
        <Button variant="secondary" size="medium" full onClick={onClose}>
          Cancelar
        </Button>
        <Button
          isLoading={isLoading}
          className="mb-3"
          variant="primary"
          size="medium"
          full
          onClick={sendResetEmail}
        >
          Enviar e-mail
        </Button>
      </div>
    </>
  );
};

export default SendPasswordReset;

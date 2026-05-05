import Button from "@src/components/common/Button";
import { sendWelcomeEmail } from "@src/services/login";
import { toast } from "@src/utils/toast";
import Image from "next/image";
import React, { useCallback, useState } from "react";

import { useAppDispatch } from "@src/store/hooks";

interface Props {
  onClose: (emailSent?: boolean) => void;
  email: string;
  creationMode?: boolean;
}

const SendWelcome = (props: Props) => {
  const { onClose, email, creationMode } = props;
  const textStyle = "text-neutral-600 text-lg font-normal not-italic text-left";
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(false);

  const sendEmail = useCallback(async () => {
    setIsLoading(true);
    try {
      await dispatch(sendWelcomeEmail(email));
      if (!creationMode) {
        toast({
          title: "Sucesso!",
          message: `O e-mail com as instruções foi enviado para ${email} com sucesso.`,
          type: "success",
        });
      }
      onClose(true);
    } catch (err) {
      toast({
        title: "Ocorreu um erro!",
        message: "Tente novamente mais tarde.",
        type: "error",
      });
      onClose();
    } finally {
      setIsLoading(false);
    }
  }, [dispatch, email, onClose, creationMode]);

  return (
    <>
      <div className="relative p-6 flex flex-auto justify-center gap-4 items-center flex-col">
        <h1 className="text-neutral-900 text-lg font-semibold not-italic text-center">
          {creationMode ? "Usuário cadastrado com sucesso!" : "Enviar e-mail inicial"}
        </h1>
        <div
          className="absolute right-6 top-8 cursor-pointer text-neutral-900 text-lg"
          onClick={() => onClose(false)}
        >
          <Image src="/close_simple.svg" alt="X" width={14} height={14} />
        </div>
        <p className={textStyle}>
          {creationMode ? (
            <>
              Você deseja enviar um e-mail com instruções para definir a senha ao usuário{" "}
              <b>{email}</b>?
            </>
          ) : (
            <>
              Ao prosseguir, o usuário <b>{email}</b> receberá um e-mail com instruções para o
              primeiro acesso e uso da sua senha. Deseja realmente enviar?
            </>
          )}
        </p>
      </div>
      <div className="flex flex-row justify-center p-6 gap-4">
        <Button variant="secondary" size="medium" full onClick={() => onClose(false)}>
          {creationMode ? "Não enviar" : "Cancelar"}
        </Button>
        <Button
          isLoading={isLoading}
          className="mb-3"
          variant="primary"
          size="medium"
          full
          onClick={sendEmail}
        >
          {creationMode ? "Sim, enviar e-mail" : "Enviar"}
        </Button>
      </div>
    </>
  );
};

export default SendWelcome;

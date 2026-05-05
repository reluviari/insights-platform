import Button from "@src/components/common/Button";
import { logout } from "@src/services/login";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { use, useCallback } from "react";

import { useAppDispatch } from "@src/store/hooks";

interface MessageTokenExpiredProps {
  isExpired: boolean;
}

const MessageTokenExpired: React.FC<MessageTokenExpiredProps> = ({ isExpired }) => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const textStyle = "text-neutral-600 text-lg font-normal not-italic text-left";

  const tokenExpire = (
    <Image
      src="../tokenExpireLogo.svg"
      alt="token expire image"
      width={184}
      height={206.85}
      priority
    />
  );

  const handleRedirectClick = useCallback(async () => {
    await dispatch(logout());
    router.replace("/login");
  }, [dispatch, router]);

  return (
    <>
      <div className="relative p-6 flex flex-auto justify-center gap-4 items-center flex-col">
        {tokenExpire}
        <h1 className="text-neutral-900 text-lg font-semibold not-italic text-center">
          Sua sessão foi interrompida
        </h1>
        {isExpired ? (
          <p className={textStyle}>Por favor, faça login novamente.</p>
        ) : (
          <>
            <p className={textStyle}>
              Identificamos um novo login na plataforma, realizado com os seus dados de acesso.
            </p>
            <p className={textStyle}>
              No <b>Afya Insights</b> permitimos apenas uma sessão ativa por usuário, por isso
              interrompemos esta sessão.
            </p>
            <p className={textStyle}>
              Caso não reconheça este acesso simultâneo entre em contato com nosso time de
              atendimento.
            </p>
          </>
        )}
      </div>
      <div className="flex items-center justify-end p-6 border-t border-solid border-blueGray-200 rounded-b">
        <Button variant="primary" size="medium" full onClick={handleRedirectClick}>
          Ir para página de login
        </Button>
      </div>
    </>
  );
};

export default MessageTokenExpired;

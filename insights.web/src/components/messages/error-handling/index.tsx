import { AxiosError } from "axios";
import Image from "next/image";
import React from "react";

interface IErrorProps {
  onClickProps?(event: React.MouseEvent<HTMLImageElement>): void;
  error: AxiosError;
}

const MessageErrorComponent: React.FC<IErrorProps> = (props: IErrorProps) => {
  const buttonClose = (
    <Image
      onClick={event => props.onClickProps(event)}
      src={"close.svg"}
      alt="close button"
      width={16}
      height={17}
      style={{ cursor: "pointer" }}
      className="dark:invert"
      priority
    />
  );

  const statusCode = props.error && ((props.error as AxiosError).request as XMLHttpRequest)?.status;
  const messageError =
    statusCode === 401
      ? "Acesso inválido! Verifique seus dados de acesso."
      : "Oops! Identificamos um problema em nosso sistema e já estamos atuando para solucioná-lo. Por favor, tente acessar novamente mais tarde";
  return (
    <div className="bg-[#FCEBEB] rounded-md w-[396px] h-auto pt-2 pb-2 px-4 flex justify-start items-center mt-16 mb-8">
      {buttonClose}
      <p className="text-[#DA3333] font-normal text-sm mt-[3px] mr-[10px] pl-2">{messageError}</p>
    </div>
  );
};

export default MessageErrorComponent;

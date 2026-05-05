import Button from "@src/components/common/Button";
import InputPassword from "@src/components/common/InputPassword";
import Loading from "@src/components/common/Loading";
import { changePassword } from "@src/services/users";
import { selectUserLoading } from "@src/store/slices/users/selectors";
import { getPasswordStrengthInfo } from "@src/utils/getPasswordStrengthInfo";
import { passwordStrengthValidation } from "@src/utils/passwordStrengthValidation";
import PasswordStrengthBars from "@src/utils/renderPasswordStrengthBar";
import { toast } from "@src/utils/toast";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import { useAppDispatch, useAppSelector } from "@src/store/hooks";

interface Props {
  onClose: () => void;
  userId: string;
  email: string;
}

const CreateNewPassword = (props: Props) => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    trigger,
  } = useForm({ mode: "onChange" });

  const { onClose, userId, email } = props;
  const textStyle = "text-neutral-600 text-lg font-normal not-italic text-left";
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(false);

  const passwordData = watch("password");
  const confirmPasswordData = watch("confirmPassword");

  const isLoadingUsers = useAppSelector(selectUserLoading);
  const { strength } = passwordStrengthValidation(passwordData);
  const { borderColor, content, contentColor } = getPasswordStrengthInfo(strength);

  const [formIsValid, setFormIsValid] = useState(false);
  const [strengthPassword, setStrengthPassword] = useState(0);

  useEffect(() => {
    setFormIsValid(false);

    const lengthEquals = passwordData?.length === confirmPasswordData?.length;
    const equalValues = passwordData === confirmPasswordData;

    if (passwordData) {
      setStrengthPassword(strength);
    }

    if (strengthPassword >= 3 && equalValues && lengthEquals && passwordData.length >= 8) {
      setFormIsValid(true);
    }
  }, [passwordData, confirmPasswordData, strengthPassword, strength]);

  const onSubmit = async (data: any) => {
    if (!formIsValid) {
      toast({
        type: "error",
        title: "Senhas não conferem",
        message: "As senhas informadas não conferem. Por favor, verifique e tente novamente.",
      });

      return;
    }

    try {
      dispatch(changePassword(data.password, userId)).then((response: any) => {
        if (response) {
          toast({
            type: "success",
            title: "Senha cadastrada",
            message: `Senha cadastrada com sucesso`,
          });
          onClose();
        } else {
          toast({
            type: "error",
            title: "Ocorreu um erro",
            message: "Ocorreu um erro ao cadastrar a nova senha",
          });
        }
      });
    } catch (err) {
      console.error(err);
    }
  };

  if (isLoadingUsers)
    return (
      <>
        <div className="w-full relative flex justify-center items-center mt-20">
          <Loading color="fill-neutral-900" />
        </div>
      </>
    );

  return (
    <>
      <div className="relative p-6 flex flex-auto justify-center gap-4 items-center flex-col">
        <h1 className="text-neutral-900 text-lg font-semibold not-italic text-center">
          Criar nova senha
        </h1>
        <div
          className="absolute right-6 top-8 cursor-pointer text-neutral-900 text-lg"
          onClick={onClose}
        >
          <Image src="/close_simple.svg" alt="X" width={14} height={14} />
        </div>
        <div>
          <p className="mt-3 text-neutral-400 text-base font-normal not-italic">
            Digite a nova senha para redefinir a senha do usuário {email}
          </p>
          <p className="mt-5"> A senha dever ter: </p>

          <ul className="mt-2 text-neutral-400">
            <li> No mínimo 8 digitos</li>
            <li> Ao menos uma letra</li>
            <li> Ao menos um número</li>
            <li> Ao menos um caracter especial</li>
          </ul>
          <div className="mt-8">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="relative">
                <InputPassword
                  label="Senha"
                  error={Boolean(errors.password)}
                  placeholder="Senha"
                  id="password"
                  name="password"
                  {...register("password", { required: true })}
                />
              </div>
              <div className="relative pt-2">
                <InputPassword
                  label="Confirme sua senha"
                  error={Boolean(errors.password)}
                  placeholder="Confirme sua senha"
                  id="confirmPassword"
                  name="confirmPassword"
                  {...register("confirmPassword", { required: true })}
                />
              </div>

              <div className="mt-4">
                <PasswordStrengthBars strength={strengthPassword} borderColor={borderColor} />
                <div
                  className={`w-full flex justify-end text-right text-xs pt-2 items-end ${contentColor}`}
                >
                  {content}
                </div>
              </div>

              <div className="flex flex-row justify-center p-6 gap-4">
                <Button variant="secondary" size="medium" full onClick={onClose}>
                  Cancelar
                </Button>
                <Button
                  size="medium"
                  variant="primary"
                  disabled={!formIsValid}
                  full
                  isLoading={isLoadingUsers}
                >
                  Cadastrar nova senha
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreateNewPassword;

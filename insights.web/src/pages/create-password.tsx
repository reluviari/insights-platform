import Alert from "@src/components/common/Alert";
import Button from "@src/components/common/Button";
import InputPassword from "@src/components/common/InputPassword";
import LinkHilight from "@src/components/common/LinkHilight";
import Loading from "@src/components/common/Loading";
import { defineFirstPassword, validateToken } from "@src/services/users";
import { selectLoginError } from "@src/store/slices/login/selectors";
import { selectUserLoading } from "@src/store/slices/users/selectors";
import { getPasswordStrengthInfo } from "@src/utils/getPasswordStrengthInfo";
import { passwordStrengthValidation } from "@src/utils/passwordStrengthValidation";
import PasswordStrengthBars from "@src/utils/renderPasswordStrengthBar";
import { toast } from "@src/utils/toast";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import { useAppDispatch, useAppSelector } from "@src/store/hooks";

export default function CreatePassword() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    trigger,
  } = useForm({ mode: "onChange" });

  const passwordData = watch("password");
  const confirmPasswordData = watch("confirmPassword");

  const dispatch = useAppDispatch();
  const isLoadingUsers = useAppSelector(selectUserLoading);
  const hasError = useAppSelector(selectLoginError);
  const router = useRouter();
  const { token } = router.query;
  const { strength } = passwordStrengthValidation(passwordData);
  const { borderColor, content, contentColor } = getPasswordStrengthInfo(strength);

  const [tokenIsInvalid, setTokenIsInvalid] = useState(true);
  const [url, setUrl] = useState("");
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
  }, [passwordData, confirmPasswordData]);

  useEffect(() => {
    setUrl(window.location.origin);
    if (token) {
      try {
        dispatch(validateToken(token as string)).then(response => {
          if (response.valid) {
            setTokenIsInvalid(!response.valid);
            return;
          }
          setTokenIsInvalid(!response.valid);
        });
      } catch (err) {
        setTokenIsInvalid(true);
      }
    }
  }, [token]);

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
      dispatch(defineFirstPassword({ ...data, token })).then(response => {
        if (response) {
          toast({
            type: "success",
            title: "Senha cadastrada",
            message: `O cadastro da primeira senha foi realizado com sucesso`,
          });
          router.push("/login");
        } else {
          toast({
            type: "error",
            title: "Ocorreu um erro",
            message: "Ocorreu um erro ao cadastrar a senha",
          });
        }
      });
    } catch (err) {
      console.error(err);
    }
  };

  const logoImagem = (
    <Image
      src={"/logoLogin.svg"}
      alt="logo imagem"
      width={200}
      height={59}
      style={{ margin: "0 auto" }}
      priority
    />
  );

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
      <div className="min-h-screen bg-neutral-0 flex">
        <Head>
          <title>Cadastre nova senha</title>
        </Head>
        <div className="hidden lg:block relative w-0 flex-1 bg-black">
          <div
            style={{
              display: "table",
              background: `url('/binary.png')`,
              width: "100%",
              height: "100%",
              backgroundSize: "cover",
              backgroundPosition: "30% 45%",
            }}
          ></div>
        </div>

        <div className="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
          <div className="mx-auto w-full max-w-sm">
            {tokenIsInvalid ? (
              <>
                <div className="mb-16">{logoImagem}</div>
                <h2
                  style={{ fontSize: "28px", lineHeight: "34px" }}
                  className="mt-6 text-neutral-900 not-italic font-semibold"
                >
                  Você já cadastrou sua senha!
                </h2>
                <p className="mt-3 text-neutral-400 text-base font-normal not-italic mb-5">
                  Se você esqueceu sua senha e deseja redefini-la, clique no botão abaixo!
                </p>
                <LinkHilight href={`${url}/forgot-password`}> Redefinir sua senha</LinkHilight>
              </>
            ) : (
              <div>
                <div className="mb-16"> {logoImagem}</div>
                {hasError && (
                  <Alert type="error">Acesso inválido! Verifique seus dados de acesso.</Alert>
                )}
                <h2
                  style={{ fontSize: "28px", lineHeight: "34px" }}
                  className="mt-6 text-neutral-900 not-italic font-semibold"
                >
                  Cadastre uma nova senha
                </h2>
                <p className="mt-3 text-neutral-400 text-base font-normal not-italic">
                  Redefina sua senha e acesse a plataforma
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
                        disabled={tokenIsInvalid}
                        error={Boolean(errors.password) || hasError}
                        placeholder="Senha"
                        id="password"
                        name="password"
                        {...register("password", { required: true })}
                      />
                    </div>
                    <div className="relative pt-2">
                      <InputPassword
                        label="Confirme sua senha"
                        disabled={tokenIsInvalid}
                        error={Boolean(errors.password) || hasError}
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

                    <div className="mb-4 mt-8">
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
            )}
          </div>
        </div>
      </div>
    </>
  );
}

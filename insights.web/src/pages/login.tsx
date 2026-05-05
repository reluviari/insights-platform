import Alert from "@src/components/common/Alert";
import Button from "@src/components/common/Button";
import Input from "@src/components/common/Input";
import InputPassword from "@src/components/common/InputPassword";
import Label from "@src/components/common/Label";
import LinkHilight from "@src/components/common/LinkHilight";
import { login } from "@src/services/login";
import { selectLoginError, selectLoginLoading } from "@src/store/slices/login/selectors";
import { toast } from "@src/utils/toast";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";

import { useAppDispatch, useAppSelector } from "@src/store/hooks";

const insightsSsoEnabled = process.env.NEXT_PUBLIC_INSIGHTS_SSO_ENABLED === "true";

export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({ mode: "onChange" });

  const dispatch = useAppDispatch();
  const isLoading = useAppSelector(selectLoginLoading);
  const hasError = useAppSelector(selectLoginError);
  const router = useRouter();
  const [inactiveUserError, setInactiveUserError] = useState<string | null>(null);

  useEffect(() => {
    if (hasError) {
      setInactiveUserError(null);
    }
  }, [hasError]);

  const handleSsoClick = () => {
    toast({
      type: "warning",
      title: "SSO (Keycloak)",
      message:
        "Keycloak não faz parte do uso atual do projeto. Esta área fica para quando o SSO for implementado.",
    });
  };

  const onSubmit = async (data: any) => {
    try {
      await dispatch(login(data));
      router.push("/");
    } catch (err: any) {
      if (err.message.includes("Conta temporariamente bloqueada")) {
        setInactiveUserError(err.message);
      } else {
        console.error(err);
      }
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

  return (
    <>
      <Head>
        <title>Insights | Login</title>
      </Head>
      <div className="min-h-screen bg-neutral-0 flex">
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
            <div>
              <div className="mb-16">{logoImagem}</div>
              {inactiveUserError ? (
                <Alert type="error">
                  Conta temporariamente bloqueada. <br />
                  Sua conta foi bloqueada por um administrador. <br />
                  Para mais informações, entre em contato com o suporte ao cliente.
                </Alert>
              ) : hasError ? (
                <Alert type="error">Acesso inválido! Verifique seus dados de acesso.</Alert>
              ) : null}
              <h2
                style={{ fontSize: "28px", lineHeight: "34px" }}
                className="mt-6 text-neutral-900 not-italic font-semibold"
              >
                Boas-vindas ao Insights Platform
              </h2>
              <p
                style={{ lineHeight: "19px" }}
                className="mt-6 text-neutral-400 text-base font-normal not-italic"
              >
                Informe os dados abaixo para acessar a plataforma
              </p>
            </div>
            <div className="mt-6">
              <form
                onSubmit={handleSubmit(onSubmit)}
                onChange={() => {
                  setInactiveUserError(null);
                }}
              >
                <div className="mb-4">
                  <Label>Login</Label>
                  <Input
                    error={Boolean(errors.email) || hasError || !!inactiveUserError}
                    type="email"
                    placeholder="E-mail"
                    id="email"
                    name="email"
                    {...register("email", { required: true })}
                  />
                </div>
                <div className="relative">
                  <InputPassword
                    label="Senha"
                    error={Boolean(errors.password) || hasError || !!inactiveUserError}
                    placeholder="Senha"
                    id="password"
                    name="password"
                    {...register("password", { required: true })}
                  />
                </div>
                <div className="flex justify-end items-center my-8">
                  {/* <Checkbox id="checkbox-remember" label="Lembrar-me" /> */}
                  <div>
                    <LinkHilight href="/forgot-password">Esqueceu a senha?</LinkHilight>
                  </div>
                </div>
                <div className="mb-4 mt-6">
                  <Button
                    isLoading={isLoading}
                    disabled={!isValid}
                    size="medium"
                    variant="primary"
                    full
                  >
                    Acessar
                  </Button>
                </div>
              </form>

              <div
                className="mt-10 border-t border-neutral-200 pt-8"
                role="region"
                aria-labelledby="sso-login-heading"
              >
                <p
                  id="sso-login-heading"
                  className="text-center text-sm font-medium text-neutral-600 mb-4"
                >
                  ou
                </p>
                <Button
                  type="button"
                  size="medium"
                  variant="secondary"
                  full
                  disabled={!insightsSsoEnabled}
                  aria-describedby="sso-login-help"
                  onClick={insightsSsoEnabled ? handleSsoClick : undefined}
                >
                  Continuar com SSO (Keycloak)
                </Button>
                <p
                  id="sso-login-help"
                  className="mt-3 text-xs leading-relaxed text-neutral-400 text-center"
                >
                  {insightsSsoEnabled ? (
                    <>
                      Flag SSO ativa — o fluxo completo ainda não faz parte do roadmap atual da
                      equipa.
                    </>
                  ) : (
                    <>
                      <strong className="font-medium text-neutral-500">SSO (Keycloak) não está em uso.</strong>{" "}
                      Utilize e-mail e senha na API. O botão fica reservado para uma eventual fase
                      futura de SSO; não configure Keycloak no fluxo normal de desenvolvimento.
                    </>
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

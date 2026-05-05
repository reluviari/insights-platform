import Alert from "@src/components/common/Alert";
import Button from "@src/components/common/Button";
import Input from "@src/components/common/Input";
import Label from "@src/components/common/Label";
import { forgotPassword } from "@src/services/login";
import { selectLoginError, selectLoginLoading } from "@src/store/slices/login/selectors";
import { toast } from "@src/utils/toast";
import Image from "next/image";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";

import { useAppDispatch, useAppSelector } from "@src/store/hooks";

export default function ForgotPassword() {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({ mode: "onChange" });

  const dispatch = useAppDispatch();
  const isLoading = useAppSelector(selectLoginLoading);
  const hasError = useAppSelector(selectLoginError);
  const router = useRouter();

  const onSubmit = async (data: any) => {
    try {
      await dispatch(forgotPassword(data?.email));
      toast({
        title: "E-mail enviado",
        message: "Um email com as instruções de recuperação de senha foi enviado para você",
        type: "success",
      });
      router.push("/login");
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

  return (
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
            {hasError && (
              <Alert type="error">Acesso inválido! Verifique seus dados de acesso.</Alert>
            )}
            <h2
              style={{ fontSize: "28px", lineHeight: "34px" }}
              className="mt-6 text-neutral-900 not-italic font-semibold"
            >
              Esqueceu a senha?
            </h2>
            <p
              style={{ lineHeight: "19px" }}
              className="mt-6 text-neutral-400 text-base font-normal leading-6 not-italic"
            >
              Não se preocupe! Informe o e-mail cadastrado e enviaremos instruções para você
              recuperar o acesso.
            </p>
          </div>
          <div className="mt-6">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="mb-4">
                <Label>Digite o e-mail cadastrado</Label>
                <Input
                  error={Boolean(errors.email) || hasError}
                  type="email"
                  placeholder="E-mail"
                  id="email"
                  name="email"
                  {...register("email", { required: true })}
                />
              </div>
              <div className="mb-4 mt-6 flex gap-2 flex-col">
                <Button
                  isLoading={isLoading}
                  disabled={!isValid}
                  size="medium"
                  variant="primary"
                  full
                >
                  Recuperar senha
                </Button>
                <Button
                  size="medium"
                  variant="secondary"
                  full
                  type="button"
                  onClick={() => router.push("/login")}
                >
                  Voltar para o login
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

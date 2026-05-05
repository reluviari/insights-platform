import Company from "@src/assets/icons/Company";
import TickCircle from "@src/assets/icons/TickCircle";
import Upload from "@src/assets/icons/Upload";
import Breadcrumbs from "@src/components/common/Breadcrumbs";
import Button from "@src/components/common/Button";
import Input from "@src/components/common/Input";
import Layout from "@src/components/common/Layout";
import PageTitle from "@src/components/common/PageTitle";
import { NextPageWithLayout } from "@src/pages/_app";
import { createCustomer } from "@src/services/customers";
import { customerActions } from "@src/store/slices/customers";
import {
  selectCustomerError,
  selectCustomerErrorMsg,
  selectCustomerLoading,
} from "@src/store/slices/customers/selectors";
import { home } from "@src/utils/constants";
import { toast } from "@src/utils/toast";
import { debounce } from "lodash";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useEffect, useState, ChangeEvent, useCallback } from "react";
import { useForm } from "react-hook-form";

import { useAppDispatch, useAppSelector } from "@src/store/hooks";

const CustomersCreate: NextPageWithLayout = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const isLoadingCustomers = useAppSelector(selectCustomerLoading);
  const hasError = useAppSelector(selectCustomerError);
  const msgError = useAppSelector(selectCustomerErrorMsg);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({ mode: "onChange" });

  const [iconBase64, setIconBase64] = useState("");

  const handleChangeIcon = (e: ChangeEvent<HTMLInputElement>) => {
    const reader = new FileReader();
    reader.readAsDataURL(e.target.files[0]);
    reader.onload = e => {
      const base64 = e.target.result as string;
      setIconBase64(base64);
      setValue("logo", base64);
    };
  };

  const handleRedirectDebounced = useCallback(() => {
    debounce(() => {
      router.push("/settings/customers");
    }, 1500);
  }, [router]);

  const onSubmit = async (data: any) => {
    const { name, document, logo } = data;

    const createCustomerBody = {
      name,
      document,
      logo,
    };

    if (typeof logo !== "string") delete createCustomerBody.logo;

    try {
      const response = await dispatch(createCustomer(createCustomerBody));
      if (response) {
        toast({
          type: "success",
          title: "Cliente cadastrado",
          message: `O cliente ${name} foi cadastrado com sucesso.`,
        });
        router.push("/settings/customers");
      }
    } catch (err: any) {
      console.error(err?.message || err);
      router.reload();
    }
  };
  useEffect(() => {
    if (hasError) {
      if (msgError && msgError === "exception:CUSTOMER_ALREADY_EXIST") {
        toast({
          type: "error",
          title: "CNPJ já cadastrado",
          message: "Já existe um cliente com o CNPJ informado. Por favor informe outro CNPJ.",
        });
      } else {
        toast({
          type: "error",
          title: "Erro ao salvar cliente",
          message:
            "Ocorreu um erro ao salvar as informações do cliente, tente novamente mais tarde.",
        });
      }
      dispatch(customerActions.controlView({ isLoading: false, hasError: false }));
    }
  }, [hasError, msgError, dispatch]);

  return (
    <section className={`flex min-h-screen w-full`}>
      <Head>
        <title>Novo Cliente</title>
      </Head>
      <div className="w-full bg-neutral-100 px-10 py-8">
        <div className="self-stretch h-[78px] flex-col justify-start items-start gap-3 flex w-full">
          <Breadcrumbs
            links={[
              {
                label: "Home",
                route: home,
              },
              {
                label: "Configurações",
                route: "/settings",
              },
              {
                label: "Administrar clientes",
                route: "/settings/customers",
              },
              {
                label: "Novo cliente",
                route: "/settings/customers/create",
                active: true,
              },
            ]}
          />
          <div className="flex justify-baseline items-baseline gap-5 justify-between h-20 w-full">
            <div className="flex text-stone-900 text-3xl font-sans font-bold leading-10">
              <PageTitle>Novo cliente</PageTitle>
            </div>
            <div className=" flex-end flex gap-2 w-50 h-9">
              <Button
                size="medium"
                variant="secondary"
                onClick={() => {
                  router.push("/settings/customers");
                }}
              >
                Cancelar
              </Button>

              <Button
                className="gap-2.5"
                variant="primary"
                size="medium"
                type="submit"
                form="customerCreateForm"
                isLoading={isLoadingCustomers}
              >
                <TickCircle /> Confirmar cadastro
              </Button>
            </div>
          </div>
        </div>
        <div className="justify-start items-start gap-8 flex mb-2 mt-10">
          <div className="h-12 justify-start items-center gap-4 inline-flex">
            <div className="w-12 h-12 relative">
              <Company
                width="58"
                height="58"
                colors={["#232323", "#232323", "#D31C5B", "#232323", "#232323"]}
              />
            </div>
            <div className="grow shrink basis-0 flex-col justify-center items-start gap-1 inline-flex">
              <div className="self-stretch text-neutral-800 text-lg font-bold font-sans leading-7">
                Informações Gerais
              </div>
              <div className="self-stretch text-neutral-400 text-sm font-medium font-sans leading-tight">
                Preencha os dados básicos do cliente.
              </div>
            </div>
          </div>
        </div>

        <form id="customerCreateForm" onSubmit={handleSubmit(onSubmit)}>
          <div className="Form p-6 my-5 bg-neutral-0 flex rounded-lg shadow  flex-col justify-start items-start font-sans">
            <div className="TwoColumns self-stretch grow justify-start items-start gap-4 inline-flex">
              <div className="Fields w-72 h-44 flex-col justify-start items-start inline-flex">
                <div className="FileUploadBase self-stretch grow shrink basis-0  rounded-lg flex-col justify-start items-center gap-2 flex">
                  <div className="Label self-stretch text-neutral-800 text-sm font-sans leading-5">
                    Logotipo do cliente
                  </div>
                  <div className="Content self-stretch grow shrink basis-0 px-6 py-4 bg-white rounded-lg border border-dashed border-neutral-400 flex-col justify-start items-center gap-1 flex">
                    <div className="LogoText self-stretch h-24 flex-col justify-start items-center gap-3 flex">
                      <div className="FeaturedIcon w-10 h-10   rounded-3xl  justify-center items-center inline-flex">
                        <div className="UploadCloud  flex-col justify-start items-start flex" />
                        {iconBase64 ? (
                          <Image
                            alt="icon"
                            className="w-10 h-10 rounded-3xl"
                            src={iconBase64}
                            width="40"
                            height="40"
                          ></Image>
                        ) : (
                          <Upload />
                        )}
                      </div>
                      <div className="TextAndSupportingText self-stretch h-10 flex-col justify-start items-center gap-1 flex">
                        <div className="Action self-stretch justify-center items-start gap-1 inline-flex">
                          <div className="Button justify-start items-start flex">
                            <div className="ButtonBase justify-center items-center gap-2 flex">
                              <div className="Text text-primary text-sm font-medium font-sans underline leading-5">
                                <label htmlFor="file_icon_input" className="cursor-pointer">
                                  Clique aqui
                                </label>
                                <Input
                                  className="hidden"
                                  id="file_icon_input"
                                  type={"file"}
                                  {...register("logo")}
                                  onChange={handleChangeIcon}
                                  accept={"image/jpeg, image/png, image/svg+xml"}
                                />
                              </div>
                            </div>
                          </div>
                          <div className="Text text-neutral-900 text-xs font-sans font-normal leading-5">
                            para enviar uma imagem.
                          </div>
                        </div>
                        <div className="SupportingText self-stretch text-center text-neutral-300 text-xs font-sans leading-[1.125rem]">
                          SVG, PNG ou JPG <br />
                          (Tam. máx. recomendado: 74x74px)
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="Fields grow w-full shrink basis-0 flex-col justify-start items-start gap-6 inline-flex">
                <div className="Input self-stretch h-20 flex-col justify-start items-start gap-1 flex">
                  <div className="Label self-stretch text-neutral-900 text-sm font-sans font-medium leading-5">
                    Nome do cliente
                  </div>
                  <Input
                    id="name"
                    name="name"
                    error={Boolean(errors.name)}
                    type="text"
                    maxLength={50}
                    placeholder="Digite o nome do cliente"
                    {...register("name", { required: true })}
                  ></Input>
                </div>
                <div className="Input self-stretch h-20 flex-col justify-start items-start gap-1 flex">
                  <div className="Label self-stretch text-neutral-900 text-sm font-sans font-medium leading-5">
                    Número do CNPJ
                  </div>
                  <Input
                    id="document"
                    name="document"
                    error={Boolean(errors.document)}
                    type="text"
                    placeholder="Informe o número do CNPJ do cliente"
                    maxLength={18}
                    {...register("document", { required: true })}
                  ></Input>
                </div>
              </div>
            </div>
            <div className="Input self-stretch flex-col justify-start items-start gap-2 flex"></div>
          </div>
        </form>
      </div>
    </section>
  );
};

CustomersCreate.getLayout = function getLayout(page: any) {
  return <Layout>{page}</Layout>;
};

export default CustomersCreate;

import ProfileCircle from "@src/assets/icons/ProfileCicle";
import TickCircle from "@src/assets/icons/TickCircle";
import LabelFieldInput from "@src/components/blocks/Fields/LabelFieldInput";
import LabelFieldSelect from "@src/components/blocks/Fields/LabelFieldSelect";
import GeneralInfoSection from "@src/components/blocks/GeneralInfoSection";
import Breadcrumbs from "@src/components/common/Breadcrumbs";
import Button from "@src/components/common/Button";
import InputPassword from "@src/components/common/InputPassword";
import Layout from "@src/components/common/Layout";
import PageTitle from "@src/components/common/PageTitle";
import SendWelcome from "@src/components/messages/send-welcome";
import Modal from "@src/components/modal";
import UploadBase64 from "@src/components/uploadBase64";
import { NextPageWithLayout } from "@src/pages/_app";
import { useGetCustomersQuery } from "@src/services/customers";
import { useGetDepartmentsQuery } from "@src/services/departments";
import { createUser } from "@src/services/users";
import { roleOptions } from "@src/shared/enums/roles";
import { userActions } from "@src/store/slices/users";
import {
  selectUserLoading,
  selectUserError,
  selectUserErrorMsg,
} from "@src/store/slices/users/selectors";
import { home } from "@src/utils/constants";
import { getPasswordStrengthInfo } from "@src/utils/getPasswordStrengthInfo";
import { passwordStrengthValidation } from "@src/utils/passwordStrengthValidation";
import PasswordStrengthBars from "@src/utils/renderPasswordStrengthBar";
import { toast } from "@src/utils/toast";
import Head from "next/head";
import { useRouter } from "next/router";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";

import { useAppDispatch, useAppSelector } from "@src/store/hooks";

const UsersPage: NextPageWithLayout = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const isLoadingUsers = useAppSelector(selectUserLoading);
  const hasError = useAppSelector(selectUserError);
  const msgError = useAppSelector(selectUserErrorMsg);
  const inputEmail = useRef(null);

  const { data: customerData } = useGetCustomersQuery({ page: 1, pageSize: 50 });
  const [customerOptions, setCustomerOptions] = useState([]);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    control,
    watch,
  } = useForm({ mode: "onChange" });

  const selectedCustomer = watch("customer");
  const params = { page: 1, pageSize: 50 };

  const { data: departmentData } = useGetDepartmentsQuery({
    params,
    customerId: selectedCustomer,
  });

  const [iconBase64, setIconBase64] = useState("");

  const handleChangeIcon = (e: ChangeEvent<HTMLInputElement>) => {
    const reader = new FileReader();
    reader.readAsDataURL(e.target.files[0]);
    reader.onload = e => {
      const base64 = e.target.result as string;
      setIconBase64(base64);
      setValue("avatar", base64);
    };
  };

  const passwordData = watch("password");
  const confirmPasswordData = watch("confirmPassword");
  const { strength } = passwordStrengthValidation(passwordData);
  const { borderColor, content, contentColor } = getPasswordStrengthInfo(strength);
  const [strengthPassword, setStrengthPassword] = useState(0);
  const [isValidPassword, setIsValidPassword] = useState(false);

  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const [createdUserEmail, setCreatedUserEmail] = useState("");

  useEffect(() => {
    setValue("roles", "USER");
  }, [setValue]);

  const onSubmit = (data: any) => {
    if ((data.password || data.confirmPassword) && !isValidPassword) {
      toast({
        type: "error",
        title: "Senha inválida",
        message: "Um dos requisitos não foi cumprido.",
      });
      dispatch(userActions.controlView({ msgError: "INVALID_PASSWORD" }));
      return;
    }

    const isValidEmail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;
    if (data.email && !data.email.match(isValidEmail)) {
      toast({
        type: "error",
        title: "Email inválido",
        message: "Endereço de e-mail inválido.",
      });
      inputEmail.current.focus();
      return;
    }

    const formattedData = {
      ...data,
      roles: [data.roles],
    };

    dispatch(createUser(formattedData)).then(response => {
      if (response) {
        setCreatedUserEmail(data.email);
        setShowWelcomeModal(true);
      }
    });
  };

  const handleModalClose = (emailSent = false) => {
    setShowWelcomeModal(false);
    if (emailSent) {
      toast({
        type: "success",
        title: "Sucesso!",
        message: `O e-mail com as instruções foi enviado para ${createdUserEmail} com sucesso.`,
      });
    } else {
      toast({
        type: "success",
        title: "Sucesso!",
        message: `Usuário ${createdUserEmail} cadastrado com sucesso.`,
      });
    }
    router.push("/settings/users");
  };

  useEffect(() => {
    if (!!customerData && !!customerData.rows) {
      const copyRows = [...customerData.rows];
      setCustomerOptions(
        copyRows
          .filter(f => f.isActive)
          .sort((a: any, b: any) => (a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1)),
      );
    }
  }, [customerData]);

  useEffect(() => {
    if (hasError) {
      if (msgError && msgError === "exception:EMAIL_ALREADY_EXIST") {
        toast({
          type: "error",
          title: "Email já cadastrado",
          message:
            "Já existe um usuário com o endereço de e-mail informado. Por favor informe outro e-mail.",
        });
        dispatch(userActions.controlView({ isLoading: false, hasError: false }));
      } else if (msgError && msgError === "exception:INVALID_PASSWORD_PATTERN") {
        toast({
          type: "error",
          title: "Senha inválida",
          message: "Um dos requisitos não foi cumprido.",
        });
        dispatch(userActions.controlView({ isLoading: false, hasError: false }));
      }
    }
  }, [hasError, msgError, dispatch]);

  useEffect(() => {
    if (passwordData || confirmPasswordData) {
      setIsValidPassword(false);
      const lengthEquals = passwordData?.length === confirmPasswordData?.length;
      const equalValues = passwordData === confirmPasswordData;
      if (passwordData) {
        setStrengthPassword(strength);
      }
      if (strengthPassword > 3 && equalValues && lengthEquals && passwordData.length >= 8) {
        setIsValidPassword(true);
      }
    }
  }, [passwordData, confirmPasswordData, strengthPassword, strength]);

  return (
    <section className="flex flex-col min-h-screen bg-neutral-100 w-full px-6 pt-10">
      <Head>
        <title>Novo usuário</title>
      </Head>
      <div className="header-content h-[4.875rem] bg-gray-200 flex-shrink-0 bg-red">
        <Breadcrumbs
          links={[
            {
              label: "Home",
              route: home,
            },
            {
              label: "Administrar usuários",
              route: "/settings/users",
            },
            {
              label: "Novo usuário",
              route: "settings/users/create",
              active: true,
            },
          ]}
        />

        <div className="flex justify-between items-center">
          <PageTitle>Novo usuário</PageTitle>
          <div className="flex-end flex gap-2 w-50 h-9">
            <Button
              variant="secondary"
              size="medium"
              onClick={() => {
                dispatch(userActions.controlView({ msgError: "" }));
                router.push("/settings/users");
              }}
            >
              Cancelar
            </Button>

            <Button
              variant="primary"
              size="medium"
              type="submit"
              form="userCreateForm"
              className="gap-2.5"
              onClick={onSubmit}
              isLoading={isLoadingUsers}
            >
              <TickCircle /> Cadastrar usuário
            </Button>
          </div>
        </div>
      </div>

      <div>
        <GeneralInfoSection
          iconComponent={<ProfileCircle />}
          title="Informações gerais"
          description="Preencha os dados básicos do usuário"
        />

        <form id="userCreateForm" onSubmit={handleSubmit(onSubmit)}>
          <div className="bg-neutral-0 p-5 shadow-md bg-opacity-25 bg-black rounded-xl">
            <div className="flex gap-4">
              <div className="w-80">
                <p className="font-inter text-sm font-medium leading-5 text-left text-gray-800">
                  Foto de perfil
                </p>
                <UploadBase64
                  className="hidden"
                  iconBase64={iconBase64}
                  image={handleChangeIcon}
                  type={"file"}
                  {...register("avatar")}
                  setValue={setValue}
                />
              </div>

              <div className="w-full flex flex-col gap-5">
                <LabelFieldInput
                  label="Nome"
                  id="name"
                  name="name"
                  type="text"
                  required={true}
                  placeholder="Informe o nome completo do usuário"
                  setValue={setValue}
                  {...register("name", { required: true })}
                  error={Boolean(errors.name)}
                />
                <LabelFieldInput
                  label="Telefone"
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="(00) 000000000"
                  setValue={setValue}
                  {...register("phone", { required: false })}
                  error={Boolean(errors.phone)}
                  mask="(00) [0]00000000"
                />
              </div>
            </div>
            <div className="flex gap-4 w-full pt-6">
              <LabelFieldSelect
                label="Cliente"
                id="customer"
                name="customer"
                placeholder="Selecione uma das opções"
                data={customerOptions}
                control={control}
                required={true}
                error={Boolean(errors.customer)}
                {...register("customer", { required: true })}
              />
              <LabelFieldSelect
                label="Grupo"
                id="department"
                name="department"
                placeholder="Selecione uma das opções"
                data={departmentData?.rows}
                control={control}
                required={true}
                isDisabled={!selectedCustomer}
                error={Boolean(errors.department)}
                {...register("department", { required: !selectedCustomer ? false : true })}
              />
            </div>
            <div className="w-full flex flex-row gap-4 pt-6">
              <LabelFieldSelect
                label="Perfil do Usuário"
                id="roles"
                name="roles"
                data={roleOptions}
                control={control}
                required={true}
                error={Boolean(errors.roles)}
                defaultValue="USER"
                {...register("roles", { required: true })}
              />
              <LabelFieldInput
                label="E-mail (Login)"
                id="email"
                name="email"
                type="text"
                required={true}
                placeholder="Informe o email corporativo do usuário"
                setValue={setValue}
                error={Boolean(errors.email || msgError === "exception:EMAIL_ALREADY_EXIST")}
                {...register("email", { required: true })}
                ref={inputEmail}
              />
            </div>
            <div className="flex gap-4 w-full pt-6">
              <InputPassword
                label="Criar senha"
                placeholder="Criar senha"
                id="password"
                name="password"
                error={Boolean(
                  errors.password ||
                    msgError === "exception:INVALID_PASSWORD_PATTERN" ||
                    msgError === "INVALID_PASSWORD",
                )}
                {...register("password", { required: false })}
              />
              <InputPassword
                label="Confirme sua senha"
                placeholder="Confirme sua senha"
                id="confirmPassword"
                name="confirmPassword"
                error={Boolean(
                  errors.password ||
                    msgError === "exception:INVALID_PASSWORD_PATTERN" ||
                    msgError === "INVALID_PASSWORD",
                )}
                {...register("confirmPassword", { required: false })}
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
            <div style={{ marginTop: "-20px" }}>
              <ul className="mt-2 text-neutral-400 mz-5">
                <li> A senha deve ter:</li>
                <li> No mínimo 8 dígitos</li>
                <li> Ao menos uma letra</li>
                <li> Ao menos um número</li>
                <li> Ao menos um caractere especial</li>
              </ul>
            </div>
          </div>
        </form>
      </div>
      {showWelcomeModal && (
        <Modal isCloseIcon={false} width="w-[500px]" height="h-[230px]">
          <SendWelcome
            onClose={(emailSent?: boolean) => handleModalClose(emailSent)}
            email={createdUserEmail}
            creationMode
          />
        </Modal>
      )}
    </section>
  );
};

UsersPage.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};

export default UsersPage;

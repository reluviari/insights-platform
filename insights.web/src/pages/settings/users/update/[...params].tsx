import ProfileCircle from "@src/assets/icons/ProfileCicle";
import TickCircle from "@src/assets/icons/TickCircle";
import LabelFieldInput from "@src/components/blocks/Fields/LabelFieldInput";
import LabelFieldSelect from "@src/components/blocks/Fields/LabelFieldSelect";
import GeneralInfoSection from "@src/components/blocks/GeneralInfoSection";
import Breadcrumbs from "@src/components/common/Breadcrumbs";
import Button from "@src/components/common/Button";
import ConfirmModal from "@src/components/common/ConfirmModal";
import Layout from "@src/components/common/Layout";
import PageTitle from "@src/components/common/PageTitle";
import UploadBase64 from "@src/components/uploadBase64";
import { NextPageWithLayout } from "@src/pages/_app";
import { useGetCustomersQuery } from "@src/services/customers";
import { useGetDepartmentsQuery } from "@src/services/departments";
import { updateUser, deleteUser, useLazyGetUserQuery } from "@src/services/users";
import { roleOptions } from "@src/shared/enums/roles";
import { userActions } from "@src/store/slices/users";
import {
  selectUserErrorMsg,
  selectUserError,
  selectUserLoading,
} from "@src/store/slices/users/selectors";
import { home } from "@src/utils/constants";
import { toast } from "@src/utils/toast";
import Head from "next/head";
import { usePathname } from "next/navigation";
import { useRouter } from "next/router";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";

import { useAppDispatch, useAppSelector } from "@src/store/hooks";

const UsersUpdate: NextPageWithLayout = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { params } = router.query;
  const [customerId, setCustomerId] = useState("");
  const [userId, setUserId] = useState("");
  const [iconBase64, setIconBase64] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [trigger, { isLoading, data }] = useLazyGetUserQuery();
  const { data: customerData } = useGetCustomersQuery({ page: 1, pageSize: 50 });
  const [customerOptions, setCustomerOptions] = useState([]);
  const dispatch = useAppDispatch();
  const isLoadingUser = useAppSelector(selectUserLoading);
  const hasError = useAppSelector(selectUserError);
  const msgError = useAppSelector(selectUserErrorMsg);
  const inputEmail = useRef(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    control,
    watch,
  } = useForm({ mode: "onChange" });

  useEffect(() => {
    if (!params) return;
    setUserId(params[0]);
    setCustomerId(params[1]);

    //FORCE MASK TO OLD VALUES ON EDIT
    document.getElementById("phone").focus();
  }, [params]);

  useEffect(() => {
    if (customerId.length > 0 && userId.length > 0) {
      trigger({ user: userId, customer: customerId });
    }
  }, [customerId, userId, trigger]);

  useEffect(() => {
    if (!!customerData && !!customerData.rows) {
      const copyRows = [...customerData.rows];
      setCustomerOptions(
        copyRows.sort((a: any, b: any) => (a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1)),
      );
    }
  }, [customerData]);

  const selectedCustomer = watch("customer");

  const { data: departmentData } = useGetDepartmentsQuery({
    page: 1,
    pageSize: 50,
    customerId: selectedCustomer,
  });

  const handleChangeIcon = (e: ChangeEvent<HTMLInputElement>) => {
    const reader = new FileReader();
    reader.readAsDataURL(e.target.files[0]);
    reader.onload = e => {
      const base64 = e.target.result as string;
      setIconBase64(base64);
      setValue("avatar", base64);
    };
  };

  useEffect(() => {
    if (!data) return;
    setValue("name", data?.name);
    setValue("phone", data?.phone);
    setValue("email", data?.email);
    setValue("customer", data?.customer?.id);
    setValue("department", data?.departments[0]?.id);
    setValue("roles", data?.roles[0]);
    setValue("avatar", data?.avatar);
    setIconBase64(data?.avatar);
  }, [data, setValue]);

  const onSubmit = (data: any) => {
    const dataSubmit = {
      ...data,
      departmentIds: [data?.department],
      roles: [data?.roles],
    };
    delete dataSubmit.department;

    const isValidEmail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;
    if (data.email && !data.email.match(isValidEmail)) {
      toast({
        type: "error",
        title: "Email inválido",
        message: "Endereço de e-mail inválido.",
      });
      return;
    }
    if (data.name) {
      dispatch(updateUser(dataSubmit, userId)).then((response: any) => {
        if (response) {
          toast({
            type: "success",
            title: "Usuário atualizado com sucesso",
            message: `O cadastro ${data.name} foi atualizado com sucesso.`,
          });
          router.push("/settings/users");
        }
      });
    }
  };

  useEffect(() => {
    if (!!customerData && !!customerData.rows) {
      const copyRows = [...customerData.rows];
      setCustomerOptions(
        copyRows.sort((a: any, b: any) => (a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1)),
      );
    }
  }, [customerData, customerId]);

  useEffect(() => {
    if (hasError) {
      if (msgError && msgError === "exception:EMAIL_ALREADY_EXIST") {
        toast({
          type: "error",
          title: "Email já cadastrado",
          message:
            "Já existe um usuário com o endereço de e-mail informado. Por favor informe outro e-mail.",
        });
      } else {
        toast({
          type: "error",
          title: "Erro ao atualizar",
          message: "Ocorreu um erro ao tentar atualizar. Por favor tente novamente, ou mais tarde.",
        });
      }
      dispatch(userActions.controlView({ isLoading: false, hasError: false }));
    }
  }, [hasError, msgError, dispatch]);

  const handleDeleteUser = async () => {
    try {
      if (!userId || !data?.name) {
        throw new Error("Usuário não encontrado.");
      }

      const result = await deleteUser(userId)(dispatch);
      if (result) {
        toast({
          type: "success",
          title: "Usuário excluído",
          message: `O usuário ${data?.name} e todos os dados associados foram excluídos com sucesso.`,
        });
        router.push("/settings/users");
      } else {
        throw new Error("Erro ao excluir o usuário.");
      }
    } catch (error) {
      toast({
        type: "error",
        title: "Ocorreu um erro!",
        message: "Tente novamente mais tarde.",
      });
      router.push("/settings/users");
    } finally {
      setShowDeleteModal(false);
    }
  };

  return (
    <section className="flex flex-col min-h-screen bg-neutral-100 w-full px-6 pt-10">
      <Head>
        <title>Editar usuário</title>
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
              label: "Editar usuário",
              route: pathname,
              active: true,
            },
          ]}
        />

        <div className="flex justify-between items-center">
          <PageTitle>Editar usuário</PageTitle>
          <div className="flex-end flex gap-2 w-50 h-9">
            <Button
              variant="secondary"
              size="medium"
              onClick={() => {
                router.push("/settings/users");
              }}
            >
              Cancelar
            </Button>

            <Button
              variant="primary"
              size="medium"
              type="submit"
              form="userUpdateForm"
              className="gap-2.5"
              onClick={onSubmit}
              isLoading={isLoadingUser}
            >
              <TickCircle /> Salvar usuário
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

        <form id="userUpdateForm" onSubmit={handleSubmit(onSubmit)}>
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
                  type="text"
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
                isDisabled={true}
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
                error={Boolean(errors.email)}
                {...register("email", { required: true })}
              />
            </div>
            <div className="flex justify-end pt-6">
              <Button
                variant="tertiary"
                size="medium"
                type="button"
                className="flex items-center gap-2 group"
                onClick={() => setShowDeleteModal(true)}
              >
                <span className="w-[18px] h-[19.5px]">
                  <svg
                    width="18"
                    height="19.5"
                    viewBox="0 0 16 18"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="group-hover:fill-red-900 fill-[#EA2023]"
                  >
                    <path
                      d="M3 18C2.45 18 1.97933 17.8043 1.588 17.413C1.196 17.021 1 16.55 1 16V3H0V1H5V0H11V1H16V3H15V16C15 16.55 14.8043 17.021 14.413 17.413C14.021 17.8043 13.55 18 13 18H3ZM13 3H3V16H13V3ZM5 14H7V5H5V14ZM9 14H11V5H9V14Z"
                      fill="currentColor"
                    />
                  </svg>
                </span>
                Excluir usuário
              </Button>
            </div>
          </div>
        </form>
      </div>

      {showDeleteModal && (
        <ConfirmModal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={handleDeleteUser}
          title="Confirmação de exclusão do usuário"
          description={
            <>
              Você está prestes a excluir o usuário{" "}
              <span className="font-semibold text-[#475467]">{data?.name}</span>. Esta ação é
              irreversível e todos os dados associados serão permanentemente removidos. Tem certeza
              de que deseja continuar?
            </>
          }
          confirmText="Sim, excluir"
          cancelText="Cancelar"
        />
      )}
    </section>
  );
};

UsersUpdate.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};

export default UsersUpdate;

import Add from "@src/assets/icons/Add";
import CloseSmall from "@src/assets/icons/CloseSmall";
import Company from "@src/assets/icons/Company";
import TickCircle from "@src/assets/icons/TickCircle";
import Users from "@src/assets/icons/Users";
import AttachReportEdit from "@src/components/attachReport/create/id";
import LabelFieldInput from "@src/components/blocks/Fields/LabelFieldInput";
import GeneralInfoSection from "@src/components/blocks/GeneralInfoSection";
import Breadcrumbs from "@src/components/common/Breadcrumbs";
import Button from "@src/components/common/Button";
import Layout from "@src/components/common/Layout";
import Loading from "@src/components/common/Loading";
import PageTitle from "@src/components/common/PageTitle";
import { ReportDetail } from "@src/components/customers/Interfaces";
import { ReportConfig } from "@src/components/customers/ReportConfig";
import ModalConfirm from "@src/components/ModalConfirm";
import UploadBase64 from "@src/components/uploadBase64";
import { NextPageWithLayout } from "@src/pages/_app";
import {
  useLazyGetCustomerByIdQuery,
  useLazyGetDepartmentsByCustomerIDQuery,
  useLazyGetReportsByCustomerIdQuery,
} from "@src/services/customers";
import { updateCustomer, createDepartment, deleteDepartment } from "@src/services/customers";
import { customerActions } from "@src/store/slices/customers";
import {
  selectCustomerError,
  selectCustomerErrorMsg,
  selectCustomerLoading,
} from "@src/store/slices/customers/selectors";
import { home } from "@src/utils/constants";
import { toast } from "@src/utils/toast";
import Head from "next/head";
import { usePathname } from "next/navigation";
import { useRouter } from "next/router";
import { ChangeEvent, useState, useEffect, useRef } from "react";
import { PropsWithChildren } from "react";
import { useForm } from "react-hook-form";
import CreatableSelect from "react-select/creatable";

import { useAppDispatch, useAppSelector } from "@src/store/hooks";

const CustomersUpdate: NextPageWithLayout = () => {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const isLoadingCustomers = useAppSelector(selectCustomerLoading);
  const hasError = useAppSelector(selectCustomerError);
  const msgError = useAppSelector(selectCustomerErrorMsg);
  const [trigger, { isLoading, data }] = useLazyGetCustomerByIdQuery();
  const [triggerGetDepartments, { isLoading: isLoadingDepartments, data: dataDepartments }] =
    useLazyGetDepartmentsByCustomerIDQuery();
  const [
    triggerGetReportsByCustomerId,
    { isLoading: isLoadingReportCustomer, data: reportsDetail },
  ] = useLazyGetReportsByCustomerIdQuery();
  const ref = useRef();
  const customerId = router.query.id as string;

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isValid },
  } = useForm();

  type ModalDeleteDepartment = { visible: boolean; removedValue?: any };

  const [iconBase64, setIconBase64] = useState("");
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [departmentOptions, setDepartmentOptions] = useState([]);
  const [selectedDepartmentOptions, setSelectedDepartmentOptions] = useState([]);
  const [reportDetails, setReportDetails] = useState<ReportDetail[]>(reportsDetail || []);
  const [modalDeleteDepartment, setModalDeleteDepartment] = useState<ModalDeleteDepartment>({
    visible: false,
    removedValue: undefined,
  });

  const handleOpenReportModal = () => {
    setIsReportModalOpen(true);
  };

  const handleUpdateReportDetails = (response: any) => {
    setReportDetails(response);
  };

  const handleCloseReportModal = () => {
    setIsReportModalOpen(false);
  };

  const handleCloseDeleteDepartmentModal = () => {
    setModalDeleteDepartment({ visible: false, removedValue: undefined });
  };

  const setStateAfterDelete = () => {
    setDepartmentOptions(state => {
      return state.filter(value => value.value !== modalDeleteDepartment.removedValue.value);
    });
    setSelectedDepartmentOptions(state => {
      return state.filter(value => value.value !== modalDeleteDepartment.removedValue.value);
    });
  };

  const handleDeleteDeparment = async () => {
    const departmentToDelete = modalDeleteDepartment.removedValue;
    if (departmentToDelete.id) {
      try {
        await dispatch(deleteDepartment(departmentToDelete.id, router.query.id));
        toast({
          type: "success",
          title: "Grupo de usuário removido",
          message: `O Grupo de usuário ${departmentToDelete.value} foi removido com sucesso.`,
        });

        setStateAfterDelete();
      } catch (err: any) {
        console.error(err?.message || err);
      }
    } else {
      setStateAfterDelete();
    }
    setModalDeleteDepartment({ visible: false, removedValue: undefined });
  };

  const handleChangeIcon = (e: ChangeEvent<HTMLInputElement>) => {
    const reader = new FileReader();
    reader.readAsDataURL(e.target.files[0]);
    reader.onload = e => {
      const base64 = e.target.result as string;
      setIconBase64(base64);
      setValue("logo", base64);
    };
  };

  const createDeparmentAsync = async (departmentName: string) => {
    try {
      const response = await dispatch(createDepartment({ title: departmentName }, router.query.id));
      toast({
        type: "success",
        title: "Grupo de usuário criado",
        message: `O grupo de usuários '${departmentName}' foi criado com sucesso.`,
      });
      return response;
    } catch (err) {
      console.error(err);
      toast({
        type: "error",
        title: "Ocorreu um erro",
        message: `Não foi possível criar o grupo de usuários. Tente novamente.`,
      });
      return null;
    }
  };

  const handleCreateDepartment = async (inputValue: string) => {
    const newOption = { label: inputValue, value: inputValue };
    setDepartmentOptions(prev => [...prev, newOption]);
    setSelectedDepartmentOptions(prev => [...prev, newOption]);
    await createDeparmentAsync(inputValue);
  };

  const onSubmit = async (data: any) => {
    const { name, document, logo } = data;

    const updateCustomerBody = {
      name,
      document,
      logo,
    };

    if (typeof logo !== "string") delete updateCustomerBody.logo;

    try {
      const response = await dispatch(updateCustomer(updateCustomerBody, router.query.id));
      if (response) {
        toast({
          type: "success",
          title: "Cliente atualizado",
          message: `O cliente ${name} foi atualizado com sucesso.`,
        });
        router.push("/settings/customers");
      }
    } catch (err: any) {
      console.error(err?.message || err);
      router.reload();
    }
  };

  useEffect(() => {
    if (router.query.id) {
      trigger(router.query.id);
      triggerGetDepartments(router.query.id);
      triggerGetReportsByCustomerId(router.query.id as string);
    }
  }, [router, trigger, triggerGetDepartments, triggerGetReportsByCustomerId]);

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

  useEffect(() => {
    if (!reportsDetail) return;
    const reports = reportsDetail.filter((report: any) => report.id);
    setReportDetails(reports);
  }, [reportsDetail]);

  useEffect(() => {
    if (!data) return;
    setValue("name", data?.name);
    setValue("document", data?.document);
    setValue("logo", data?.logo);
    setIconBase64(data?.logo);
  }, [data, setValue]);

  useEffect(() => {
    if (!dataDepartments || dataDepartments.rows.length < 1) return;
    const departments = dataDepartments.rows.map(
      (e: { title: string; id: string; isActive: boolean }) => {
        return {
          label: e.title,
          value: e.title,
          id: e.id,
          isActive: e.isActive,
        };
      },
    );
    setDepartmentOptions(departments);
    setSelectedDepartmentOptions(departments);
  }, [dataDepartments]);

  const handleSelectChange = (selectedOptions: any, { action, removedValue }: any) => {
    if (action == "remove-value" && Object.keys(removedValue).length > 0) {
      setModalDeleteDepartment({ visible: true, removedValue: removedValue });
    } else {
      setSelectedDepartmentOptions(selectedOptions);
    }
  };

  const MultiValueRemove = (props: PropsWithChildren<any>) => {
    return (
      <div
        className={`absolute pl-3 mt-2.5 cursor-pointer ${props.innerProps.className} `}
        onClick={props.innerProps.onClick}
      >
        <CloseSmall />
      </div>
    );
  };

  return (
    <section className="flex flex-col min-h-screen bg-neutral-100 w-full px-6 pt-10">
      <Head>
        <title>Editar Cliente</title>
      </Head>
      <div className="header-content h-[4.875rem] bg-gray-200 flex-shrink-0 bg-red">
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
              label: "Editar cliente",
              route: pathname,
              active: true,
            },
          ]}
        />

        <div className="flex justify-between items-center">
          <PageTitle>Editar cliente</PageTitle>
          <div className=" flex-end flex gap-2 w-50 h-9">
            <Button
              variant="secondary"
              size="medium"
              onClick={() => {
                router.push("/settings/customers");
              }}
            >
              Cancelar
            </Button>

            <Button
              variant="primary"
              size="medium"
              type="submit"
              form="CustomerUpdateForm"
              className="gap-2.5"
              isLoading={isLoadingCustomers}
            >
              <TickCircle /> Confirmar alterações
            </Button>
          </div>
        </div>
      </div>
      <div>
        <GeneralInfoSection
          iconComponent={
            <Company
              width="58"
              height="58"
              colors={["#232323", "#232323", "#D31C5B", "#232323", "#232323"]}
            />
          }
          title="Informações gerais"
          description="Preencha os dados básicos do cliente"
        />
        {isLoading ? (
          <div className="w-full relative flex justify-center items-center mt-20">
            <Loading color="fill-neutral-900" />
          </div>
        ) : (
          <>
            <form id="CustomerUpdateForm" onSubmit={handleSubmit(onSubmit)}>
              <div className="bg-neutral-0 p-6 shadow-card border-card bg-opacity-25 bg-black rounded-lg">
                <div className="flex gap-4">
                  <div className="w-80">
                    <p className="font-inter text-base font-medium leading-5 text-left text-gray-800">
                      Logotipo do cliente
                    </p>
                    <UploadBase64
                      className="hidden"
                      iconBase64={iconBase64}
                      image={handleChangeIcon}
                      type={"file"}
                      {...register("logo")}
                      setValue={setValue}
                    />
                  </div>

                  <div className="w-full flex flex-col gap-6">
                    <LabelFieldInput
                      ref={ref.current}
                      label="Nome do cliente"
                      id="name"
                      name="name"
                      type="text"
                      maxLength={50}
                      placeholder="Digite o nome do cliente"
                      setValue={setValue}
                      {...register("name", { required: true })}
                      error={Boolean(errors.name)}
                    />
                    <LabelFieldInput
                      ref={ref.current}
                      label="Número do CNPJ"
                      id="document"
                      name="document"
                      type="text"
                      placeholder="Informe o número do CNPJ do cliente"
                      setValue={setValue}
                      maxLength={18}
                      {...register("document", { required: true })}
                      error={Boolean(errors.document)}
                    />
                  </div>
                </div>
              </div>
            </form>
            <div>
              <GeneralInfoSection
                iconComponent={<Users colors={["#232323", "#232323", "#D31C5B", "#D31C5B"]} />}
                title="Grupo de usuários"
                description="Crie grupos para categorizar os usuários da empresa e atribua permissões específicas de visualização de relatórios para cada grupo."
              />
            </div>
            <div className="bg-neutral-0 p-6 shadow-card border-card bg-opacity-25 bg-black rounded-lg h-auto">
              <div className="mb-1">
                <label className="text-neutral-800 text-sm font-medium font-inter leading-tight">
                  Digite o nome do grupo e aperte enter para criá-lo.
                </label>
              </div>
              <CreatableSelect
                styles={{
                  control: (baseStyles, state) => ({
                    ...baseStyles,
                    borderColor: "grey",
                    minHeight: "46px",
                    borderRadius: "8px",
                    backgroundColor: "#fff",
                  }),
                  placeholder: base => ({
                    ...base,
                    backgroundColor: "#fff",
                  }),
                  input: base => ({
                    ...base,
                    fontSize: "1em",
                    color: "grey",
                    fontWeight: 400,
                    backgroundColor: "#fff",
                  }),
                  multiValueLabel: base => ({
                    ...base,
                    color: "#000000",
                    border: "1px solid grey",
                    borderRadius: "16px",
                    width: "99px",
                    height: "32px",
                    paddingTop: "4px",
                    paddingLeft: "30px",
                    fontSize: "14px",
                    fontWeight: "400",
                    fontFamily: "Inter, sans-serif",
                  }),
                  multiValue: base => ({
                    ...base,
                    backgroundColor: "#fff",
                  }),
                }}
                isMulti
                components={{
                  DropdownIndicator: () => null,
                  //ClearIndicator: () => null,
                  MultiValueRemove,
                }}
                placeholder={"Selecione as opções"}
                closeMenuOnSelect={false}
                options={departmentOptions}
                value={selectedDepartmentOptions}
                onChange={(value: any, action: any) => handleSelectChange(value, action)}
                onCreateOption={handleCreateDepartment}
                isLoading={isLoadingDepartments}
                backspaceRemovesValue={false}
              ></CreatableSelect>
              {modalDeleteDepartment.visible && (
                <ModalConfirm
                  title="Grupo de usuários"
                  content="Tem certeza que deseja remover esse Grupo de usuários? Essa ação não poderá ser revertida."
                  isLoading={isLoadingCustomers}
                  onClose={handleCloseDeleteDepartmentModal}
                  onConfirm={handleDeleteDeparment}
                ></ModalConfirm>
              )}
            </div>

            {isLoadingReportCustomer ? (
              <div className="w-full relative flex justify-center items-center mt-20">
                <Loading color="fill-neutral-900" />
              </div>
            ) : (
              <ReportConfig
                reportsDetail={reportDetails}
                onUpdateReportDetails={handleUpdateReportDetails}
                customerId={customerId}
              />
            )}

            <Button
              variant="secondary"
              size="x-small"
              onClick={handleOpenReportModal}
              className="gap-2.5 mt-2 mb-6 group"
              type="button"
            >
              <Add className="group-hover:stroke-neutral-400" /> Adicionar relatório
            </Button>
            {isReportModalOpen && (
              <AttachReportEdit
                onClose={handleCloseReportModal}
                onUpdateReportDetails={handleUpdateReportDetails}
                customerId={customerId}
              />
            )}
          </>
        )}
      </div>
    </section>
  );
};

CustomersUpdate.getLayout = function getLayout(page: any) {
  return <Layout>{page}</Layout>;
};

export default CustomersUpdate;

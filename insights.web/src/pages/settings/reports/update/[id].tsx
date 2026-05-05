import Add from "@src/assets/icons/Add";
import Filters from "@src/assets/icons/Filters";
import Reports from "@src/assets/icons/Reports";
import TickCircle from "@src/assets/icons/TickCircle";
import Trash from "@src/assets/icons/Trash";
import Upload from "@src/assets/icons/Upload";
import Breadcrumbs from "@src/components/common/Breadcrumbs";
import Button from "@src/components/common/Button";
import Input from "@src/components/common/Input";
import Label from "@src/components/common/Label";
import Layout from "@src/components/common/Layout";
import Loading from "@src/components/common/Loading";
import SectionTitle from "@src/components/common/SectionTitle";
import Textarea from "@src/components/common/Textarea";
import { NextPageWithLayout } from "@src/pages/_app";
import {
  updateReport,
  useLazyGetReportDetailsQuery,
  useLazyGetTargetFiltersQuery,
} from "@src/services/reports";
import { selectReportLoading, selectReportError } from "@src/store/slices/reports/selectors";
import { home } from "@src/utils/constants";
import { toast } from "@src/utils/toast";
import _ from "lodash";
import Head from "next/head";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useRouter } from "next/router";
import React, { ChangeEvent, useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { v4 as uuid } from "uuid";

import { useAppDispatch, useAppSelector } from "@src/store/hooks";

const ReportsUpdate: NextPageWithLayout = () => {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const loadingUpdate = useAppSelector(selectReportLoading);
  const hasErrorUpdate = useAppSelector(selectReportError);
  const [trigger, { isLoading, data }] = useLazyGetReportDetailsQuery();
  const [targetFiltersTrigger, { isLoading: targetFiltersLoading, data: targetFiltersData }] =
    useLazyGetTargetFiltersQuery();

  const {
    control,
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<any>({
    defaultValues: {
      title: data?.title,
      description: data?.description,
    },
  });

  const [iconBase64, setIconBase64] = useState("");

  const handleChangeIcon = (e: ChangeEvent<HTMLInputElement>) => {
    const reader = new FileReader();
    reader.readAsDataURL(e.target.files[0]);
    reader.onload = e => {
      const base64 = e.target.result as string;
      setIconBase64(base64);
      setValue("icon", base64);
    };
  };

  const { fields, append, remove } = useFieldArray({
    control,
    name: "filters",
  });

  useEffect(() => {
    if (!data) return;
    setValue("title", data?.title);
    setValue("description", data?.description);
    setValue("icon", data?.icon);
    setIconBase64(data?.icon);
    targetFiltersTrigger({ reportId: data?.id });
  }, [data, setValue, targetFiltersTrigger]);

  useEffect(() => {
    if (!targetFiltersData) return;
    const { rows } = targetFiltersData;
    setValue("filters", rows);
  }, [targetFiltersData, setValue]);

  useEffect(() => {
    if (router.query.id) trigger({ id: router.query.id });
  }, [router, trigger]);

  useEffect(() => {
    if (hasErrorUpdate) {
      toast({
        type: "error",
        title: "Erro ao salvar relatório",
        message:
          "Ocorreu um erro ao salvar as informações do relatório, tente novamente mais tarde.",
      });
    }
  }, [hasErrorUpdate, dispatch, router]);

  const onSubmit = async (report: any) => {
    try {
      await dispatch(updateReport({ ...report, id: data?.id }));
      toast({
        type: "success",
        title: "Relatório atualizado",
        message: `O relatório ${report.title} foi atualizado com sucesso.`,
      });
      router.push("/settings/reports");
    } catch (err: any) {
      console.error(err?.message || err);
    }
  };

  return (
    <section className={`flex min-h-screen w-full`}>
      <Head>
        <title>Editar relatório</title>
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
                label: "Relatório",
                route: "/settings/reports",
              },
              {
                label: "Editar",
                route: pathname,
                active: true,
              },
            ]}
          />
          <div className="justify-start items-start gap-5 w-full">
            <div className="flex flex-inline justify-between">
              <div className="text-stone-900 text-3xl font-bold leading-10">Editar relatório</div>
              <div className="flex-inline flex gap-2">
                <Button
                  variant="secondary"
                  size="medium"
                  onClick={() => {
                    router.push("/settings/reports");
                  }}
                >
                  Cancelar
                </Button>
                <div className="px-4 py-0">
                  <Button
                    variant="primary"
                    size="medium"
                    type="submit"
                    form="report-form"
                    disabled={isLoading}
                    className="gap-2"
                    isLoading={loadingUpdate}
                  >
                    <TickCircle className="bg-neutral-400 flex relative hover:bg-neutral-400 focus:bg-neutral-400 mx-5" />
                    Salvar
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="justify-start items-start gap-8 flex my-5 font-sans">
          <SectionTitle
            title="Configurar relatório"
            description="Configure as informações básicas do relatório e personalize a forma como ele será
            apresentado para os clientes."
            icon={<Reports colors={["#232323", "#232323", "#D31C5B", "#232323"]} />}
          />
        </div>
        {isLoading ||
          (targetFiltersLoading && (
            <div className="w-full relative flex justify-center items-center mt-20">
              <Loading color="fill-neutral-900" />
            </div>
          ))}
        {!isLoading && !targetFiltersLoading && (
          <form id="report-form" onSubmit={handleSubmit(onSubmit)}>
            <div className="h-96 p-6 my-5 bg-neutral-0 flex rounded-lg shadow  flex-col justify-start items-start font-sans">
              <div className="TwoColumns self-stretch grow justify-start items-start gap-4 inline-flex">
                <div className="Fields w-72 h-44 flex-col justify-start items-start inline-flex">
                  <div className="FileUploadBase self-stretch grow shrink basis-0  rounded-lg flex-col justify-start items-center gap-2 flex">
                    <div className="Label self-stretch text-neutral-900 text-sm font-medium font-sans leading-5">
                      Ícone do relatório
                    </div>
                    <div className="Content self-stretch grow shrink basis-0 px-6 py-4 bg-white rounded-lg border border-dashed border-neutral-400 flex-col justify-start items-center gap-1 flex">
                      <div className="LogoText self-stretch h-24 flex-col justify-start items-center gap-3 flex">
                        <div className="FeaturedIcon w-10 h-10 rounded-3xl  justify-center items-center inline-flex">
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
                        <div className="self-stretch h-10 flex-col justify-start items-center gap-1 flex">
                          <div className="self-stretch justify-center items-start gap-1 inline-flex">
                            <div className="justify-start items-start flex">
                              <div className="justify-center items-center gap-2 flex">
                                <div className="text-primary text-sm font-medium font-sans underline leading-5">
                                  <label htmlFor="file_icon_input" className="cursor-pointer">
                                    Clique aqui
                                  </label>
                                  <Input
                                    className="hidden"
                                    id="file_icon_input"
                                    type={"file"}
                                    {...register("icon")}
                                    onChange={handleChangeIcon}
                                  />
                                </div>
                              </div>
                            </div>
                            <div className="text-neutral-900 text-xs font-sans font-normal leading-5">
                              para enviar uma imagem.
                            </div>
                          </div>
                          <div className="self-stretch text-center text-neutral-300 text-xs font-sans leading-[1.125rem]">
                            SVG, PNG, JPG or GIF (max. 800x400px)
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="grow w-full shrink basis-0 flex-col justify-start items-start gap-6 inline-flex">
                  <div className="self-stretch h-20 flex-col justify-start items-start gap-1 flex">
                    <Label>Nome do relatório*</Label>
                    <Input
                      error={Boolean(errors.title)}
                      id="title"
                      name="title"
                      type="text"
                      placeholder="Dê o nome para o relatório. Este nome será apresentado para os clientes"
                      {...register("title", { required: true })}
                    />
                  </div>
                  <div className="self-stretch h-20 flex-col justify-start items-start gap-1 flex">
                    <Label> ID do relatório </Label>
                    <Input readOnly disabled={true} value={data?.id} />
                  </div>
                </div>
              </div>
              <div className="Input self-stretch h-40 flex-col justify-start items-start gap-1 flex mt-5 mb-5">
                <Label> Descrição* </Label>
                <Textarea
                  rows={3}
                  error={Boolean(errors.description)}
                  placeholder="Acrescente uma breve descrição sobre o relatório"
                  {...register("description", { required: true })}
                />
              </div>
            </div>
            <SectionTitle
              title="Filtros"
              description="Defina quais filtros poderão ser utilizados para este relatório."
              icon={<Filters />}
            />

            <div className="p-6 my-5 bg-neutral-0 flex rounded-lg shadow flex-col gap-4">
              {fields.map((item, index) => (
                <div key={item.id} className="flex w-full gap-4 items-end">
                  <div className="w-full">
                    <Label> Nome da tabela* </Label>
                    <Input
                      error={Boolean(_.get(errors, `filters.${index}.table`))}
                      id={`filters.${index}.table`}
                      name={`filters.${index}.table`}
                      type="text"
                      placeholder="Informe o nome da tabela (igual ao Power BI)"
                      {...register(`filters.${index}.table`, { required: true })}
                    />
                  </div>
                  <div className="w-full">
                    <Label> Nome da coluna que será filtrada* </Label>
                    <Input
                      error={Boolean(_.get(errors, `filters.${index}.column`))}
                      id={`filters.${index}.column`}
                      name={`filters.${index}.column`}
                      type="text"
                      placeholder="Digite o nome da coluna (igual ao Power BI)"
                      {...register(`filters.${index}.column`, { required: true })}
                    />
                  </div>
                  <div className="w-full">
                    <Label> Nome de Exibição </Label>
                    <Input
                      error={Boolean(_.get(errors, `filters.${index}.displayName`))}
                      id={`filters.${index}.displayName`}
                      name={`filters.${index}.displayName`}
                      type="text"
                      placeholder="Digite um nome amigável para ser usado neste filtro."
                      {...register(`filters.${index}.displayName`, { required: false })}
                    />
                  </div>
                  <div>
                    <Button
                      variant="secondary"
                      size="medium"
                      className="group"
                      onClick={() => remove(index)}
                    >
                      <Trash
                        width={20}
                        height={20}
                        className="group-hover:fill-neutral-400 group-hover:stroke-neutral-400"
                      />
                    </Button>
                  </div>
                </div>
              ))}
              <div>
                <Button
                  variant="secondary"
                  size="x-small"
                  type="button"
                  className="group gap-1"
                  onClick={() => append({ id: uuid(), column: "", table: "", displayName: "" })}
                >
                  <Add className="group-hover:stroke-neutral-400" /> Adicionar filtro
                </Button>
              </div>
            </div>
          </form>
        )}
      </div>
    </section>
  );
};

ReportsUpdate.getLayout = function getLayout(page: any) {
  return <Layout>{page}</Layout>;
};

export default ReportsUpdate;

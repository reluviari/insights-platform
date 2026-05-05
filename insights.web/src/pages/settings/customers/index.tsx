import Square from "@src/assets/icons/Square";
import Breadcrumbs from "@src/components/common/Breadcrumbs";
import Button from "@src/components/common/Button";
import Card from "@src/components/common/Card";
import ConfirmModal from "@src/components/common/ConfirmModal";
import InputSearch from "@src/components/common/InputSearch";
import Layout from "@src/components/common/Layout";
import Loading from "@src/components/common/Loading";
import PageTitle from "@src/components/common/PageTitle";
import ConfirmModalSelectUsers from "@src/components/customers/ConfirmModalSelectUsers";
import { NextPageWithLayout } from "@src/pages/_app";
import { updateStatusCustomer, useLazyGetCustomersQuery } from "@src/services/customers";
import { UpdateStatusCustomer } from "@src/shared/interfaces/update-status-customer.interface";
import { selectCustomerLoading } from "@src/store/slices/customers/selectors";
import { home } from "@src/utils/constants";
import { toast } from "@src/utils/toast";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

import { useAppDispatch, useAppSelector } from "@src/store/hooks";

const Customers: NextPageWithLayout = () => {
  const dispatch = useAppDispatch();
  const [page, setPage] = useState(0);
  const [triggerGetCustomers, { data }] = useLazyGetCustomersQuery({});
  const isLoading = useAppSelector(selectCustomerLoading);
  const [filter, setFilter] = useState("");
  const [dataCustomers, setDataCustomers] = useState(data);
  const router = useRouter();
  const pageTitle = `${process.env.NEXT_PUBLIC_PLATAFORM_NAME} | Clientes`;

  const [selectedCustomer, setSelectedCustomer] = useState<{
    id: string;
    name: string;
    isActive: boolean;
  } | null>(null);

  const handleToggleCustomer = (id: string, name: string, isActive: boolean) => {
    setSelectedCustomer({ id, name, isActive });
  };

  const handleCloseToggleCustomer = () => {
    setSelectedCustomer(null);
  };

  const handleSuccess = (message: string) => {
    toast({
      title: `Cliente ${selectedCustomer.isActive ? "bloqueado com sucesso" : "desbloqueado"}`,
      message: message,
      type: "success",
    });

    triggerGetCustomers({ page, pageSize: 50 });
  };

  const handleError = (message: string) => {
    toast({
      title: "Ocorreu um erro",
      message: message,
      type: "error",
    });
  };

  const handleConfirm = (users?: string[]) => {
    if (selectedCustomer) {
      toggleCustomerStatus(selectedCustomer.id, selectedCustomer.isActive, users);
    }
  };

  const toggleCustomerStatus = async (id: string, isActive: boolean, users?: string[]) => {
    try {
      const customer = dataCustomers.rows.find((customer: any) => customer.id === id);
      if (!customer) throw new Error("Cliente não encontrado");

      const customerStatus: UpdateStatusCustomer = {
        customer: {
          isActive: !isActive,
        },
        users: !!users ? users : [],
      };

      await dispatch(updateStatusCustomer(customerStatus, id));

      handleSuccess(
        `${
          isActive
            ? "O cliente agora está marcado como 'Inativo'."
            : "O cliente selecionado foi desbloqueado com sucesso."
        }`,
      );
    } catch (err) {
      handleError(`Erro ao ${isActive ? "desativar" : "ativar"} o cliente.`);
    } finally {
      handleCloseToggleCustomer();
    }
  };

  useEffect(() => {
    triggerGetCustomers({ page, pageSize: 50 });
  }, [triggerGetCustomers]);

  useEffect(() => {
    if (!!data && filter == "") {
      const copyData = data;
      setDataCustomers(copyData);
    }
  }, [data]);

  const searchEnter = () => {
    if (filter == "") {
      const copyData = data;
      setDataCustomers(copyData);
      return;
    }
    const rowsFilter = data.rows.filter(
      (row: { name: string; departments: any }) =>
        row.name.toLowerCase().includes(filter.toLowerCase()) ||
        row.departments.some((department: { title: string }) =>
          department.title.toLowerCase().includes(filter.toLowerCase()),
        ),
    );

    const copyData = {
      rows: rowsFilter,
    };
    setDataCustomers(copyData);
  };

  return (
    <section className="flex min-h-screen w-full">
      <Head>
        <title>{pageTitle}</title>
      </Head>
      <div className="w-full bg-body px-10 pt-12">
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
              label: "Clientes",
              route: "/settings/customers",
              active: true,
            },
          ]}
        />
        <div className="flex justify-baseline items-baseline gap-5 justify-between h-20">
          <div className="text-stone-900 text-3xl font-bold leading-10">
            <PageTitle>Administrar clientes</PageTitle>
          </div>
          <div className="flex-end flex gap-3 h-11">
            {data && (
              <InputSearch
                id="search"
                name="search"
                type="text"
                placeholder="Pesquise por nome do cliente ou grupo"
                value={filter}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFilter(e.target.value)}
                onKeyPress={(e: React.KeyboardEvent<HTMLInputElement>) => {
                  if (e.key === "Enter") {
                    searchEnter();
                  }
                }}
              />
            )}
            <div className="border border-neutral-700"></div>
            <Button
              className="gap-2"
              variant="primary"
              size="medium"
              onClick={() => {
                router.push("/settings/customers/create");
              }}
            >
              <Square /> Novo cliente
            </Button>
          </div>
        </div>
        {isLoading && (
          <div className="w-full relative flex justify-center items-center mt-20">
            <Loading color="fill-neutral-900" />
          </div>
        )}
        <div>
          {!isLoading &&
            (!!dataCustomers && !!dataCustomers.rows && dataCustomers.rows.length > 0 ? (
              <div className="justify-start items-start gap-8 grid grid-cols-3 mt-4">
                {[...dataCustomers.rows]
                  .slice()
                  .sort((a: any, b: any) => (a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1))
                  .map((customer: any) => (
                    <Card
                      id={customer.id}
                      key={customer.id}
                      title={customer.name}
                      icon={customer.logo}
                      listIcons={customer.users.rows}
                      listCount={customer.users.count}
                      reports={customer.reports.rows}
                      reportsCount={customer.reports.count}
                      menuAction={true}
                      isActive={customer.isActive}
                      labelMenuAction="Editar Cliente"
                      urlRedirectMenuAction="/settings/customers/update/[id]"
                      menuItems={[
                        {
                          icon: <Image src="/edit.svg" alt="Edit" width={20} height={20} />,
                          label: "Editar Cliente",
                          onClick: () => router.push(`/settings/customers/update/${customer.id}`),
                        },
                        {
                          icon: customer.isActive ? (
                            <Image src="/block.svg" alt="Block" width={20} height={20} />
                          ) : (
                            <Image
                              src="/check_circle.svg"
                              alt="CheckCircle"
                              width={20}
                              height={20}
                            />
                          ),
                          label: customer.isActive ? "Bloquear Cliente" : "Desbloquear Cliente",
                          onClick: () =>
                            handleToggleCustomer(customer.id, customer.name, customer.isActive),
                        },
                      ]}
                      justifyClass="justify-center"
                    />
                  ))}
              </div>
            ) : (
              <div className="flex justify-center items-center mt-20">
                <p>Nenhum cliente encontrado. Verifique a pesquisa e tente novamente.</p>
              </div>
            ))}
        </div>
      </div>
      {selectedCustomer && selectedCustomer.isActive && (
        <ConfirmModal
          isOpen={!!selectedCustomer}
          onClose={handleCloseToggleCustomer}
          onConfirm={handleConfirm}
          title="Deseja bloquear o cliente?"
          description="Isso impedirá o cliente de acessar a plataforma."
          confirmText="Sim, bloquear"
          cancelText="Cancelar"
          isLoading={isLoading}
        ></ConfirmModal>
      )}
      {selectedCustomer && !selectedCustomer.isActive && (
        <ConfirmModalSelectUsers
          isOpen={!!selectedCustomer}
          onClose={handleCloseToggleCustomer}
          onConfirm={handleConfirm}
          title="Desbloquear cliente e usuários associados?"
          description={`O cliente ${selectedCustomer.name} possui os seguintes usuários associados. Selecione os usuários que deseja desbloquear junto com o cliente.`}
          confirmText="Desbloquear"
          cancelText="Cancelar"
          customerId={selectedCustomer.id}
        />
      )}
    </section>
  );
};

Customers.getLayout = function getLayout(page: any) {
  return <Layout>{page}</Layout>;
};

export default Customers;

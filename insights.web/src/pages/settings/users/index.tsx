/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @next/next/no-img-element */
import Company from "@src/assets/icons/Company";
import Edit from "@src/assets/icons/Edit";
import Square from "@src/assets/icons/Square";
import Breadcrumbs from "@src/components/common/Breadcrumbs";
import Button from "@src/components/common/Button";
import Chip from "@src/components/common/Chip";
import ConfirmModal from "@src/components/common/ConfirmModal";
import Dropdown from "@src/components/common/Dropdown";
import FloatingStatus from "@src/components/common/FloatingStatus";
import InputSearch from "@src/components/common/InputSearch";
import Layout from "@src/components/common/Layout";
import Loading from "@src/components/common/Loading";
import PageTitle from "@src/components/common/PageTitle";
import SearchFilter from "@src/components/common/SearchFilter";
import SubMenu from "@src/components/common/Submenu";
import Table from "@src/components/common/Table";
import ChangePassword from "@src/components/messages/change-password";
import SendWelcome from "@src/components/messages/send-welcome";
import Modal from "@src/components/modal";
import UserInfo from "@src/components/users/UserInfo";
import UserStatus from "@src/components/users/UserStatus";
import { NextPageWithLayout } from "@src/pages/_app";
import { useLazyGetUsersSearchQuery, updateUser, deleteUser } from "@src/services/users";
import { FilterUserSearch } from "@src/shared/interfaces/FilterUserSearch";
import { home } from "@src/utils/constants";
import { toast } from "@src/utils/toast";
import classNames from "classnames";
import Head from "next/head";
import Image from "next/image";
import router from "next/router";
import React, { useEffect, useState } from "react";

import { useAppDispatch } from "@src/store/hooks"; // Importando o hook useAppDispatch

interface DropdownProps {
  isActive: boolean;
  fieldName: string;
}

const Users: NextPageWithLayout = () => {
  const dispatch = useAppDispatch();
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [selectedUserEmail, setSelectedUserEmail] = useState("");
  const [selectedUser, setSelectedUser] = useState<{ id: string; isActive: boolean } | null>(null);
  const [selectedUserName, setSelectedUserName] = useState("");
  const [dataSearch, setDataSearch] = useState<FilterUserSearch>();
  const [filter, setFilter] = useState("");
  const [dataTable, setDataTable] = useState<any>();
  const [
    triggerSearch,
    { error: errorDataSearch, data: userDataSearch, isFetching: isLoadingSearch },
  ] = useLazyGetUsersSearchQuery();

  const [isActiveState, setIsActiveState] = useState<DropdownProps[]>([
    { isActive: false, fieldName: "name" },
    { isActive: false, fieldName: "createdAt" },
    { isActive: false, fieldName: "isActive" },
    { isActive: false, fieldName: "createdTokenAt" },
  ]);
  const [orderBy, setOrderBy] = useState<string[]>([]);

  const showModal = (id: string, email: string) => {
    setSelectedUserId(id);
    setSelectedUserEmail(email);
    setShowChangePasswordModal(true);
  };

  const showWelModal = (email: string) => {
    setSelectedUserEmail(email);
    setShowWelcomeModal(true);
  };

  const closeModal = () => {
    setSelectedUserId("");
    setSelectedUserEmail("");
    setShowChangePasswordModal(false);
    setShowWelcomeModal(false);
    setSelectedUser(null);
    setSelectedUserName("");
  };

  useEffect(() => {
    if (filter == "") {
      triggerSearch({ search: "" });
    }
  }, [triggerSearch]);

  useEffect(() => {
    if (!!errorDataSearch) {
      toast({
        type: "error",
        title: "Erro ao pesquisar",
        message: "Ocorreu um erro ao tentar realizar a pesquisa. Por favor tente novamente.",
      });
    }
  }, [errorDataSearch]);

  useEffect(() => {
    if (!!userDataSearch) {
      const copyData = userDataSearch;
      setDataTable(copyData);
    }
  }, [userDataSearch]);

  const searchEnter = () => {
    if (filter == "") {
      const copyData = userDataSearch;
      setDataTable(copyData);
    }
    refetchUsers();
  };

  useEffect(() => {
    if (!!dataSearch) {
      if (filter != "") {
        dataSearch.search = filter;
      }
      triggerSearch(cleanDataSearch());
    }
  }, [dataSearch]);

  const handleDataSearch = (value: React.SetStateAction<FilterUserSearch>) => {
    setDataSearch({
      ...value,
      orderBy,
    });
  };

  const handleOrderChange = (field: string, order: string, key: string) => {
    const newOrderBy = [`${field}:${order}`];

    setOrderBy(newOrderBy);
    setDataSearch(prevData => ({
      ...prevData,
      orderBy: newOrderBy,
    }));
    setIsActiveState(prevState =>
      prevState.map(item =>
        item.fieldName === key ? { ...item, isActive: true } : { ...item, isActive: false },
      ),
    );
  };

  const handleToggleUser = (id: string, isActive: boolean) => {
    setSelectedUser({ id, isActive });
  };

  const pageTitle = `${process.env.NEXT_PUBLIC_PLATAFORM_NAME} | Usuários`;

  const handleBlockUser = async () => {
    const user = {
      isActive: false,
    };

    if (selectedUser) {
      dispatch(updateUser(user, selectedUser.id))
        .then(response => {
          if (response) {
            handleSuccess(
              "Usuário bloqueado com sucesso",
              "O usuário agora está marcado como ‘Inativo’ e não tem permissão para acessar a plataforma.",
            );
          }
        })
        .finally(() => {
          closeModal();
        });
    }
  };

  const handleUnblockUser = async () => {
    const user = {
      isActive: true,
    };

    if (selectedUser) {
      dispatch(updateUser(user, selectedUser.id))
        .then(response => {
          if (response) {
            handleSuccess(
              "Usuário desbloqueado com sucesso",
              "O usuário agora está marcado como ‘Ativo’ e tem permissão para acessar a plataforma.",
            );
          }
        })
        .finally(() => {
          closeModal();
        });
    }
  };

  const handleDeleteUser = async () => {
    if (selectedUser) {
      try {
        if (!selectedUser.id || !selectedUserName) {
          throw new Error("Usuário não encontrado.");
        }

        const result = await deleteUser(selectedUser.id)(dispatch);
        if (result) {
          handleSuccess(
            "Usuário excluído",
            `O usuário ${selectedUserName} e todos os dados associados foram excluídos com sucesso.`,
          );
        } else {
          throw new Error("Erro ao excluir o usuário.");
        }
      } catch (error) {
        handleError("Ocorreu um erro! Tente novamente mais tarde.");
        router.push("/settings/users");
      } finally {
        closeModal();
      }
    }
  };

  const handleSuccess = (title: string, message: string) => {
    toast({
      title,
      message,
      type: "success",
    });
    refetchUsers();
  };

  const handleError = (message: string) => {
    toast({
      title: "Ocorreu um erro",
      message: message,
      type: "error",
    });
  };

  function cleanDataSearch(): object {
    const clean = dataSearch ? { ...dataSearch } : {};

    return Object.fromEntries(Object.entries(clean).filter(([_, value]) => value != null));
  }

  const refetchUsers = () => {
    const searchFilter = filter || "";
    triggerSearch({
      ...cleanDataSearch(),
      search: searchFilter,
    });
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
              label: "Usuários",
              route: "/settings/users",
              active: true,
            },
          ]}
        />
        <div className="flex justify-baseline items-center gap-15 justify-between h-20">
          <PageTitle>Administrar usuários</PageTitle>
          <div className="flex-end flex gap-3 w-100 h-15">
            {userDataSearch && (
              <InputSearch
                id="search"
                name="search"
                type="text"
                placeholder="Pesquise por nome ou e-mail"
                value={filter}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFilter(e.target.value)}
                onKeyPress={(e: React.KeyboardEvent<HTMLInputElement>) => {
                  if (e.key === "Enter") {
                    searchEnter();
                  }
                }}
              />
            )}

            {userDataSearch && <SearchFilter dataSearch={handleDataSearch} />}

            <div className="border border-neutral-700"></div>
            <Button
              variant="primary"
              size="medium"
              onClick={() => {
                router.push("/settings/users/create");
              }}
            >
              <Square /> Novo usuário
            </Button>
          </div>
        </div>
        {isLoadingSearch && (
          <div className="w-full relative flex justify-center items-center mt-20">
            <Loading color="fill-neutral-900" />
          </div>
        )}
        <div className="mt-4">
          {!isLoadingSearch &&
            (dataTable?.rows?.length > 0 ? (
              <Table
                hasMore={dataTable?.hasMore}
                loadMore={() => {}}
                columns={[
                  {
                    key: "name",
                    label: (
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        Nome{" "}
                        <SubMenu
                          fieldName="name"
                          handleOrder={handleOrderChange}
                          isActiveState={isActiveState}
                        />
                      </div>
                    ),
                    render: (value, row) => (
                      <UserInfo name={value} email={row.email} avatar={row.avatar} />
                    ),
                  },
                  {
                    key: "phone",
                    label: "Telefone",
                  },
                  {
                    key: "customer.logo",
                    label: "Cliente",
                    render: (value, row) => (
                      <div className="flex justify-center relative border rounded-md border-neutral-200 w-12 h-12">
                        <FloatingStatus active={row?.customer?.isActive} />
                        {value ? (
                          <img
                            className="h-12 w-12"
                            src={value}
                            alt={row.name}
                            title={row?.customer?.name}
                          />
                        ) : (
                          <Company width={48} height={48} title={row?.customer?.name} />
                        )}
                      </div>
                    ),
                  },
                  {
                    key: "departments",
                    label: "Grupo",
                    render: (value, row) => {
                      return (
                        <div className="flex gap-2 flex-wrap justify-center">
                          {value?.map((dp: any) => (
                            <Chip key={dp.id}>{dp.title}</Chip>
                          ))}
                        </div>
                      );
                    },
                  },
                  {
                    key: "createdAt",
                    label: (
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "flex-start",
                          alignItems: "center",
                        }}
                      >
                        Data de Cadastro{" "}
                        <SubMenu
                          fieldName="createdAt"
                          handleOrder={handleOrderChange}
                          isActiveState={isActiveState}
                        />
                      </div>
                    ),
                    render: (value, row) => (
                      <div className="flex justify-start">{!value ? "-" : value}</div>
                    ),
                  },
                  {
                    key: "isActive",
                    label: (
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "flex-start",
                          alignItems: "center",
                        }}
                      >
                        Status{" "}
                        <SubMenu
                          fieldName="isActive"
                          handleOrder={handleOrderChange}
                          isActiveState={isActiveState}
                        />
                      </div>
                    ),
                    render: (value, row) => {
                      return (
                        <div className="flex justify-start">
                          <UserStatus active={value} />
                        </div>
                      );
                    },
                  },
                  {
                    key: "lastLogin",
                    label: (
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "flex-start",
                          alignItems: "center",
                        }}
                      >
                        Último acesso{" "}
                        <SubMenu
                          fieldName="createdTokenAt"
                          handleOrder={handleOrderChange}
                          isActiveState={isActiveState}
                        />
                      </div>
                    ),
                    render: (value, row) => (
                      <div className="flex justify-start">{!value ? "-" : value}</div>
                    ),
                  },
                  {
                    key: "actions",
                    label: "Ações",
                    render: (value, row) => (
                      <div className="flex justify-center text-left">
                        <Dropdown
                          items={[
                            {
                              icon: <Edit />,
                              label: "Editar usuário",
                              onClick: () => {
                                router.push(`/settings/users/update/${row.id}/${row.customer.id}`);
                              },
                            },
                            {
                              icon: row.isActive ? (
                                <Image src="/block.svg" alt="Block" width={20} height={20} />
                              ) : (
                                <Image
                                  src="/check_circle.svg"
                                  alt="CheckCircle"
                                  width={20}
                                  height={20}
                                />
                              ),
                              label: row.isActive ? "Bloquear Usuário" : "Desbloquear Usuário",
                              onClick: () => handleToggleUser(row.id, row.isActive),
                            },
                            {
                              icon: (
                                <Image
                                  src="/lock.svg"
                                  alt="Lock"
                                  width={16}
                                  height={21}
                                  className={classNames({
                                    "image-invert": !row.isActive,
                                  })}
                                />
                              ),
                              label: "Alterar Senha",
                              onClick: () => {
                                if (row.isActive) {
                                  showModal(row.id, row.email);
                                }
                              },
                              disabled: !row.isActive,
                              disabledMessage:
                                "Não é possível alterar a senha de um usuário inativo. \nPor favor, ative o usuário primeiro para realizar esta ação.",
                            },
                            {
                              icon: (
                                <Image
                                  src="/EnvelopeSimple.svg"
                                  alt="E-mail"
                                  width={24}
                                  height={21}
                                  className={classNames({
                                    "image-invert": !row.isActive,
                                  })}
                                />
                              ),
                              label: "Enviar e-mail inicial",
                              onClick: () => {
                                if (row.isActive) {
                                  showWelModal(row.email);
                                }
                              },
                              disabled: !row.isActive,
                              disabledMessage:
                                "Não é possível enviar e-mail inicial para um usuário inativo. \nPor favor, ative o usuário primeiro para realizar esta ação.",
                            },
                            {
                              icon: <Image src="/delete.svg" alt="Delete" width={16} height={18} />,
                              label: "Excluir usuário",
                              onClick: () => {
                                setSelectedUserId(row.id);
                                setSelectedUserName(row.name);
                                setSelectedUser({ id: row.id, isActive: row.isActive });
                              },
                            },
                          ]}
                        />
                      </div>
                    ),
                  },
                ]}
                data={dataTable?.rows || []}
              />
            ) : (
              <div className="flex justify-center items-center mt-20">
                <p>
                  Nenhum usuário encontrado. Verifique os filtros aplicados ou a pesquisa e tente
                  novamente.
                </p>
              </div>
            ))}
        </div>
        {showChangePasswordModal && (
          <Modal isCloseIcon={false} width="w-[400px]" height="h-[588px]">
            <ChangePassword
              onClose={closeModal}
              userId={selectedUserId}
              email={selectedUserEmail}
            />
          </Modal>
        )}
        {showWelcomeModal && (
          <Modal isCloseIcon={false} width="w-[400px]" height="h-[588px]">
            <SendWelcome onClose={closeModal} email={selectedUserEmail} />
          </Modal>
        )}
        {selectedUser && (
          <>
            {selectedUser.isActive ? (
              <ConfirmModal
                isOpen={!!selectedUser}
                onClose={closeModal}
                onConfirm={handleBlockUser}
                title="Deseja bloquear este usuário?"
                description="Isso impedirá o usuário de acessar a plataforma."
                confirmText="Sim, bloquear"
                cancelText="Cancelar"
              />
            ) : (
              <ConfirmModal
                isOpen={!!selectedUser}
                onClose={closeModal}
                onConfirm={handleUnblockUser}
                title="Deseja desbloquear este usuário?"
                description="Isso permitirá que o usuário acesse a plataforma novamente."
                confirmText="Sim, desbloquear"
                cancelText="Cancelar"
              />
            )}
          </>
        )}
        {selectedUserId && selectedUserName && (
          <ConfirmModal
            isOpen={!!selectedUserId}
            onClose={closeModal}
            onConfirm={handleDeleteUser}
            title="Confirmação de exclusão do usuário"
            description={
              <>
                Você está prestes a excluir o usuário{" "}
                <span className="font-bold text-[#475467]">{selectedUserName}</span>. Esta ação é
                irreversível e todos os dados associados, serão permanentemente removidos. Tem
                certeza de que deseja continuar?
              </>
            }
            confirmText="Sim, excluir"
            cancelText="Cancelar"
          />
        )}
      </div>
    </section>
  );
};

Users.getLayout = function getLayout(page: any) {
  return <Layout>{page}</Layout>;
};

export default Users;

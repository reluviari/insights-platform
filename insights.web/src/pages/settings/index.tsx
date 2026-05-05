import Buket from "@src/assets/icons/Buket";
import Company from "@src/assets/icons/Company";
import Reports from "@src/assets/icons/Reports";
import Users from "@src/assets/icons/Users";
import Breadcrumbs from "@src/components/common/Breadcrumbs";
import Card from "@src/components/common/Card";
import Layout from "@src/components/common/Layout";
import Loading from "@src/components/common/Loading";
import PageTitle from "@src/components/common/PageTitle";
import { useGetSettingsQuery } from "@src/services/settings";
import { home } from "@src/utils/constants";
import Head from "next/head";
import React, { useEffect } from "react";

import { NextPageWithLayout } from "../_app";

const SettingsPage: NextPageWithLayout = () => {
  const { isLoading, data } = useGetSettingsQuery({});
  const pageTitle = `${process.env.NEXT_PUBLIC_PLATAFORM_NAME} | Configurações`;

  const itens = [
    {
      iternIcon: <Company />,
      index: "customer",
      title: "Administrar clientes",
      description: "Consulte, edite e cadastre novos  os clientes que possuem acesso a plataforma",
      listIcons: data?.customer?.customers,
      listCount: data?.customer?.count,
      cardWidth: "w-auto",
      route: "/settings/customers",
    },
    {
      iternIcon: <Users />,
      title: "Administrar usuários",
      description:
        "Gerencie todos os usuários e configure o nível de acesso a cada dashboard disponível.",
      listIcons: data?.user?.users,
      listCount: data?.user?.count,
      cardWidth: "w-auto",
      route: "/settings/users",
    },
    {
      iternIcon: <Reports />,
      title: "Relatórios",
      description:
        "Consulte os dashboards disponíveis na plataforma e personalize sua exibição com um ícone e uma miniatura.",
      listCount: data?.report?.count,
      cardWidth: "w-auto",
      route: "/settings/reports",
      isReportCount: true,
    },
    {
      iternIcon: <Buket />,
      title: "Temas de Navegação",
      description: "Fitness Fanatic, Design Enthusiast, Mentor, Meetup Organizer & PHP Lover.",
      listCount: 0,
      cardWidth: "w-auto",
    },
  ];

  return (
    <section className={`flex min-h-screen w-full`}>
      <Head>
        <title>{pageTitle}</title>
      </Head>
      <div className="w-full bg-body px-10 py-8 overflow-hidden">
        <Breadcrumbs
          links={[
            {
              label: "Home",
              route: home,
            },
            {
              label: "Configurações",
              route: "/settings",
              active: true,
            },
          ]}
        />
        <PageTitle>Configurações</PageTitle>
        {isLoading ? (
          <div className="w-full relative flex justify-center items-center mt-20">
            <Loading color="fill-neutral-900" />
          </div>
        ) : (
          <div className="justify-start items-start gap-8 grid grid-cols-3 my-8">
            <Card {...itens[0]}></Card>
            <Card {...itens[1]}></Card>
            <Card {...itens[2]}></Card>
            {/* <Card {...itens[3]}></Card> */}
          </div>
        )}
      </div>
    </section>
  );
};

SettingsPage.getLayout = function getLayout(page: any) {
  return <Layout>{page}</Layout>;
};

export default SettingsPage;

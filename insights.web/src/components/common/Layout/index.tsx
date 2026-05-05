import MessageTokenExpired from "@src/components/messages/token-expired";
import Modal from "@src/components/modal";
import { useGetUserReportsQuery } from "@src/services/reports";
import { loginActions } from "@src/store/slices/login";
import {
  selectAuthExpireError,
  selectAuthRedirectToLogin,
  selectAuthUser,
} from "@src/store/slices/login/selectors";
import { User } from "@src/store/slices/login/types";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useEffect } from "react";
import React from "react";
import TagManager from "react-gtm-module";

import useTokenExpirationCheck from "@src/hooks/useTokenExpiration";
import { useAppDispatch, useAppSelector } from "@src/store/hooks";
const Menu = dynamic(() => import("../Menu"), { ssr: false });

export default function Layout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { data } = useGetUserReportsQuery({});
  const { reports, externalWorkspaceId } = data || { reports: [] };
  const error = useAppSelector(selectAuthExpireError);
  const isExpired = useTokenExpirationCheck();
  const redirectToLogin = useAppSelector(selectAuthRedirectToLogin);
  const user: User = useAppSelector(selectAuthUser);
  const customerName = user?.customerName;
  const departmentName = user?.departmentName;
  const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID;

  useEffect(() => {
    if (redirectToLogin) router.push("/login");

    return () => {
      dispatch(loginActions.controlView({ redirectToLogin: false }));
    };
  }, [dispatch, redirectToLogin, router]);

  useEffect(() => {
    const { slugs } = router.query;
    if (router.asPath !== "/" && !slugs) return;

    const [workspaceId, reportId] = Array.isArray(slugs) ? slugs : [];

    const [report] = reports || [];

    if (!workspaceId && !reportId) {
      if (!report) return;
      const { externalId } = report;
      router.push(`/${externalWorkspaceId}/${externalId}`);
    }
  }, [router, router.query, reports, externalWorkspaceId]);

  useEffect(() => {
    if (GTM_ID && customerName && departmentName) {
      TagManager.initialize({
        gtmId: GTM_ID,
        dataLayer: {
          customerName,
          departmentName,
        },
      });
    }
  }, [user]);

  return (
    <section className={`flex bg-neutral-100 min-h-screen`}>
      <Menu reports={reports} workspaceId={externalWorkspaceId} />
      <div className="flex justify-center items-center w-full overflow-full ml-[88px]">
        {React.cloneElement(children as React.ReactElement<any>, { reports })}
      </div>
      {error || isExpired ? (
        <Modal isCloseIcon={false} width="w-[400px]" height="h-[588px]">
          <MessageTokenExpired isExpired={isExpired} />
        </Modal>
      ) : null}
    </section>
  );
}

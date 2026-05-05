import { AppDispatch, RootState } from "@src/store";
import { loginActions } from "@src/store/slices/login";
import { User } from "@src/store/slices/login/types";
import { toast } from "@src/utils/toast";
import jwtDecode from "jwt-decode";
import { api } from "./api";

interface ILoginData {
  email: string;
  password: string;
  rememberMe: boolean;
}

export const login =
  (body: ILoginData) => async (dispatch: AppDispatch, getState: () => RootState) => {
    try {
      dispatch(loginActions.controlView({ isLoading: true, hasError: false }));

      const { data, status } = await api.post("/auth/sign-in", body);

      if (status !== 200) {
        throw new Error("Erro ao realizar login");
      }

      const user = jwtDecode<User>(data.accessToken);
      const decodedToken: any = jwtDecode(data.accessToken);

      dispatch(
        loginActions.controlData({
          token: data.accessToken,
          user: {
            name: user.name,
            email: user.email,
            roles: user.roles,
            tenant: user.tenant,
            customer: user.customer,
            customerName: user.customerName,
            department: user.department,
            departmentName: user.departmentName,
          },
          expire: decodedToken.exp * 1000,
        }),
      );
      dispatch(loginActions.controlView({ isLoading: false, hasError: false }));
    } catch (err: any) {
      if (err.response && err.response.data.message === "exception:INACTIVE_USER") {
        dispatch(loginActions.controlView({ isLoading: false, hasError: false }));
        throw new Error("Conta temporariamente bloqueada");
      } else {
        dispatch(loginActions.controlView({ isLoading: false, hasError: true }));
      }
      throw err;
    }
  };

export const logout = () => async (dispatch: AppDispatch) => {
  try {
    dispatch(
      loginActions.controlData({
        token: null,
        user: null,
      }),
    );
    dispatch(loginActions.controlView({ expireError: false }));
  } catch (err: any) {
    throw err;
  }
};

export const forgotPassword =
  (email: string) => async (dispatch: AppDispatch, getState: () => RootState) => {
    try {
      dispatch(loginActions.controlView({ isLoading: true, hasError: false }));

      const { data, status } = await api.post("/auth/send-define-password", {
        email,
        type: "RESET_PASSWORD",
      });

      if (status !== 204) throw new Error("Erro ao enviar email de redefinição de senha");
      dispatch(loginActions.controlView({ isLoading: false, hasError: false }));
    } catch (err: any) {
      if (err.response && err.response.data.message === "exception:INACTIVE_USER") {
        dispatch(loginActions.controlView({ isLoading: false, hasError: false }));
        toast({
          title: "Redefinição de senha não permitida",
          message:
            "Sua conta está temporariamente bloqueada e você não pode redefinir sua senha neste momento. Para mais informações, entre em contato com o suporte ao cliente.",
          type: "error",
        });
      } else {
        console.error(err);
        dispatch(loginActions.controlView({ isLoading: false, hasError: true }));
        toast({
          title: "Ocorreu um erro",
          message: "Ocorreu um erro ao enviar o email de redefinição de senha",
          type: "error",
        });
      }
      throw err;
    }
  };

export const sendPasswordResetEmail =
  (email: string) => async (dispatch: AppDispatch, getState: () => RootState) => {
    try {
      dispatch(loginActions.controlView({ isLoading: true, hasError: false }));

      const { data, status } = await api.post("/auth/send-define-password", {
        email,
        type: "RESET_PASSWORD",
      });

      if (status !== 204) throw new Error("Erro ao enviar email de redefinição de senha");
      dispatch(loginActions.controlView({ isLoading: false, hasError: false }));
    } catch (err) {
      console.error(err);
      dispatch(loginActions.controlView({ isLoading: false, hasError: false }));
      throw err;
    }
  };

export const sendWelcomeEmail =
  (email: string) => async (dispatch: AppDispatch, getState: () => RootState) => {
    try {
      dispatch(loginActions.controlView({ isLoading: true, hasError: false }));

      const { data, status } = await api.post("/auth/send-define-password", {
        email,
        type: "WELCOME",
      });

      if (status !== 204) throw new Error("Erro ao enviar email inicial");
      dispatch(loginActions.controlView({ isLoading: false, hasError: false }));
    } catch (err) {
      console.error(err);
      dispatch(loginActions.controlView({ isLoading: false, hasError: false }));
      throw err;
    }
  };

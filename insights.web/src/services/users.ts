import { createApi } from "@reduxjs/toolkit/query/react";
import { ExceptionsConstants } from "@src/shared/enums/exceptions";
import { FilterUserSearch } from "@src/shared/interfaces/FilterUserSearch";
import { Pagination } from "@src/shared/interfaces/pagination";
import { AppDispatch } from "@src/store";
import { userActions } from "@src/store/slices/users";
import { formatPhone } from "@src/utils/phone";
import { toast } from "@src/utils/toast";
import { format, isValid } from "date-fns";

import { api, baseQueryMiddleware, hasMoreItems, mergePaginationItems } from "./api";

type UserData = {
  name?: string;
  phone?: string;
  document?: string;
  email?: string;
  avatar?: string;
  isActive?: boolean;
  department?: string;
  customer?: string;
  roles?: string[];
};

type PasswordData = {
  password: string;
  token: string;
};

export const createUser = (user: UserData) => async (dispatch: AppDispatch) => {
  const { customer, department, roles = ["USER"], ...newUser } = user;
  const data = { ...newUser, departmentIds: [department], isActive: true, roles };
  try {
    if (customer) {
      dispatch(userActions.controlView({ isLoading: true, hasError: false }));
      const { status } = await api.post(`/customers/${customer}/users`, data);
      if (status == 200) {
        dispatch(userActions.controlView({ isLoading: false, hasError: false, msgError: "" }));
        return true;
      }
    }
  } catch (err: any) {
    dispatch(
      userActions.controlView({
        isLoading: false,
        hasError: true,
        msgError: err.response.data.message,
      }),
    );
  }
};

export const updateUser = (user: UserData, userId: string) => async (dispatch: AppDispatch) => {
  const { customer, department, roles = ["USER"], ...newUser } = user;
  const data = department
    ? { ...newUser, departmentIds: [department], roles }
    : { ...newUser, roles };
  try {
    dispatch(userActions.controlView({ isLoading: true, hasError: false }));
    const { status } = await api.put(`/users/${userId}`, data);
    if (status == 200) {
      dispatch(userActions.controlView({ isLoading: false, hasError: false }));
      return true;
    }
  } catch (err: any) {
    if (
      err?.response?.data?.message === ExceptionsConstants.INACTIVE_CUSTOMER &&
      newUser.isActive
    ) {
      dispatch(userActions.controlView({ isLoading: false, hasError: false }));
      toast({
        title: "Ocorreu um erro",
        message:
          "Não é possível desbloquear este usuário enquanto o cliente estiver inativo. Por favor, ative o cliente primeiro.",
        type: "error",
      });
    } else {
      dispatch(
        userActions.controlView({
          isLoading: false,
          hasError: true,
          msgErr: err.response.data.message,
        }),
      );
      toast({
        title: "Ocorreu um erro",
        message: `Erro ao ${user.isActive ? "desbloquear" : "bloquear"} o usuário.`,
        type: "error",
      });
    }
  }
};

export const deleteUser = (userId: string) => async (dispatch: AppDispatch) => {
  try {
    dispatch(userActions.controlView({ isLoading: true, hasError: false }));
    const { status } = await api.delete(`/users/${userId}`);
    if (status == 204) {
      dispatch(userActions.controlView({ isLoading: false, hasError: false }));
      return true;
    } else {
      throw new Error("Failed to delete user");
    }
  } catch (err: any) {
    dispatch(
      userActions.controlView({
        isLoading: false,
        hasError: true,
        msgError: err.response?.data?.message || "Erro ao excluir o usuário.",
      }),
    );
    return false;
  }
};

export const changePassword =
  (password: string, userId: string) => async (dispatch: AppDispatch) => {
    const data = { password };
    try {
      if (password) {
        dispatch(userActions.controlView({ isLoading: true, hasError: false }));
        const { status } = await api.put(`/auth/change-password/${userId}`, data);
        if (status == 204) {
          dispatch(userActions.controlView({ isLoading: false, hasError: false }));
          return true;
        }
      }
    } catch (err: any) {
      dispatch(
        userActions.controlView({
          isLoading: false,
          hasError: true,
          msgError: err.response.data.message,
        }),
      );
    }
  };

export const defineFirstPassword = (data: PasswordData) => async (dispatch: AppDispatch) => {
  try {
    dispatch(userActions.controlView({ isLoading: true, hasError: false }));
    const { status } = await api.post("/auth/define-password", data);
    if (status == 204) {
      dispatch(userActions.controlView({ isLoading: false, hasError: false }));
      return true;
    }
  } catch (err: any) {
    dispatch(userActions.controlView({ isLoading: false, hasError: true }));
  }
};

export const validateToken = (token: string) => async (dispatch: AppDispatch) => {
  try {
    dispatch(userActions.controlView({ isLoading: true, hasError: false }));
    const response = await api.post("/auth/validate-token", { token });
    dispatch(userActions.controlView({ isLoading: false, hasError: false }));
    return { valid: response.data.valid };
  } catch (err: any) {
    dispatch(userActions.controlView({ isLoading: false, hasError: false }));

    throw err;
  }
};

export const usersApi = createApi({
  reducerPath: "usersApi",
  refetchOnMountOrArgChange: true,
  baseQuery: baseQueryMiddleware,
  endpoints: builder => ({
    getUsers: builder.query({
      query: (params: Pagination) => ({
        url: `/users`,
        method: "GET",
        params,
      }),
      transformResponse(baseQueryReturnValue: any, meta, arg) {
        if (baseQueryReturnValue && baseQueryReturnValue.rows) {
          return {
            ...baseQueryReturnValue,
            hasMore: hasMoreItems(baseQueryReturnValue),
            rows: baseQueryReturnValue?.rows?.map((user: any) => {
              const lastLoginDate = user?.lastLogin
                ? isValid(new Date(user.lastLogin)) &&
                  format(new Date(user.lastLogin), "dd/MM/yyyy")
                : null;
              const createdAtDate = user?.createdAt
                ? isValid(new Date(user.createdAt)) &&
                  format(new Date(user.createdAt), "dd/MM/yyyy")
                : null;

              return {
                ...user,
                lastLogin: lastLoginDate,
                createdAt: createdAtDate,
                phone: formatPhone(user?.phone),
              };
            }),
          };
        }

        return baseQueryReturnValue;
      },
      serializeQueryArgs: ({ endpointName }) => {
        return endpointName;
      },
      merge: mergePaginationItems,
    }),
    getUser: builder.query({
      query: ({ user, customer }) => ({
        url: `/customers/${customer}/users/${user}`,
        method: "GET",
      }),
    }),
    getUsersSearch: builder.query({
      query: (body: FilterUserSearch) => ({
        url: `/users/search`,
        method: "POST",
        body,
      }),
      transformResponse(baseQueryReturnValue: any, meta, arg) {
        if (baseQueryReturnValue && baseQueryReturnValue.rows) {
          return {
            ...baseQueryReturnValue,
            hasMore: hasMoreItems(baseQueryReturnValue),
            rows: baseQueryReturnValue?.rows?.map((user: any) => {
              const lastLoginDate = user?.lastLogin
                ? isValid(new Date(user.lastLogin)) &&
                  format(new Date(user.lastLogin), "dd/MM/yyyy")
                : null;
              const createdAtDate = user?.createdAt
                ? isValid(new Date(user.createdAt)) &&
                  format(new Date(user.createdAt), "dd/MM/yyyy")
                : null;

              return {
                ...user,
                lastLogin: lastLoginDate,
                createdAt: createdAtDate,
                phone: formatPhone(user?.phone),
              };
            }),
          };
        }
        return baseQueryReturnValue;
      },
    }),
    updateUser: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/users/${id}`,
        method: "PUT",
        body: data,
      }),
    }),
  }),
});

export const {
  useGetUsersQuery,
  useLazyGetUsersQuery,
  useLazyGetUserQuery,
  useLazyGetUsersSearchQuery,
  useUpdateUserMutation,
} = usersApi;

import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "@src/store";

import { initialState } from ".";

const selectSlice = (state: RootState) => state.login || initialState;

export const selectLoginLoading = createSelector([selectSlice], state => state.view.isLoading);

export const selectLoginError = createSelector([selectSlice], state => state.view.hasError);

export const selectAuthExpireError = createSelector([selectSlice], state => state.view.expireError);

export const selectAuthRedirectToLogin = createSelector(
  [selectSlice],
  state => state.view.redirectToLogin,
);

export const selectAuthData = createSelector([selectSlice], state => state.data);

export const selectAuthView = createSelector([selectSlice], state => state.view);

export const selectAuthToken = createSelector([selectAuthData], state => state.token);

export const selectAuthUser = createSelector([selectAuthData], state => state.user);

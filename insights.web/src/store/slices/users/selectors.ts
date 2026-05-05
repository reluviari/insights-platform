import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "@src/store";

import { initialState } from ".";

const selectSlice = (state: RootState) => state.user || initialState;

export const selectUserLoading = createSelector([selectSlice], state => state.view.isLoading);

export const selectUserError = createSelector([selectSlice], state => state.view.hasError);

export const selectUserErrorMsg = createSelector([selectSlice], state => state.view.msgError);

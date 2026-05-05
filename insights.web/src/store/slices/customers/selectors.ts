import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "@src/store";

import { initialState } from ".";

const selectSlice = (state: RootState) => state.customer || initialState;

export const selectCustomerLoading = createSelector([selectSlice], state => state.view.isLoading);

export const selectCustomerError = createSelector([selectSlice], state => state.view.hasError);

export const selectCustomerErrorMsg = createSelector([selectSlice], state => state.view.msgError);

import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "@src/store";

import { initialState } from ".";

const selectSlice = (state: RootState) => state.department || initialState;

export const selectDepartmentLoading = createSelector([selectSlice], state => state.view.isLoading);

export const selectDepartmentError = createSelector([selectSlice], state => state.view.hasError);

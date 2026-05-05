import { createSlice } from "@reduxjs/toolkit";
import { generateReducersControllers } from "@src/store/utils";

import { DepartmentState, Data, View } from "./types";

export const initialState: DepartmentState = {
  data: {},
  view: {},
};

export const slice = createSlice({
  name: "department",
  initialState,
  reducers: {
    ...generateReducersControllers<View, Data>(),
  },
});

export const { actions: departmentActions } = slice;
export default slice.reducer;

import { createSlice } from "@reduxjs/toolkit";
import { generateReducersControllers } from "@src/store/utils";

import { CustomerState, Data, View } from "./types";

export const initialState: CustomerState = {
  data: {},
  view: {},
};

export const slice = createSlice({
  name: "customer",
  initialState,
  reducers: {
    ...generateReducersControllers<View, Data>(),
  },
});

export const { actions: customerActions } = slice;
export default slice.reducer;

import { createSlice } from "@reduxjs/toolkit";
import { generateReducersControllers } from "@src/store/utils";

import { UserState, Data, View } from "./types";

export const initialState: UserState = {
  data: {},
  view: {},
};

export const slice = createSlice({
  name: "user",
  initialState,
  reducers: {
    ...generateReducersControllers<View, Data>(),
  },
});

export const { actions: userActions } = slice;
export default slice.reducer;

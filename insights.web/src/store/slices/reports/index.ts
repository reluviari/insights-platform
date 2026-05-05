import { createSlice } from "@reduxjs/toolkit";
import { generateReducersControllers } from "@src/store/utils";

import { ReportState, Data, View } from "./types";

export const initialState: ReportState = {
  data: {},
  view: {},
};

export const slice = createSlice({
  name: "report",
  initialState,
  reducers: {
    ...generateReducersControllers<View, Data>(),
  },
});

export const { actions: reportActions } = slice;
export default slice.reducer;

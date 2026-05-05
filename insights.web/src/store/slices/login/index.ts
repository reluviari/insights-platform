import { createSlice } from "@reduxjs/toolkit";
import { generateReducersControllers } from "@src/store/utils";

import { LoginState, Data, View } from "./types";

function getParsedData(data: any) {
  if (data === null) {
    return null;
  }
  return JSON.parse(data);
}

function loadLoginFromLS() {
  if (typeof window !== "undefined") {
    const data = window !== undefined ? window.localStorage.getItem("auth") : {};
    return getParsedData(data);
  }
  return null;
}

const dataFromLS = loadLoginFromLS();

export const initialState: LoginState = {
  data: dataFromLS || {
    token: null,
    user: null,
  },
  view: {
    isLoading: false,
    expireError: false,
  },
};

export const slice = createSlice({
  name: "login",
  initialState,
  reducers: {
    ...generateReducersControllers<View, Data>(),
  },
});

// Action creators are generated for each case reducer function
export const { actions: loginActions } = slice;
export default slice.reducer;

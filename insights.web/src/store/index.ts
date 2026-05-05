import { Action, ThunkAction, configureStore } from "@reduxjs/toolkit";
import { customersApi } from "@src/services/customers";
import { departmentsApi } from "@src/services/departments";
import { reportsApi } from "@src/services/reports";
import { settingsApi } from "@src/services/settings";
import { usersApi } from "@src/services/users";
import { throttle } from "lodash";

import customerReducer from "./slices/customers";
import departmentReducer from "./slices/departments";
import loginReducer from "./slices/login";
import reportReducer from "./slices/reports";
import userReducer from "./slices/users";

export const store = configureStore({
  reducer: {
    login: loginReducer,
    report: reportReducer,
    user: userReducer,
    customer: customerReducer,
    department: departmentReducer,
    [reportsApi.reducerPath]: reportsApi.reducer,
    [settingsApi.reducerPath]: settingsApi.reducer,
    [customersApi.reducerPath]: customersApi.reducer,
    [departmentsApi.reducerPath]: departmentsApi.reducer,
    [usersApi.reducerPath]: usersApi.reducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware()
      .concat(reportsApi.middleware)
      .concat(settingsApi.middleware)
      .concat(customersApi.middleware)
      .concat(departmentsApi.middleware)
      .concat(usersApi.middleware),
});

let loginReference: any;

function saveState(state: any) {
  const data = JSON.stringify(state);
  localStorage.setItem("auth", data);
}

const subscribeCallback = throttle(() => {
  if (!store) return;
  const { login } = store.getState();
  if (loginReference !== login?.data) {
    loginReference = login?.data;
    saveState(loginReference);
  }
}, 1000);

store.subscribe(subscribeCallback);

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;

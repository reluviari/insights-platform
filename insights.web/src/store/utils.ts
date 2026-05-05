import { PayloadAction } from "@reduxjs/toolkit";
import isArray from "lodash/isArray";
import mergeWith from "lodash/mergeWith";

export function generalControl(store: any, payload: any) {
  return mergeWith(store, payload, (objValue, srcValue, key, object) => {
    if (isArray(objValue)) {
      return srcValue;
    }
  });
}

export function generateReducersControllers<View, Data>() {
  return {
    controlView(state: any, action: PayloadAction<View>) {
      const { payload } = action;
      generalControl(state, { view: payload });
    },
    controlData(state: any, action: PayloadAction<Data>) {
      const { payload } = action;
      generalControl(state, { data: payload });
    },
  };
}

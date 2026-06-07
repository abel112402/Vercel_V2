import { configureStore } from "@reduxjs/toolkit";
import { authSlice as authApiSlice } from "./authApiSlice";
import { bookingApiSlice } from "./bookingApiSlice";
import { tableApiSlice } from "./tableApiSlice";
import authReducer from "./authSlice";
import bookingReducer from "./bookingSlice";

export const store = configureStore({
  reducer: {
    [authApiSlice.reducerPath]: authApiSlice.reducer,
    [bookingApiSlice.reducerPath]: bookingApiSlice.reducer,
    [tableApiSlice.reducerPath]: tableApiSlice.reducer,
    auth: authReducer,
    booking: bookingReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(authApiSlice.middleware)
      .concat(bookingApiSlice.middleware)
      .concat(tableApiSlice.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
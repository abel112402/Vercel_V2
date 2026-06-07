import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { authSlice as authApiSlice } from "./authApiSlice";

export type UserInfo = {
  id: number;
  name: string;
  email: string;
  role: "user" | "admin";
};

export interface AuthState {
  user: UserInfo | null;
  isLoggedIn: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  isLoggedIn: false,
  error: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<UserInfo | null>) {
      state.user = action.payload;
      state.isLoggedIn = Boolean(action.payload);
      state.error = null;
    },
    clearUser(state) {
      state.user = null;
      state.isLoggedIn = false;
      state.error = null;
    },
    setAuthError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(authApiSlice.endpoints.login.matchFulfilled, (state, action) => {
      state.user = action.payload.user;
      state.isLoggedIn = true;
      state.error = null;
    });
    builder.addMatcher(authApiSlice.endpoints.getMe.matchFulfilled, (state, action) => {
      state.user = action.payload;
      state.isLoggedIn = true;
      state.error = null;
    });
    builder.addMatcher(authApiSlice.endpoints.logout.matchFulfilled, (state) => {
      state.user = null;
      state.isLoggedIn = false;
      state.error = null;
    });
    builder.addMatcher(authApiSlice.endpoints.login.matchRejected, (state, action) => {
      state.error = action.error.message ?? "Login failed";
    });
    builder.addMatcher(authApiSlice.endpoints.getMe.matchRejected, (state) => {
      state.user = null;
      state.isLoggedIn = false;
      state.error = null;
    });
  },
});

export const selectIsLoggedIn = (state: { auth: AuthState }) => state.auth.isLoggedIn;
export const selectUser = (state: { auth: AuthState }) => state.auth.user;
export const selectAuthError = (state: { auth: AuthState }) => state.auth.error;
export const selectUserRole = (state: { auth: AuthState }) => state.auth.user?.role || null;

export const { setUser, clearUser, setAuthError } = authSlice.actions;
export default authSlice.reducer;

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api/v1";
const NEPTUN_CODE = import.meta.env.VITE_NEPTUN_CODE || "DMKSEH";

export const authSlice = createApi({
  reducerPath: "authSlice",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    credentials: "include",
  }),
  endpoints: (build) => ({
    register: build.mutation({
      query: (credentials) => ({
        url: "/auth/register",
        headers: {
          "X-Neptun-Code": NEPTUN_CODE,
        },
        method: "POST",
        body: credentials,
      }),
    }),
    login: build.mutation({
      query: (credentials) => ({
        url: "/auth/login",
        headers: {
          "X-Neptun-Code": NEPTUN_CODE,
        },
        method: "POST",
        body: credentials,
      }),
    }),
    logout: build.mutation<void, void>({
      query: () => ({
        url: "/auth/logout",
        headers: {
          "X-Neptun-Code": NEPTUN_CODE,
        },
        method: "POST",
      }),
    }),
    getMe: build.query({
      query: () => ({
        url: "/auth/me",
        headers: {
          "X-Neptun-Code": NEPTUN_CODE,
        },
      }),
    }),
  }),
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useLogoutMutation,
  useGetMeQuery,
} = authSlice;
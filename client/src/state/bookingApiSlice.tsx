import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { type BookingInfo, type BookingState } from "./bookingSlice";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api/v1";
const NEPTUN_CODE = import.meta.env.VITE_NEPTUN_CODE || "DMKSEH";

export interface UploadBookingInfo {
  tableId: number;
  date: string;
  startTime: string;
  endTime: string;
  name: string;
  email: string;
  phone: string;
  headcount: number;
  notes: string | null;
}

export const bookingApiSlice = createApi({
  reducerPath: "bookingApiSlice",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    credentials: "include",
  }),
  tagTypes: ["Booking"],
  endpoints: (build) => ({
    getAll: build.query<BookingState, void>({
      query: () => ({
        url: "/bookings",
        headers: {
          "X-Neptun-Code": NEPTUN_CODE,
        },
      }),
      providesTags: [{ type: "Booking", id: "LIST" }],
    }),
    getMine: build.query<BookingInfo[], void>({
      query: () => ({
        url: "/bookings/my",
        headers: {
          "X-Neptun-Code": NEPTUN_CODE,
        },
      }),
      providesTags: [{ type: "Booking", id: "MINE" }],
    }),
    updateStatus: build.mutation<void, { id: number; status: string }>({
      query: ({ id, status }) => ({
        url: `/bookings/${id}/status`,
        method: "PATCH",
        body: { status },
        headers: {
          "X-Neptun-Code": NEPTUN_CODE,
        },
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Booking", id },
        { type: "Booking", id: "LIST" },
        { type: "Booking", id: "MINE" },
      ],
    }),
    getById: build.query<BookingInfo, number>({
      query: (id) => ({
        url: `/bookings/${id}`,
        headers: {
          "X-Neptun-Code": NEPTUN_CODE,
        },
      }),
      providesTags: (_result, _error, id) => [{ type: "Booking", id }],
    }),
    book: build.mutation<BookingInfo, UploadBookingInfo>({
      query: (bookingInfo: UploadBookingInfo) => ({
        url: "/bookings",
        method: "POST",
        body: bookingInfo,
        headers: {
          "X-Neptun-Code": NEPTUN_CODE,
        },
      }),
      invalidatesTags: [
        { type: "Booking", id: "LIST" },
        { type: "Booking", id: "MINE" }
      ],
    }),
  }),
});

export const {
  useGetAllQuery,
  useGetMineQuery,
  useUpdateStatusMutation,
  useGetByIdQuery,
  useBookMutation,
} = bookingApiSlice;
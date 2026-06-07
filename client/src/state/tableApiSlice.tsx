import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { TableInterface } from "../data/Table";
import type { TableCategory } from "../enums/TableCategory";
import type { TableType } from "../enums/TableType";

const BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:3000/api/v1";

export type CreateTableInput = {
  name?: string;
  type: TableType;
  category: TableCategory;
  color: string;
  status: number;
  position: {
    x: number;
    y: number;
  };
  isLocked: boolean;
};

export type UpdateTableInput = {
  id: number;
  body: Partial<Omit<CreateTableInput, "position">>;
};

export type TableTimeslot = {
  startTime: string;
  endTime: string;
  isAvailable: boolean;
};

const normalizeTable = (table: any): TableInterface => ({
  ...table,
  id: String(table.id),
  position: {
    x: table.position?.x ?? 0,
    y: table.position?.y ?? 0,
  },
});

export const tableApiSlice = createApi({
  reducerPath: "tableApiSlice",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    credentials: "include",
  }),
  tagTypes: ["Table"],
  endpoints: (build) => ({
    getAll: build.query<TableInterface[], void>({
      query: () => "/tables",
      transformResponse: (response: any) =>
        Array.isArray(response) ? response.map(normalizeTable) : [],
      providesTags: (result) =>
        result
          ? [
              ...result.map((table) => ({ type: "Table" as const, id: table.id })),
              { type: "Table" as const, id: "LIST" },
            ]
          : [{ type: "Table" as const, id: "LIST" }],
    }),
    createTable: build.mutation<TableInterface, CreateTableInput>({
      query: (body) => ({
        url: "/tables",
        method: "POST",
        body,
      }),
      transformResponse: (response: any) => normalizeTable(response),
      invalidatesTags: [{ type: "Table", id: "LIST" }],
    }),
    updateTable: build.mutation<TableInterface, UpdateTableInput>({
      query: ({ id, body }) => ({
        url: `/tables/${id}`,
        method: "PATCH",
        body,
      }),
      transformResponse: (response: any) => normalizeTable(response),
      invalidatesTags: (_result, _error, arg) => [
        { type: "Table", id: String(arg.id) },
        { type: "Table", id: "LIST" },
      ],
    }),
    updateTablePosition: build.mutation<TableInterface, { id: number; position: { x: number; y: number } }>({
      query: ({ id, position }) => ({
        url: `/tables/${id}/position`,
        method: "PATCH",
        body: position,
      }),
      transformResponse: (response: any) => normalizeTable(response),
      invalidatesTags: (_result, _error, arg) => [
        { type: "Table", id: String(arg.id) },
        { type: "Table", id: "LIST" },
      ],
    }),
    deleteTable: build.mutation<void, number>({
      query: (id) => ({
        url: `/tables/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, arg) => [
        { type: "Table", id: String(arg) },
        { type: "Table", id: "LIST" },
      ],
    }),
    getTimeslots: build.query<TableTimeslot[], { id: number; date: string }>({
      query: ({ id, date }) => `/tables/${id}/timeslots?date=${encodeURIComponent(date)}`,
    }),
  }),
});

export const {
  useGetAllQuery,
  useCreateTableMutation,
  useUpdateTableMutation,
  useUpdateTablePositionMutation,
  useDeleteTableMutation,
  useGetTimeslotsQuery,
} = tableApiSlice;

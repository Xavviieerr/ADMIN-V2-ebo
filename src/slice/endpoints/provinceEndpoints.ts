import { ProvinceNamesResponse, ProvinceRequest, ProvinceResponse, SingleProvinceResponse, TownsResponse } from "@/types/provinceTypes";
import { AppEndpointBuilder } from "./types";

export const provinceEndpoints = (builder: AppEndpointBuilder) => ({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getAllProvinces: builder.query<ProvinceResponse, Partial<any>>({
    query({ page, limit }: { page: number; limit: number }) {
      return {
        url: `/provinces?page=${page}&limit=${limit}`,
        method: "GET",
      };
    },
    providesTags: ["provinces"],
  }),

  getSingleProvince: builder.query<SingleProvinceResponse, Partial<ProvinceRequest>>({
    query({ id }) {
      return {
        url: `/provinces/${id}`,
        method: "GET",
      };
    },
    providesTags: ["town"],
  }),

  updateTown: builder.mutation<
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    any,
    {
      id: string;
      name: string;
      isWaterside: boolean;
      note?: string;
      latitude?: number;
      longitude?: number;
      provinceId: string;
    }
  >({
    query: ({ id, ...body }) => ({
      url: `/provinces/towns/${id}`,
      method: "PATCH",
      body,
    }),
    invalidatesTags: ["town", "provinces"],
  }),

  getAllProvinceNoPagination: builder.query<ProvinceNamesResponse, Partial<void>>({
    query() {
      return {
        url: `/provinces/all`,
        method: "GET",
      };
    },
  }),

  getTownsByProvinceId: builder.query<TownsResponse, { provinceId: string }>({
    query({ provinceId }) {
      return {
        url: `/provinces/provinces/${provinceId}/towns`,
        method: "GET",
      };
    },
  }),
});

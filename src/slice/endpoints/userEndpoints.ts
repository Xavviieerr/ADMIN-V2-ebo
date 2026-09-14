import { User } from "@/types/userTypes";
import { ProvinceRequest } from "@/types/provinceTypes";
import { GetUsersResponse, GetUsersResponseSearch } from "@/types/userTypes";
import { PermissionsResponse, SinglePermissionResponse, SetPermissionRequest } from "@/types/permissions";
import { ProfileMutationResponse, UpdateUserProfileRequest, UpdateUsernameRequest, UploadUserImageResponse } from "@/types/userTypes";
import { CreateAdminRequest, InviteAdminRequest, RejectUserRequest, RestrictUserRequest, UserActionResponse } from "@/types/userTypes";
import { AppEndpointBuilder } from "./types";

export const userEndpoints = (builder: AppEndpointBuilder) => ({
  getSingleUser: builder.query<User, Partial<ProvinceRequest>>({
    query({ id }) {
      return {
        url: `/admin/users/${id}`,
        method: "GET",
      };
    },
  }),

  getSingleAdminUser: builder.query<User, Partial<ProvinceRequest>>({
    query({ id }) {
      return {
        url: `/admin/${id}`,
        method: "GET",
      };
    },
    providesTags: ["admins"],
  }),

  getAdminUsers: builder.query<
    GetUsersResponse,
    {
      search?: string;
      limit?: number;
      page?: number;
      role?: string;
      status?: string;
      sortBy?: string;
      sortOrder?: string;
    }
  >({
    query: ({ search = "", limit = 15, page = 1, role, status, sortBy, sortOrder }) => {
      const params = new URLSearchParams();

      if (search) params.append("search", search);
      if (role && role !== "all" && ["user", "admin", "super_admin"].includes(role))
        params.append("role", role);
      if (status && status !== "all") params.append("status", status);
      if (sortBy && ["email", "username", "name"].includes(sortBy))
        params.append("sortBy", sortBy);
      if (sortOrder && ["ASC", "DESC"].includes(sortOrder))
        params.append("sortOrder", sortOrder);
      params.append("limit", limit.toString());
      params.append("page", page.toString());

      return {
        url: `/admin/users?${params.toString()}`,
        method: "GET",
      };
    },
    providesTags: ["admins"],
  }),

  getAdminUsersSearch: builder.query<
    GetUsersResponseSearch,
    { query?: string; limit?: number; page?: number }
  >({
    query: ({ query = "", limit = 10, page = 1 }) => {
      const params = new URLSearchParams();

      params.append("query", query);
      params.append("limit", limit.toString());
      params.append("page", page.toString());

      return {
        url: `/admin/users/search?${params.toString()}`,
        method: "GET",
      };
    },
    providesTags: ["admins"],
  }),

  getAllAdminPermissions: builder.query<PermissionsResponse, void>({
    query() {
      return {
        url: `/admin/permissions`,
        method: "GET",
      };
    },
  }),

  getSingleAdminPermission: builder.query<SinglePermissionResponse, Partial<{ id: string }>>({
    query({ id }) {
      return {
        url: `/admin/permissions/${id}`,
        method: "GET",
      };
    },
    providesTags: (result, error, { id }) =>
      id ? [{ type: "permissions", id }] : [],
  }),

  setAdminPermission: builder.mutation<any, SetPermissionRequest>({
    query({ permissions, userId, method = "PATCH" }) {
      const body =
        method === "PATCH" ? { permissions } : { permissions, userId };

      const url =
        method === "POST"
          ? "/admin/permissions"
          : `/admin/permissions/${userId}`;

      return {
        url: url,
        method: method,
        body: body,
      };
    },
    invalidatesTags: (result, error, { userId }) => [
      "admins",
      { type: "permissions", id: userId },
    ],
  }),

  updateAdminProfile: builder.mutation<
    any,
    {
      firstName?: string;
      lastName?: string;
      profilePicture?: File;
    }
  >({
    query: ({ firstName, lastName, profilePicture }) => {
      const formData = new FormData();
      if (firstName !== undefined) formData.append("firstName", firstName);
      if (lastName !== undefined) formData.append("lastName", lastName);
      if (profilePicture) formData.append("profilePicture", profilePicture);
      return {
        url: "/admin/me",
        method: "PATCH",
        body: formData,
      };
    },
    invalidatesTags: ["admins"],
  }),

  updateUserProfile: builder.mutation<
    ProfileMutationResponse,
    UpdateUserProfileRequest
  >({
    query: (body) => ({
      url: "/users/me",
      method: "PATCH",
      body,
    }),
    invalidatesTags: ["admins"],
  }),

  updateUsername: builder.mutation<
    ProfileMutationResponse,
    UpdateUsernameRequest
  >({
    query: (body) => ({
      url: "/users/me/username",
      method: "PATCH",
      body,
    }),
    invalidatesTags: ["admins"],
  }),

  uploadUserImage: builder.mutation<UploadUserImageResponse, FormData>({
    query: (body) => ({
      url: "/users/image/upload",
      method: "POST",
      body,
    }),
  }),

  approveAdmin: builder.mutation<UserActionResponse, { userId: string }>({
    query: ({ userId }) => ({
      url: `/admin/approve/${userId}`,
      method: "POST",
    }),
    invalidatesTags: ["admins"],
  }),

  restrictUser: builder.mutation<UserActionResponse, RestrictUserRequest>({
    query: ({ userId, suspensionReason }) => ({
      url: `/admin/users/restrict/${userId}`,
      method: "POST",
      body: { suspensionReason },
    }),
    invalidatesTags: ["admins"],
  }),

  unrestrictUser: builder.mutation<UserActionResponse, { userId: string }>({
    query: ({ userId }) => ({
      url: `/admin/unrestrict/${userId}`,
      method: "POST",
    }),
    invalidatesTags: ["admins"],
  }),

  rejectUser: builder.mutation<UserActionResponse, RejectUserRequest>({
    query: ({ userId, rejectionReason }) => ({
      url: `/admin/reject/${userId}`,
      method: "POST",
      body: { rejectionReason },
    }),
    invalidatesTags: ["admins"],
  }),

  deleteUser: builder.mutation<UserActionResponse, { userId: string }>({
    query: ({ userId }) => ({
      url: `/admin/users/${userId}`,
      method: "DELETE",
    }),
    invalidatesTags: ["admins"],
  }),

  inviteAdmin: builder.mutation<UserActionResponse, InviteAdminRequest>({
    query: (body) => ({
      url: "/admin/invite",
      method: "POST",
      body,
    }),
    invalidatesTags: ["admins"],
  }),

  createAdmin: builder.mutation<UserActionResponse, CreateAdminRequest>({
    query: (body) => ({
      url: "/admin/create",
      method: "POST",
      body,
    }),
    invalidatesTags: ["admins"],
  }),
});

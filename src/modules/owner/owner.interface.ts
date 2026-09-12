import { TAccountStatus } from "@/modules/user/user.interface";

export type TOwnerQuery = {
  searchTerm?: string;
  page?: string;
  limit?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  status?: TAccountStatus;
};

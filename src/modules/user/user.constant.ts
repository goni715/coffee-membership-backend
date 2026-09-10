export const USER_SEARCHABLE_FIELDS = ["fullName", "email", "address"];

export const ACCOUNT_STATUSES = {
  PENDING : 'pending',
  ACTIVE : 'active',
  BLOCKED : 'blocked',
} as const;

export const USER_ROLES = {
  CUSTOMER: "customer",
  OWNER: "owner",
  ADMIN: "admin",
  SUPER_ADMIN: "super_admin",
} as const;

export const USER_VALID_FIELDS: string[] = [
  "searchTerm",
  "page",
  "limit",
  "sortBy",
  "sortOrder",
  "status",
];

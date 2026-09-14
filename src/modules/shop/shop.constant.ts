export const SHOP_STATUSES = {
  ACTIVE: "active",
  SUSPENDED: "suspended",
  INACTIVE: "inactive",
} as const;

export const SHOP_SEARCHABLE_FIELDS = [
  "shopName",
  "contactNumber",
  "address",
  "description",
];

export const SHOP_VALID_FIELDS: string[] = [
  "searchTerm",
  "page",
  "limit",
  "sortBy",
  "sortOrder",
  "status",
  "city",
];


export const QRCODE_PREFIX = {
  SHOP: "SHOP",
  COFFEE: "COFFEE",
} as const;
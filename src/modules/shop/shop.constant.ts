export const SHOP_STATUSES = {
  ACTIVE: "active",
  SUSPENDED: "suspended",
  INACTIVE: "inactive",
} as const;

export const SHOP_SEARCHABLE_FIELDS = [
  "ownerName",
  "ownerEmail",
  "ownerPhone",
  "name",
  "contactNumber",
  "address",
  "description",
];

export const CUSTOMER_SHOP_SEARCHABLE_FIELDS = [
  "name",
  "contactNumber",
  "address",
  "description",
];

export const QRCODE_PREFIX = {
  SHOP: "SHOP",
  COFFEE: "COFFEE",
} as const;
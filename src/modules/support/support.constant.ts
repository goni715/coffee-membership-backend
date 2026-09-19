export const SUPPORT_STATUSES = {
    NEW: "new",
    REPLIED: "replied",
    CLOSED: "closed",
} as const;

export const SUPPORT_SEARCHABLE_FIELDS = ["fullName", "email", "subject"];

export const SUPPORT_VALID_FIELDS: string[] = [
    "searchTerm",
    "page",
    "limit",
    "sortBy",
    "sortOrder",
    "status",
];
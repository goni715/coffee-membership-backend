

export const MEMBERSHIP_STATUSES = {
    PENDING: 'pending',
    ACTIVE: 'active',
    REJECTED: 'rejected',
    PAUSED: 'paused',
} as const;

export const MEMBERSHIP_SEARCHABLE_FIELDS = [
    "customerName",
    "customerEmail",
    "customerPhone"
];

export const MEMBERSHIP_VALID_FIELDS: string[] = [
    "searchTerm",
    "page",
    "limit",
    "sortBy",
    "sortOrder",
    "status",
];
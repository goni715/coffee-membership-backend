

export const MEMBERSHIP_STATUSES = {
    PENDING: 'pending',
    ACTIVE: 'active',
    REJECTED: 'rejected',
    PAUSED: 'paused',
} as const;

export const MEMBERSHIP_UPDATE_STATUSES = [
    'active',
    'rejected',
    'paused',
];

export const MEMBERSHIP_SEARCHABLE_FIELDS = [
    "customerName",
    "customerEmail",
    "customerPhone"
];

export const MY_MEMBERSHIPS_SEARCHABLE_FIELDS = [
    "shopName",
    "contactNumber",
    "address"
];

export const MEMBERSHIP_VALID_FIELDS: string[] = [
    "searchTerm",
    "page",
    "limit",
    "sortBy",
    "sortOrder",
    "status",
];
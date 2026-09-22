
export const OWNER_REDEMPTION_SEARCHABLE_FIELDS = [
    "customerName",
    "customerEmail",
    "customerPhone"
];

export const CUSTOMER_REDEMPTION_SEARCHABLE_FIELDS = [
    "shopName",
    "contactNumber",
    "address"
];

export const REDEMPTION_VALID_FIELDS: string[] = [
    "searchTerm",
    "page",
    "limit",
    "sortBy",
    "sortOrder",
    "isRedeemed",
];

export const TIMEFRAME = {
    TODAY: 'today',
    LAST_WEEK: 'last_week',
    LAST_MONTH: 'last_month',
} as const;

export const TIMEFRAME_VALUES = Object.values(TIMEFRAME);
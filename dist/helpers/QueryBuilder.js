"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeFilterQuery = exports.makeSearchQuery = void 0;
class QueryBuilder {
    makeSearchQuery(searchTerm, SearchFields) {
        const searchQuery = {
            $or: SearchFields.map((item) => ({
                [item]: { $regex: searchTerm, $options: "i" },
            })),
        };
        return searchQuery;
    }
    makeFilterQuery(filters) {
        const filterQuery = {};
        Object.keys(filters).forEach((key) => {
            const value = filters[key];
            if (value === "true") {
                filterQuery[key] = true;
            }
            else if (value === "false") {
                filterQuery[key] = false;
            }
            // Convert numeric strings to actual numbers
            else if (!isNaN(Number(value))) {
                filterQuery[key] = Number(value);
            }
            // Keep it as a string if none of the above conditions match
            else {
                filterQuery[key] = value;
            }
        });
        return filterQuery;
    }
}
_a = new QueryBuilder(), exports.makeSearchQuery = _a.makeSearchQuery, exports.makeFilterQuery = _a.makeFilterQuery;

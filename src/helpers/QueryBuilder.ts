class QueryBuilder {
  makeSearchQuery(searchTerm: string, SearchFields: string[]) {
    const searchQuery = {
      $or: SearchFields.map((item) => ({
        [item]: { $regex: searchTerm, $options: "i" },
      })),
    };

    return searchQuery;
  }

  makeFilterQuery(filters: Record<string, unknown>) {
    const filterQuery: Record<string, unknown> = {};

    Object.keys(filters).forEach((key) => {
      const value = filters[key];

      if (value === "true") {
        filterQuery[key] = true;
      } else if (value === "false") {
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

export const { makeSearchQuery, makeFilterQuery } = new QueryBuilder();

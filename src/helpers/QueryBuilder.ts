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

      if (typeof value === "boolean") {
        filterQuery[key] = value;
      }
      else if (typeof value === "number") {
        filterQuery[key] = value;
      }
      else {
        filterQuery[key] = value;
      }
    });

    return filterQuery;
  }
}

export const { makeSearchQuery, makeFilterQuery } = new QueryBuilder();

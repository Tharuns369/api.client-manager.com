export class SearchFilter {
    searchClientFilter(clientQuery: any, filters: any) {
      const conditions: string[] = [];
  
      if (filters.name) {
        console.log("filters.name",filters.name);
        
        conditions.push(`name ILIKE '%${filters.name}%'`);
        console.log("filters.name",filters.name);

      }
  
      if (filters.email) {
        conditions.push(`email ILIKE '%${filters.email}%'`);
      }
  
      if (conditions.length > 0) {
        clientQuery.whereClause = conditions.join(' AND ');
      }
  
      return clientQuery;
    }
  }
  
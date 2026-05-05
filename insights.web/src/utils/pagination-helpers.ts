/** Funções puras de paginação (extraídas para testes e reuso sem carregar axios/store). */

export function mergePaginationItems(currentCache: any, newItems: any) {
  const uniqueNewItems =
    newItems?.rows?.filter((newItem: any) => {
      return !currentCache?.rows?.some((cachedItem: any) => cachedItem.id === newItem.id);
    }) || [];

  return {
    ...newItems,
    rows: [...(currentCache?.rows ?? []), ...uniqueNewItems],
  };
}

export function hasMoreItems(params: { page: number; pageSize: number; count: number }) {
  const { page, pageSize, count } = params;
  return page * pageSize < count;
}

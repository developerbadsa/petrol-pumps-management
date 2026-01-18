export type PaginationResult<T> = {
  current_page: number;
  data: T[];
  per_page: number;
  total: number;
  last_page: number;
  next_page_url: string | null;
  prev_page_url: string | null;
};

export function buildPagination<T>(
  data: T[],
  total: number,
  page: number,
  perPage: number,
  baseUrl: string
): PaginationResult<T> {
  const lastPage = Math.max(1, Math.ceil(total / perPage));
  const nextPage = page < lastPage ? `${baseUrl}?page=${page + 1}&per_page=${perPage}` : null;
  const prevPage = page > 1 ? `${baseUrl}?page=${page - 1}&per_page=${perPage}` : null;

  return {
    current_page: page,
    data,
    per_page: perPage,
    total,
    last_page: lastPage,
    next_page_url: nextPage,
    prev_page_url: prevPage,
  };
}

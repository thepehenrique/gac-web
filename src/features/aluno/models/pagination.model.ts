export interface PaginationQueryResponseDto<T> {
  content: T[];
  totalRecords: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
}

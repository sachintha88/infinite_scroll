export interface Book {
  title: string;
}

export interface UseBookSearchResult {
  loading: boolean;
  error: boolean;
  books: string[];
  hasMore: boolean;
}

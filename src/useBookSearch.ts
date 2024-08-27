import axios, { Canceler } from "axios";
import { useEffect, useState } from "react";
import { Book, UseBookSearchResult } from "./types";

export default function useBookSearch(
  query: string,
  pageNumber: number
): UseBookSearchResult {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);
  const [books, setBooks] = useState<string[]>([]);
  const [hasMore, setHasMore] = useState<boolean>(false);

  useEffect(() => {
    setBooks([]);
  }, [query]);

  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      setError(false);
      let cancel: Canceler;
      try {
        const { data } = await axios.get("http://openlibrary.org/search.json", {
          params: { q: query, page: pageNumber },
          cancelToken: new axios.CancelToken((c) => (cancel = c)),
        });
        setBooks((prevBooks) => {
          return [
            ...new Set([...prevBooks, ...data.docs.map((b: Book) => b.title)]),
          ];
        });
        setHasMore(data.docs.length > 0);
      } catch (e) {
        if (axios.isCancel(e)) return;
        setError(true);
      } finally {
        setLoading(false);
      }
      return () => cancel;
    };

    fetchBooks();
  }, [query, pageNumber]);

  return { loading, error, books, hasMore };
}

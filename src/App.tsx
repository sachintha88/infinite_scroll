import { ChangeEvent, useCallback, useRef, useState } from "react";
import useBookSearch from "./useBookSearch";

export default function App() {
  const [query, setQuery] = useState<string>("");
  const [pageNumber, setPageNumber] = useState<number>(1);

  const { books, hasMore, loading, error } = useBookSearch(query, pageNumber);

  const observer = useRef<IntersectionObserver | null>(null);
  const lastBookElementRef = useCallback(
    (node: HTMLDivElement) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPageNumber((prevPageNumber) => prevPageNumber + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setPageNumber(1);
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 p-4">
      <div className="fixed top-0 left-0 w-full bg-gray-100 p-4 z-10">
        <div className="flex justify-center w-full">
          <input
            type="text"
            value={query}
            onChange={handleSearch}
            className="w-1/2 max-w-lg p-6 mb-4 text-lg border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 h-16"
            placeholder="Search for books..."
            style={{ fontSize: "1.5rem" }}
          />
        </div>
      </div>
      <div className="w-full max-w-lg mt-24">
        {books.map((book: string, index: number) => (
          <div
            ref={books.length === index + 1 ? lastBookElementRef : null}
            key={book}
            className="p-4 mb-2 bg-white border border-gray-200 rounded-lg shadow-sm"
          >
            {book}
          </div>
        ))}
        {loading && <div className="text-center text-blue-500">Loading...</div>}
        {error && <div className="text-center text-red-500">Error</div>}
      </div>
    </div>
  );
}

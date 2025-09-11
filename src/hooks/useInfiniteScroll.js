import { useState, useEffect, useCallback } from "react";

export const useInfiniteScroll = ({
  hasNextPage = false,
  fetchNextPage,
  threshold = 100,
}) => {
  const [isFetching, setIsFetching] = useState(false);

  const handleScroll = useCallback(() => {
    const scrollTop =
      document.documentElement.scrollTop || document.body.scrollTop;
    const scrollHeight =
      document.documentElement.scrollHeight || document.body.scrollHeight;
    const clientHeight =
      document.documentElement.clientHeight || window.innerHeight;
    const scrolledToBottom =
      Math.ceil(scrollTop + clientHeight) >= scrollHeight - threshold;

    if (scrolledToBottom && hasNextPage && !isFetching) {
      setIsFetching(true);
    }
  }, [hasNextPage, isFetching, threshold]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  useEffect(() => {
    if (!isFetching) return;

    const fetchMore = async () => {
      try {
        await fetchNextPage();
      } catch (error) {
        console.error("Error fetching next page:", error);
      } finally {
        setIsFetching(false);
      }
    };

    fetchMore();
  }, [isFetching, fetchNextPage]);

  return { isFetching, setIsFetching };
};

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, Clock, User, MessageCircle } from "lucide-react";
import { Input } from "../ui/Input";
import { Avatar } from "../ui/Avatar";
import { useDebounce } from "../../hooks/useDebounce";

export const SearchBar = ({
  placeholder = "Search...",
  onSearch,
  onResultSelect,
  showRecentSearches = true,
  className = "",
}) => {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [results, setResults] = useState([]);
  const [recentSearches, setRecentSearches] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const inputRef = useRef(null);
  const containerRef = useRef(null);

  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    if (debouncedQuery && debouncedQuery.length > 2) {
      handleSearch(debouncedQuery);
    } else {
      setResults([]);
      setIsLoading(false);
    }
  }, [debouncedQuery]);

  useEffect(() => {
    const saved = localStorage.getItem("recentSearches");
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = async (searchQuery) => {
    setIsLoading(true);
    try {
      if (onSearch) {
        const searchResults = await onSearch(searchQuery);
        setResults(searchResults || []);
      }
    } catch (error) {
      console.error("Search error:", error);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    setIsOpen(true);

    if (value.length > 0) {
      setIsLoading(true);
    }
  };

  const handleResultClick = (result) => {
    setQuery("");
    setIsOpen(false);

    if (showRecentSearches) {
      const newRecent = [
        result,
        ...recentSearches.filter((item) => item.id !== result.id),
      ].slice(0, 5);
      setRecentSearches(newRecent);
      localStorage.setItem("recentSearches", JSON.stringify(newRecent));
    }

    if (onResultSelect) {
      onResultSelect(result);
    }
  };

  const clearRecentSearch = (id) => {
    const filtered = recentSearches.filter((item) => item.id !== id);
    setRecentSearches(filtered);
    localStorage.setItem("recentSearches", JSON.stringify(filtered));
  };

  const clearAllRecent = () => {
    setRecentSearches([]);
    localStorage.removeItem("recentSearches");
  };

  const renderResultItem = (item, isRecent = false) => {
    const getIcon = () => {
      switch (item.type) {
        case "user":
          return <User className="w-4 h-4 text-gray-400" />;
        case "chat":
          return <MessageCircle className="w-4 h-4 text-gray-400" />;
        default:
          return <Search className="w-4 h-4 text-gray-400" />;
      }
    };

    return (
      <motion.div
        initial={{ opacity: 0, y: -5 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center space-x-3 p-3 hover:bg-gray-50 cursor-pointer group"
        onClick={() => handleResultClick(item)}
      >
        {isRecent && <Clock className="w-4 h-4 text-gray-400" />}

        {item.avatar ? (
          <Avatar
            src={item.avatar}
            alt={item.title}
            size="sm"
            fallbackText={item.title}
          />
        ) : (
          <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
            {getIcon()}
          </div>
        )}

        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 truncate">
            {item.title}
          </p>
          {item.subtitle && (
            <p className="text-xs text-gray-500 truncate">{item.subtitle}</p>
          )}
        </div>

        {isRecent && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              clearRecentSearch(item.id);
            }}
            className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-200 rounded"
          >
            <X className="w-3 h-3 text-gray-400" />
          </button>
        )}
      </motion.div>
    );
  };

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <Input
        ref={inputRef}
        type="text"
        placeholder={placeholder}
        value={query}
        onChange={handleInputChange}
        onFocus={() => setIsOpen(true)}
        leftIcon={<Search />}
        rightIcon={
          query && (
            <button
              onClick={() => {
                setQuery("");
                setResults([]);
                inputRef.current?.focus();
              }}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          )
        }
      />

      <AnimatePresence>
        {isOpen && (query || recentSearches.length > 0) && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 max-h-96 overflow-y-auto z-50"
          >
            {isLoading && (
              <div className="p-4 text-center">
                <div className="inline-flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-600"></div>
                  <span className="text-sm text-gray-500">Searching...</span>
                </div>
              </div>
            )}

            {!isLoading && results.length > 0 && (
              <div>
                <div className="px-3 py-2 text-xs font-medium text-gray-500 bg-gray-50 border-b">
                  Search Results
                </div>
                {results.map((result) => (
                  <div key={result.id}>{renderResultItem(result)}</div>
                ))}
              </div>
            )}

            {!isLoading &&
              !query &&
              showRecentSearches &&
              recentSearches.length > 0 && (
                <div>
                  <div className="flex items-center justify-between px-3 py-2 text-xs font-medium text-gray-500 bg-gray-50 border-b">
                    <span>Recent Searches</span>
                    <button
                      onClick={clearAllRecent}
                      className="text-primary-600 hover:text-primary-700"
                    >
                      Clear all
                    </button>
                  </div>
                  {recentSearches.map((item) => (
                    <div key={`recent-${item.id}`}>
                      {renderResultItem(item, true)}
                    </div>
                  ))}
                </div>
              )}

            {!isLoading && query && results.length === 0 && (
              <div className="p-4 text-center text-gray-500">
                <Search className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                <p className="text-sm">No results found for "{query}"</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

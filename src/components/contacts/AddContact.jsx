import React, { useState } from "react";
import { motion } from "framer-motion";
import { Search, UserPlus, Mail, AtSign } from "lucide-react";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";
import { Avatar } from "../ui/Avatar";
import { useDebounce } from "../../hooks/useDebounce";
import toast from "react-hot-toast";

export const AddContact = ({ onClose }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [addingContacts, setAddingContacts] = useState(new Set());

  const debouncedQuery = useDebounce(searchQuery, 500);

  React.useEffect(() => {
    if (debouncedQuery && debouncedQuery.length > 2) {
      searchUsers(debouncedQuery);
    } else {
      setSearchResults([]);
    }
  }, [debouncedQuery]);

  const searchUsers = async (query) => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const mockResults = [
        {
          id: "1",
          username: "john_doe",
          firstName: "John",
          lastName: "Doe",
          email: "john@example.com",
          avatar: null,
          isOnline: true,
        },
        {
          id: "2",
          username: "jane_smith",
          firstName: "Jane",
          lastName: "Smith",
          email: "jane@example.com",
          avatar: null,
          isOnline: false,
        },
      ].filter(
        (user) =>
          user.username.includes(query.toLowerCase()) ||
          user.firstName.toLowerCase().includes(query.toLowerCase()) ||
          user.email.includes(query.toLowerCase())
      );

      setSearchResults(mockResults);
    } catch (error) {
      console.error("Search error:", error);
      toast.error("Failed to search users");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddContact = async (user) => {
    setAddingContacts((prev) => new Set([...prev, user.id]));

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast.success(`Added ${user.firstName} to your contacts`);

      setSearchResults((prev) => prev.filter((u) => u.id !== user.id));
    } catch (error) {
      console.error("Add contact error:", error);
      toast.error("Failed to add contact");
    } finally {
      setAddingContacts((prev) => {
        const newSet = new Set(prev);
        newSet.delete(user.id);
        return newSet;
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Search Input */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Search for users
        </label>
        <Input
          type="text"
          placeholder="Search by username, email, or name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          leftIcon={<Search />}
          autoFocus
        />
        <p className="text-xs text-gray-500 mt-1">
          Enter at least 3 characters to search
        </p>
      </div>

      {/* Search Results */}
      <div className="max-h-80 overflow-y-auto">
        {isLoading && (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          </div>
        )}

        {!isLoading && searchQuery && searchResults.length === 0 && (
          <div className="text-center py-8">
            <Search className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No users found for "{searchQuery}"</p>
          </div>
        )}

        {searchResults.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-700 mb-3">
              Search Results
            </h3>

            {searchResults.map((user) => (
              <motion.div
                key={user.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <Avatar
                    src={user.avatar}
                    alt={user.firstName}
                    size="md"
                    isOnline={user.isOnline}
                    fallbackText={user.firstName}
                  />

                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {user.firstName} {user.lastName}
                    </p>
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <span className="flex items-center">
                        <AtSign className="w-3 h-3 mr-1" />
                        {user.username}
                      </span>
                      <span className="flex items-center">
                        <Mail className="w-3 h-3 mr-1" />
                        {user.email}
                      </span>
                    </div>
                  </div>
                </div>

                <Button
                  size="sm"
                  onClick={() => handleAddContact(user)}
                  loading={addingContacts.has(user.id)}
                  disabled={addingContacts.has(user.id)}
                >
                  <UserPlus className="w-4 h-4 mr-1" />
                  Add
                </Button>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
        <Button variant="secondary" onClick={onClose}>
          Cancel
        </Button>
      </div>
    </div>
  );
};

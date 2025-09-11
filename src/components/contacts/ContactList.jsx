import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { Plus, Search, UserPlus } from "lucide-react";
import { ContactItem } from "./ContactItem";
import { AddContact } from "./AddContact";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Modal } from "../ui/Modal";
import { fetchContacts } from "../../store/slices/chatSlice";

export const ContactList = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddContact, setShowAddContact] = useState(false);

  const dispatch = useDispatch();
  const { contacts, isLoading } = useSelector((state) => state.chat);

  useEffect(() => {
    dispatch(fetchContacts());
  }, [dispatch]);

  const filteredContacts = contacts.filter(
    (contact) =>
      contact.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.lastName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 bg-white">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-semibold text-gray-900">Contacts</h1>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowAddContact(true)}
              className="rounded-full p-2"
            >
              <Plus className="h-5 w-5" />
            </Button>
          </div>

          {/* Search */}
          <Input
            type="text"
            placeholder="Search contacts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            leftIcon={<Search />}
            className="w-full"
          />
        </div>

        {/* Contact list */}
        <div className="flex-1 overflow-y-auto scrollbar-thin">
          {isLoading ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            </div>
          ) : filteredContacts.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full p-8 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <UserPlus className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchQuery ? "No contacts found" : "No contacts yet"}
              </h3>
              <p className="text-gray-500 mb-4">
                {searchQuery
                  ? `No contacts match "${searchQuery}"`
                  : "Start by adding some contacts to chat with"}
              </p>
              {!searchQuery && (
                <Button onClick={() => setShowAddContact(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Contact
                </Button>
              )}
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {filteredContacts.map((contact, index) => (
                <motion.div
                  key={contact.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <ContactItem contact={contact} />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Add Contact Modal */}
      <Modal
        isOpen={showAddContact}
        onClose={() => setShowAddContact(false)}
        title="Add New Contact"
        size="md"
      >
        <AddContact onClose={() => setShowAddContact(false)} />
      </Modal>
    </>
  );
};

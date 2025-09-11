import React from "react";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import { Edit, Mail, Calendar, MapPin, Phone } from "lucide-react";
import { Avatar } from "../ui/Avatar";
import { Button } from "../ui/Button";
import { formatDate } from "../../utils/formatters";

export const ProfileView = ({ onEdit }) => {
  const { user } = useSelector((state) => state.auth);

  if (!user) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-8"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div className="flex items-center space-x-6">
          <Avatar
            src={user.avatar}
            alt={user.firstName}
            size="2xl"
            fallbackText={user.firstName}
          />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {user.firstName} {user.lastName}
            </h1>
            <p className="text-lg text-gray-600">@{user.username}</p>
            <div className="flex items-center space-x-2 mt-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-500">Online</span>
            </div>
          </div>
        </div>

        <Button onClick={onEdit} variant="secondary">
          <Edit className="h-4 w-4 mr-2" />
          Edit Profile
        </Button>
      </div>

      {/* Bio */}
      {user.bio && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">About</h3>
          <p className="text-gray-600 leading-relaxed">{user.bio}</p>
        </div>
      )}

      {/* Contact Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Contact Information
          </h3>
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gray-100 rounded-lg">
                <Mail className="h-4 w-4 text-gray-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="text-gray-900">{user.email}</p>
              </div>
            </div>

            {user.phone && (
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <Phone className="h-4 w-4 text-gray-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="text-gray-900">{user.phone}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Account Details
          </h3>
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gray-100 rounded-lg">
                <Calendar className="h-4 w-4 text-gray-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Joined</p>
                <p className="text-gray-900">{formatDate(user.createdAt)}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gray-100 rounded-lg">
                <MapPin className="h-4 w-4 text-gray-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Last seen</p>
                <p className="text-gray-900">
                  {formatDate(user.lastSeen || user.updatedAt)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Activity Stats */}
      <div className="mt-8 pt-8 border-t border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Activity</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 rounded-lg p-4 text-center">
            <p className="text-2xl font-bold text-blue-600">12</p>
            <p className="text-sm text-blue-600">Total Chats</p>
          </div>
          <div className="bg-green-50 rounded-lg p-4 text-center">
            <p className="text-2xl font-bold text-green-600">248</p>
            <p className="text-sm text-green-600">Messages Sent</p>
          </div>
          <div className="bg-purple-50 rounded-lg p-4 text-center">
            <p className="text-2xl font-bold text-purple-600">5</p>
            <p className="text-sm text-purple-600">Groups</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

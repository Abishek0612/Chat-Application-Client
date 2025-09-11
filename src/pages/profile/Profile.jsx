import React, { useState } from "react";
import { motion } from "framer-motion";
import { ProfileView } from "../../components/profile/ProfileView";
import { ProfileEdit } from "../../components/profile/ProfileEdit";

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-sm border border-gray-200"
      >
        {isEditing ? (
          <ProfileEdit onCancel={() => setIsEditing(false)} />
        ) : (
          <ProfileView onEdit={() => setIsEditing(true)} />
        )}
      </motion.div>
    </div>
  );
};

export default Profile;

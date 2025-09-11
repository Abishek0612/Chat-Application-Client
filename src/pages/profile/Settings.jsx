import React, { useState } from "react";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import {
  Bell,
  Moon,
  Globe,
  Shield,
  Volume2,
  Eye,
  Smartphone,
  Download,
  Trash2,
} from "lucide-react";
import { Button } from "../../components/ui/Button";
import {
  updateNotificationSettings,
  setTheme,
} from "../../store/slices/uiSlice";
import { logoutUser } from "../../store/slices/authSlice";
import toast from "react-hot-toast";

const Settings = () => {
  const dispatch = useDispatch();
  const { notifications, theme } = useSelector((state) => state.ui);
  const { user } = useSelector((state) => state.auth);

  const [settings, setSettings] = useState({
    notifications: notifications,
    theme: theme,
    language: "en",
    autoDownload: {
      photos: true,
      videos: false,
      documents: false,
    },
    privacy: {
      readReceipts: true,
      lastSeen: true,
      profilePhoto: "everyone",
      status: "contacts",
    },
  });

  const handleNotificationChange = (key, value) => {
    const newNotifications = { ...settings.notifications, [key]: value };
    setSettings((prev) => ({ ...prev, notifications: newNotifications }));
    dispatch(updateNotificationSettings(newNotifications));
  };

  const handleThemeChange = (newTheme) => {
    setSettings((prev) => ({ ...prev, theme: newTheme }));
    dispatch(setTheme(newTheme));
    toast.success(`Theme changed to ${newTheme}`);
  };

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  const settingSections = [
    {
      title: "Notifications",
      icon: Bell,
      items: [
        {
          label: "Enable Notifications",
          description: "Receive notifications for new messages",
          type: "toggle",
          value: settings.notifications.enabled,
          onChange: (value) => handleNotificationChange("enabled", value),
        },
        {
          label: "Sound",
          description: "Play sound for notifications",
          type: "toggle",
          value: settings.notifications.sound,
          onChange: (value) => handleNotificationChange("sound", value),
        },
        {
          label: "Desktop Notifications",
          description: "Show notifications on desktop",
          type: "toggle",
          value: settings.notifications.desktop,
          onChange: (value) => handleNotificationChange("desktop", value),
        },
      ],
    },
    {
      title: "Appearance",
      icon: Moon,
      items: [
        {
          label: "Theme",
          description: "Choose your preferred theme",
          type: "select",
          value: settings.theme,
          options: [
            { value: "light", label: "Light" },
            { value: "dark", label: "Dark" },
            { value: "system", label: "System" },
          ],
          onChange: handleThemeChange,
        },
      ],
    },
    {
      title: "Privacy",
      icon: Shield,
      items: [
        {
          label: "Read Receipts",
          description: "Let others know when you read their messages",
          type: "toggle",
          value: settings.privacy.readReceipts,
          onChange: (value) =>
            setSettings((prev) => ({
              ...prev,
              privacy: { ...prev.privacy, readReceipts: value },
            })),
        },
        {
          label: "Last Seen",
          description: "Show when you were last online",
          type: "toggle",
          value: settings.privacy.lastSeen,
          onChange: (value) =>
            setSettings((prev) => ({
              ...prev,
              privacy: { ...prev.privacy, lastSeen: value },
            })),
        },
      ],
    },
    {
      title: "Storage",
      icon: Download,
      items: [
        {
          label: "Auto-download Photos",
          description: "Automatically download photos",
          type: "toggle",
          value: settings.autoDownload.photos,
          onChange: (value) =>
            setSettings((prev) => ({
              ...prev,
              autoDownload: { ...prev.autoDownload, photos: value },
            })),
        },
        {
          label: "Auto-download Videos",
          description: "Automatically download videos",
          type: "toggle",
          value: settings.autoDownload.videos,
          onChange: (value) =>
            setSettings((prev) => ({
              ...prev,
              autoDownload: { ...prev.autoDownload, videos: value },
            })),
        },
      ],
    },
  ];

  return (
    <div className="max-w-4xl mx-auto p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        {/* Header */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Settings</h1>
          <p className="text-gray-600">
            Manage your account and app preferences
          </p>
        </div>

        {/* Settings Sections */}
        {settingSections.map((section, sectionIndex) => (
          <motion.div
            key={section.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: sectionIndex * 0.1 }}
            className="bg-white rounded-lg shadow-sm border border-gray-200"
          >
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-primary-100 rounded-lg">
                  <section.icon className="h-5 w-5 text-primary-600" />
                </div>
                <h2 className="text-lg font-semibold text-gray-900">
                  {section.title}
                </h2>
              </div>
            </div>

            <div className="p-6 space-y-4">
              {section.items.map((item, itemIndex) => (
                <div
                  key={item.label}
                  className="flex items-center justify-between"
                >
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">
                      {item.label}
                    </h3>
                    <p className="text-sm text-gray-500">{item.description}</p>
                  </div>

                  <div>
                    {item.type === "toggle" && (
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={item.value}
                          onChange={(e) => item.onChange(e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                      </label>
                    )}

                    {item.type === "select" && (
                      <select
                        value={item.value}
                        onChange={(e) => item.onChange(e.target.value)}
                        className="block w-32 rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 text-sm"
                      >
                        {item.options.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        ))}

        {/* Account Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200"
        >
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Account</h2>
          </div>

          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-900">
                  Export Data
                </h3>
                <p className="text-sm text-gray-500">
                  Download a copy of your data
                </p>
              </div>
              <Button variant="secondary" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-red-600">Sign Out</h3>
                <p className="text-sm text-gray-500">
                  Sign out of your account
                </p>
              </div>
              <Button variant="danger" size="sm" onClick={handleLogout}>
                Sign Out
              </Button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-red-600">
                  Delete Account
                </h3>
                <p className="text-sm text-gray-500">
                  Permanently delete your account
                </p>
              </div>
              <Button variant="danger" size="sm">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Settings;

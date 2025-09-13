import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import { useDispatch } from "react-redux";
import { Camera, Upload, X } from "lucide-react";
import { Avatar } from "../ui/Avatar";
import { Button } from "../ui/Button";
import { updateUserProfile } from "../../store/slices/authSlice";
import { authAPI } from "../../store/api/authApi";
import toast from "react-hot-toast";

export const AvatarUpload = ({ currentAvatar, onUploadSuccess }) => {
  const dispatch = useDispatch();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [previewUrl, setPreviewUrl] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      handleUpload(file);
    }
  };

  const validateFile = (file) => {
    const maxSize = 5 * 1024 * 1024;
    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];

    if (file.size > maxSize) {
      throw new Error("File size must be less than 5MB");
    }

    if (!allowedTypes.includes(file.type)) {
      throw new Error(
        "File type not supported. Please use JPEG, PNG, GIF, or WebP"
      );
    }
  };

  const handleUpload = async (file) => {
    try {
      validateFile(file);

      const reader = new FileReader();
      reader.onload = (e) => setPreviewUrl(e.target.result);
      reader.readAsDataURL(file);

      setIsUploading(true);
      setUploadProgress(0);

      const formData = new FormData();
      formData.append("avatar", file);

      const response = await authAPI.uploadAvatar(formData);

      const newAvatarUrl = response.data.data?.user?.avatar;

      if (newAvatarUrl) {
        dispatch(updateUserProfile({ avatar: newAvatarUrl }));
        toast.success("Avatar updated successfully");
        onUploadSuccess?.(newAvatarUrl);
        setPreviewUrl(null);
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error(error.message || "Failed to upload avatar");
      setPreviewUrl(null);
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      handleUpload(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const removePreview = () => {
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const displayAvatar = previewUrl || currentAvatar;

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="relative">
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="relative cursor-pointer"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onClick={() => !isUploading && fileInputRef.current?.click()}
        >
          <Avatar
            src={displayAvatar}
            size="2xl"
            className="border-4 border-white shadow-lg"
          />

          <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity cursor-pointer">
            <Camera className="h-8 w-8 text-white" />
          </div>

          {isUploading && (
            <div className="absolute inset-0 bg-black bg-opacity-70 rounded-full flex items-center justify-center">
              <div className="text-center text-white">
                <div className="text-sm font-medium">{uploadProgress}%</div>
                <div className="w-16 bg-gray-600 rounded-full h-1 mt-1">
                  <div
                    className="bg-white h-1 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            </div>
          )}
        </motion.div>

        {previewUrl && !isUploading && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              removePreview();
            }}
            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      <div className="flex space-x-2">
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
        >
          <Upload className="h-4 w-4 mr-2" />
          Choose Photo
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => {
            const input = document.createElement("input");
            input.type = "file";
            input.accept = "image/*";
            input.capture = "environment";
            input.onchange = (e) => {
              const file = e.target.files?.[0];
              if (file) {
                handleUpload(file);
              }
            };
            input.click();
          }}
          disabled={isUploading}
        >
          <Camera className="h-4 w-4 mr-2" />
          Camera
        </Button>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      <p className="text-xs text-gray-500 text-center max-w-xs">
        Upload a photo to personalize your profile. Max size: 5MB. Supported
        formats: JPG, PNG, GIF, WebP.
      </p>
    </div>
  );
};

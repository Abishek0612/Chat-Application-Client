import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Camera, Upload, X } from "lucide-react";
import { Avatar } from "../ui/Avatar";
import { Button } from "../ui/Button";
import { uploadService } from "../../services/upload";
import toast from "react-hot-toast";

export const AvatarUpload = ({ currentAvatar, onUploadSuccess }) => {
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

  const handleUpload = async (file) => {
    try {
      uploadService.validateFile(file, {
        maxSize: 5 * 1024 * 1024,
        allowedTypes: ["image/*"],
      });

      const reader = new FileReader();
      reader.onload = (e) => setPreviewUrl(e.target.result);
      reader.readAsDataURL(file);

      setIsUploading(true);
      setUploadProgress(0);

      const result = await uploadService.uploadAvatar(file, (progress) => {
        setUploadProgress(progress);
      });

      toast.success("Avatar updated successfully");
      onUploadSuccess?.(result.fileUrl);
    } catch (error) {
      console.error("Upload error:", error);
      toast.error(error.message || "Failed to upload avatar");
      setPreviewUrl(null);
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
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

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="relative">
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="relative"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          <Avatar
            src={previewUrl || currentAvatar}
            size="2xl"
            className="cursor-pointer border-4 border-white shadow-lg"
          />

          {/* Upload overlay */}
          <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity cursor-pointer">
            <Camera className="h-8 w-8 text-white" />
          </div>

          {/* Upload progress */}
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

        {/* Remove preview button */}
        {previewUrl && !isUploading && (
          <button
            onClick={removePreview}
            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Upload buttons */}
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

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Upload instructions */}
      <p className="text-xs text-gray-500 text-center max-w-xs">
        Upload a photo to personalize your profile. Max size: 5MB. Supported
        formats: JPG, PNG, GIF, WebP.
      </p>
    </div>
  );
};

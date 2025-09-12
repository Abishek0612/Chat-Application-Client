import React, { useState, useRef, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { Send, Paperclip, Smile, Mic, Image } from "lucide-react";
import { Button } from "../ui/Button";
import EmojiPicker from "emoji-picker-react";
import api from "../../services/api";
import toast from "react-hot-toast";

export const MessageInput = ({
  onSendMessage,
  onTyping,
  onStopTyping,
  disabled,
}) => {
  const [message, setMessage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);
  const imageInputRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setMessage(value);

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    if (value.trim()) {
      onTyping?.();
      typingTimeoutRef.current = setTimeout(() => {
        onStopTyping?.();
      }, 1000);
    } else {
      onStopTyping?.();
    }

    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim() && !disabled && !isUploading) {
      onSendMessage(message.trim());
      setMessage("");

      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      onStopTyping?.();

      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleEmojiClick = (emojiData) => {
    setMessage((prev) => prev + emojiData.emoji);
    setShowEmojiPicker(false);
    textareaRef.current?.focus();
  };

  const uploadFile = async (file, type) => {
    if (!file) return;

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append("file", file);

      console.log("Uploading file:", file.name, file.type, file.size);

      const response = await api.post("/messages/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(percentCompleted);
          console.log("Upload progress:", percentCompleted + "%");
        },
      });

      console.log("Upload response:", response.data);

      if (response.data.success && response.data.data?.fileUrl) {
        const caption = type === "IMAGE" ? "" : file.name;

        onSendMessage(caption, type, {
          fileUrl: response.data.data.fileUrl,
          fileName: response.data.data.fileName || file.name,
          fileSize: response.data.data.fileSize || file.size,
        });

        toast.success("File uploaded successfully!");
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (error) {
      console.error("File upload error:", error);

      let errorMessage = "Failed to upload file";

      if (error.response?.status === 401) {
        errorMessage =
          "File upload service not configured. Please contact administrator.";
      } else if (error.response?.status === 413) {
        errorMessage = "File too large. Please choose a smaller file.";
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }

      toast.error(errorMessage);
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const maxSize = 10 * 1024 * 1024;
    const allowedTypes = [
      "application/pdf",
      "text/plain",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/zip",
      "application/x-rar-compressed",
    ];

    if (file.size > maxSize) {
      toast.error("File size must be less than 10MB");
      e.target.value = "";
      return;
    }

    if (!allowedTypes.includes(file.type)) {
      toast.error("File type not supported");
      e.target.value = "";
      return;
    }

    await uploadFile(file, "FILE");
    e.target.value = "";
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const maxSize = 5 * 1024 * 1024;
    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];

    if (file.size > maxSize) {
      toast.error("Image size must be less than 5MB");
      e.target.value = "";
      return;
    }

    if (!allowedTypes.includes(file.type)) {
      toast.error("Image type not supported");
      e.target.value = "";
      return;
    }

    await uploadFile(file, "IMAGE");
    e.target.value = "";
  };

  const startRecording = () => setIsRecording(true);
  const stopRecording = () => setIsRecording(false);

  return (
    <div className="border-t border-gray-200 bg-white p-4">
      <form onSubmit={handleSubmit}>
        <div className="flex items-end space-x-2">
          <div className="relative">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="rounded-full p-2"
              disabled={disabled || isUploading}
              onClick={() => fileInputRef.current?.click()}
            >
              <Paperclip className="h-5 w-5" />
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              onChange={handleFileUpload}
              accept=".pdf,.doc,.docx,.txt,.zip,.rar"
            />
          </div>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => imageInputRef.current?.click()}
            className="rounded-full p-2"
            disabled={disabled || isUploading}
          >
            <Image className="h-5 w-5" />
          </Button>
          <input
            ref={imageInputRef}
            type="file"
            className="hidden"
            onChange={handleImageUpload}
            accept="image/*"
          />

          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={message}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder={isUploading ? "Uploading..." : "Type a message..."}
              className="w-full resize-none rounded-2xl border border-gray-300 px-4 py-2 pr-12 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent max-h-32 scrollbar-thin disabled:bg-gray-100"
              rows={1}
              disabled={disabled || isUploading}
            />
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className="rounded-full p-1"
                disabled={disabled || isUploading}
              >
                <Smile className="h-4 w-4" />
              </Button>
            </div>
            {showEmojiPicker && (
              <div className="absolute bottom-full right-0 mb-2 z-50">
                <EmojiPicker
                  onEmojiClick={handleEmojiClick}
                  searchDisabled
                  skinTonesDisabled
                  width={300}
                  height={400}
                />
              </div>
            )}
          </div>

          {message.trim() ? (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
            >
              <Button
                type="submit"
                className="rounded-full p-2 h-10 w-10"
                disabled={disabled || isUploading}
              >
                <Send className="h-4 w-4" />
              </Button>
            </motion.div>
          ) : (
            <Button
              type="button"
              variant={isRecording ? "danger" : "ghost"}
              size="sm"
              onClick={isRecording ? stopRecording : startRecording}
              className="rounded-full p-2"
              disabled={disabled || isUploading}
            >
              <Mic
                className={`h-5 w-5 ${isRecording ? "animate-pulse" : ""}`}
              />
            </Button>
          )}
        </div>

        {isUploading && (
          <div className="mt-2 flex items-center justify-center">
            <div className="w-full bg-gray-200 rounded-full h-2 mr-2">
              <div
                className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
            <span className="text-sm text-gray-500 flex-shrink-0">
              {uploadProgress}%
            </span>
          </div>
        )}
      </form>
    </div>
  );
};

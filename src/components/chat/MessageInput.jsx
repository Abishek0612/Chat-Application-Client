import React, { useState, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { Send, Paperclip, Smile, Mic, Image } from "lucide-react";
import { Button } from "../ui/Button";
import { useDebounce } from "../../hooks/useDebounce";
import EmojiPicker from "emoji-picker-react";

export const MessageInput = ({ onSendMessage, onTyping, onStopTyping }) => {
  const [message, setMessage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);
  const imageInputRef = useRef(null);

  const debouncedStopTyping = useDebounce(() => {
    onStopTyping?.();
  }, 1000);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setMessage(value);

    if (value.trim()) {
      onTyping?.();
      debouncedStopTyping();
    } else {
      onStopTyping?.();
    }

    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = Math.min(textarea.scrollHeight, 120) + "px";
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (message.trim()) {
      onSendMessage(message.trim());
      setMessage("");
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

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      console.log("File selected:", file);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      console.log("Image selected:", file);
    }
  };

  const startRecording = () => {
    setIsRecording(true);
  };

  const stopRecording = () => {
    setIsRecording(false);
  };

  return (
    <div className="border-t border-gray-200 bg-white p-4">
      <form onSubmit={handleSubmit}>
        <div className="flex items-end space-x-2">
          {/* Attachment button */}
          <div className="relative">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="rounded-full p-2"
            >
              <Paperclip className="h-5 w-5" />
            </Button>

            {/* Hidden file inputs */}
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              onChange={handleFileUpload}
              accept=".pdf,.doc,.docx,.txt,.zip,.rar"
            />
            <input
              ref={imageInputRef}
              type="file"
              className="hidden"
              onChange={handleImageUpload}
              accept="image/*"
            />
          </div>

          {/* Image upload button */}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => imageInputRef.current?.click()}
            className="rounded-full p-2"
          >
            <Image className="h-5 w-5" />
          </Button>

          {/* Message input */}
          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={message}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="Type a message..."
              className="w-full resize-none rounded-2xl border border-gray-300 px-4 py-2 pr-12 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent max-h-32 scrollbar-thin"
              rows={1}
            />

            {/* Emoji button */}
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className="rounded-full p-1"
              >
                <Smile className="h-4 w-4" />
              </Button>
            </div>

            {/* Emoji picker */}
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

          {/* Send/Voice button */}
          {message.trim() ? (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
            >
              <Button type="submit" className="rounded-full p-2 h-10 w-10">
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
            >
              <Mic
                className={`h-5 w-5 ${isRecording ? "animate-pulse" : ""}`}
              />
            </Button>
          )}
        </div>
      </form>
    </div>
  );
};

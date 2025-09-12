import api from "./api";

class UploadService {
  async uploadFile(file, options = {}) {
    const formData = new FormData();
    formData.append("file", file);

    if (options.folder) {
      formData.append("folder", options.folder);
    }

    try {
      const response = await api.post("/messages/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          if (options.onProgress) {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            options.onProgress(percentCompleted);
          }
        },
      });

      return {
        success: true,
        data: response.data.data || response.data,
      };
    } catch (error) {
      console.error("Upload error:", error);

      let errorMessage = "Failed to upload file";

      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.status === 401) {
        errorMessage =
          "File upload service not configured properly. Please contact administrator.";
      } else if (error.response?.status === 413) {
        errorMessage = "File too large. Please choose a smaller file.";
      } else if (error.message) {
        errorMessage = error.message;
      }

      throw new Error(errorMessage);
    }
  }

  async uploadAvatar(file, onProgress) {
    const formData = new FormData();
    formData.append("avatar", file);

    try {
      const response = await api.post("/users/avatar", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          if (onProgress) {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            onProgress(percentCompleted);
          }
        },
      });

      return {
        success: true,
        fileUrl: response.data.data?.user?.avatar || response.data.user?.avatar,
      };
    } catch (error) {
      console.error("Avatar upload error:", error);
      throw new Error(
        error.response?.data?.message || "Failed to upload avatar"
      );
    }
  }

  async uploadChatFile(file, onProgress) {
    return this.uploadFile(file, {
      folder: "chat-files",
      onProgress,
    });
  }

  async uploadImage(file, onProgress) {
    return this.uploadFile(file, {
      folder: "images",
      onProgress,
    });
  }

  validateFile(file, options = {}) {
    const {
      maxSize = 10 * 1024 * 1024,
      allowedTypes = ["image/*", "application/pdf", "text/*"],
    } = options;

    if (file.size > maxSize) {
      throw new Error(`File size must be less than ${maxSize / 1024 / 1024}MB`);
    }

    const isValidType = allowedTypes.some((type) => {
      if (type.endsWith("/*")) {
        return file.type.startsWith(type.slice(0, -1));
      }
      return file.type === type;
    });

    if (!isValidType) {
      throw new Error(`File type ${file.type} is not allowed`);
    }

    return true;
  }

  getFileIcon(fileType) {
    if (fileType.startsWith("image/")) return "🖼️";
    if (fileType.startsWith("video/")) return "🎥";
    if (fileType.startsWith("audio/")) return "🎵";
    if (fileType.includes("pdf")) return "📄";
    if (fileType.includes("word")) return "📝";
    if (fileType.includes("excel")) return "📊";
    if (fileType.includes("zip") || fileType.includes("rar")) return "📦";
    return "📎";
  }

  formatFileSize(bytes) {
    if (bytes === 0) return "0 Bytes";

    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  }
}

export const uploadService = new UploadService();

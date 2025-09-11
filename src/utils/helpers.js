import { DEFAULT_AVATAR_COLORS, REGEX_PATTERNS } from "./constants";

export const generateInitials = (name) => {
  if (!name) return "?";

  return name
    .split(" ")
    .map((word) => word.charAt(0))
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

export const generateAvatarColor = (str) => {
  if (!str) return DEFAULT_AVATAR_COLORS[0];

  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }

  const index = Math.abs(hash) % DEFAULT_AVATAR_COLORS.length;
  return DEFAULT_AVATAR_COLORS[index];
};

export const formatFileSize = (bytes) => {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

export const getFileType = (mimeType) => {
  if (!mimeType) return "unknown";

  if (mimeType.startsWith("image/")) return "image";
  if (mimeType.startsWith("video/")) return "video";
  if (mimeType.startsWith("audio/")) return "audio";
  if (mimeType.includes("pdf")) return "pdf";
  if (mimeType.includes("word") || mimeType.includes("document"))
    return "document";
  if (mimeType.includes("excel") || mimeType.includes("spreadsheet"))
    return "spreadsheet";
  if (mimeType.includes("powerpoint") || mimeType.includes("presentation"))
    return "presentation";
  if (
    mimeType.includes("zip") ||
    mimeType.includes("rar") ||
    mimeType.includes("archive")
  )
    return "archive";
  if (mimeType.includes("text")) return "text";

  return "file";
};

export const getFileIcon = (mimeType) => {
  const type = getFileType(mimeType);

  const icons = {
    image: "🖼️",
    video: "🎥",
    audio: "🎵",
    pdf: "📄",
    document: "📝",
    spreadsheet: "📊",
    presentation: "📽️",
    archive: "📦",
    text: "📄",
    file: "📎",
    unknown: "❓",
  };

  return icons[type] || icons.unknown;
};

export const truncateText = (text, maxLength = 50) => {
  if (!text) return "";
  if (text.length <= maxLength) return text;

  return text.substring(0, maxLength).trim() + "...";
};

export const highlightText = (text, query) => {
  if (!query || !text) return text;

  const regex = new RegExp(`(${query})`, "gi");
  return text.replace(regex, "<mark>$1</mark>");
};

export const validateEmail = (email) => {
  return REGEX_PATTERNS.EMAIL.test(email);
};

export const validatePhone = (phone) => {
  return REGEX_PATTERNS.PHONE.test(phone);
};

export const validateUsername = (username) => {
  return REGEX_PATTERNS.USERNAME.test(username);
};

export const validateURL = (url) => {
  return REGEX_PATTERNS.URL.test(url);
};

export const isValidPassword = (password) => {
  if (password.length < 6) return false;

  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);

  return hasUpperCase && hasLowerCase && hasNumbers;
};

export const generateChatName = (members, currentUserId) => {
  const otherMembers = members.filter(
    (member) => member.userId !== currentUserId
  );

  if (otherMembers.length === 0) return "You";
  if (otherMembers.length === 1) {
    const user = otherMembers[0].user;
    return `${user.firstName} ${user.lastName || ""}`.trim();
  }

  return `${otherMembers[0].user.firstName} and ${
    otherMembers.length - 1
  } others`;
};

export const sortMessagesByDate = (messages) => {
  return [...messages].sort(
    (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
  );
};

export const groupMessagesByDate = (messages) => {
  const groups = {};

  messages.forEach((message) => {
    const date = new Date(message.createdAt).toDateString();
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(message);
  });

  return groups;
};

export const shouldShowAvatar = (message, previousMessage, currentUserId) => {
  if (!previousMessage) return true;
  if (message.senderId !== previousMessage.senderId) return true;

  const timeDiff =
    new Date(message.createdAt) - new Date(previousMessage.createdAt);
  return timeDiff > 5 * 60 * 1000;
};

export const isImageFile = (file) => {
  return file.type.startsWith("image/");
};

export const isVideoFile = (file) => {
  return file.type.startsWith("video/");
};

export const isAudioFile = (file) => {
  return file.type.startsWith("audio/");
};

export const compressImage = (file, maxWidth = 800, quality = 0.8) => {
  return new Promise((resolve) => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();

    img.onload = () => {
      const { width, height } = img;
      const ratio = Math.min(maxWidth / width, maxWidth / height);

      canvas.width = width * ratio;
      canvas.height = height * ratio;

      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      canvas.toBlob(resolve, "image/jpeg", quality);
    };

    img.src = URL.createObjectURL(file);
  });
};

export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
      document.execCommand("copy");
      document.body.removeChild(textArea);
      return true;
    } catch (fallbackError) {
      document.body.removeChild(textArea);
      return false;
    }
  }
};

export const downloadFile = (url, filename) => {
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const detectDevice = () => {
  const userAgent = navigator.userAgent;

  return {
    isMobile:
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        userAgent
      ),
    isTablet: /iPad|Android(?!.*Mobile)/i.test(userAgent),
    isDesktop:
      !/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        userAgent
      ),
    isIOS: /iPad|iPhone|iPod/.test(userAgent),
    isAndroid: /Android/.test(userAgent),
  };
};

export const throttle = (func, delay) => {
  let timeoutId;
  let lastExecTime = 0;

  return function (...args) {
    const currentTime = Date.now();

    if (currentTime - lastExecTime > delay) {
      func.apply(this, args);
      lastExecTime = currentTime;
    } else {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        func.apply(this, args);
        lastExecTime = Date.now();
      }, delay - (currentTime - lastExecTime));
    }
  };
};

export const debounce = (func, delay) => {
  let timeoutId;

  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
};

export const generateUniqueId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

export const parseJWT = (token) => {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );

    return JSON.parse(jsonPayload);
  } catch (error) {
    return null;
  }
};

export const isTokenExpired = (token) => {
  if (!token) return true;

  const payload = parseJWT(token);
  if (!payload || !payload.exp) return true;

  return Date.now() >= payload.exp * 1000;
};

export const scrollToBottom = (element, smooth = true) => {
  if (element) {
    element.scrollTo({
      top: element.scrollHeight,
      behavior: smooth ? "smooth" : "auto",
    });
  }
};

export const getRandomColor = () => {
  return DEFAULT_AVATAR_COLORS[
    Math.floor(Math.random() * DEFAULT_AVATAR_COLORS.length)
  ];
};

export const createObjectURL = (file) => {
  return URL.createObjectURL(file);
};

export const revokeObjectURL = (url) => {
  URL.revokeObjectURL(url);
};

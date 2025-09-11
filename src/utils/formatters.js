import {
  formatDistanceToNow,
  format,
  isToday,
  isYesterday,
  isThisWeek,
  isThisYear,
} from "date-fns";

export const formatTime = (date) => {
  if (!date) return "";

  const messageDate = new Date(date);
  const now = new Date();

  if (isToday(messageDate)) {
    return format(messageDate, "HH:mm");
  } else if (isYesterday(messageDate)) {
    return "Yesterday";
  } else if (isThisWeek(messageDate)) {
    return format(messageDate, "EEEE");
  } else if (isThisYear(messageDate)) {
    return format(messageDate, "MMM d");
  } else {
    return format(messageDate, "MMM d, yyyy");
  }
};

export const formatDate = (date, options = {}) => {
  if (!date) return "";

  const messageDate = new Date(date);

  if (options.dateOnly) {
    if (isToday(messageDate)) {
      return "Today";
    } else if (isYesterday(messageDate)) {
      return "Yesterday";
    } else if (isThisYear(messageDate)) {
      return format(messageDate, "MMMM d");
    } else {
      return format(messageDate, "MMMM d, yyyy");
    }
  }

  if (options.relative) {
    return formatDistanceToNow(messageDate, { addSuffix: true });
  }

  if (options.full) {
    return format(messageDate, "MMMM d, yyyy 'at' HH:mm");
  }

  return format(messageDate, "MMM d, yyyy");
};

export const formatLastSeen = (date) => {
  if (!date) return "Never";

  const lastSeenDate = new Date(date);
  const now = new Date();
  const diffInMinutes = Math.floor((now - lastSeenDate) / (1000 * 60));

  if (diffInMinutes < 1) {
    return "Just now";
  } else if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes > 1 ? "s" : ""} ago`;
  } else if (diffInMinutes < 1440) {
    const hours = Math.floor(diffInMinutes / 60);
    return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  } else if (isYesterday(lastSeenDate)) {
    return `Yesterday at ${format(lastSeenDate, "HH:mm")}`;
  } else if (isThisWeek(lastSeenDate)) {
    return format(lastSeenDate, "EEEE 'at' HH:mm");
  } else {
    return formatDate(lastSeenDate);
  }
};

export const formatChatTime = (date) => {
  if (!date) return "";

  const messageDate = new Date(date);

  if (isToday(messageDate)) {
    return format(messageDate, "HH:mm");
  } else if (isYesterday(messageDate)) {
    return "Yesterday";
  } else if (isThisWeek(messageDate)) {
    return format(messageDate, "EEE");
  } else {
    return format(messageDate, "dd/MM");
  }
};

export const formatMessageTime = (date) => {
  if (!date) return "";

  const messageDate = new Date(date);
  return format(messageDate, "HH:mm");
};

export const formatMessageDate = (date) => {
  if (!date) return "";

  const messageDate = new Date(date);

  if (isToday(messageDate)) {
    return "Today";
  } else if (isYesterday(messageDate)) {
    return "Yesterday";
  } else if (isThisYear(messageDate)) {
    return format(messageDate, "MMMM d");
  } else {
    return format(messageDate, "MMMM d, yyyy");
  }
};

export const formatPhoneNumber = (phone) => {
  if (!phone) return "";

  const cleaned = phone.replace(/\D/g, "");

  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(
      6
    )}`;
  } else if (cleaned.length === 11 && cleaned[0] === "1") {
    return `+1 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(
      7
    )}`;
  }

  if (phone.startsWith("+")) {
    return phone;
  }

  return `+${cleaned}`;
};

export const formatUsername = (username) => {
  if (!username) return "";
  return username.startsWith("@") ? username : `@${username}`;
};

export const formatName = (firstName, lastName) => {
  if (!firstName && !lastName) return "Unknown User";
  if (!lastName) return firstName;
  return `${firstName} ${lastName}`;
};

export const formatInitials = (firstName, lastName) => {
  const first = firstName ? firstName.charAt(0).toUpperCase() : "";
  const last = lastName ? lastName.charAt(0).toUpperCase() : "";
  return first + last || "?";
};

export const formatFileSize = (bytes) => {
  if (bytes === 0) return "0 B";

  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
};

export const formatDuration = (seconds) => {
  if (!seconds || seconds < 0) return "0:00";

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
};

export const formatCount = (count) => {
  if (count < 1000) {
    return count.toString();
  } else if (count < 1000000) {
    return `${(count / 1000).toFixed(1)}K`;
  } else if (count < 1000000000) {
    return `${(count / 1000000).toFixed(1)}M`;
  } else {
    return `${(count / 1000000000).toFixed(1)}B`;
  }
};

export const formatPercentage = (value, total) => {
  if (!total || total === 0) return "0%";
  const percentage = (value / total) * 100;
  return `${percentage.toFixed(1)}%`;
};

export const formatCurrency = (amount, currency = "USD") => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
  }).format(amount);
};

export const formatRelativeTime = (date) => {
  if (!date) return "";

  const messageDate = new Date(date);
  const now = new Date();
  const diffInSeconds = Math.floor((now - messageDate) / 1000);

  if (diffInSeconds < 30) {
    return "just now";
  } else if (diffInSeconds < 60) {
    return `${diffInSeconds}s ago`;
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes}m ago`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours}h ago`;
  } else if (diffInSeconds < 604800) {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days}d ago`;
  } else {
    return formatDate(messageDate);
  }
};

export const formatSearchHighlight = (text, query) => {
  if (!query || !text) return text;

  const regex = new RegExp(
    `(${query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`,
    "gi"
  );
  return text.replace(regex, "<strong>$1</strong>");
};

export const formatMessagePreview = (message, maxLength = 50) => {
  if (!message) return "No messages yet";

  let preview = "";

  switch (message.type) {
    case "IMAGE":
      preview = "📷 Photo";
      break;
    case "VIDEO":
      preview = "🎥 Video";
      break;
    case "AUDIO":
      preview = "🎵 Audio";
      break;
    case "FILE":
      preview = `📎 ${message.fileName || "File"}`;
      break;
    default:
      preview = message.content || "";
  }

  if (preview.length > maxLength) {
    return preview.substring(0, maxLength) + "...";
  }

  return preview;
};

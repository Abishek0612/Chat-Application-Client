import { REGEX_PATTERNS } from "./constants";

export const validation = {
  required: (value, message = "This field is required") => {
    if (!value || value.toString().trim() === "") {
      return message;
    }
    return null;
  },

  email: (value, message = "Please enter a valid email address") => {
    if (value && !REGEX_PATTERNS.EMAIL.test(value)) {
      return message;
    }
    return null;
  },

  minLength: (minLength, message) => (value) => {
    if (value && value.length < minLength) {
      return message || `Must be at least ${minLength} characters`;
    }
    return null;
  },

  maxLength: (maxLength, message) => (value) => {
    if (value && value.length > maxLength) {
      return message || `Must be no more than ${maxLength} characters`;
    }
    return null;
  },

  pattern: (pattern, message) => (value) => {
    if (value && !pattern.test(value)) {
      return message || "Invalid format";
    }
    return null;
  },

  phone: (value, message = "Please enter a valid phone number") => {
    if (value && !REGEX_PATTERNS.PHONE.test(value)) {
      return message;
    }
    return null;
  },

  username: (
    value,
    message = "Username must be 3-20 characters and contain only letters, numbers, and underscores"
  ) => {
    if (value && !REGEX_PATTERNS.USERNAME.test(value)) {
      return message;
    }
    return null;
  },

  password: (
    value,
    message = "Password must be at least 6 characters and contain uppercase, lowercase, and number"
  ) => {
    if (!value) return null;

    if (value.length < 6) {
      return "Password must be at least 6 characters";
    }

    if (!/(?=.*[a-z])/.test(value)) {
      return "Password must contain at least one lowercase letter";
    }

    if (!/(?=.*[A-Z])/.test(value)) {
      return "Password must contain at least one uppercase letter";
    }

    if (!/(?=.*\d)/.test(value)) {
      return "Password must contain at least one number";
    }

    return null;
  },

  confirmPassword:
    (password) =>
    (value, message = "Passwords do not match") => {
      if (value && value !== password) {
        return message;
      }
      return null;
    },

  fileSize: (maxSize, message) => (file) => {
    if (file && file.size > maxSize) {
      return (
        message ||
        `File size must be less than ${Math.round(maxSize / 1024 / 1024)}MB`
      );
    }
    return null;
  },

  fileType: (allowedTypes, message) => (file) => {
    if (file && !allowedTypes.includes(file.type)) {
      return (
        message ||
        `File type not supported. Allowed types: ${allowedTypes.join(", ")}`
      );
    }
    return null;
  },

  url: (value, message = "Please enter a valid URL") => {
    if (value && !REGEX_PATTERNS.URL.test(value)) {
      return message;
    }
    return null;
  },

  number: (value, message = "Please enter a valid number") => {
    if (value && isNaN(Number(value))) {
      return message;
    }
    return null;
  },

  integer: (value, message = "Please enter a valid integer") => {
    if (value && (!Number.isInteger(Number(value)) || Number(value) < 0)) {
      return message;
    }
    return null;
  },

  range: (min, max, message) => (value) => {
    const num = Number(value);
    if (value && (num < min || num > max)) {
      return message || `Value must be between ${min} and ${max}`;
    }
    return null;
  },
};

export const validateForm = (formData, validationRules) => {
  const errors = {};

  Object.keys(validationRules).forEach((field) => {
    const rules = validationRules[field];
    const value = formData[field];

    for (const rule of rules) {
      const error = rule(value);
      if (error) {
        errors[field] = error;
        break;
      }
    }
  });

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export const createValidator = (rules) => {
  return (value) => {
    for (const rule of rules) {
      const error = rule(value);
      if (error) {
        return error;
      }
    }
    return null;
  };
};

export const validationRules = {
  email: [validation.required(), validation.email()],

  password: [validation.required(), validation.password()],

  confirmPassword: (password) => [
    validation.required(),
    validation.confirmPassword(password),
  ],

  username: [
    validation.required(),
    validation.minLength(3),
    validation.maxLength(20),
    validation.username(),
  ],

  firstName: [validation.required(), validation.maxLength(50)],

  lastName: [validation.maxLength(50)],

  phone: [validation.phone()],

  bio: [validation.maxLength(200)],

  chatName: [
    validation.required("Chat name is required"),
    validation.minLength(1),
    validation.maxLength(100),
  ],

  message: [
    validation.required("Message cannot be empty"),
    validation.maxLength(1000),
  ],

  file: (maxSize, allowedTypes) => [
    validation.fileSize(maxSize),
    validation.fileType(allowedTypes),
  ],
};

export const validateField = (value, rules) => {
  for (const rule of rules) {
    const error = rule(value);
    if (error) {
      return error;
    }
  }
  return null;
};

export const hasErrors = (errors) => {
  return Object.values(errors).some((error) => error !== null && error !== "");
};

export const getFirstError = (errors) => {
  const errorValues = Object.values(errors).filter(
    (error) => error !== null && error !== ""
  );
  return errorValues.length > 0 ? errorValues[0] : null;
};

Chat Application Frontend

# DESCRIPTION : This is the frontend part of my WhatsApp-style messaging application built for the Relatim technical challenge. What started as a basic messaging app requirement turned into a pretty comprehensive chat platform with lots of cool features.

# What I Built

This is a modern real-time chat application that feels familiar (think WhatsApp/Telegram) but with some extra bells and whistles. The core requirement was to have a sidebar with Chat and Contacts tabs, plus a top navigation - but I ended up building way more than that.

# Tech Stack

Core Framework:

React 18 - Obviously needed this for the MERN requirement.
Vite - Way faster than Create React App, and the hot reload is lightning quick during development

State Management:

Redux Toolkit - The requirements didn't specify this, but managing chat state, user auth, and real-time updates across components would be messy with just React state
RTK Query - Actually, I built custom API layers instead, but the pattern is similar.

Real-time Communication:

Socket.io Client - Had to make this feel like a real chat app, so messages appear instantly without refreshing.

Styling & UI:

Tailwind CSS - I can style components super fast with this, and the utility classes keep everything consistent
Framer Motion - Added smooth animations because modern apps just feel better with micro-interactions
Lucide React - Clean, consistent icons throughout the app

# Authentication:

Google OAuth - Beyond the basic login, I added social auth because that's what users expect these days

Form Handling:

React Hook Form - Makes form validation and error handling much cleaner than manual state management

File Handling:

React Dropzone - For drag-and-drop file uploads (images, documents, etc.)

Additional Utilities:

date-fns - Much lighter than moment.js for handling message timestamps
React Hot Toast - Better than browser alerts for user feedback
Emoji Picker React - Because what's a chat app without emojis? 😄

# Features Implemented

Required Features ✅

Left Sidebar: Clean tabbed interface switching between Chats and Contacts
Top Navigation: Message and Dashboard sections (I interpreted Dashboard as the main chat area)
Chat Interface: Full messaging experience with sender/receiver message bubbles
Contacts Management: Add, search, and manage your contacts

Additional Features I Added
Authentication & Security:

Traditional email/password registration and login
Google OAuth integration for quick signup
JWT token management with auto-refresh
Protected routes and authentication guards

Real-time Messaging:

Instant message delivery (no page refresh needed)
Typing indicators ("Abishek is typing...")
Online/offline status for contacts
Last seen timestamps

Rich Media Support:

Image sharing with preview
File uploads (documents, videos, audio)
Drag and drop file support
Image compression to save bandwidth
File size and type validation

Enhanced Chat Experience:

Message search within conversations
Emoji picker with categories
Message timestamps and grouping by date
Chat list sorted by recent activity
Message bubbles with proper styling (different colors for sent/received)

User Experience:

Responsive design (works great on mobile and desktop)
Skeleton loading states while content loads
Error boundaries to handle crashes gracefully
Toast notifications for user feedback
Form validation with helpful error messages
Search functionality across chats and contacts

Profile & Settings:

User profile management
Avatar upload with image cropping
Settings page with notification preferences

Social Features:

Friend request system (send/accept/reject)
Contact management beyond just chatting
User search across the platform

Developer Experience:

Custom hooks for reusable logic
Utility functions for common operations
Proper error handling and loading states
Clean component architecture with separation of concerns

..................

# How to Run This Project

Prerequisites:

Node.js 18+
npm or yarn
The backend server running on port 5000

Environment Setup:

# Clone the repository - https://github.com/Abishek0612/Chat-Application-Client.git

# .env ( create in root directory and paste the below credentials)

# .env or .env.production

VITE_API_URL=http://localhost:5000
VITE_APP_NAME=Chat App
VITE_DEBUG=true
VITE_GOOGLE_CLIENT_ID=1046169149716-nu6sdv3286sc1rfl4gkspm96ddaqq1a9.apps.googleusercontent.com
VITE_APP_VERSION=1.0.0

VITE_ENABLE_NOTIFICATIONS=true
VITE_ENABLE_FILE_UPLOAD=true
VITE_ENABLE_VOICE_MESSAGES=false
VITE_ENABLE_VIDEO_CALLS=false

VITE_MAX_FILE_SIZE=10485760
VITE_MAX_IMAGE_SIZE=5242880

VITE_DEBUG=false
VITE_MOCK_API=false

# Installation & Development:

Install dependencies
npm install

# Start development server

npm run dev

# The app will open at http://localhost:3000 and connect to your backend at http://localhost:5000.kindly run the backend server for local development

# Live URL (Deployed in netlify)

https://chat-applications-mern.netlify.app/login

# Architecture Decisions

Why Redux Toolkit?
Chat applications have complex state that needs to be shared across many components - active chats, message history, user status, notifications. Redux makes this manageable and predictable.

Component Structure:
I organized components by feature rather than type. So all chat-related components live together, making it easier to find what you need when working on chat features.

Real-time Strategy:
Socket.io handles all real-time features. The frontend listens for events and updates the Redux store, which automatically updates all connected components.

Mobile-First Design:
Built responsive from the ground up. The sidebar becomes a modal on mobile, and touch interactions work smoothly.

Performance Considerations:
Message virtualization for long chat histories (hooks prepared)
Image compression before upload
Debounced search to avoid API spam
Optimistic updates for better perceived performance

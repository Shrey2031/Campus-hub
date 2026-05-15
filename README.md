# 🎓 CampusHub — AI-Powered Student Collaboration Platform

<div align="center">

![CampusHub Banner](https://github.com/Shrey2031/Campus-hub/blob/main/Screenshot%202026-04-17%20200737.png?raw=true)
![MERN Stack](https://github.com/Shrey2031/Campus-hub/blob/main/Screenshot%202026-05-15%20215311.png?raw=true)
![Socket.IO](https://github.com/Shrey2031/Campus-hub/blob/main/Screenshot%202026-05-15%20214913.png?raw=true)
![Gemini AI](https://github.com/Shrey2031/Campus-hub/blob/main/Screenshot%202026-05-15%20214954.png?raw=true)


**A real-time collaboration platform built for distance-learning students to share notes, solve doubts, and learn together — powered by AI.**

[🚀 Live Demo](https://campushub-frontend-c389.onrender.com/) · [📂 Backend](./campushub-backend) · [🎨 Frontend](./campushub-frontend) · [🐛 Report Bug](https://github.com/Shrey2031/Campus-hub/issues)

</div>

---

## 📌 Table of Contents

- [About the Project](#-about-the-project)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Screenshots](#-screenshots)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [API Overview](#-api-overview)
- [Project Structure](#-project-structure)
- [Author](#-author)

---

## 🧠 About the Project

Distance-learning students often struggle with **lack of peer interaction** — no one to ask when stuck, no way to share resources easily, and no instant help available outside class hours.

**CampusHub** solves this by providing:
- A structured **Q&A and discussion** platform where students can post doubts and get answers from peers
- **Real-time chat rooms** powered by Socket.IO so discussions happen live
- **Gemini AI integration** that answers questions instantly when no peer is available
- Organized **note and resource sharing** so nothing gets lost in WhatsApp groups

> Built during my time at **IIT Patna** to help fellow distance-learning students stay connected and learn better.

---

## ✨ Features

| Feature | Description |
|---|---|
| 🔐 JWT Authentication | Secure signup/login with token-based auth and protected routes |
| 💬 Real-Time Discussions | Live chat rooms using Socket.IO for instant peer interaction |
| 🤖 Gemini AI Q&A | AI-powered instant answers when peers are unavailable |
| 📝 Post & Comment System | Structured doubt-posting with nested comments for knowledge sharing |
| 📁 Resource Sharing | Upload and share notes and study materials with Cloudinary |
| 👤 User Profiles | Personal dashboard showing posts, activity, and contributions |
| 🔒 Protected APIs | Role-based middleware ensuring secure data access |

---

## 🛠 Tech Stack

### Frontend
- **React.js** — Component-based UI
- **Tailwind CSS** — Utility-first styling
- **Socket.IO Client** — Real-time communication
- **Axios** — HTTP requests

### Backend
- **Node.js + Express.js** — REST API server
- **MongoDB + Mongoose** — Database and ODM
- **Socket.IO** — Real-time bidirectional events
- **JWT (jsonwebtoken)** — Authentication
- **bcryptjs** — Password hashing
- **Cloudinary** — Cloud media storage
- **Google Gemini API** — AI-powered answers

---

## 📸 Screenshots



| Home / Feed | Real-Time Chat | AI Q&A |
|---|---|---|
| ![Feed](https://github.com/Shrey2031/Campus-hub/blob/main/Screenshot%202026-05-15%20215311.png?raw=true) | ![Chat](https://github.com/Shrey2031/Campus-hub/blob/main/Screenshot%202026-05-15%20214913.png?raw=true) | ![AI](https://github.com/Shrey2031/Campus-hub/blob/main/Screenshot%202026-05-15%20214954.png?raw=true) |

---

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:
- [Node.js](https://nodejs.org/) (v18+)
- [MongoDB](https://www.mongodb.com/) (local or Atlas)
- [Git](https://git-scm.com/)

### Installation

**1. Clone the repository**
```bash
git clone https://github.com/Shrey2031/Campus-hub.git
cd Campus-hub
```

**2. Setup Backend**
```bash
cd campushub-backend
npm install
```

Create a `.env` file in `campushub-backend/` (see [Environment Variables](#-environment-variables))

```bash
npm run dev
# Server runs on http://localhost:5000
```

**3. Setup Frontend**
```bash
cd ../campushub-frontend
npm install
npm run dev
# App runs on http://localhost:5173
```

---

## 🔐 Environment Variables

Create a `.env` file inside `campushub-backend/` with the following:

```env
# Server
PORT=5000
NODE_ENV=development

# MongoDB
MONGO_URI=your_mongodb_connection_string

# JWT
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=7d

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Gemini AI
GEMINI_API_KEY=your_gemini_api_key

# Frontend URL (for CORS)
CLIENT_URL=http://localhost:5173
```


---

## 📡 API Overview

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| POST | `/api/v1/users/register` | Register new user | ❌ |
| POST | `/api/v1/users/login` | Login and get JWT | ❌ |
| GET | `/api/v1/posts/` | Get all posts/doubts | ✅ |
| POST | `/api/v1/posts/` | Create a new post | ✅ |
| POST | `/api/v1/posts/:id/comment` | Add comment to post | ✅ |
| POST | `/api/v1/ai/ask` | Ask Gemini AI a question | ✅ |
| POST | `/api/v1/posts/upload` | Upload resource to Cloudinary | ✅ |
| GET | `/api/v1/users/profile` | Get current user profile | ✅ |

---

## 🗂 Project Structure

```
Campus-hub/
│
├── campushub-backend/
│   ├── config/          # DB connection, Cloudinary config
│   ├── controllers/     # Route handler logic
│   ├── middleware/       # Auth middleware, error handler
│   ├── models/          # Mongoose schemas (User, Post, Comment)
│   ├── routes/          # Express route definitions
│   ├── socket/          # Socket.IO event handlers
│   ├── utils/           # Helper functions
│   └── server.js        # Entry point
│
├── campushub-frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── pages/       # Route-level page components
│   │   ├── context/     # Auth context, Socket context
│   │   ├── hooks/       # Custom React hooks
│   │   ├── services/    # API call functions (axios)
│   │   └── App.jsx      # Root component with routes
│   └── index.html
│
├── .gitignore
└── README.md
```

---

## 🙋 Author

**Shreya Kumari**
- 🎓 B.S CS & Data Analytics — IIT Patna (2023–2026)
- 📧 shreyakumari44611@gmail.com
- 💼 [LinkedIn](https://www.linkedin.com/in/shreya-kumari-424684277/)
- 🐙 [GitHub](https://github.com/Shrey2031)

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

---

<div align="center">
  If you found this project helpful, please consider giving it a ⭐ — it helps others find it too!
</div>

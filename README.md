# 🚀 Full-Stack Job Portal (MERN)

A production-ready, scalable Job Portal platform built with the MERN stack. It features dedicated role-based workspaces for **Candidates** and **Recruiters**, real-time application tracking, and automated resume management.

### 🎥 Project Demo

<!-- GIF PLACEHOLDER: Apni screen recording ka GIF banakar project folder mein 'demo.gif' naam se save karein, ya yahan direct image link paste karein -->
![Job Portal Working Demo](./demo.gif)

*Note: Replace `./demo.gif` with the actual path to your screen recording GIF once you create it.*

---

### 🔗 Live Links
- **(Live):** [https://job-portal-web-app-seven-sepia.vercel.app](https://job-portal-web-app-seven-sepia.vercel.app)
---

## 🛠️ Tech Stack

- **Frontend:** React.js, Vite, Tailwind CSS, TanStack Query (React Query), Zustand, React Router DOM, React Hot Toast
- **Backend:** Node.js, Express.js, Mongoose
- **Database:** MongoDB Atlas
- **Authentication:** JSON Web Tokens (JWT) with secure HTTP-only cookies
- **Cloud Storage:** Cloudinary (for PDF Resume uploads)
- **Email Service:** Resend (for email verification)
- **Deployment:** Vercel (Frontend) & Render (Backend)

---

## ✨ Features & Workflows

### 👨‍💼 Candidate Workspace
- **Secure Authentication:** Sign up, login, and email verification.
- **Browse & Filter:** Search and explore live job postings globally.
- **Easy Apply:** 1-click applications utilizing uploaded resumes.
- **Dashboard:** Track application statuses in real-time.
- **Saved Jobs:** Bookmark jobs for later viewing.
- **Profile Management:** Upload and manage resumes via Cloudinary.

### 🏢 Recruiter Workspace
- **Company Management:** Create and manage company profiles.
- **Job Postings:** Post, edit, and manage job listings with automatic slug generation.
- **Applicant Tracking:** View candidate applications, download resumes, and manage hiring stages.
- **Dashboard Analytics:** Overview of active jobs, total applicants, and company reach.

---

## 🚀 Local Setup & Installation

### Prerequisites
- Node.js (v18 or later)
- MongoDB locally or MongoDB Atlas URI
- Cloudinary Account
- Resend Account (Optional, for email services)

### 1. Clone the repository
```bash
git clone [https://github.com/your-username/job-portal.git](https://github.com/your-username/job-portal.git)
cd job-portal

```

### 2. Backend Setup

Navigate to the backend directory and install dependencies:

```bash
cd backend
npm install

```

Create a `.env` file in the `backend` directory based on `.env.example`:

```env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173

MONGODB_URI=your_mongodb_connection_string

JWT_ACCESS_SECRET=your_secret_key
JWT_REFRESH_SECRET=your_refresh_secret
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CLOUDINARY_URL=your_cloudinary_url

RESEND_API_KEY=your_resend_api_key
RESEND_FROM_EMAIL=onboarding@resend.dev
SKIP_EMAIL_VERIFICATION=true

```

Start the backend development server:

```bash
npm run dev

```

### 3. Frontend Setup

Open a new terminal window, navigate to the frontend directory, and install dependencies:

```bash
cd frontend
npm install

```

Create a `.env` file in the `frontend` directory:

```env
VITE_API_BASE_URL=http://localhost:5000/api/v1

```

Start the frontend development server:

```bash
npm run dev

```

---

## 📂 Folder Structure

```text
/
├── backend/               # Express & Node.js API
│   ├── src/
│   │   ├── controllers/   # Request handlers (Business logic)
│   │   ├── models/        # Mongoose database schemas
│   │   ├── routes/        # API endpoints
│   │   ├── middlewares/   # Auth, validation, file upload
│   │   └── validators/    # express-validator schemas
│   └── package.json
└── frontend/              # React (Vite) Client
    ├── src/
    │   ├── features/      # Modular components (Auth, Candidate, Recruiter, Jobs)
    │   ├── services/      # Axios API client setup & Interceptors
    │   ├── store/         # Zustand global state management
    │   └── layouts/       # Protected & Public route wrappers
    └── package.json

```

---

## 🌱 Seed Data (Optional)

For testing purposes, you can populate your local database using the seed scripts provided in `backend/src/seeds/`. These scripts will inject sample candidates, recruiters, companies, and jobs.
*(Note: Ensure your MongoDB is connected before running seed scripts).*

---

## ☁️ Deployment Instructions

This project is configured for split deployment:

1. **Backend:** Deploy the `/backend` folder to **Render** or **Railway**. Ensure all environment variables are set. Set the `CLIENT_URL` to your frontend's live domain.
2. **Frontend:** Deploy the `/frontend` folder to **Vercel** or **Netlify**. Set the `VITE_API_BASE_URL` to your live backend API URL.

---

## 🔧 Troubleshooting

* **CORS Errors during Login:** Ensure the `CLIENT_URL` in your backend environment variables exactly matches your frontend URL (no trailing slash).
* **Database Connection Failed:** Make sure you have whitelisted your IP address (or `0.0.0.0/0` for production) in your MongoDB Atlas Network Access settings.
* **Cookies Not Storing:** Check your `backend/src/config/cookies.js` file. For production, `sameSite` must be set to `'none'` and `secure` to `true`.

```


# ClassHub | Intelligent Learning Management System 🎓

ClassHub is a high-performance, full-stack LMS designed for modern academic environments. Built with a focus on speed, user experience, and AI integration, it bridges the gap between students, CRs, and Faculty. It features AI-powered timetable vision, secure Google OAuth onboarding, and role-based assignment tracking. Built with React, TypeScript, Supabase, and Gemini AI.

## 🚀 Core Features

* **AI Timetable Vision:** Integrated Google Gemini AI to parse and digitize timetable images into interactive schedules.
* **LMS Workflow:** Seamless assignment distribution and PDF submission system with cloud storage.
* **Role-Based Access Control (RBAC):** Secure environments for Students, CRs, and Faculty with distinct permissions.
* **Google OAuth 2.0:** Secure authentication with custom onboarding to sync academic profiles automatically.
* **Modern UI/UX:** Built with React & Tailwind CSS, featuring subtle micro-animations and a premium "Subtle Drift" aesthetic.

## 🛠️ Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | React 18, TypeScript, Tailwind CSS, Lucide Icons |
| **Backend** | Supabase (PostgreSQL) |
| **Storage** | Supabase Storage (S3 Buckets) |
| **AI Engine** | Google Gemini 1.5 Pro |
| **Deployment** | Vercel |

## ⚙️ Detailed Tech Stack
| Layer | Technology | Purpose |
| :--- | :--- | :---
| **Frontend Framework** | React 18 (Vite) | High-speed, component-based UI rendering.
| **Language** | Typescript | Ensures type safety and reduces runtime bugs in complex data flows.
| **Styling** | Tailwind CSS | Utility-first styling for a custom, premium "SaaS" look.
| **Icons** | Lucide React | Clean, consistent vector icons for the UI.
| **Backend / DB** | Supabase (PostgreSQL) | Relational database with real-time capabilities and built-in Auth.
| **Storage** | Supabase Buckets | S3-compatible cloud storage for student PDF submissions.
| **AI Integration** | Google Gemini 1.5 Pro | Multimodal AI used for vision-to-data extraction.
| **Authentication** | Google OAuth 2.0 | Secure, one-click login for students and faculty.
| **Deployment** | Vercel | Easy setup, reliable

## 📦 Database & Security
ClassHub utilizes **Row Level Security (RLS)** to ensure data privacy. Students can only view their own submissions, while Faculty can access class-wide deliverables for grading and tracking.

## 🔧 Installation
1. Clone the repo: `git clone https://github.com/YOUR_USERNAME/classhub.git`
2. Install dependencies: `npm install`
3. Set up your `.env` with Supabase and Gemini keys.
4. Run locally: `npm run dev`

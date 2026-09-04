# Forma_AI Setup Guide

Use this guide to set up the same project on another system.

## 1. Install Git

Open a terminal and run:

```powershell
git --version
```

If Git is not installed, install it from:
https://git-scm.com/

## 2. Set your Git identity

Run this one time on the new system:

```powershell
git config --global user.name "Your Name"
git config --global user.email "youremail@example.com"
```

## 3. Clone the repository

```powershell
git clone https://github.com/keshav456mehta/Forma_AI.git
cd Forma_AI
```

## 4. Switch to your working branch

Example:

```powershell
git checkout Vinay
git branch
```

The branch with `*` is the current branch.

## 5. Backend setup

Go to the backend folder:

```powershell
cd backend
```

Install Node.js first if `node` or `npm` is missing:
https://nodejs.org/

Then install dependencies:

```powershell
npm install
```

Start the backend:

```powershell
npm start
```

Expected basic result:
- the server starts on port `5000` by default
- visiting `/` returns JSON like `{ "message": "server is running" }`

## 6. Frontend setup

Open a new terminal and run:

```powershell
cd Forma_AI/frontend
npm install
npm run dev
```

## 7. MongoDB setup

This step is optional if you only need the non-database parts.

Create `backend/.env` with:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
CORS_ORIGIN=http://localhost:5173
```

You can also use `MONGO_URI` if your team already has that variable name in notes or screenshots.

Important:
- keep `backend/.env` private and never commit it
- use `backend/.env.example` as the tracked template

If the MongoDB variable is empty, the backend still runs, but MongoDB will not connect.

For production, set `CORS_ORIGIN` to the deployed frontend origin (or a
comma-separated list of approved origins). Do not use `*` for this setting.

## 8. Useful Git commands

Check status:

```powershell
git status
```

Pull latest changes:

```powershell
git pull
```

Push your branch:

```powershell
git push -u origin Vinay
```

## 9. What was completed on August 8, 2026

Completed:
- Git setup check
- Git identity check
- repo clone verification
- branch setup on `Vinay`
- Express backend scaffold
- commit and push

Not completed:
- real MongoDB Atlas connection string

## Shareable links

Repository:
https://github.com/keshav456mehta/Forma_AI

Branch:
https://github.com/keshav456mehta/Forma_AI/tree/Vinay

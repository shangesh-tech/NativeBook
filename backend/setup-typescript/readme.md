# Express + TypeScript Setup 

---

## 📁 1️⃣ Create project folder

```bash
mkdir express-ts-backend
cd express-ts-backend
```

---

## 📦 2️⃣ Initialize npm

```bash
npm init -y
```

---

## 📥 3️⃣ Install Express

```bash
npm install express
```

---

## 🧠 4️⃣ Install TypeScript & required dev tools

```bash
npm install -D typescript ts-node nodemon @types/node @types/express
```

### What each one does (simple):

* **typescript** → TS compiler
* **ts-node** → run TS directly
* **nodemon** → auto restart server
* **@types/node** → Node types (https, fs, etc.)
* **@types/express** → Express types

---

## ⚙️ 5️⃣ Create `tsconfig.json`

```bash
npx tsc --init
```

Now **replace everything** inside `tsconfig.json` with this 👇

### ✅ Best tsconfig for Express backend

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "CommonJS",
    "rootDir": "./src",
    "outDir": "./dist",

    "strict": true,
    "esModuleInterop": true,
    "moduleResolution": "node",
    "types": ["node"],

    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  }
}

```

---

## 📂 6️⃣ Project folder structure

```txt
express-ts-backend/
│
├── src/
│   ├── server.ts
│   ├── app.ts
│   ├── db.ts
│   └── cron.ts
│
├── dist/        ← compiled JS (auto)
├── package.json
├── tsconfig.json
└── .env
```

---

## 🌍 7️⃣ Install dotenv (for env variables)

```bash
npm install dotenv
```

Create `.env`

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/test
API_URL=https://example.com
```

---

## 🧩 8️⃣ Create Express app

### `src/app.ts`

```ts
import express, { Application } from "express";

const app: Application = express();

app.use(express.json());

app.get("/", (_req, res) => {
  res.send("🚀 Express + TypeScript running");
});

export default app;
```

---

## ▶️ 9️⃣ Create server entry point

### `src/server.ts`

```ts
import dotenv from "dotenv";
import app from "./app";

dotenv.config();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
```

---

## 🗄️ 1️⃣0️⃣ MongoDB connection (TypeScript)

### `src/db.ts`

```ts
import mongoose from "mongoose";

export const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(process.env.MONGO_URI!);
    console.log("✅ MongoDB connected");
  } catch (error) {
    console.error("❌ MongoDB connection failed", error);
    process.exit(1);
  }
};
```

Use it in `server.ts`:

```ts
import { connectDB } from "./db";

connectDB();
```

---

## ⏰ 1️⃣1️⃣ Cron job (your earlier code)

### `src/cron.ts`

```ts
import { CronJob } from "cron";
import https from "https";

const API_URL = process.env.API_URL!;

const job = new CronJob("*/14 * * * *", () => {
  https.get(API_URL, (res) => {
    console.log("Ping status:", res.statusCode);
  });
});

export default job;
```

Start cron in `server.ts`:

```ts
import job from "./cron";
job.start();
```

---

## ▶️ 1️⃣2️⃣ Update `package.json` scripts

```json
"scripts": {
  "dev": "nodemon src/server.ts",
  "build": "tsc",
  "start": "node dist/server.js"
}
```

---

## 🏃‍♂️ 1️⃣3️⃣ Run the server

### Development

```bash
npm run dev
```

### Production

```bash
npm run build
npm start
```

---

## ✅ DONE 🎉

You now have:
✔ Express + TypeScript
✔ MongoDB
✔ Cron jobs
✔ Environment variables
✔ Nodemon + TS
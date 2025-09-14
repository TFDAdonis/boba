# Khisba GIS - Deployment Guide

## 🚨 Upload Issue Fix - Firebase CORS Configuration

The upload functionality is currently blocked by Firebase Storage CORS policy. Here's how to fix it:

### Step 1: Access Google Cloud Shell
1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. Click the `>_` icon in the top right to activate Cloud Shell
3. Select your Firebase project (`cccc-72b24`)

### Step 2: Create CORS Configuration
In the Cloud Shell editor, create a file called `cors.json`:

**For Development (Allow all domains):**
```json
[
  {
    "origin": ["*"],
    "method": ["GET", "HEAD", "POST", "PUT", "DELETE"],
    "responseHeader": ["Content-Type"],
    "maxAgeSeconds": 3600
  }
]
```

**For Production (Specific domains):**
```json
[
  {
    "origin": [
      "https://your-app.netlify.app",
      "https://your-replit-domain.replit.dev",
      "http://localhost:5173"
    ],
    "method": ["GET", "HEAD", "POST", "PUT", "DELETE"],
    "responseHeader": ["Content-Type"],
    "maxAgeSeconds": 3600
  }
]
```

### Step 3: Apply CORS Configuration
Run this command in Cloud Shell:
```bash
gsutil cors set cors.json gs://cccc-72b24.appspot.com
```

### Step 4: Verify Configuration
Check if CORS is applied:
```bash
gsutil cors get gs://cccc-72b24.appspot.com
```

### Step 5: Test Upload
- Clear your browser cache or use incognito mode
- Try uploading a file again (it may take 5-10 minutes to propagate)

---

## 🌐 Netlify Deployment Options

Netlify cannot host full-stack Express applications directly. You have two deployment strategies:

### Option 1: Split Deployment (Recommended)

**Frontend on Netlify + Backend on Render/Railway**

#### Deploy Backend to Render:
1. **Prepare Backend Repository:**
   - Create a separate repository for your `server/` folder
   - Include `package.json`, `shared/` folder, and all server files
   - Add a `start` script: `"start": "tsx server/index.ts"`

2. **Deploy to Render:**
   - Go to [render.com](https://render.com) and sign in
   - Click "New" → "Web Service"
   - Connect your backend repository
   - Set root directory: `server/` (if using monorepo)
   - Set build command: `npm install && npm run build` (if using TypeScript) OR `npm install` (if using JS)
   - Set start command: `npm start` (ensure package.json has start script) OR `node dist/index.js` (if built from TS)
   - Add environment variables:
     - `DATABASE_URL` (your PostgreSQL connection string)
     - `FIREBASE_*` variables
     - `NODE_ENV=production`

#### Deploy Frontend to Netlify:
1. **Prepare Frontend Repository:**
   - Create a separate repository for your `client/` folder
   - Update `client/src/lib/queryClient.ts` to use your Render backend URL:
   ```typescript
   const baseURL = import.meta.env.VITE_API_URL || 'https://your-backend.onrender.com';
   ```

2. **Deploy to Netlify:**
   - Go to [netlify.com](https://netlify.com) and log in
   - Click "Add new site" → "Import an existing project"
   - Connect your frontend repository
   - Build settings:
     - Build command: `npm run build`
     - Publish directory: `dist`
   - Environment variables:
     - `VITE_API_URL=https://your-backend.onrender.com`
     - `VITE_FIREBASE_*` variables (for client-side Firebase)

3. **Fix React Router:**
   Create `netlify.toml` in your frontend root:
   ```toml
   [[redirects]]
   from = "/*"
   to = "/index.html"
   status = 200
   ```

4. **Fix CORS on Backend:**
   Update your Express server to allow Netlify domain:
   ```javascript
   app.use(cors({
     origin: ['https://your-app.netlify.app', 'http://localhost:5000']
   }));
   ```

### Option 2: Convert to Netlify Functions

**Convert Express to Serverless Functions:**

1. **Prerequisites:**
   - All backend routes must start with `/api`
   - No global variables between requests
   - Functions must complete within 10 seconds

2. **Install Dependencies:**
   ```bash
   npm install serverless-http
   ```

3. **Create `netlify.toml`:**
   ```toml
   [functions]
   directory = "server/functions"
   external_node_modules = ["express"]
   node_bundler = "esbuild"

   [[redirects]]
   force = true
   from = "/api/*"
   status = 200
   to = "/.netlify/functions/app/:splat"
   ```

4. **Build TypeScript and Create Function Wrapper:**
   First, build your TypeScript to JavaScript:
   ```bash
   npm run build  # or tsc if configured
   ```

   Create `server/functions/app.mjs`:
   ```javascript
   import express from "express";
   import serverless from "serverless-http";
   import { registerRoutes } from "../routes.js";  // Adjust path to built JS

   const app = express();
   app.use(express.json());
   
   // Your existing routes (without createServer call)
   registerRoutes(app);

   export const handler = serverless(app);
   ```

**⚠️ Limitations of Serverless Functions:**
- 10-second execution limit
- 128MB memory limit
- No persistent storage
- Cold start delays
- Higher complexity for debugging
- Requires TypeScript build step
- Must remove HTTP server creation from routes

---

## 📝 Current Status

**✅ Fixed Issues:**
- Firebase configuration with fallback values
- Map page now fetches real data from API
- GPS location capture working
- File validation and UI working

**🔧 Requires Manual Fix:**
- Firebase Storage CORS configuration (follow steps above)

**🚀 Ready for Deployment:**
- Application is fully functional once CORS is configured
- Choose deployment strategy based on your needs
- Option 1 (Split) recommended for better performance and flexibility

---

## 🛠️ Development Notes

- Database uses PostgreSQL with Drizzle ORM
- Frontend built with React + TypeScript + Vite
- Backend uses Express + TypeScript
- File storage via Firebase Storage
- Authentication ready for Replit Auth integration
- Responsive design with Tailwind CSS

For questions or issues, refer to the deployment logs and error messages for specific guidance.
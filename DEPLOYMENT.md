# MERN Stack LMS - Deployment Guide

## 🚀 Separate Deployment (Recommended)

### Frontend Deployment (Vercel)

1. **Build the frontend:**
   ```bash
   cd frontend
   npm run build
   ```

2. **Deploy to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Set the root directory to `frontend/`
   - Vercel will automatically detect the `vercel.json` and build settings

3. **Environment Variables:**
   - In Vercel dashboard, go to your project settings
   - Add environment variable: `VITE_API_URL=https://your-backend-url.onrender.com`
   - Replace with your actual backend URL

### Backend Deployment (Render/Railway/Cyclic)

Choose one of the following platforms:

#### Option 1: Render (Recommended)
1. **Create account** at [render.com](https://render.com)
2. **Connect GitHub** repository
3. **Create Web Service:**
   - Runtime: Node
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Root Directory: `backend/`
4. **Environment Variables:**
   - `NODE_ENV=production`
   - `PORT=10000` (or any port Render assigns)
   - `CLIENT_URL=https://your-frontend-url.vercel.app` (or `*` for all origins)
   - Add your MongoDB connection string and other secrets

#### Option 2: Railway
1. **Create account** at [railway.app](https://railway.app)
2. **Connect GitHub** repository
3. **Deploy:**
   - Railway will auto-detect Node.js
   - Set root directory to `backend/`
4. **Environment Variables:** Same as Render

#### Option 3: Cyclic
1. **Create account** at [cyclic.sh](https://cyclic.sh)
2. **Connect GitHub** repository
3. **Deploy:**
   - Cyclic will auto-detect Node.js
   - Set root directory to `backend/`
4. **Environment Variables:** Same as Render

## 🔧 Configuration Summary

### Frontend (`frontend/`)
- ✅ `vite.config.js`: `base: "/"`
- ✅ `vercel.json`: Routes all requests to `index.html`
- ✅ `src/services/api.js`: Uses `VITE_API_URL` environment variable
- ✅ `.env`: Contains `VITE_API_URL` for development

### Backend (`backend/`)
- ✅ `server.js`: Only serves API routes, no frontend static files
- ✅ CORS: Allows all origins (`*`) or specific frontend URL
- ✅ No Vercel serverless code (removed)

## 🐛 Troubleshooting

### Frontend Issues:
- **Blank screen**: Check browser console for JS loading errors
- **MIME type error**: Ensure `base: "/"` in `vite.config.js`
- **API calls failing**: Verify `VITE_API_URL` is set correctly

### Backend Issues:
- **404 errors**: Ensure backend is deployed and URL is correct
- **CORS errors**: Check `CLIENT_URL` environment variable
- **File not found**: Backend no longer serves frontend files

### Deployment Issues:
- **Build fails**: Check that dependencies are installed
- **Environment variables**: Ensure all required vars are set
- **Ports**: Use dynamic `PORT` from environment

## 📝 Next Steps

1. Deploy frontend to Vercel
2. Deploy backend to your chosen platform
3. Update frontend `VITE_API_URL` with backend URL
4. Test all API endpoints work
5. Verify user registration/login functionality
# Bhumil Prajapati — Portfolio

Full-stack MERN portfolio with Admin Panel, Three.js, GSAP animations.

## Stack
- **Frontend**: Next.js 14, Three.js, GSAP, Framer Motion, Tailwind CSS
- **Backend**: Node.js, Express, MongoDB Atlas, JWT, bcrypt

## Local Development

### Backend
```bash
cd backend
npm install
# Create .env from .env.example and fill values
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## Deployment

### Backend → Render
1. Go to [render.com](https://render.com)
2. New → Web Service → Connect GitHub repo
3. Root Directory: `backend`
4. Build Command: `npm install`
5. Start Command: `node index.js`
6. Add Environment Variables:
   - `MONGO_URI` — your Atlas URI
   - `JWT_SECRET` — random secret string
   - `ADMIN_EMAIL` — bhumilprajapati4@gmail.com
   - `ADMIN_PASSWORD` — your password
   - `NODE_ENV` — production

### Frontend → Vercel
1. Go to [vercel.com](https://vercel.com)
2. Import GitHub repo
3. Root Directory: `frontend`
4. Add Environment Variable:
   - `NEXT_PUBLIC_API_URL` — your Render backend URL

## Admin Panel
- URL: `/admin/login`
- Email: `bhumilprajapati4@gmail.com`

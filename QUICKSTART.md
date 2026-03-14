# Quick Start Guide - HIV Connect Pro

## Prerequisites
- Node.js v16+ installed
- MongoDB installed and running

## Step 1: Start MongoDB

Make sure MongoDB is running on your system:

```bash
# Windows (if installed as service, it should already be running)
# Or start manually:
mongod

# Mac/Linux
sudo systemctl start mongod
# or
brew services start mongodb-community
```

## Step 2: Install Backend Dependencies

```bash
cd backend
npm install
```

## Step 3: Start Backend Server

```bash
npm run dev
```

You should see:
```
Server running on port 5000
MongoDB Connected: 127.0.0.1
```

## Step 4: Install Frontend Dependencies

Open a new terminal:

```bash
cd frontend
npm install
```

## Step 5: Start Frontend Development Server

```bash
npm run dev
```

You should see:
```
VITE ready in XXX ms
Local: http://localhost:5173/
```

## Step 6: Access the Application

Open your browser and go to: `http://localhost:5173`

## Step 7: Create Your First Account

1. Click "Get Started" or "Register"
2. Fill in the registration form:
   - Username (min 3 characters)
   - Email
   - Password (min 6 characters)
   - Age (18+)
   - Gender
   - Country
   - Bio (optional)
   - Interests (optional)
3. Click "Register"

## Step 8: Explore Features

After registration, you'll be redirected to the dashboard where you can:

- **Create Posts**: Share your thoughts with the community
- **Discover Users**: Find and connect with others
- **Send Match Requests**: Connect with people you're interested in
- **Real-time Chat**: Message your matches (Socket.io powered)
- **View Notifications**: Stay updated on likes, comments, and matches
- **Edit Profile**: Customize your profile and privacy settings

## Creating an Admin Account

To access the admin panel:

1. Register a normal account
2. Open MongoDB Compass or mongo shell
3. Connect to `mongodb://127.0.0.1:27017/HIVmeddia`
4. Find your user in the `users` collection
5. Update the document:
   ```javascript
   db.users.updateOne(
     { email: "your-email@example.com" },
     { $set: { isAdmin: true } }
   )
   ```
6. Logout and login again
7. Access admin panel from the user menu

## Testing Real-time Chat

1. Open the app in two different browsers (or incognito mode)
2. Register two different accounts
3. Send a match request from one account
4. Accept it from the other account
5. Start chatting in real-time!

## Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running: `mongod --version`
- Check connection string in `backend/.env`

### Port Already in Use
- Backend (5000): Change `PORT` in `backend/.env`
- Frontend (5173): Change port in `frontend/vite.config.js`

### Socket.io Connection Issues
- Ensure backend is running on port 5000
- Check browser console for connection errors
- Verify CORS settings in `backend/server.js`

## Environment Variables

Backend `.env` (already configured):
```
MONGO_URI=mongodb://127.0.0.1:27017/HIVmeddia
JWT_SECRET=zelalemsecret123
PORT=5000
NODE_ENV=development
```

## Default Features

✅ User authentication with JWT
✅ Real-time messaging with Socket.io
✅ AI content moderation (basic keyword-based)
✅ Matchmaking system
✅ Social feed with posts, likes, comments
✅ User search and discovery
✅ Privacy controls (anonymous mode, blocking)
✅ Admin panel for moderation
✅ Mental health resources page
✅ Responsive Material-UI design

## Next Steps

- Customize the AI moderation in `backend/utils/aiModeration.js`
- Add profile picture upload functionality
- Integrate with external AI moderation APIs
- Add email verification
- Implement password reset
- Deploy to production

Enjoy building your community! 🎉

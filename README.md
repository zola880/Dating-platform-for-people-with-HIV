# HIV Connect Pro - Dating Platform

**Find Love Without Stigma** - The premier dating and relationship platform for people living with HIV/AIDS.

## 💕 About

HIV Connect Pro is a specialized dating platform designed exclusively for people living with HIV/AIDS. We understand that dating with HIV comes with unique challenges - the fear of disclosure, stigma, and rejection. Our platform eliminates these barriers by creating a safe space where everyone understands your journey.

### Why HIV Connect Pro?

- **No Stigma**: Everyone here is HIV+, so there's no awkward disclosure conversation
- **Find Real Love**: From casual dating to serious relationships and marriage
- **Smart Matching**: Advanced algorithm matches you with compatible partners
- **Privacy First**: Control who sees your information with granular privacy settings
- **Safe & Secure**: Verified profiles, AI moderation, and blocking features

## 🎯 Core Dating Features

### Swipe & Match
- **Tinder-style Swiping**: Swipe right to like, left to pass
- **Super Likes**: Stand out with a personalized message
- **Instant Matches**: Get notified when someone likes you back
- **Compatibility Scores**: See how compatible you are with each match

### Advanced Matchmaking
- **Smart Recommendations**: AI-powered suggestions based on your preferences
- **Detailed Preferences**: Set age range, location, relationship goals
- **Interest Matching**: Find people who share your hobbies and passions
- **Relationship Goals**: Filter by what people are looking for

### Dating Profiles
- **Rich Profiles**: Photos, bio, interests, lifestyle details
- **Relationship Status**: Single, divorced, widowed, it's complicated
- **Lifestyle Info**: Education, occupation, smoking, drinking, children
- **What You're Looking For**: Serious relationship, casual dating, friendship, marriage

### Real-Time Chat
- **Instant Messaging**: Chat with your matches in real-time
- **Photo Sharing**: Share moments with your connections
- **Typing Indicators**: See when someone is typing
- **Read Receipts**: Know when your messages are read

## 🌟 Additional Features

### Social Features
- **Stories**: Share 24-hour stories with your matches
- **Posts & Feed**: Share updates and life moments
- **Groups**: Join dating advice groups, local meetups, support circles
- **Events**: Attend virtual speed dating, local meetups, social events

### Privacy & Safety
- **Anonymous Browsing**: Browse profiles without being seen
- **Block Users**: Block anyone who makes you uncomfortable
- **Report System**: Report inappropriate behavior
- **AI Moderation**: Automatic filtering of offensive content
- **Verified Profiles**: Badge system for verified users

### Optional Health Features
- **Medication Reminders**: Never miss your meds (optional)
- **Health Tracking**: Track your health journey privately (optional)
- **Support Resources**: Access to mental health resources

## 🚀 Quick Start

### For Users

1. **Sign Up** - Create your dating profile in minutes
2. **Set Preferences** - Tell us what you're looking for
3. **Start Swiping** - Browse potential matches
4. **Match & Chat** - Connect with people you like
5. **Meet & Date** - Take it offline when you're ready

### For Developers

```bash
# Backend
cd backend
npm install
npm run dev

# Frontend
cd frontend
npm install
npm run dev
```

Visit `http://localhost:5173` to see the app!

## 📱 Key Pages

1. **Landing Page** - Marketing and sign up
2. **Swipe Match** - Tinder-style card swiping
3. **Browse Profiles** - Grid view of potential matches
4. **My Matches** - See who you've matched with
5. **Messages** - Real-time chat with matches
6. **Profile** - Your dating profile
7. **Dating Preferences** - Set your match criteria
8. **Events** - Dating events and meetups
9. **Groups** - Dating advice and social groups

## 🔒 Privacy & Security

- **End-to-end encryption** ready for messages
- **Profile visibility controls**
- **Anonymous mode**
- **Block and report features**
- **AI content moderation**
- **Secure authentication**
- **No data selling** - Your privacy is paramount

## 💡 Dating Tips

- **Be Honest**: Your status is already known - focus on who you are
- **Stay Positive**: Everyone here understands your journey
- **Take Your Time**: Get to know people through chat first
- **Stay Safe**: Meet in public places for first dates
- **Be Respectful**: Treat others how you want to be treated

## 🎨 Tech Stack

- **Frontend**: React 18, Material-UI, Socket.io Client
- **Backend**: Node.js, Express, MongoDB, Socket.io
- **Real-time**: WebSocket connections for instant messaging
- **Security**: JWT authentication, bcrypt, rate limiting

## 📊 Statistics

- Smart matching algorithm with compatibility scoring
- Real-time messaging with typing indicators
- 60+ API endpoints
- 14 database models
- Fully responsive design

## 🌈 Our Mission

To create a judgment-free dating platform where people living with HIV/AIDS can find love, companionship, and meaningful relationships without fear of stigma or rejection.

## 📞 Support

- **Dating Advice**: Join our support groups
- **Technical Issues**: Contact support through the app
- **Safety Concerns**: Use the report feature immediately

## 📄 License

MIT

---

**Find your match today. Love knows no status.** ❤️

## 🌟 Key Features

### Social & Community
- **Real-time Chat**: Socket.io powered messaging with typing indicators
- **Matchmaking**: Smart recommendations based on interests, location, and preferences
- **Groups**: Create and join support groups, social circles, and advocacy communities
- **Events**: Organize and attend virtual/in-person events and support meetings
- **Stories**: Share 24-hour stories with your community
- **Posts & Feed**: Share updates, like, comment with AI moderation

### Health Management
- **Medication Reminders**: Never miss a dose with customizable reminders
- **Health Tracking**: Log medications, symptoms, appointments, mood, exercise, and diet
- **Adherence Statistics**: Track your medication adherence percentage
- **Health Dashboard**: Visualize your health journey with comprehensive stats

### Privacy & Safety
- **Anonymous Mode**: Browse and interact anonymously
- **HIV Status Controls**: Choose who sees your status (public/matches-only/private)
- **User Blocking**: Block unwanted users
- **AI Moderation**: Automatic content filtering for safety
- **Report System**: Report inappropriate content or users
- **Mental Health Resources**: Access to crisis hotlines and support organizations

### Advanced Features
- **File Uploads**: Share images and videos
- **Admin Panel**: Comprehensive moderation and analytics tools
- **Notifications**: Real-time updates for all activities
- **User Search**: Find people by age, gender, location, interests
- **Profile Customization**: Detailed profiles with interests and bio

## 🚀 Tech Stack

### Backend
- Node.js + Express.js
- MongoDB + Mongoose
- Socket.io (Real-time)
- JWT Authentication
- Multer (File uploads)
- bcrypt (Password hashing)

### Frontend
- React 18
- Material-UI (MUI)
- React Router v6
- Socket.io Client
- Axios
- React Toastify

## 📦 Installation

### Prerequisites
- Node.js v16+
- MongoDB running locally or connection string

### Quick Start

1. **Clone and setup backend:**
```bash
cd backend
npm install
npm run dev
```

2. **Setup frontend (new terminal):**
```bash
cd frontend
npm install
npm run dev
```

3. **Access the app:**
- Frontend: http://localhost:5173
- Backend: http://localhost:5001

## 📁 Project Structure

```
hiv-connect-pro/
├── backend/
│   ├── config/          # Database configuration
│   ├── controllers/     # Business logic (12 controllers)
│   ├── middleware/      # Auth, validation, error handling
│   ├── models/          # Mongoose models (12 models)
│   ├── routes/          # API routes (12 route files)
│   ├── utils/           # Socket.io, AI moderation, helpers
│   ├── uploads/         # File storage
│   ├── server.js        # Entry point
│   └── .env             # Environment variables
└── frontend/
    ├── src/
    │   ├── components/  # Reusable UI components
    │   ├── pages/       # 14 page components
    │   ├── context/     # React Context (Auth, Socket)
    │   ├── routes/      # Route guards
    │   ├── services/    # API service
    │   └── App.jsx      # Main app
    └── package.json
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Users
- `GET /api/users/:id` - Get user profile
- `PUT /api/users/profile` - Update profile
- `GET /api/users/search` - Search users
- `GET /api/users/recommendations` - Get match recommendations
- `POST /api/users/block/:id` - Block user

### Posts
- `GET /api/posts` - Get all posts
- `POST /api/posts` - Create post
- `PUT /api/posts/:id/like` - Like/unlike post
- `POST /api/posts/:id/comment` - Comment on post

### Groups
- `GET /api/groups` - Get all groups
- `POST /api/groups` - Create group
- `POST /api/groups/:id/join` - Join group
- `GET /api/groups/my-groups` - Get user's groups

### Events
- `GET /api/events` - Get all events
- `POST /api/events` - Create event
- `POST /api/events/:id/rsvp` - RSVP to event
- `GET /api/events/my-events` - Get user's events

### Health
- `GET /api/health/logs` - Get health logs
- `POST /api/health/logs` - Create health log
- `GET /api/health/reminders` - Get medication reminders
- `POST /api/health/reminders` - Create reminder
- `POST /api/health/reminders/:id/log` - Log medication taken
- `GET /api/health/stats` - Get health statistics

### Messages (Real-time via Socket.io)
- `GET /api/messages` - Get all conversations
- `GET /api/messages/:userId` - Get conversation with user
- Socket events: `sendMessage`, `newMessage`, `typing`

### Matches
- `GET /api/matches` - Get accepted matches
- `GET /api/matches/pending` - Get pending requests
- `POST /api/matches/:userId` - Send match request
- `PUT /api/matches/:matchId` - Accept/reject match

### Stories
- `GET /api/stories` - Get active stories
- `POST /api/stories` - Create story
- `PUT /api/stories/:id/view` - View story
- `DELETE /api/stories/:id` - Delete story

### File Upload
- `POST /api/upload` - Upload single file
- `POST /api/upload/multiple` - Upload multiple files

### Admin
- `GET /api/admin/stats` - Dashboard statistics
- `GET /api/admin/users` - Get all users
- `PUT /api/admin/users/:id/ban` - Ban/unban user
- `GET /api/reports` - Get reports
- `POST /api/reports` - Create report

## 🗄️ Database Models

1. **User** - Authentication, profile, privacy settings
2. **Post** - Social posts with likes and comments
3. **Message** - Real-time chat messages
4. **Match** - User connections and match requests
5. **Notification** - System notifications
6. **Report** - User/content reports
7. **Group** - Community groups
8. **Event** - Events and meetups
9. **Story** - 24-hour stories
10. **HealthLog** - Health tracking entries
11. **MedicationReminder** - Medication schedules
12. **VideoCall** - Video call history (ready for WebRTC)

## 🎨 Frontend Pages

1. **Landing** - Marketing page
2. **Login/Register** - Authentication
3. **Dashboard** - Main feed with recommendations
4. **Profile** - User profiles
5. **Edit Profile** - Profile management
6. **Discover** - User search and discovery
7. **Messages** - Real-time chat
8. **Notifications** - Activity feed
9. **Groups** - Community groups
10. **Events** - Event management
11. **Health Tracker** - Health and medication management
12. **Admin Panel** - Moderation tools
13. **Resources** - Mental health support
14. **Group Detail** - Individual group view

## 🔒 Security Features

- JWT token authentication
- Password hashing with bcrypt
- Protected API routes
- Rate limiting (100 requests per 15 minutes)
- Input validation and sanitization
- CORS configuration
- File upload validation
- AI content moderation
- User blocking system

## 🌐 Environment Variables

```env
MONGO_URI=mongodb://127.0.0.1:27017/HIVmeddia
JWT_SECRET=zelalemsecret123
PORT=5001
NODE_ENV=development
```

## 📱 Features in Detail

### Medication Reminders
- Set multiple daily reminders
- Track adherence with logs
- View adherence statistics
- Customizable frequencies

### Health Tracking
- Log 7 types of health data
- Private/public visibility
- Historical tracking
- Visual statistics

### Groups
- 5 categories: support, social, health, advocacy, other
- Public/private groups
- Member roles: admin, moderator, member
- Group posts and discussions

### Events
- 3 types: virtual, in-person, hybrid
- 5 categories: support-group, awareness, social, health, fundraiser
- RSVP system with capacity limits
- Virtual meeting links

### AI Moderation
- Keyword-based filtering
- Offensive content detection
- Moderation flags
- Ready for external AI APIs

## 🚀 Deployment Ready

- Production-ready code structure
- Error handling
- Logging ready
- Environment-based configuration
- Scalable architecture

## 📈 Future Enhancements

- WebRTC video calling
- Email verification
- Password reset
- Push notifications
- Advanced AI moderation (OpenAI/Perspective API)
- Image compression
- Geolocation services
- Calendar integration
- Telemedicine integration

## 🤝 Contributing

This is a demonstration project showcasing a full-stack MERN application with advanced features for the HIV community.

## 📄 License

MIT

## 💙 Support

For mental health resources and support, visit the Resources page in the application or contact:
- National Suicide Prevention Lifeline: 988
- Crisis Text Line: Text HOME to 741741

---

Built with ❤️ for the HIV community

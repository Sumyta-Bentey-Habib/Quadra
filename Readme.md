# Quadra - Social Media Platform

Quadra is a modern, full-stack social media application built with Next.js and Node.js. It provides a comprehensive social networking experience with real-time messaging, post interactions, notifications, and more.

## 🌐 Live Demo

Experience Quadra in action: **[https://quadra-blush.vercel.app/](https://quadra-blush.vercel.app/)**

## 🚀 Features

### Core Features
- **User Authentication**: Secure login and registration system with NextAuth.js
- **Post Management**: Create, edit, delete posts with text and image support
- **Real-time Messaging**: Instant messaging with Socket.io integration
- **Interactive Posts**: Like, comment, and reply to posts with emoji reactions
- **Notifications**: Real-time notifications for likes, comments, and messages
- **Bookmarks**: Save posts for later viewing
- **User Profiles**: Customizable profiles with bio, social links, and portfolio
- **Explore Feed**: Discover new content and users
- **Message Status**: Track message delivery and read receipts

### Real-time Features
- Live user online/offline status
- Real-time notifications
- Instant messaging with typing indicators
- Live message status updates (sent, delivered, read)
- Real-time post interactions

## 🛠 Tech Stack

### Frontend
- **Framework**: Next.js 15 with App Router
- **Language**: React 19, JavaScript
- **Styling**: Tailwind CSS with custom animations
- **UI Components**: Radix UI primitives
- **Icons**: Lucide React, React Icons
- **Animations**: Framer Motion, Lottie
- **Type Safety**: JavaScript with JSDoc

### Backend
- **Runtime**: Node.js with Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: NextAuth.js
- **Real-time**: Socket.io for WebSocket connections
- **File Storage**: Cloudinary for image management
- **Validation**: Zod for schema validation

### Development Tools
- **Linting**: ESLint
- **Package Manager**: npm
- **Build Tool**: Turbopack (Next.js)
- **Code Quality**: Prettier (via ESLint config)

## 📋 Prerequisites

Before running this project, make sure you have:
- Node.js (v18 or higher)
- npm or yarn package manager
- MongoDB database (local or cloud instance)
- Git for version control

## ⚙️ Installation & Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd quadra
```

### 2. Install Dependencies

#### Frontend Dependencies
```bash
cd quadra
npm install
```

#### Backend Dependencies
```bash
cd ../Quadra-Server
npm install
```

### 3. Environment Configuration

#### Frontend Environment Variables (`.env.local`)
Create a `.env.local` file in the `quadra` directory:

```env
# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here

# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/quadra

# Cloudinary (for image uploads)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Socket.io Client
SOCKET_IO_URL=http://localhost:5000
```

#### Backend Environment Variables (`.env`)
Create a `.env` file in the `Quadra-Server` directory:

```env
# Server Configuration
PORT=5000

# MongoDB Atlas Connection
DB_USERNAME=your-mongodb-username
DB_PASSWORD=your-mongodb-password

# JWT Secret (if needed)
JWT_SECRET=your-jwt-secret
```

### 4. Database Setup

1. **MongoDB Atlas (Recommended)**:
   - Create a free cluster at [MongoDB Atlas](https://www.mongodb.com/atlas)
   - Get your connection string from the cluster
   - Replace the `DB_USERNAME` and `DB_PASSWORD` in your `.env` file

2. **Local MongoDB**:
   - Install MongoDB locally
   - Update the connection string in your `.env` file

### 5. Cloudinary Setup (Optional)
For image uploads, create a free account at [Cloudinary](https://cloudinary.com) and get your:
- Cloud name
- API key
- API secret

## 🚀 Running the Application

### Development Mode

1. **Start the Backend Server**:
```bash
cd Quadra-Server
npm start
```
The server will run on `http://localhost:5000`

2. **Start the Frontend Development Server**:
```bash
cd quadra
npm run dev
```
The application will be available at `http://localhost:3000`

### Production Mode

1. **Build the Frontend**:
```bash
cd quadra
npm run build
npm start
```

2. **Start the Backend**:
```bash
cd Quadra-Server
npm start
```

## 📁 Project Structure

```
quadra/
├── app/                    # Next.js App Router pages
│   ├── (auth)/            # Authentication pages
│   ├── (home)/            # Main application pages
│   ├── api/               # API routes
│   └── providers/         # Context providers
├── components/            # Reusable UI components
│   ├── ui/               # Base UI components
│   ├── navigation/       # Navigation components
│   ├── PostsUi/          # Post-related components
│   └── chat/             # Messaging components
├── lib/                  # Utility functions and configurations
├── constants/            # Application constants
├── data/                 # Static data and mock data
└── public/               # Static assets

Quadra-Server/            # Backend server
├── index.js             # Main server file
└── package.json         # Server dependencies
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `GET /api/auth/[...nextauth]` - NextAuth configuration

### Users
- `GET /users` - Get all users or specific user by email
- `GET /users/:id` - Get user by ID
- `PUT /users/:id` - Update user profile
- `GET /users/status/:userId` - Get user online status

### Posts
- `GET /posts` - Get posts (all, by user, or specific post)
- `POST /posts` - Create new post
- `PATCH /posts/:id` - Update post
- `DELETE /posts/:id` - Delete post
- `PATCH /posts/:id/like` - Like/unlike post

### Comments
- `POST /posts/:id/comments` - Add comment to post
- `GET /posts/:id/comments` - Get post comments
- `POST /posts/:postId/comments/:commentId/replies` - Reply to comment

### Bookmarks
- `POST /bookmarks` - Add bookmark
- `GET /bookmarks/:userId` - Get user bookmarks
- `DELETE /bookmarks/:userId/:postId` - Remove bookmark

### Conversations
- `POST /conversations/check` - Check existing conversation
- `POST /conversations` - Create new conversation
- `GET /conversations/user/:userId` - Get user conversations
- `PUT /conversations/members/:conversationId` - Add members to group

### Messages
- `GET /messages/:conversationId` - Get conversation messages
- `POST /messages` - Send new message
- `PUT /messages/:messageId` - Edit message
- `DELETE /messages/:messageId` - Delete message
- `POST /messages/forward` - Forward message

### Notifications
- `GET /notifications/:userId` - Get user notifications
- `POST /notifications` - Create notification
- `PATCH /notifications/:notificationId/read` - Mark as read
- `DELETE /notifications/:notificationId` - Delete notification

## 🔄 Real-time Events (Socket.io)

### Connection Events
- `authenticate` - User authentication
- `userOnline` - User comes online
- `disconnect` - User disconnects

### Conversation Events
- `joinConversation` - Join conversation room
- `leaveConversation` - Leave conversation room
- `typing` - User typing indicator

### Message Events
- `newMessage` - New message received
- `messageEdited` - Message edited
- `messageDeleted` - Message deleted
- `messageDelivered` - Message delivered
- `messageRead` - Message read

### Notification Events
- `newNotification` - New notification received

## 🎨 UI Components

The application uses a comprehensive set of UI components:

- **Navigation**: Responsive sidebar and navbar
- **Posts**: Post cards with interactions
- **Chat**: Message list, input, and conversation management
- **Notifications**: Notification list with filters
- **Forms**: Login, registration, and profile editing
- **Modals**: Various modal dialogs for interactions

## 🔧 Development Scripts

### Frontend Scripts
```bash
npm run dev      # Start development server with Turbopack
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

### Backend Scripts
```bash
npm start        # Start the server
npm test         # Run tests (placeholder)
```

## 🚀 Deployment

### Frontend Deployment (Vercel)
1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push

### Backend Deployment
Deploy the `Quadra-Server` to services like:
- Railway
- Render
- DigitalOcean App Platform
- AWS/Heroku

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the ISC License - see the LICENSE file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - React framework
- [MongoDB](https://www.mongodb.com/) - Database
- [Socket.io](https://socket.io/) - Real-time communication
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS
- [Radix UI](https://www.radix-ui.com/) - Accessible UI components
- [Framer Motion](https://www.framer.com/motion/) - Animation library

## 📞 Support

For support, email [your-email@example.com] or create an issue in the repository.

---

**Made with ❤️ by the Quadra Team**
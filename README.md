# EZdraw - Next-Generation Collaborative Whiteboard Platform

![EZdraw](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)

**EZdraw** is a production-ready, real-time collaborative whiteboard platform built with modern web technologies. It's designed to be a superior alternative to Excalidraw with advanced features for teams and businesses.

## 🌟 Features

### Core Features
- ✏️ **Advanced Drawing Tools** - Pencil, shapes (rectangles, circles), text, and more
- 🎨 **Customization** - Color picker, stroke width control, and layer management
- 💾 **Auto-Save** - Automatic cloud sync every 30 seconds
- 📤 **Export** - Export to PNG, SVG, and PDF formats
- ↩️ **Undo/Redo** - Full action history with unlimited undo/redo
- 🖼️ **Infinite Canvas** - Pan and zoom for unlimited workspace

### Collaboration Features
- 👥 **Real-Time Collaboration** - See teammates' cursors and changes live
- 🟢 **Presence System** - Know who's online and active
- 🔄 **Live Sync** - Changes broadcast instantly to all collaborators
- 💬 **Team Communication** - Built-in chat and commenting (coming soon)

### Version Control
- 📜 **Version History** - Complete history of all canvas changes
- ⏮️ **Restore Previous Versions** - Rollback to any previous state
- 🔍 **Version Browser** - Visual timeline of canvas evolution

### Team Management
- 📁 **Projects** - Organize canvases into team workspaces
- 👤 **Role-Based Access** - Owner, Admin, Editor, and Viewer roles
- 🔗 **Team Invitations** - Invite members via email or link
- 🔐 **Secure Sharing** - Public/private canvas visibility

### Subscription Plans
- 💳 **Free Tier** - Basic features for individuals
- 🚀 **Pro Plan** - Advanced features and unlimited canvases (₹499/month)
- 🏢 **Business Plan** - Team features and analytics (₹1,499/month)
- 🏛️ **Enterprise** - Custom solutions with SSO and on-premise options

### Admin Dashboard
- 📊 **Analytics** - User growth, canvas creation, and activity metrics
- 👨‍💼 **User Management** - View and manage all users
- 💬 **Feedback System** - Track bugs and feature requests
- 📝 **Activity Logs** - Audit trail of admin actions

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern UI library
- **TypeScript** - Type-safe development
- **Vite** - Lightning-fast build tool
- **TailwindCSS** - Utility-first styling
- **React Router** - Client-side routing
- **Zustand** - State management (ready to use)
- **Lucide React** - Beautiful icons

### Backend & Services
- **Supabase** - Complete backend platform
  - PostgreSQL database
  - Authentication (email/password + OAuth)
  - Real-time subscriptions
  - Row Level Security
  - Storage for exports
- **Supabase Realtime** - WebSocket-based collaboration

### Architecture
- **MVC Pattern** - Clean separation of concerns
  - Models: Supabase database schemas
  - Views: React components
  - Controllers: Custom hooks and services

## 📦 Database Schema

### Core Tables
- **users** - User profiles and account info
- **canvases** - Drawing board data and metadata
- **canvas_versions** - Version history tracking
- **projects** - Team workspace organization
- **project_members** - Team membership and roles
- **subscriptions** - Payment and billing data
- **feedback** - User feedback and bug reports
- **admin_logs** - Admin activity tracking

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Supabase account

### Environment Setup

Create a `.env` file in the root directory:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Database Setup

The database schema is automatically created via migrations in `supabase/migrations/`. The migration includes:
- All table definitions
- Row Level Security policies
- Indexes for performance
- Triggers for auto-updating timestamps

## 📱 Pages & Routes

- `/` - Landing page with feature showcase
- `/login` - User authentication
- `/signup` - User registration
- `/pricing` - Subscription plans
- `/dashboard` - User's canvas library
- `/projects` - Team workspace management
- `/canvas/:id` - Canvas editor with real-time collaboration
- `/admin` - Admin dashboard (role-restricted)

## 🔐 Security Features

- **Row Level Security (RLS)** - Database-level access control
- **JWT Authentication** - Secure token-based auth
- **Role-Based Access** - Fine-grained permissions
- **Secure OAuth** - Google & GitHub integration
- **Data Encryption** - All data encrypted at rest and in transit

## 🎨 Design Principles

- **Clean & Modern** - Professional UI without purple/indigo hues
- **Responsive** - Works on desktop, tablet, and mobile
- **Accessible** - Keyboard navigation and screen reader support
- **Fast** - Optimized rendering and lazy loading
- **Intuitive** - User-friendly interface with minimal learning curve

## 📊 Performance

- **Code Splitting** - Optimized bundle sizes per route
- **Lazy Loading** - Components loaded on demand
- **Efficient Rendering** - Canvas optimization with throttling
- **CDN Ready** - Static assets optimized for delivery
- **Build Size** - ~100KB gzipped JavaScript

## 🔄 Real-Time Features

### Presence System
- Active user indicators
- Colored cursor tracking
- User avatars and names
- Join/leave notifications

### Collaborative Editing
- Instant canvas updates
- Conflict resolution
- Synchronized drawing
- Broadcast changes to all users

## ��️ Roadmap

### Phase 1 (Completed) ✅
- Core drawing functionality
- Real-time collaboration
- Version history
- Project management
- Pricing page
- Admin dashboard

### Phase 2 (Future)
- [ ] In-canvas chat system
- [ ] Sticky notes and comments
- [ ] Template library
- [ ] AI-powered features
- [ ] Advanced export options
- [ ] Stripe payment integration
- [ ] Video/voice calls (WebRTC)
- [ ] Mobile apps (React Native)

### Phase 3 (Future)
- [ ] API for third-party integrations
- [ ] Slack, Notion, Trello integrations
- [ ] Custom webhooks
- [ ] White-label solution
- [ ] On-premise deployment
- [ ] Advanced analytics

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Supabase for the excellent backend platform
- React team for the amazing UI library
- TailwindCSS for beautiful styling utilities
- Lucide for the icon library

## 📞 Support

For support, email support@ezdraw.com or join our Discord community.

## 🌐 Live Demo

Visit [https://ezdraw.vercel.app](https://ezdraw.vercel.app) to try the live demo.

---

**Built with ❤️ by the EZdraw Team**
